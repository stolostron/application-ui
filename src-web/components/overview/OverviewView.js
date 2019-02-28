/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import classNames from 'classnames'
import DragCardLayer from './DragCardLayer'
import { Loading, Notification } from 'carbon-components-react'
import Masonry from 'react-masonry-component'
import {getProviderCards, filterOverview, getSavedViewState, saveViewState, PROVIDER_FILTER, BANNER_FILTER} from './filterHelper'
import { getConditionFilterSets } from './dataHelper'
import OverviewToolbar from './OverviewToolbar'
import ProviderBanner from './cards/ProviderBanner'
import ProviderCard from './cards/ProviderCard'
import CountsCard from './cards/CountsCard'
import HeatCard from './cards/HeatCard'
import PieCard from './cards/PieCard'
import LineCard from './cards/LineCard'
import { CardTypes, CARD_SPACING } from './constants.js'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/overview-page.scss')
})

const masonryOptions = {
  layoutInstant: true,
  horizontalOrder: true,
  fitWidth: true,
  initLayout: false,
  resizeContainer: true,
  columnWidth: 10,
  gutter: 0,
}

export default class OverviewView extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    overview: PropTypes.object,
    pollInterval: PropTypes.number,
    refetch: PropTypes.func,
    reloading: PropTypes.bool,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.scroll = _.debounce(()=>{
      this.scrollView()
    }, 50)
  }

  componentWillMount() {
    const { locale } = this.context
    const activeFilters={}
    activeFilters[BANNER_FILTER] = []
    activeFilters[PROVIDER_FILTER] = []
    activeFilters['environment'] = []
    activeFilters['region'] = []
    activeFilters['vendor'] = []
    const conditionFilters=new Set()
    this.setState({
      viewState: getSavedViewState(locale),
      conditionFilters,
      activeFilters,
    })
    this.onUnload = this.onUnload.bind(this)
    window.addEventListener('beforeunload', this.onUnload)
    this.updateCardOrder = this.updateCardOrder.bind(this)
    this.handleLayoutComplete = this.handleLayoutComplete.bind(this)
    this.updateHeatMapState = this.updateHeatMapState.bind(this)
  }

  componentDidMount(){
    this.layoutOverview()
    window.addEventListener('scroll', this.scroll)
  }

  componentDidUpdate(){
    this.layoutOverview()
  }

  setPageRef = ref => {
    this.pageRef = ref
    this.layoutOverview()
  }

  setHeaderRef = ref => {
    this.headerRef = ref
    this.layoutOverview()
  }

  setProviderRef = ref => {
    this.providerRef = ref
    this.layoutOverview()
  }

  setViewRef = ref => {
    this.viewRef = ref
    this.layoutOverview()
  }

  // make sure masonry starts below overview header
  layoutOverview() {
    if (this.headerRef && this.providerRef) {
      const headerRect = this.headerRef.getBoundingClientRect()
      this.providerRef.style.marginTop = headerRect.height+'px'
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
    window.removeEventListener('scroll', this.scroll)
  }

  scrollView () {
    if (this.headerRef && this.providerRef) {
      const providerRect = this.providerRef.getBoundingClientRect()
      this.headerRef.classList.toggle('bottom-border', providerRect.top<-1)
    }
  }

  setMasonryRef = ref => {this.masonry = ref}
  getMasonry = () => {return this.masonry}
  handleLayoutComplete = () => {
    // after first layout, do transition timeouts
    this.masonry.masonry.options.layoutInstant = false
    if (this.headerRef) {
      this.headerRef.classList.toggle('laidout', true)
    }
    if (this.providerRef) {
      this.providerRef.classList.toggle('laidout', true)
    }
    if (this.viewRef) {
      this.viewRef.classList.toggle('laidout', true)
    }
  }

  setMasonryRef = ref => {
    this.masonry = ref
    if (ref) {
      // we use masonry to layout the cards
      // however sometimes masonry doesn't respect the spacing we want between cards
      // so here we make sure it's CARD_SPACING
      let lastItemLeft=0
      let lastItemWidth=0
      const masonry = this.masonry.masonry
      const getItemLayoutPosition = masonry._getItemLayoutPosition.bind(masonry)
      masonry._getItemLayoutPosition = (item) =>{
        const position = getItemLayoutPosition(item)
        if (position.x !==0 && (position.x - (lastItemLeft+lastItemWidth)) < CARD_SPACING) {
          position.x = lastItemLeft = lastItemLeft+lastItemWidth+CARD_SPACING
        }
        lastItemLeft = position.x
        lastItemWidth = item.size.width
        return position
      }
    }
  }

  shouldComponentUpdate () {
    return !this.isDragging
  }

  render() {
    const { locale } = this.context
    const { loading, error } = this.props

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const { overview } = this.props
    const {viewState, activeFilters, conditionFilters} = this.state
    const {cardOrder} = viewState
    const conditionFilterSets = getConditionFilterSets(overview, conditionFilters.size>0)
    const view = this.getViewData(overview, activeFilters, conditionFilters, conditionFilterSets)
    const filteredOverview = filterOverview(activeFilters, conditionFilters, conditionFilterSets, overview)
    const filteredProviders = getProviderCards(overview, filteredOverview, activeFilters, conditionFilters, locale)
    const {providerCards, bannerCards} = filteredProviders
    const bannerOpen = bannerCards.length>0
    const boundFilters = this.getBoundFilters(bannerOpen, locale)
    return (
      <div className='overview-page' ref={this.setPageRef}>
        {this.renderHeader(providerCards, view, filteredOverview, filteredProviders, conditionFilterSets, boundFilters)}
        {this.renderProviders(providerCards, view, filteredOverview, filteredProviders, conditionFilterSets)}
        {this.renderView(cardOrder, view, overview, filteredOverview, filteredProviders, conditionFilters, conditionFilterSets, bannerOpen)}
      </div>
    )
  }

  renderHeader(providerCards, view, filteredOverview, filteredProviders, conditionFilterSets, boundFilters) {
    const { locale } = this.context
    const { allProviders, bannerCards } = filteredProviders
    const { refetch, startPolling, stopPolling, pollInterval, reloading, overview } = this.props
    const { timestamp } = overview
    const bannerOpen = bannerCards.length>0
    const title = bannerOpen ? '' : msgs.get('routes.dashboard', locale)
    const headerClasses = classNames({
      'overview-header': true,
      'bottom-border': bannerOpen,
    })
    return (
      <div className={headerClasses} role='region' aria-label={title} ref={this.setHeaderRef}>
        <div className='overview-header-title'>{title}</div>

        {/* provider banner */}
        {bannerOpen &&
        <ProviderBanner
          bannerCards={bannerCards}
          conditionFilterSets={conditionFilterSets}
          overview={overview}
          view={view}
        />}


        {/* toolbar at top right */}
        <OverviewToolbar
          startPolling={startPolling}
          stopPolling={stopPolling}
          pollInterval={pollInterval}
          allProviders={allProviders}
          refetch={refetch}
          boundFilters={boundFilters}
          timestamp={timestamp}
          reloading={reloading}
          locale={locale}
          view={view} />
      </div>
    )
  }

  renderProviders(providerCards, view, filteredOverview, filteredProviders, conditionFilterSets) {
    const { providerWidth, bannerCards } = filteredProviders
    const bannerOpen = bannerCards.length>0
    const providerClasses = classNames({
      'provider-view': true,
      'banner-open': bannerOpen,
    })
    return (
      <div className='overview-providers'  ref={this.setProviderRef}>
        {/* provider cards */}
        <div className={providerClasses}>
          {!bannerOpen &&
            providerCards.map((cardData)=>{
              const item = this.getItemData(cardData, filteredOverview)
              const {key} = cardData
              return <ProviderCard key={key} item={item} view={view}
                width={providerWidth} conditionFilterSets={conditionFilterSets} />
            })}
        </div>
      </div>
    )
  }


  renderView(cardOrder, view, overview, filteredOverview, filteredProviders, conditionFilters, conditionFilterSets, bannerOpen ) {
    const { allProviders } = filteredProviders
    const {viewState, activeFilters} = this.state
    const {heatMapState={}} = viewState
    return (
      <div className='overview-view' ref={this.setViewRef}>
        <div className='masonry-container'>
          <Masonry
            enableResizableChildren
            disableImagesLoaded
            className={'masonry-class'}
            options={masonryOptions}
            ref={this.setMasonryRef}
            onLayoutComplete={() => this.handleLayoutComplete()}>
            {cardOrder.map((cardData)=>{
              const item = this.getItemData(cardData, filteredOverview)
              const {key, type} = cardData
              switch(type) {
              case CardTypes.counts:
                return <CountsCard key={key} item={item}
                  allProviders={allProviders} bannerOpen={bannerOpen} />
              case CardTypes.heatmap:
                return <HeatCard key={key} item={item}
                  heatMapState={heatMapState}
                  unfilteredOverview={overview}
                  conditionFilters={conditionFilters}
                  conditionFilterSets={conditionFilterSets}
                  updateHeatMapState={this.updateHeatMapState}
                />
              case CardTypes.piechart:
                return <PieCard key={key} item={item} />
              case CardTypes.linegraph:
                return <LineCard key={key} item={item} activeFilters={activeFilters} conditionFilters={conditionFilters} />
              }
            })
            }
          </Masonry>
        </div>
        <DragCardLayer getMasonry={this.getMasonry} updateCardOrder={this.updateCardOrder} />
      </div>
    )
  }

  //////////////////////////////////////////////////////////////////////
  //////////////// VIEW FUNCTIONS ///////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  getViewData(overview, activeFilters, conditionFilters, conditionFilterSets) {
    return {
      overview,
      activeFilters,
      conditionFilters,
      conditionFilterSets,

      // editing
      addCard: this.spliceCards.bind(this),
      updateFilters: this.updateFilters.bind(this),
      refreshCardOrder: this.refreshCardOrder.bind(this),
      getCurrentViewState: this.getCurrentViewState.bind(this),
    }
  }

  getBoundFilters(bannerOpen, locale) {
    const filters=[]
    const {activeFilters, conditionFilters} = this.state
    // remove condition filter
    conditionFilters.forEach(key=>{
      filters.push({
        name: msgs.get(`filter.view.condition.${key}`, locale),
        onClick: this.removeConditionFilter.bind(this, key)
      })
    })
    // remove active filter
    Object.keys(activeFilters).forEach(key=>{
      if (key!==BANNER_FILTER && (!bannerOpen || key!==PROVIDER_FILTER)) {
        activeFilters[key].forEach(value=>{
          value = value.title||value
          filters.push({
            name: value,
            onClick: this.removeActiveFilter.bind(this, key, value)
          })
        })
      }
    })
    return filters
  }

  removeActiveFilter(key, value) {
    this.setState(prevState => {
      const activeFilters = _.cloneDeep(prevState.activeFilters)
      const filters = activeFilters[key]
      const idx = key===PROVIDER_FILTER ? filters.findIndex(({title})=>{
        return title === value
      }) : filters.indexOf(value)
      if (idx!==-1) {
        filters.splice(idx,1)
      }
      return { activeFilters }
    })
  }

  removeConditionFilter(key) {
    this.setState(prevState => {
      const conditionFilters = _.cloneDeep(prevState.conditionFilters)
      conditionFilters.delete(key)
      return { conditionFilters }
    })
  }

  updateFilters(activeFilters, conditionFilters) {
    this.setState(prevState => {
      // if user changes condition, reset active flags
      if (!activeFilters) {
        activeFilters = {}
        Object.keys(prevState.activeFilters).forEach(key=>{
          activeFilters[key]=[]
        })
      }
      conditionFilters = conditionFilters || prevState.conditionFilters
      return { activeFilters, conditionFilters }
    })
  }

  updateHeatMapState(heatMapState) {
    this.setState(preState => {
      const viewState = _.cloneDeep(preState.viewState)
      viewState.heatMapState = heatMapState
      return { viewState }
    })
  }

  //////////////////////////////////////////////////////////////////////
  //////////////// CARD FUNCTIONS ///////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  getItemData(cardData, overview) {
    const {title='', type} = cardData
    const key = title + type
    cardData.key = key
    return {
      cardData,
      overview,

      // editing
      spliceCards: this.spliceCards.bind(this, cardData),

      // dragging
      canDrag: () => { return true },
      beginDrag:  this.beginDrag.bind(this, cardData),
      endDrag:  this.endDrag.bind(this),
      getDragInfo: this.getDragInfo.bind(this),
    }
  }

  spliceCards(cardData, replace) {
    this.setState(preState => {
      const viewState = _.cloneDeep(preState.viewState)
      const {cardOrder} = viewState
      const idx = cardOrder.findIndex(card=>{
        return card.key === cardData.key
      })
      if (idx!==-1) {
        if (replace) {
          this.replaceWithoutLayout(idx)
          cardOrder.splice(idx,1,replace)
        } else {
          cardOrder.splice(idx,1)
        }
      } else if (replace) {
        cardOrder.push(replace)
      }
      return { viewState }
    })
  }

  // react-masonary and react will add the replaced card at end of list
  // then lay it out into position--instead we just want it to appear
  // where the old one was--so we save the old one's position and apply
  // it to the new one
  replaceWithoutLayout(idx) {
    const replaced = this.masonry.masonryContainer.childNodes[idx]
    this.saveMasonryLayout = this.masonry.performLayout
    this.masonry.performLayout = () => {
      var diff = this.masonry.diffDomChildren()
      const replacement = diff.appended[0]
      replacement.style.position = 'absolute'
      replacement.style.left = replaced.style.left
      replacement.style.top = replaced.style.top
      replacement.classList.add('replaced') // dissolve into place
      replacement.addEventListener('animationend', ()=>{
        replacement.classList.remove('replaced') // remove after done
      })
      diff.appended.forEach(this.masonry.listenToElementResize, this.masonry)
      this.masonry.masonry.reloadItems()
      this.masonry.performLayout = this.saveMasonryLayout
    }
  }

  // dragging
  beginDrag(cardData, cardRef) {
    if (!this.dragInfo) {
      this.dragInfo = {cardRef, cardData}
      this.isDragging = true
    }
  }

  endDrag() {
    delete this.dragInfo
  }

  getDragInfo() {
    return this.dragInfo
  }

  updateCardOrder() {
    delete this.isDragging

    // update card order
    this.setState((prevState) => {
      const {viewState} = prevState
      viewState.cardOrder = this.getCurrentCardOrder()
      return { viewState }
    })
  }

  getCurrentCardOrder() {
    const cardOrder = Array.from(this.masonry.masonryContainer.childNodes).map((child)=>{
      const {item: {cardData}} = child
      delete cardData.key
      return cardData
    })
    return cardOrder
  }

  refreshCardOrder() {
    const { locale } = this.context
    this.setState(() => {
      return { viewState: getSavedViewState(locale) }
    })
  }

  getCurrentViewState() {
    const {viewState: {heatMapState={}}} = this.state
    return {heatMapState, cardOrder: this.getCurrentCardOrder()}
  }

  onUnload() {
    const state = this.getCurrentViewState()
    saveViewState(state)
  }

}

OverviewView.contextTypes = {
  locale: PropTypes.string
}


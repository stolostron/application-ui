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
import DragCardLayer from './DragCardLayer'
import { Loading, Notification } from 'carbon-components-react'
import Masonry from 'react-masonry-component'
import RefreshTime from '../common/RefreshTime'
import OverviewMenu, {getSavedViewState} from './OverviewMenu'
import {updateProviderCards, filterOverview, filterViewState, PROVIDER_FILTER} from './filterHelper'
import { getNoncompliantClusterSet } from './dataHelper'
import {FilterBar} from './modals/FilterView'
import ProviderBanner from './cards/ProviderBanner'
import ProviderCard from './cards/ProviderCard'
import CountsCard from './cards/CountsCard'
import HeatCard from './cards/HeatCard'
import PieCard from './cards/PieCard'
import LineCard from './cards/LineCard'
import { CardTypes } from './constants.js'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/overview-page.scss')
})

const masonryOptions = {
  layoutInstant: true,
  horizontalOrder: true,
  fitWidth: true,
  resizeContainer: false,
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
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
  }

  componentWillMount() {
    const { locale } = this.context
    const { loading } = this.props
    this.setState({
      loading,
      viewState: getSavedViewState(locale),
    })
    this.updateCardOrder = this.updateCardOrder.bind(this)
    this.handleLayoutComplete = this.handleLayoutComplete.bind(this)
    this.updateHeatMapChoices = this.updateHeatMapChoices.bind(this)
  }

  setViewRef = ref => {this.viewRef = ref}
  setMasonryRef = ref => {this.masonry = ref}
  getMasonry = () => {return this.masonry}
  handleLayoutComplete = () => {
    // after first layout, do transition timeouts
    this.masonry.masonry.options.layoutInstant = false
    if (this.viewRef) {
      this.viewRef.classList.toggle('laidout', true)
    }
  }

  shouldComponentUpdate () {
    return !this.isDragging
  }

  componentWillReceiveProps(){
    this.setState((prevState, props) => {
      let {loading} = props
      let reloading = false
      if (loading && prevState.loaded) {
        reloading = true
        loading = false
      }
      const loaded = !loading || prevState.loaded
      return {loading, loaded, reloading}
    })
  }

  render() {
    const { error } = this.props
    const { loading } = this.state
    const { locale } = this.context

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', locale)} />

    const { refetch, startPolling, stopPolling, pollInterval, overview } = this.props
    const {timestamp} = overview
    const {viewState, reloading} = this.state
    const {cardOrder, bannerCards=[], activeFilters, heatMapChoices={}} = viewState
    const view = this.getViewData(overview, activeFilters)
    const boundActiveFilters = this.getBoundActiveFilters()
    const filteredOverview = filterOverview(activeFilters, overview)
    const noncompliantClusterSet = getNoncompliantClusterSet(filteredOverview)
    const {allProviders, providerWidth} = updateProviderCards(overview, cardOrder, activeFilters, locale)
    return (
      <div className='overview-view' ref={this.setViewRef}>

        {/* provider banner at top */}
        {bannerCards.length>0 &&
          <ProviderBanner
            bannerCards={bannerCards}
            view={view}
            overview={overview}
            noncompliantClusterSet={noncompliantClusterSet}
          />
        }
        {/* filter bar at top right */}
        <FilterBar boundActiveFilters={boundActiveFilters} locale={locale} />

        {/* overflow menu at top right */}
        <OverviewMenu
          startPolling={startPolling}
          stopPolling={stopPolling}
          pollInterval={pollInterval}
          allProviders={allProviders}
          view={view}
        />

        {/* last time refreshed */}
        <RefreshTime refetch={refetch} timestamp={timestamp} reloading={reloading} />

        {/* cards */}
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
              case CardTypes.provider:
                return <ProviderCard key={key} item={item} view={view}
                  width={providerWidth} noncompliantClusterSet={noncompliantClusterSet} />
              case CardTypes.counts:
                return <CountsCard key={key} item={item} />
              case CardTypes.heatmap:
                return <HeatCard key={key} item={item}
                  heatMapChoices={heatMapChoices}
                  updateHeatMapChoices={this.updateHeatMapChoices}
                />
              case CardTypes.piechart:
                return <PieCard key={key} item={item} />
              case CardTypes.linegraph:
                return <LineCard key={key} item={item} />
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
  getViewData(overview, activeFilters) {
    return {
      overview,
      activeFilters,

      // editing
      addCard: this.spliceCards.bind(this),
      updateActiveFilters: this.updateActiveFilters.bind(this),
      refreshCardOrder: this.refreshCardOrder.bind(this),
      getCurrentViewState: this.getCurrentViewState.bind(this),
    }
  }

  getBoundActiveFilters() {
    const filters=[]
    const {viewState: {activeFilters}} = this.state
    Object.keys(activeFilters).forEach(key=>{
      if (key!==PROVIDER_FILTER) {
        activeFilters[key].forEach(value=>{
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
    this.setState(preState => {
      let viewState = _.cloneDeep(preState.viewState)
      const {activeFilters} = viewState
      const filters = activeFilters[key]
      const idx = filters.indexOf(value)
      if (idx!==-1) {
        filters.splice(idx,1)
      }
      viewState = filterViewState(activeFilters, viewState)
      return { viewState }
    })
  }

  updateActiveFilters(activeFilters) {
    this.setState(preState => {
      const viewState = filterViewState(activeFilters, _.cloneDeep(preState.viewState))
      return { viewState }
    })
  }

  updateHeatMapChoices(heatMapChoices) {
    this.setState(preState => {
      const viewState = _.cloneDeep(preState.viewState)
      viewState.heatMapChoices = heatMapChoices
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
    const {viewState: {activeFilters, heatMapChoices={}, bannerCards=[], providerCards=[]}} = this.state
    return {activeFilters, heatMapChoices, bannerCards, providerCards, cardOrder: this.getCurrentCardOrder()}
  }

}

OverviewView.contextTypes = {
  locale: PropTypes.string
}


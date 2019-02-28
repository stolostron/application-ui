/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../../lib/shared/resources'
import {filterByProvider, filterByCondition, getMatchingClusters, BANNER_FILTER, PROVIDER_FILTER, CONDITION_FILTER, ConditionTypes} from '../filterHelper'
import { Checkbox, Icon } from 'carbon-components-react'
import { Scrollbars } from 'react-custom-scrollbars'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-filterview.scss')
})

// if section has more then this number of filters, add "show more"
const SHOW_MORE = 10

const ShowOrMoreItem = ({ count, isExpanded, onExpand, locale }) => {
  return (
    <div className='filter-section-expand' tabIndex='0' role={'button'}
      onClick={onExpand} onKeyPress={onExpand}>
      {isExpanded ?
        msgs.get('filter.view.collapse', locale) :
        msgs.get('filter.view.expand', [count], locale)}
    </div>
  )
}

ShowOrMoreItem.propTypes = {
  count: PropTypes.number,
  isExpanded: PropTypes.bool,
  locale: PropTypes.string,
  onExpand: PropTypes.func,
}


const FilterSection = ({ section: {key, name, filters, isExpanded, onExpand}, locale }) => {
  if (key !== CONDITION_FILTER) {
    filters.sort(({label:a, isAll:ia}, {label:b, isAll:ib})=>{
      if (ia && !ib) {
        return -1
      } else if (!ia && ib) {
        return 1
      }
      return a.localeCompare(b)
    })
  }

  // show more/or less
  const count = filters.length-SHOW_MORE-2
  const showMoreOrLess = count>0
  if (showMoreOrLess) {
    if (!isExpanded) {
      filters = filters.slice(0, SHOW_MORE)
    }
  }

  return (
    <div className='filter-section'>
      <div className='filter-section-title'>
        {name}
      </div>
      {filters.map(({key, label, checked, onChange}) => {
        return <Checkbox
          id={key}
          key={key}
          className='filter-section-checkbox'
          labelText={label}
          checked={checked}
          onChange={onChange}
        />
      })}
      {showMoreOrLess &&
        <ShowOrMoreItem
          count={count}
          isExpanded={isExpanded}
          onExpand={onExpand}
          locale={locale}
        />}
    </div>
  )
}


FilterSection.propTypes = {
  locale: PropTypes.string,
  section: PropTypes.object,
}


export default class FilterView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      expanded: {},
    }
    this.resize = _.debounce(()=>{
      this.layoutView()
    }, 150)
    this.handleFilterClose = this.handleFilterClose.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  layoutView() {
    this.forceUpdate()
  }

  setContainerRef = ref => {this.containerRef = ref}

  render() {
    const { context: {locale}, view} = this.props
    const {overview, activeFilters, conditionFilters, conditionFilterSets} = view
    const bannerFiltered = activeFilters[BANNER_FILTER].length>0
    let {allProviders} = this.props
    let {clusters=[]} = overview

    // add filter sections
    const sections=[]

    // condition filters
    sections.push(this.getConditionSectionData(locale))
    if (conditionFilters.size>0) {
      clusters = filterByCondition(clusters, conditionFilters, conditionFilterSets)
      allProviders = allProviders.filter(({includes})=>{
        const {matchingClusters} = getMatchingClusters(clusters, includes)
        return (matchingClusters.length!==0)
      })
    }

    // provider filters
    if (!bannerFiltered) {
      const providerSet = new Set(allProviders.map(provider=>{return provider.title}))
      sections.push(this.getSectionData(PROVIDER_FILTER, providerSet, locale))
    }

    // other filters
    const purposeSet = new Set()
    const regionSet = new Set()
    const kubetypeSet = new Set()
    // if banner is open
    if (bannerFiltered) {
      clusters = filterByProvider(clusters, activeFilters)
    }
    clusters.forEach((cluster)=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      const { vendor='Other', environment='Other', region='Other'} = labels
      purposeSet.add(environment)
      regionSet.add(region)
      kubetypeSet.add(vendor)
    })
    sections.push(this.getSectionData('environment', purposeSet, locale))
    sections.push(this.getSectionData('region', regionSet, locale))
    sections.push(this.getSectionData('vendor', kubetypeSet, locale))

    // calc height of scrollbar container
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    const rect = document.getElementsByClassName('overview-header')[0].getBoundingClientRect()
    const scrollHeight = height-rect.top
    const containerWidth = 260 // based on overview-filterview width of 300px
    return (
      <div className='overview-filterview' style={{height:scrollHeight+3}} >
        <h3 className='filterHeader'>
          <span className='titleText'>
            {msgs.get('filter.view.title', locale)}
          </span>
          <Icon
            className='closeIcon'
            description={msgs.get('filter.view.close', locale)}
            name="icon--close"
            onClick={this.handleFilterClose}
          />
        </h3>
        <Scrollbars style={{ width: containerWidth, height: scrollHeight-80 }}
          renderView = {this.renderView}
          renderThumbVertical = {this.renderThumbVertical}
          ref={this.setContainerRef}
          className='filter-sections-container'>
          {sections.map(section => {
            return <FilterSection key={section.key} section={section} locale={locale} />
          })}
        </Scrollbars>
      </div>)
  }

  renderView({ style, ...props }) {
    style.marginBottom = -17
    return (
      <div {...props} style={{ ...style }} />
    )
  }

  renderThumbVertical({ style, ...props }) {
    const finalStyle = {
      ...style,
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(255,255,255,.2)'
    }
    return <div className={'filter-sections-scrollbar'} style={finalStyle} {...props} />
  }

  getConditionSectionData(locale) {
    const {view: {conditionFilters=new Set()}} = this.props
    const filters = Object.keys(ConditionTypes).map(value=>{
      return {
        key: CONDITION_FILTER+value,
        label: msgs.get(`filter.view.condition.${value}`, locale),
        checked: conditionFilters.has(value),
        onChange: this.onChange.bind(this, CONDITION_FILTER, value),
      }
    })
    filters.unshift({
      key: CONDITION_FILTER+'none',
      label: msgs.get('filter.view.none', locale),
      isAll: true,
      checked: conditionFilters.size===0,
      onChange: this.onChange.bind(this, CONDITION_FILTER, 'none'),
    })
    return {
      key: CONDITION_FILTER,
      name: msgs.get('filter.view.conditions', locale),
      filters,
    }
  }

  getSectionData(label, set, locale) {
    let msgKey
    switch (label) {
    case PROVIDER_FILTER:
      msgKey = 'filter.view.cloud.providers'
      break
    case 'environment':
      msgKey = 'filter.view.purpose'
      break
    case 'region':
      msgKey = 'filter.view.regions'
      break
    case 'vendor':
      msgKey = 'filter.view.kube.type'
      break
    }
    const {view: {activeFilters}} = this.props
    const active = activeFilters[label]
    const activeMap = _.keyBy(active, 'title')
    const multipleChoices = set.size>1
    const filters = [...set].map(value=>{
      return {
        key: label+value,
        label: value,
        checked: !multipleChoices || (label===PROVIDER_FILTER ? !!activeMap[value] : active.indexOf(value)!==-1),
        onChange: !multipleChoices ? ()=>{} : this.onChange.bind(this, label, value),
      }
    })
    if (multipleChoices) {
      filters.unshift({
        key: label+'all',
        label: msgs.get('filter.view.all', locale),
        isAll: true,
        checked: active.length===0,
        onChange: this.onChange.bind(this, label, 'all'),
      })
    }
    return {
      key: label,
      name: msgs.get(msgKey, locale),
      filters,
      isExpanded: this.state.expanded[label],
      onExpand: this.onExpand.bind(this, label),
    }
  }

  onChange = (label, value, checked) => {
    const {allProviders, view, updateFilters} = this.props
    if (label!==CONDITION_FILTER) {
      const activeFilters = _.cloneDeep(view.activeFilters)
      if (value!=='all') {
        const filters=activeFilters[label]

        // for provider filter, add includes
        if (label===PROVIDER_FILTER) {
          const idx = filters.findIndex(({title})=>{
            return title === value
          })
          if (checked && idx==-1) {
            const allMap = _.keyBy(allProviders, 'title')
            filters.push(allMap[value])
          } else if (idx!==-1) {
            filters.splice(idx, 1)
          }
        } else {
          const idx = filters.indexOf(value)
          if (checked && idx===-1) {
            filters.push(value)
          } else if (idx!==-1) {
            filters.splice(idx, 1)
          }
        }
      } else {
        activeFilters[label]=[]
      }
      updateFilters(activeFilters)
    } else {
      const conditionFilters = _.cloneDeep(view.conditionFilters)
      if (value!=='none') {
        if (conditionFilters.has(value)) {
          conditionFilters.delete(value)
        } else {
          conditionFilters.add(value)
        }
      } else {
        conditionFilters.clear()
      }
      updateFilters(null, conditionFilters)
    }
  }

  onExpand = (label) => {
    this.setState(prevState=>{
      const expanded = _.cloneDeep(prevState.expanded)
      expanded[label] = !expanded[label]
      return {expanded}
    })
  }

  handleFilterClose = () => {
    this.props.onClose()
  }
}

FilterView.propTypes = {
  activeFilters: PropTypes.object,
  allProviders: PropTypes.array,
  conditionFilters: PropTypes.object,
  context: PropTypes.object,
  onClose: PropTypes.func,
  updateFilters: PropTypes.func,
  view: PropTypes.object,
}

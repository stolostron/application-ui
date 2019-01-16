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
import {PROVIDER_FILTER} from '../filterHelper'
import { Checkbox, Icon, Tag } from 'carbon-components-react'
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


const FilterSection = ({ section: {name, filters, isExpanded, onExpand}, locale }) => {
  filters.sort(({label:a}, {label:b})=>{return a.localeCompare(b)})

  // show more/or less
  const count = filters.length-SHOW_MORE
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
    this.handleFilterClose = this.handleFilterClose.bind(this)
  }

  render() {
    const { allProviders, context: {locale}, view} = this.props
    const {overview: {clusters=[]}} = view

    // add filter sections
    const sections=[]

    // provider filters
    const providerSet = new Set(allProviders.map(provider=>{return provider.title}))
    sections.push(this.getSectionData(PROVIDER_FILTER, providerSet, locale))

    // other filters
    const purposeSet = new Set()
    const regionSet = new Set()
    const kubetypeSet = new Set()
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

    return (
      <div className='overview-filterview'>
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
        <Scrollbars style={{ width: 230, height: 600 }}
          renderThumbVertical = {this.renderThumbVertical}
          className='filter-sections-container'>
          {sections.map(section => {
            return <FilterSection key={section.key} section={section} locale={locale} />
          })}
        </Scrollbars>
      </div>)
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
    const filters = [...set].map(value=>{
      return {
        key: label+value,
        label: value,
        checked: label===PROVIDER_FILTER ? !!activeMap[value] : active.indexOf(value)!==-1,
        onChange: this.onChange.bind(this, label, value),
      }
    })
    filters.unshift({
      key: label+'all',
      label: msgs.get('filter.view.all', locale),
      checked: active.length===0,
      onChange: this.onChange.bind(this, label, 'all'),
    })
    return {
      key: label,
      name: msgs.get(msgKey, locale),
      filters,
      isExpanded: this.state.expanded[label],
      onExpand: this.onExpand.bind(this, label),
    }
  }

  onChange = (label, value, checked) => {
    const {allProviders, view, updateActiveFilters} = this.props
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
    updateActiveFilters(activeFilters)
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
  allProviders: PropTypes.array,
  context: PropTypes.object,
  onClose: PropTypes.func,
  updateActiveFilters: PropTypes.func,
  view: PropTypes.object,
}


/////////////////////////// FILTER BAR ////////////////////////////////////
//  (FILTER TAGS DISPLAYED AT TOP)

export const FilterBar = ({ boundActiveFilters, locale }) => {
  return (
    <div className='filter-bar'>
      {boundActiveFilters.map(({name, onClick}) => {
        return <Tag key={name} type='custom'>
          {name}
          <Icon
            className='closeIcon'
            description={msgs.get('filter.remove.tag', locale)}
            name="icon--close"
            onClick={onClick}
          />
        </Tag>
      })}
    </div>
  )
}
FilterBar.propTypes = {
  boundActiveFilters: PropTypes.array,
  locale: PropTypes.string,
}

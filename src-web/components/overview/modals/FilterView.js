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
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-filterview.scss')
})

const FilterSection = ({ section: {name, filters} }) => {
  filters.sort(({label:a}, {label:b})=>{return a.localeCompare(b)})
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

    </div>
  )
}


FilterSection.propTypes = {
  section: PropTypes.object,
}


export default class FilterView extends React.Component {

  constructor (props) {
    super(props)
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
        <div className='filter-sections-container'>
          {sections.map(section => {
            return <FilterSection key={section.key} section={section} />
          })}
        </div>
      </div>)
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

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
import { Checkbox, Icon, Tag } from 'carbon-components-react'
import { CardTypes } from '../constants.js'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

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


export const filterViewState = (activeFilters, viewState) => {
  viewState.activeFilters = activeFilters

  // filter cards based on cloud filter
  if (activeFilters.cloud.length>0) {
    const clouds = activeFilters.cloud.map(cloud=>{return cloud.toLowerCase()})
    viewState.cardOrder = viewState.cardOrder.filter(card=>{
      if (card.type===CardTypes.provider) {
        const {include, exclude} = card
        const cloudMatch = clouds.some((cloud)=>{
          return (include.length!==0 && include.indexOf(cloud)!==-1) ||
          (exclude.length!==0 && exclude.indexOf(cloud) === -1)
        })
        if (cloudMatch) {
          // goes in banner
          viewState.bannerCards.push(card)
        } else {
          // removed from view
          viewState.filteredCards.push(card)
        }
        return false
      } else {
        return true
      }
    })
  } else {
    // restore all cards
    viewState.cardOrder = [...viewState.bannerCards, ...viewState.filteredCards, ...viewState.cardOrder]
    viewState.bannerCards = []
    viewState.filteredCards = []
  }

  return viewState
}

export const filterOverview = (activeFilters, overview) => {
  // filter clusters based on activeFilters
  const remainingClusters = new Set()
  const filteredOverview = _.cloneDeep(overview)
  filteredOverview.clusters = filteredOverview.clusters.filter(cluster=>{
    const labels = _.get(cluster, 'metadata.labels', {})
    const { cloud='Other', vendor='Other', environment='Other', region='Other'} = labels
    const types = [{cloud}, {vendor}, {environment}, {region}]
    for (var i = 0; i < types.length; i++) {
      const type = types[i]
      const key = Object.keys(type)[0]
      if (activeFilters[key].length>0 && activeFilters[key].indexOf(type[key])===-1) {
        return false
      }
    }
    remainingClusters.add(_.get(cluster, 'metadata.name', 'unknown'))
    return true
  })

  // filter pods on remaining clusters
  filteredOverview.pods = filteredOverview.pods.filter(pod=>{
    const clusterName = _.get(pod, 'cluster.metadata.name', {})
    return remainingClusters.has(clusterName)
  })

  return filteredOverview
}


const FilterSection = ({ section: {name, filters} }) => {
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
    const { context: {locale}, view} = this.props
    const {overview: {clusters=[]}} = view

    // add filter sections
    const sections=[]
    const providerSet = new Set()
    const purposeSet = new Set()
    const regionSet = new Set()
    const kubetypeSet = new Set()
    clusters.forEach((cluster)=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      const { cloud='Other', vendor='Other', environment='Other', region='Other'} = labels
      providerSet.add(cloud)
      purposeSet.add(environment)
      regionSet.add(region)
      kubetypeSet.add(vendor)
    })
    sections.push(this.getSectionData('cloud', providerSet, locale))
    sections.push(this.getSectionData('environment', purposeSet, locale))
    sections.push(this.getSectionData('region', regionSet, locale))
    sections.push(this.getSectionData('vendor', kubetypeSet, locale))

    return (
      <section className='overview-filter'>
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
        {sections.map(section => {
          return <FilterSection key={section.key} section={section} />
        })}
      </section>)
  }

  getSectionData(label, set, locale) {
    let msgKey
    switch (label) {
    case 'cloud':
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
    const filters = [...set].map(value=>{
      return {
        key: label+value,
        label: value,
        checked: active.indexOf(value)!==-1,
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
    const {view, updateActiveFilters} = this.props
    const activeFilters = _.cloneDeep(view.activeFilters)
    if (value!=='all') {
      const filters=activeFilters[label]
      const idx = filters.indexOf(value)
      if (checked && idx===-1) {
        filters.push(value)
      } else if (idx!==-1) {
        filters.splice(idx, 1)
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
  context: PropTypes.object,
  onClose: PropTypes.func,
  updateActiveFilters: PropTypes.func,
  view: PropTypes.object,
}



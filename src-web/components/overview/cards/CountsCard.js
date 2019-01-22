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
import GridCard from '../GridCard'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'
import config from '../../../../lib/shared/config'
import { Link } from 'react-router-dom'

resources(() => {
  require('../../../../scss/overview-counts.scss')
})

const ALL_PROVIDERS = '__all__'

const CountsCell = ({ status: {value, title, key} }) => (
  <div className='provider-cell'>
    {key ?
      <Link to={`${config.contextPath}/search?filters={"textsearch":"kind:${key}"}`}>
        <div className='counts-value'>{value}</div>
      </Link> : <div className='counts-value'>{value}</div>
    }
    <div className='counts-title'>{title}</div>
  </div>
)

CountsCell.propTypes = {
  status: PropTypes.object,
}

const CountsGroup = ({ statuses=[], group }) => {
  return (
    <div className='provider-group'>
      {statuses.map((status, idx) => {
        return (
          <div key={status.title} className='provider-cell-container'>
            {group && <div className='cell-title'>{idx===0?group:''}</div>}
            <CountsCell status={status} />
          </div>
        )
      })}
    </div>
  )}

CountsGroup.propTypes = {
  group: PropTypes.string,
  statuses: PropTypes.array,
}

class CountsCard extends React.Component {

  static propTypes = {
    allProviders: PropTypes.array,
    bannerOpen: PropTypes.bool,
    item: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleClick() {
    this.toggleSize()
  }

  handleKeyPress(e) {
    if ( e.key === 'Enter') {
      this.toggleSize()
    }
  }

  toggleSize() {
    this.setState(({expanded})=>{
      return {expanded: !expanded}
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bannerOpen) {
      this.setState({expanded: false})
    }
  }

  render() {
    const { allProviders, item, bannerOpen } = this.props
    const { overview: {applications=[], clusters = []} } = item
    const { expanded } = this.state

    // gather data
    const napps=applications.length
    const dataMap={}
    const getInitialData = () => {
      return {
        nclusters: 0,
        npods: 0,
        nnodes: 0,
        regions: new Set(),
        types: new Set(),
      }
    }
    const addData = (key, cluster, labels, idx) => {
      let data = dataMap[key]
      if (!data) {
        data = dataMap[key] = getInitialData()
      }
      data.nclusters++
      data.npods += _.get(cluster, 'usage.pods', 0)
      data.nnodes += _.get(cluster, 'capacity.nodes', 0)
      data.regions.add(labels.region || `unknown${idx}`)
      data.types.add(labels.vendor ||  `unknown${idx}`)
    }
    clusters.forEach((cluster, idx)=>{
      const labels = _.get(cluster, 'metadata.labels', {})

      // keep track of a provider
      if (expanded) {
        const pdx = allProviders.findIndex(({includes})=>{
          return includes.every(include=>{
            const keys = Object.keys(include)
            return keys.length===1 && labels[keys[0]].toLowerCase() === Object.values(include)[0].toLowerCase()
          })})
        if (pdx!==-1) {
          addData(allProviders[pdx].title, cluster, labels, idx)
        }
      }

      // keep track of all providers
      addData(ALL_PROVIDERS, cluster, labels, idx)
    })

    const allData = dataMap[ALL_PROVIDERS] || getInitialData()
    delete dataMap[ALL_PROVIDERS]
    const otherProviders = Object.keys(dataMap).sort()
    const toggleMsg = msgs.get(expanded?'overview.collapse':'overview.expand', this.context.locale)
    return (
      <GridCard item={item} >
        <div className='counts-card'>
          {this.renderCounts(msgs.get('overview.counts.all.clouds', this.context.locale), allData, expanded, napps, true)}
          {otherProviders.map(key=>{
            return this.renderCounts(key, dataMap[key], expanded)
          })}
          {!bannerOpen &&<div className='card-toggle' tabIndex='0' role={'button'}
            onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
            {toggleMsg}
          </div>}
        </div>
      </GridCard>
    )
  }

  renderCounts(group, data, expanded, napps, top) {
    const appStatus = top ? [
      {title: msgs.get('overview.counts.apps', this.context.locale), value: napps, key: 'application'},
    ] : null
    const otherStatues = [
      {title: msgs.get('overview.counts.clusters', this.context.locale), value: data.nclusters, key: 'cluster'},
      {title: msgs.get('overview.counts.types', this.context.locale), value: data.types.size},
      {title: msgs.get('overview.counts.regions', this.context.locale), value: data.regions.size},
      {title: msgs.get('overview.counts.nodes', this.context.locale), value: data.nnodes, key: 'node'},
      {title: msgs.get('overview.counts.pods', this.context.locale), value: data.npods, key: 'pod'},
    ]
    return (
      <div key={group} className='provider-group-container'>
        {appStatus && <CountsGroup statuses={appStatus} />}
        {appStatus && <div className='count-divider'></div>}
        <CountsGroup statuses={otherStatues} group={expanded?group:null} />
      </div>
    )
  }

}

export default CountsCard

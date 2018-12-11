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
import { ProviderOrb } from './ProviderOrb'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

const ProviderCell = ({ status: {value, title} }) => (
  <div className='provider-cell'>
    <div className='value'>{value}</div>
    <div className='title'>{title}</div>
  </div>
)

ProviderCell.propTypes = {
  status: PropTypes.object,
}

const ProviderGroup = ({ statuses=[] }) => (
  <div className='provider-group'>
    {statuses.map((status) =>
      <ProviderCell key={status.title} status={status} />
    )}
  </div>
)

ProviderGroup.propTypes = {
  statuses: PropTypes.array,
}

class ProviderView extends React.Component {

  static propTypes = {
    overview: PropTypes.object,
  }

  render() {
    const { overview: {applications=[], clusters = [], services=[]} } = this.props

    // gather data
    const providers = {
      Azure: [],
      AWS: [],
      Google: [],
      IBM: [],
      PC: [],
    }

    const napps=applications.length
    const nservices=services.length
    const nclusters=clusters.length
    const regions=new Set()
    let npods=0
    let nnodes=0

    clusters.forEach(cluster=>{
      // provider
      const labels = _.get(cluster, 'metadata.labels', {})
      const provider = labels.cloud || 'unknown'
      let arr = providers[provider]
      if (!arr) {
        arr = providers[provider] = []
      }
      arr.push(cluster)

      // nodes
      nnodes += _.get(cluster, 'capacity.nodes', 0)

      // pods
      npods += _.get(cluster, 'usage.pods', 0)

      // regions
      regions.add(labels.region || 'unknown')
    })

    // provider statuses
    const statuses = [
      {group:'1', stats: [
        {title: msgs.get('overview.status.apps', this.context.locale), value: napps},
        {title: msgs.get('overview.status.services', this.context.locale), value: nservices},
        {title: msgs.get('overview.status.pods', this.context.locale), value: npods},
      ]},
      {group:'2', stats: [
        {title: msgs.get('overview.status.regions', this.context.locale), value: regions.size},
        {title: msgs.get('overview.status.clusters', this.context.locale), value: nclusters},
        {title: msgs.get('overview.status.nodes', this.context.locale), value: nnodes},
      ]}]

    return (
      <div className='provider-view'>
        <div className='provider-container'>
          {Object.keys(providers).map(provider =>
            <ProviderOrb
              key={provider}
              provider={Object.assign( {name:provider}, {clusters:providers[provider]} ) }
            />)}
        </div>
        <div className='provider-statuses'>
          {statuses.map(({group, stats}) =>
            <ProviderGroup key={group} statuses={stats} />)}
        </div>
      </div>
    )
  }
}

export default ProviderView

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

resources(() => {
  require('../../../../scss/overview-counts.scss')
})

const CountsCell = ({ status: {value, title} }) => (
  <div className='provider-cell'>
    <div className='counts-value'>{value}</div>
    <div className='counts-title'>{title}</div>
  </div>
)

CountsCell.propTypes = {
  status: PropTypes.object,
}

const CountsGroup = ({ statuses=[] }) => (
  <div className='provider-group'>
    {statuses.map((status) =>
      <CountsCell key={status.title} status={status} />
    )}
  </div>
)

CountsGroup.propTypes = {
  statuses: PropTypes.array,
}

class CountsCard extends React.Component {

  static propTypes = {
    item: PropTypes.object,
  }

  render() {
    const { item } = this.props
    const { overview: {applications=[], clusters = []} } = item

    // gather data
    const napps=applications.length
    const nclusters=clusters.length
    const regions=new Set()
    const types=new Set()
    let npods=0
    let nnodes=0

    clusters.forEach((cluster, idx)=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      // nodes
      nnodes += _.get(cluster, 'capacity.nodes', 0)

      // pods
      npods += _.get(cluster, 'usage.pods', 0)

      // regions
      regions.add(labels.region || `unknown${idx}`)

      // vendors (kube types)
      types.add(labels.vendor ||  `unknown${idx}`)
    })

    // provider statuses
    const statuses = [[
      {title: msgs.get('overview.counts.apps', this.context.locale), value: napps},
      {title: msgs.get('overview.counts.types', this.context.locale), value: types.size},
      {title: msgs.get('overview.counts.pods', this.context.locale), value: npods},
    ],[
      {title: msgs.get('overview.counts.regions', this.context.locale), value: regions.size},
      {title: msgs.get('overview.counts.clusters', this.context.locale), value: nclusters},
      {title: msgs.get('overview.counts.nodes', this.context.locale), value: nnodes},
    ]]

    return (
      <GridCard item={item} >
        <div className='counts-card'>
          <CountsGroup  statuses={statuses[0]} />
          <div className='count-divider'></div>
          <CountsGroup  statuses={statuses[1]} />
        </div>
      </GridCard>
    )
  }
}

export default CountsCard

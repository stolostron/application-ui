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
import StatusPieCell from './StatusPieCell'
import { getPercentage, getTotal } from '../../../lib/client/charts-helper'
import msgs from '../../../nls/platform.properties'

class StatusCellClusters extends React.Component {
  render() {
    const { locale } = this.context
    const { overview: {clusters} } = this.props

    const data = {
      'offline': 0,
      'ready': 0,
    }

    const values = clusters.reduce((acc, {status}) => {
      switch (status.toLowerCase()) {
      case 'ok':
        data['ready'] += 1
        break

      default:
        data['offline'] += 1
        break
      }
      return acc
    }, data)

    const chartData= [
      {
        name: msgs.get('overview.status.ready', locale),
        value: values.ready,
        className: 'ready'
      },
      {
        name: msgs.get('overview.status.offline', locale),
        value: values.offline,
        className: 'offline'
      },
    ]
    const label = 'ready'
    const total=getTotal(chartData)
    const percentage=getPercentage(values.ready, total)

    return (
      <div>
        <StatusPieCell
          header={msgs.get('overview.status.clusters', locale)}
          tagValue={total.toString()}
          chartData={chartData}
          label={label}
          total={total}
          percentage={percentage}
        />
      </div>
    )
  }
}

StatusCellClusters.propTypes = {
  overview: PropTypes.object,
}

export default StatusCellClusters

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

class StatusCellPods extends React.Component {
  render() {
    const { locale } = this.context
    const { overview: {pods} } = this.props

    const data = {
      'running': 0,
      'pending': 0,
      'failed': 0,
    }

    const values = pods.reduce((acc, {status}) => {
      switch (status.toLowerCase()) {
      case 'running':
      case 'succeeded':
        data['running'] += 1
        break

      case 'pending':
        data['pending'] += 1
        break

      default:
        data['failed'] += 1
        break
      }
      return acc
    }, data)

    const chartData= [
      {
        name: msgs.get('overview.status.running', locale),
        value: values.running,
        className: 'running'
      },
      {
        name: msgs.get('overview.status.pending', locale),
        value: values.pending,
        className: 'pending'
      },
      {
        name: msgs.get('overview.status.failed', locale),
        value: values.failed,
        className: 'failed'
      },
    ]
    const label = 'running'
    const total=getTotal(chartData)
    const percentage=getPercentage(values.running, total)

    return (
      <div>
        <StatusPieCell
          header={msgs.get('overview.status.pods', locale)}
          tagValue={total.toString()}
          label={label}
          chartData={chartData}
          total={total}
          percentage={percentage}
        />
      </div>
    )
  }
}

StatusCellPods.propTypes = {
  overview: PropTypes.object,
}

export default StatusCellPods

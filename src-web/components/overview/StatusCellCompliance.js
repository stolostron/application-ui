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

class StatusCellCompliance extends React.Component {
  render() {
    const { locale } = this.context
    const { overview: {compliance=[]} } = this.props

    const data = {
      'unassigned': 2,
      'assigned': 4,
    }

    let values = compliance.reduce((acc, {status}) => {
      switch (status.toLowerCase()) {
      case 'ok':
        data['assigned'] += 1
        break

      default:
        data['unassigned'] += 1
        break
      }
      return acc
    }, data)

    //TODO
    values = {
      'unassigned': 2,
      'assigned': 4,
    }

    const chartData= [
      {
        name: msgs.get('overview.status.assigned', locale),
        value: values.assigned,
        className: 'assigned'
      },
      {
        name: msgs.get('overview.status.unassigned', locale),
        value: values.unassigned,
        className: 'unassigned'
      },
    ]
    const label = 'assigned'
    const total=getTotal(chartData)
    const percentage=getPercentage(values.assigned, total)

    return (
      <div>
        <StatusPieCell
          header={msgs.get('overview.status.compliance', locale)}
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

StatusCellCompliance.propTypes = {
  overview: PropTypes.object,
}

export default StatusCellCompliance

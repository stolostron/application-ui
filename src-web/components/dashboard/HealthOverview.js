/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import { BarGraph, PieChart } from 'carbon-addons-data-viz-react'
import DashboardSection from '../common/DashboardSection'
import msgs from '../../../nls/platform.properties'

const pieChartProps = {
  radius: 96,
  color: ['#3CC674', '#F46C0F', '#F21A06'],
}

// https://github.com/carbon-design-system/carbon-addons-data-viz-react/issues/111
// issue created against carbon, seems there is a defect with string type
const barGraphProps = {
  data: [[[14,4,1], '7d'], [[49,10,3], '6d'], [[40,10,2], '5d'], [[23,5,2], '4d'], [[33,5,1], '3d'], [[23,8,2], '2d'], [[45,3,1], '1d']],
  margin: {
    top: 30,
    right: 20,
    bottom: 75,
    left: 65,
  },
  height: 250,
  width: 400,
  labelOffsetY: 55,
  labelOffsetX: 65,
  axisOffset: 16,
  yAxisLabel: '',
  xAxisLabel: '',
  id: 'bar-graph-1',
  containerId: 'bar-graph-container',
  color: ['#3CC674', '#F46C0F', '#F21A06']
}



class HealthOverview extends React.Component {
  render() {
    const { locale } = this.context
    /* eslint-disable-next-line no-unused-vars */
    const { pieChartItems = [], barChartItems = [] } = this.props
    return (
      <div id='health-overview'>
        <DashboardSection name={msgs.get('dashboard.section.health-overview', locale)}>
          {pieChartItems.map(item =>
            item.name &&
            (<div className='dashboard-pie-chart' key={item.name} >
              <PieChart data={item.data} id={item.name} {...pieChartProps} />
              <p>{msgs.get(`dashboard.chart.${lodash.camelCase(item.name)}`, locale)}</p>
            </div>))
          }
          {/* TODO: add historical chart
          {barChartItems.map(item =>
            item.name &&
            (<div className='dashboard-chart'>
              <BarGraph data={item.data} id={item.name} {...barGraphProps} />
              <p>{msgs.get(msgs.get(`dashboard.card.${lodash.camelCase(item.name)}`), locale)}</p>
            </div>))
          }*/}
          <div className='dashboard-bar-chart'>
            <BarGraph{...barGraphProps} />
            <p>{msgs.get('dashboard.chart.historicBarChart', locale)}</p>
          </div>
        </DashboardSection>
      </div>
    )
  }
}


HealthOverview.contextTypes = {
  locale: PropTypes.string
}

HealthOverview.propTypes = {
  barChartItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.array
  })),
  pieChartItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.array
  })),
}

export default HealthOverview

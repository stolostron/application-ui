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
  color: ['#5aa700', '#efc100', '#e0182d'],
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
  color: ['#5aa700', '#efc100', '#e0182d'],
}


const DashboardPieCharts = ({ pieChartItems = [], locale }) => (
  pieChartItems.map((item) => {
    const modifiedData = item.data.filter(dataItem => dataItem && dataItem.length > 1 && dataItem[1] != 0)
    return item.name &&
    (<div className='dashboard-pie-chart' key={item.name} >
      <PieChart data={modifiedData} id={item.name} {...pieChartProps} />
      <p>{msgs.get(`dashboard.chart.${lodash.camelCase(item.name)}`, locale)}</p>
    </div>)
  })
)

DashboardPieCharts.propTypes = {
  locale: PropTypes.string,
  pieChartItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.array
  })),
}

/* TODO: add historical chart */
const DashboardBarCharts = ({ locale }) => (
  <div className='dashboard-bar-chart'>
    <BarGraph{...barGraphProps} />
    <p>{msgs.get('dashboard.chart.historicBarChart', locale)}</p>
  </div>
)

DashboardBarCharts.propTypes = {
  barChartItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.array
  })),
  locale: PropTypes.string,
}


class HealthOverview extends React.Component {
  render() {
    const { locale } = this.context
    return (
      <div id='health-overview'>
        <DashboardSection name={msgs.get('dashboard.section.health-overview', locale)}>
          <DashboardPieCharts {...this.props} locale={locale} />
          <DashboardBarCharts {...this.props} locale={locale} />
        </DashboardSection>
      </div>
    )
  }
}


HealthOverview.contextTypes = {
  locale: PropTypes.string
}

export default HealthOverview

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
import PropTypes from 'prop-types'
import { BarGraph, PieChart } from 'carbon-addons-data-viz-react'
import DashboardSection from '../common/DashboardSection'
import msgs from '../../../nls/platform.properties'

const pieChartProps = {
  data: [['Healthy', '2'], ['Warning', '0'], ['Critical', '1']],
  radius: 96,
  color: ['#3CC674', '#F46C0F', '#F21A06'],
  id: 'pie-chart',
  formatFunction: (s) => s,
}

const barGraphProps = {
  data: [[['14','4','1'], '7d'], [['49','10','3'], '6d'], [['40','10','2'], '5d'], [['23','5','2'], '4d'], [['33','5','1'], '3d'], [['23','8','2'], '2d'], [['45','3','1'], '1d']],
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



class SystemOverview extends React.Component {
  render() {
    const { locale } = this.context
    return (
      <div id='health-overview'>
        <DashboardSection name={msgs.get('dashboard.section.health-overview', locale)}>
          {/* TODO: use props data*/}
          {/*{healthData.map(item =>*/}
          {/*<DashboardCard data={item.data} title={item.title} key={item.key} />)}*/}
          <div className='dashboard-chart'>
            <PieChart {...pieChartProps} />
            <p>{msgs.get('dashboard.chart.clusterHealthPieChart', locale)}</p>
          </div>
          <div className='dashboard-chart'>
            <BarGraph{...barGraphProps} />
            <p>{msgs.get('dashboard.chart.historicBarChart', locale)}</p>
          </div>
        </DashboardSection>
      </div>
    )
  }
}

SystemOverview.contextTypes = {
  locale: PropTypes.string
}

export default SystemOverview

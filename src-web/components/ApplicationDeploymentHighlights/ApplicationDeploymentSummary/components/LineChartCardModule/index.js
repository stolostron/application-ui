/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { withLocale } from '../../../../../providers/LocaleProvider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { getChartKeyColor, getChartKeyName, getModuleData } from './utils'

const LineChartCardModule = withLocale(({ data, locale }) => {
  const moduleData = getModuleData(data)
  return (
    <BarChart
      layout="vertical"
      width={400}
      height={250}
      data={moduleData.chartCardItems}
      margin={{
        top: 20,
        right: 0,
        left: 140,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis type="number" axisLine={false} />
      <YAxis
        type="category"
        dataKey="name"
        tick={{ fontSize: 10, transform: 'translate(0, 12)' }}
        interval="preserveStartEnd"
        tickSize={10}
        axisLine={false}
        tickLine={{ stroke: '#DFE3E6', transform: 'translate(0, 6)' }}
      />
      <Tooltip />
      <Bar
        barSize={10}
        legendType="circle"
        dataKey="cm"
        stackId="a"
        fill={getChartKeyColor('cm')}
        name={getChartKeyName('cm', locale)}
      />
      <Bar
        dataKey="pr"
        stackId="a"
        fill={getChartKeyColor('pr')}
        name={getChartKeyName('pr', locale)}
      />
      <Bar
        dataKey="fl"
        stackId="a"
        fill={getChartKeyColor('fl')}
        name={getChartKeyName('fl', locale)}
      />
    </BarChart>
  )
})

LineChartCardModule.propTypes = {}

export default withLocale(LineChartCardModule)

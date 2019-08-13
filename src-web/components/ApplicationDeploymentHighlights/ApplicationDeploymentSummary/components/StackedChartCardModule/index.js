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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { getChartKeyColor, getChartKeyName, getModuleData } from './utils'

const StackedChartCardModule = withLocale(({ data, locale, chartWidth }) => {
  const moduleData = getModuleData(data)
  return (
    <ResponsiveContainer width="95%" height="90%">
      <BarChart
        width={chartWidth}
        height={250}
        data={moduleData.chartCardItems}
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 20
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <defs>
          <linearGradient id="colorCm" x1="0" y1="1" x2="0" y2="0">
            <stop offset="25%" stopColor="#014536" stopOpacity={0.8} />
            <stop
              offset="75%"
              stopColor={getChartKeyColor('cm')}
              stopOpacity={0.6}
            />
          </linearGradient>
          <linearGradient id="colorPr" x1="0" y1="1" x2="0" y2="0">
            <stop
              offset="25%"
              stopColor={getChartKeyColor('pr')}
              stopOpacity={0.8}
            />
            <stop
              offset="75%"
              stopColor={getChartKeyColor('pr')}
              stopOpacity={0.6}
            />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, transform: 'translate(0, 12)' }}
          interval="preserveStartEnd"
          tickSize={10}
          tickLine={{ stroke: '#DFE3E6', transform: 'translate(0, 6)' }}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, transform: 'translate(-5, 0)' }}
          tickLine={false}
          axisLine={false}
          tickCount={4}
          width={43}
        />
        <Tooltip />
        <Bar
          barSize={30}
          legendType="circle"
          dataKey="cm"
          stackId="a"
          stroke={getChartKeyColor('cm')}
          fillOpacity={1}
          fill="url(#colorCm)"
          name={getChartKeyName('cm', locale)}
        />
        <Bar
          dataKey="pr"
          stackId="a"
          stroke={getChartKeyColor('pr')}
          fillOpacity={1}
          fill="url(#colorPr)"
          name={getChartKeyName('pr', locale)}
        />
        <Bar
          dataKey="fl"
          stackId="a"
          fill={getChartKeyColor('fl')}
          name={getChartKeyName('fl', locale)}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

StackedChartCardModule.propTypes = {}

export default withLocale(StackedChartCardModule)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
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
import {
  getChartKeyName,
  getModuleData,
  getMaxStringWidth,
  toPercent
} from './utils'

const LineChartCardModule = withLocale(({ data, locale }) => {
  const moduleData = getModuleData(data)
  const maxString = getMaxStringWidth(data) * 2 + 30
  const domain = [0, 1]
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1]

  const renderTooltipContent = line => {
    const { payload } = line
    if (payload && payload.length > 0) {
      const entry = payload[0]
      return (
        <div className="customized-tooltip-content">
          <span className="bx--tooltip__caret" />
          <p className="total">{`${entry.payload.tooltip_name}`}</p>
          <ul className="list">
            {
              <li key={'item-0'} style={{ color: entry.color }}>
                {`${entry.name}: ${entry.payload.completed} / ${
                  entry.payload.total
                }`}
              </li>
            }
          </ul>
        </div>
      )
    }
  }

  return (
    <ResponsiveContainer width="95%" height="90%">
      <BarChart
        layout="vertical"
        width={400}
        height={250}
        data={moduleData.chartCardItems}
        margin={{
          top: 40,
          right: 20,
          left: maxString,
          bottom: 20
        }}
      >
        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F5F7FA" />
        <defs>
          <linearGradient id="colorUv" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#00BAB6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#47ECEB" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="colorNotCompl" x1="1" y1="0" x2="0" y2="0">
            <stop offset="5%" stopColor="#F5F7FA" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#F5F7FA" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <XAxis
          type="number"
          axisLine={false}
          tickFormatter={toPercent}
          tickCount={6}
          domain={domain}
          ticks={ticks}
          tick={{ fontSize: 10 }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={renderTooltipContent} />
        <Bar
          barSize={8}
          legendType="circle"
          dataKey="percent_completed"
          stackId="a"
          fillOpacity={1}
          fill="url(#colorUv)"
          name={getChartKeyName('percent_completed', locale)}
        />
        <Bar
          barSize={8}
          legendType="circle"
          dataKey="percent_not_completed"
          stackId="a"
          fillOpacity={1}
          fill="url(#colorNotCompl)"
          name={getChartKeyName('percent_not_completed', locale)}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

LineChartCardModule.propTypes = {}

export default withLocale(LineChartCardModule)

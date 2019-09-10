/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
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
import { getChartKeyName, getModuleData } from './utils'

const StackedChartCardModule = withLocale(({ data, locale, chartWidth }) => {
  const renderTooltipContent = line => {
    const { payload, label } = line

    if (payload && payload.length > 0) {
      return (
        <div className="customized-tooltip-content">
          <span className="bx--tooltip__caret" />
          <p className="total">{`${label}`}</p>
          <ul className="list">
            {payload.map(entry => (
              <li key={'item-cm'}>{`${entry.name}: ${entry.value}`}</li>
            ))}
          </ul>
        </div>
      )
    }
  }
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
        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F5F7FA" />
        <defs>
          <linearGradient id="colorCm" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#285656" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#479C9D" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorPr" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#DBFBFB" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#92EEEE" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorFl" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FF767C" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FB4B53" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, transform: 'translate(0, 12)' }}
          interval="preserveStartEnd"
          tickSize={5}
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
        <Tooltip content={renderTooltipContent} />
        <Bar
          barSize={30}
          dataKey="cm"
          stackId="a"
          fillOpacity={1}
          fill="url(#colorCm)"
          name={getChartKeyName('cm', locale)}
        />
        <Bar
          dataKey="pr"
          stackId="a"
          fillOpacity={1}
          fill="url(#colorPr)"
          name={getChartKeyName('pr', locale)}
        />
        <Bar
          dataKey="fl"
          stackId="a"
          fillOpacity={1}
          fill="url(#colorFl)"
          name={getChartKeyName('fl', locale)}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

StackedChartCardModule.propTypes = {}

export default withLocale(StackedChartCardModule)

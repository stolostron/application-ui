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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatusCell from './StatusCell'

const LineGraphTooltip = ({ active, payload, label, domainData: {available, used, units=''} }) => {
  if (!active)
    return null
  return (
    <div className='line-graph-tooltip'>
      <div className='timestamp'>{label}</div>
      {payload.map(item => {
        return (
          <div key={item.dataKey} className='data'>
            <div className={`circle ${item.dataKey}`}></div>
            <span>{item.dataKey === 'available' ? available : used}: {`${item.value}${units}`}</span>
          </div>
        )
      })}
    </div>
  )
}

LineGraphTooltip.propTypes = {
  active: PropTypes.bool,
  domainData: PropTypes.object,
  label: PropTypes.string,
  payload: PropTypes.array,
}

const LineGraphContainer = ({ chartData, domainData, tooltip }) => {
  const {tickFormatter, domain, ticks} = domainData
  return (
    <ResponsiveContainer width={260} height={150}>
      <AreaChart data={chartData} margin={{ top: 10, right: 12, bottom: 20, left: 0 }}>
        <XAxis
          dataKey='name'
          tick={{ fontSize: 10, transform: 'translate(0, 12)'}}
          interval={'preserveStartEnd'}
          tickSize={10}
          tickLine={{ stroke: '#DFE3E6', transform: 'translate(0, 6)' }}
          axisLine={false} />
        <YAxis
          tickFormatter={tickFormatter}
          domain={domain}
          ticks={ticks}
          tick={{ fontSize: 12, transform: 'translate(-5, 0)' }}
          tickLine={false}
          axisLine={false}
          tickCount={4}
          width={43}  />
        <CartesianGrid strokeDasharray='2 2' vertical={false} />
        <Tooltip content={<LineGraphTooltip tooltip={tooltip} domainData={domainData} />} />
        <Area
          type='linear'
          rawDataKey='available'
          dataKey='available'
          className='available'
          dot={false} />
        <Area
          type='linear'
          rawDataKey='used'
          dataKey='used'
          className='used'
          dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )}

LineGraphContainer.propTypes = {
  chartData: PropTypes.array,
  domainData: PropTypes.object,
  tooltip: PropTypes.string,
}

const StatusChartCell = ({
  header,
  tagValue,
  tooltip,
  chartData=[],
  domainData={},
}) =>
  <StatusCell header={header} tagValue={tagValue}>
    <LineGraphContainer chartData={chartData} domainData={domainData} tooltip={tooltip} />
  </StatusCell>

StatusChartCell.propTypes = {
  chartData: PropTypes.array,
  domainData: PropTypes.object,
  header: PropTypes.string,
  tagValue: PropTypes.string,
  tooltip: PropTypes.string,
}

export default StatusChartCell


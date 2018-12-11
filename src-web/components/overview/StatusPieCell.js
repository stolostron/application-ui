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
import { PieChart, Pie, Cell, Label } from 'recharts'
import StatusCell from './StatusCell'

const PieLabel = ({ value, label, viewBox }) => {
  return (
    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' fill='#152935' fontWeight='300'>
      <tspan x={viewBox.cx} fontSize='13px' letterSpacing='.5px'>
        <tspan fontSize='30px'>{value}</tspan>
        <tspan fontSize='15px' dy='-10'>%</tspan>
      </tspan>
      <tspan x={viewBox.cx} dy='30' textAnchor='middle' dx='-4' fontSize='13px'>{label}</tspan>
    </text>
  )
}

PieLabel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  viewBox: PropTypes.object,
}

const StatusPieCell = ({
  header,
  tagValue,
  label,
  percentage,
  chartData,
}) =>
  <StatusCell header={header} tagValue={tagValue}>
    {(() => {
      if (percentage > 0) {
        return (
          <div className='pie-graph'>
            <div className='pie-graph__container'>
              <PieChart width={100} height={100}>
                <Pie data={chartData} dataKey='value' cx='50%' cy='50%' innerRadius={40} outerRadius={50} fill="#82ca9d">
                  <Label value={percentage} content={<PieLabel label={label} />} />
                  {
                    chartData.map((entry) => (
                      <Cell key={entry.name} className={entry.className} />
                    ))
                  }
                </Pie>
              </PieChart>
            </div>
            <div className='pie-graph__legend'>
              {chartData.map((entry) => {
                return (
                  <div className={`legend-item bottom_border ${entry.className}`} key={entry.name} >
                    <span className='value'>{entry.value}</span>
                    <span className='label' title={entry.name}>{entry.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }
    })()}
  </StatusCell>

StatusPieCell.propTypes = {
  chartData: PropTypes.array,
  header: PropTypes.string,
  label: PropTypes.string,
  percentage: PropTypes.number,
  tagValue: PropTypes.string,
}

export default StatusPieCell


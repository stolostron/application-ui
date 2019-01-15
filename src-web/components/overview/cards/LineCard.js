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
import resources from '../../../../lib/shared/resources'
import { TagTypes } from '../constants.js'
import { getDataValues } from '../dataHelper'
import moment from 'moment'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GridCard from '../GridCard'
import { MAX_CHART_DATA_SIZE } from '../../../../lib/shared/constants'
import { getPercentage } from '../../../../lib/client/charts-helper'

resources(() => {
  require('../../../../scss/overview-charts.scss')
})

const LineCardTooltip = ({ active, payload, label, domainData: {areaData, units=''} }) => {
  if (!active)
    return null
  return (
    <div className='line-graph-tooltip'>
      <div className='timestamp'>{label}</div>
      {payload.map(({dataKey:key, value}) => {
        return (
          <div key={key} className='data'>
            <div className={`circle ${areaData[key] ? areaData[key].className : key}`}></div>
            <span>{areaData[key] ? areaData[key].name : key}: {`${value}${units}`}</span>
          </div>
        )
      })}
    </div>
  )
}

LineCardTooltip.propTypes = {
  active: PropTypes.bool,
  domainData: PropTypes.object,
  label: PropTypes.string,
  payload: PropTypes.array,
}

const LineGraphContainer = ({ chartData, domainData, tooltip }) => {
  const {tickFormatter, domain, areaData, ticks} = domainData
  return (
    <div className='line-chart'>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <AreaChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
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
          <Tooltip content={<LineCardTooltip tooltip={tooltip} domainData={domainData} />} />
          {domainData.dataKeys.map(key => {
            return (
              <Area
                key={key}
                type='linear'
                rawDataKey={key}
                dataKey={key}
                className={areaData[key] ? areaData[key].className : key}
                dot={false} />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )}

LineGraphContainer.propTypes = {
  chartData: PropTypes.array,
  domainData: PropTypes.object,
  tooltip: PropTypes.string,
}

const LineGraph = ({
  header,
  tagValue,
  tooltip,
  chartData=[],
  domainData={},
  item,
}) =>
  <GridCard header={header} tagValue={tagValue} item={item}>
    <LineGraphContainer chartData={chartData} domainData={domainData} tooltip={tooltip} />
  </GridCard>

LineGraph.propTypes = {
  chartData: PropTypes.array,
  domainData: PropTypes.object,
  header: PropTypes.string,
  item: PropTypes.object,
  tagValue: PropTypes.string,
  tooltip: PropTypes.string,
}

class LineCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      popTheTop: false,
      chartData: []
    }
  }

  componentWillMount() {
    this.updateChartData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateChartData(nextProps)
  }

  shouldComponentUpdate (nextProps) {
    // don't update if same timestamp
    const { item: {overview: {timestamp:oldTime}} } = this.props
    const { item: {overview: {timestamp:newTime}} } = nextProps
    return oldTime!==newTime
  }

  updateChartData(props) {
    const { item } = props
    const { cardData: {dataType, pieData}, overview } = item
    let { popTheTop } = this.state

    // line chart as line chart
    let chartPoint, dataKeys, units=''
    const areaData = {}
    if (!pieData) {
      dataKeys = ['available', 'used']
      const {available, used, units:unitz} = getDataValues(overview, dataType)
      units = unitz
      chartPoint = {
        name: moment().format('LT'),
        available,
        used,
        display: {
          available: new Intl.NumberFormat(this.context.locale).format(available),
          used: new Intl.NumberFormat(this.context.locale).format(used),
        },
        total: available,
      }
    } else {
    // pie chart as line chart
      dataKeys = Object.keys(pieData)
      const {valueMap} = getDataValues(overview, dataType, pieData)
      chartPoint = {
        name: moment().format('LT'),
        display: {},
        total: 0,
      }
      for (var pieKey in pieData) {
        const value = valueMap[pieKey] ? valueMap[pieKey].length : 0
        chartPoint[pieKey] = value
        chartPoint.display[pieKey] = new Intl.NumberFormat(this.context.locale).format(value)
        chartPoint.total+=value
        areaData[pieKey] = pieData[pieKey]
      }
    }

    const initialize = this.state.chartData.length ===0
    const chartData = this.createFixedArray(chartPoint)
    // a one point line graph doesn't look like a line graph
    if (initialize) {
      chartData.push(chartPoint)
      popTheTop = true
    } else if (popTheTop) {
      chartData.pop()
      popTheTop = false
    }
    const max = Math.max(...chartData.map(({total}) => total)) * 1.2
    const domainData = {
      tickFormatter: value => `${value}`,
      domain: [0, max],
      ticks: Array.from({length: 4}, (v, i) => Math.round(i*max/3)),
      dataKeys,
      areaData,
      units
    }

    this.setState({
      popTheTop,
      domainData,
      chartData,
    })
  }

  createFixedArray(obj) {
    const { chartData } = this.state
    const newItems = [ ...chartData, obj ]
    if (newItems.length > MAX_CHART_DATA_SIZE)
      newItems.shift()
    return newItems
  }

  render() {
    const { chartData, domainData } = this.state
    const { item } = this.props
    const { cardData: {title, tagType=TagTypes.nopercent} } = item
    const { used=0, total } = chartData[chartData.length - 1]
    const percentage = getPercentage(used, total)
    let tagValue=''
    switch (tagType) {
    case TagTypes.nopercent:
      tagValue = `${total}`
      break
    case TagTypes.nounits:
      tagValue = `${used.toFixed(2)}/${total} | ${percentage}%`
      break
    case TagTypes.units:
      tagValue = `${used} / ${total}${domainData.units} | ${percentage}%`
      break
    }

    return (
      <LineGraph
        header={title}
        tagValue={tagValue}
        chartData={chartData}
        domainData={domainData}
        item={item}
      />
    )
  }
}

LineCard.propTypes = {
  item: PropTypes.object,
}

export default LineCard


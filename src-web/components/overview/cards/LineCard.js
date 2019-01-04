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
import { TagTypes } from '../constants.js'
import moment from 'moment'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GridCard from '../GridCard'
import { MAX_CHART_DATA_SIZE } from '../../../../lib/shared/constants'
import { inflateKubeValue, deflateKubeValue, getPercentage } from '../../../../lib/client/charts-helper'
import _ from 'lodash'

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
      chartData: []
    }
  }

  componentWillMount() {
    this.updateChartData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateChartData(nextProps)
  }

  updateChartData(props) {
    const { item } = props
    const { cardData: {overviewKey, valueKey, deflateValues, pieData}, overview } = item

    // line chart as line chart
    let chartPoint, dataKeys, units=''
    const areaData = {}
    if (!pieData) {
      let available
      // get available/used
      const data = {
        'available': 0,
        'used': 0,
      }
      const values = _.get(overview, overviewKey, []).reduce((acc, {capacity, usage}) => {
        data['available'] += inflateKubeValue(capacity[valueKey])
        data['used'] += inflateKubeValue(usage[valueKey])
        return acc
      }, data)

      let {used} = values
      available = values.available
      units = values.units
      if (deflateValues) {
        const deflated = deflateKubeValue(values.available)
        available = deflated.size
        units = deflated.units
        used = deflateKubeValue(values.used).size
      }
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
      dataKeys = ['available', 'used']
    } else {
    // pie chart as line chart

      // count up statuses
      const valueMap = {}
      _.get(overview, overviewKey, []).forEach(res=>{
        const value = _.get(res, valueKey, '').toLowerCase()
        let key  = 'default'
        for (var pieKey in pieData) {
          if (pieData[pieKey].values && pieData[pieKey].values.indexOf(value)!==-1) {
            key = pieKey
            break
          }
        }
        let arr = valueMap[key]
        if (!arr) {
          arr = valueMap[key] = []
        }
        arr.push(res)
      })
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
      dataKeys = Object.keys(pieData)
    }

    const chartData = this.createFixedArray(chartPoint)
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


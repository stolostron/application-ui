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
import _ from 'lodash'

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

const LineGraphLegend = ({latest, units='', domainData }) => {
  const {areaData, dataKeys} = domainData
  // get lastest point
  const values = dataKeys.map(key=>{
    return {
      name: areaData[key] ? areaData[key].name : key,
      value: Math.floor(latest[key]),
      className:areaData[key] ? areaData[key].className : key
    }
  }).sort(({value:a}, {value:b})=>{
    return a-b
  })
    .slice(-2)
  values.forEach((item)=>{
    const percent = getPercentage(item.value, Math.floor(latest.total))
    item.value = `${item.value} ${units} | ${percent}%`
  })
  return (
    <div className='line-graph-legend'>
      {values.map(({name, value, className}) => {
        return (
          <div key={name} className={'legend-item bottom_border '+className}>
            <span className='label'>{name}</span>
            <span className='supplemental'>{value}</span>
          </div>
        )
      })}
    </div>
  )
}

LineGraphLegend.contextTypes = {
  locale: PropTypes.string
}
LineGraphLegend.propTypes = {
  domainData: PropTypes.object,
  latest: PropTypes.object,
  units: PropTypes.string
}

const LineGraphContainer = ({ chartData, domainData, tooltip }) => {
  const {tickFormatter, domain, areaData, ticks, dataKeys} = domainData
  return (
    <div className='line-graph'>
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
          {dataKeys.map(key => {
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
  latest,
  units,
  chartData=[],
  domainData={},
  item,
}) =>
  <GridCard header={header} tagValue={tagValue} item={item}>
    <div className='line-graph-container'>
      <LineGraphLegend units={units} latest={latest} domainData={domainData} />
      <LineGraphContainer chartData={chartData} domainData={domainData} tooltip={tooltip} />
    </div>
  </GridCard>

LineGraph.propTypes = {
  chartData: PropTypes.array,
  domainData: PropTypes.object,
  header: PropTypes.string,
  item: PropTypes.object,
  latest: PropTypes.object,
  tagValue: PropTypes.string,
  tooltip: PropTypes.string,
  units: PropTypes.string
}

class LineCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      popTheTop: false,
      chartData: [],
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
    return ( oldTime!==newTime ||
        !_.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
        !_.isEqual(this.props.conditionFilters, nextProps.conditionFilters))
  }

  updateChartData(props) {
    const { item, activeFilters, conditionFilters } = props
    const { cardData: {dataType, pieData}, overview } = item

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
    const {chartData, popTheTop} = this.createFixedArray(chartPoint, activeFilters, conditionFilters)
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
      activeFilters,
      conditionFilters,
    })
  }

  createFixedArray(chartPoint, activeFilters, conditionFilters) {
    const { chartData, activeFilters:af, conditionFilters:cf } = this.state
    let { popTheTop } = this.state
    let newChartData
    // if filters change, start from scratch
    if (_.isEqual(activeFilters, af) && _.isEqual(conditionFilters, cf)) {
      newChartData = [ ...chartData, chartPoint ]
      // if two of the same points added before to create a line, remove one point now
      if (popTheTop) {
        newChartData.pop()
        popTheTop = false
      }
    } else {
      // add twice to get a line graph instead of a point
      newChartData = [ chartPoint, chartPoint ]
      popTheTop = true
    }
    if (newChartData.length > MAX_CHART_DATA_SIZE) newChartData.shift()
    return {chartData:newChartData, popTheTop}
  }

  render() {
    const { chartData, domainData } = this.state
    const { item } = this.props
    const { cardData: {title, tagType=TagTypes.nopercent} } = item
    const lastest = chartData.slice(-1).pop()
    const { total } = lastest
    let tagValue=''
    switch (tagType) {
    case TagTypes.nopercent:
    case TagTypes.nounits:
      tagValue = `${total}`
      break
    case TagTypes.units:
      tagValue = `${total} ${domainData.units}`
      break
    }
    return (
      <LineGraph
        header={title}
        tagValue={tagValue}
        chartData={chartData}
        domainData={domainData}
        latest={lastest}
        units={domainData.units}
        item={item}
      />
    )
  }
}

LineCard.propTypes = {
  activeFilters: PropTypes.object,
  conditionFilters: PropTypes.object,
  item: PropTypes.object,
}

export default LineCard


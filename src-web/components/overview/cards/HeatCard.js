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
import { ConditionTypes } from '../filterHelper'
import { Select, SelectItem } from 'carbon-components-react'
import { HeatSelections, GroupByChoices, SizeChoices, ShadeChoices } from '../constants.js'
import { deflateKubeValue } from '../../../../lib/client/charts-helper'
import { getHeatMapData } from '../dataHelper'
import GridCard from '../GridCard'
import HeatCollapsed from './HeatCollapsed'
import HeatExpanded from './HeatExpanded'
import classNames from 'classnames'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'


resources(() => {
  require('../../../../scss/overview-heatmap.scss')
})

class HeatCard extends React.Component {

  static propTypes = {
    conditionFilterSets: PropTypes.object,
    conditionFilters: PropTypes.object,
    heatMapState: PropTypes.object,
    item: PropTypes.object,
    unfilteredOverview: PropTypes.object,
    updateHeatMapState: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      heatMapState: props.heatMapState,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleClick() {
    this.toggleMapSize()
  }

  handleKeyPress(e) {
    if ( e.key === 'Enter') {
      this.toggleMapSize()
    }
  }

  setHeatMapRef = ref => {
    this.heatMapRef = ref
    if (this.heatMapRef) {
      this.setState({
        mapRect: this.heatMapRef.getBoundingClientRect()
      })
    }
  }

  render() {
    const { item, unfilteredOverview, conditionFilters, conditionFilterSets } = this.props
    const { mapRect, heatMapState } = this.state
    const { heatMapChoices } = heatMapState
    const { overview:filteredOverview} = item
    const complianceFiltering = conditionFilters.has('noncompliant')
    const highFiltering = conditionFilters.size>(complianceFiltering?1:0)
    const expanded = heatMapState.expanded
    const heatMapData = getHeatMapData(filteredOverview, unfilteredOverview, heatMapChoices,
      highFiltering, conditionFilters, conditionFilterSets, !expanded)
    const mapClasses = classNames({
      'heat-card': true,
      'expanded': expanded,
      'collapsed': !expanded
    })
    return (
      <GridCard item={item}>
        <div className={mapClasses}>
          <div className='heat-card-container'>
            {this.renderHeader(expanded, heatMapChoices, heatMapData, highFiltering, conditionFilters, conditionFilterSets)}
            {expanded && this.renderHeatMapSelections(highFiltering) }
            <div className='heat-card-map' ref={this.setHeatMapRef}>
              {mapRect && (!expanded ?
                <HeatCollapsed heatMapData={heatMapData} mapRect={mapRect} /> :
                <HeatExpanded item={item} heatMapData={heatMapData}
                  heatMapChoices={heatMapChoices} mapRect={mapRect} />) }
            </div>
          </div>
        </div>
      </GridCard>
    )
  }

  renderHeader = (expanded, {shade, size}, heatMapData, highFiltering, conditionFilters, conditionFilterSets) => {
    const {locale} = this.context
    const toggleMsg = msgs.get(expanded?'overview.collapse':'overview.expand', locale)

    const {usageMsg, legend} = !highFiltering ? this.getRegularLegend(shade, heatMapData) :
      this.getConditionLegend(heatMapData, conditionFilters, conditionFilterSets)

    let usedByMsg
    switch (size) {
    case SizeChoices.pods:
      usedByMsg = msgs.get('overview.used.pods', locale)
      break

    case SizeChoices.nodes:
      usedByMsg = msgs.get('overview.used.nodes', locale)
      break
    }
    return (
      <div className='heat-card-header'>
        <div>{usedByMsg}</div>
        <div>{usageMsg}</div>
        {legend.map(({title, className})=>{
          return (
            <div key={title} className='legend-container' >
              <div className={className} />
              <div>{title}</div>
            </div>
          )
        })}
        <div className='heat-card-toggle' tabIndex='0' role={'button'}
          onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
          {toggleMsg}
        </div>
      </div>
    )
  }

  getRegularLegend = (shade, {below, average, above}) => {
    const {locale} = this.context
    const legend = [
      {title: msgs.get('overview.legend.above', [this.getShadeRangeMsg(above)], locale), className:'legend above'},
      {title: msgs.get('overview.legend.average', [this.getShadeRangeMsg(average)], locale), className:'legend average'},
      {title: msgs.get('overview.legend.below', [this.getShadeRangeMsg(below)] , locale), className:'legend below'},
    ]
    let usageMsg
    let units=deflateKubeValue(above.max).units
    if (!units) units=deflateKubeValue(average.max).units
    if (!units) units=deflateKubeValue(below.max).units
    switch (shade) {
    case ShadeChoices.vcpu:
      usageMsg = msgs.get('overview.usage.vcpu', locale)
      break
    case ShadeChoices.memory:
      usageMsg = msgs.get('overview.usage.memory', [units], locale)
      break
    case ShadeChoices.storage:
      usageMsg = msgs.get('overview.usage.storage', [units], locale)
      break
    }
    return {usageMsg, legend}
  }

  getConditionLegend = ({filteredMapData, cpu, memory, storage}, conditionFilters) => {
    const {locale} = this.context
    const legend = []
    let usageMsg
    if (Object.keys(filteredMapData).length>0) {
      usageMsg = msgs.get('overview.usage.high', locale)
      conditionFilters.forEach(condition=>{
        switch (condition) {
        case ConditionTypes.noncompliant:
          break

        case ConditionTypes.highVcpu:
          legend.push({title: msgs.get('overview.legend.cpu', [this.getShadeRangeMsg(cpu, true)], locale), className:'legend above'})
          break

        case ConditionTypes.highStorage:
          legend.push({title: msgs.get('overview.legend.storage', [this.getShadeRangeMsg(storage, true)], locale), className:'legend above'})
          break

        case ConditionTypes.highMemory:
          legend.push({title: msgs.get('overview.legend.memory', [this.getShadeRangeMsg(memory, true)], locale), className:'legend above'})
          break
        }
      })
    } else {
      usageMsg = msgs.get('overview.usage.no.match', locale)
    }
    return {usageMsg, legend}
  }

  getShadeRangeMsg = (shades, withUnits) => {
    const {locale} = this.context
    // convert shade ranges into messages
    if (shades!==-1) {
      const {min, max} = shades
      const top = deflateKubeValue(max)
      const bot = deflateKubeValue(min)
      const units = withUnits && top.units ? ` ${top.units}` : ''
      if (min!==max) {
        return `${top.size} - ${bot.size}${units}`
      }
      return `${top.size}${units}`
    }
    return msgs.get('overview.legend.none', locale)
  }

  renderHeatMapSelections = (highFiltering) => {
    const { heatMapState: {heatMapChoices} } = this.state
    return (
      <div className='heatMapSelections'>
        {this.getHeatMapSelections().map(({key, label, choice, choices=[], onChange})=> {
          // if filtering by condition, no need for shade control
          if (highFiltering && key==='shade') {
            return null
          }

          return (
            <div key={key} className='heatMapSelectionContainer'>
              <div className='heatMapSelectionLabel'>
                {label}
              </div>
              <Select id={key} className='heatMapSelection'
                value={heatMapChoices[key] || choice}
                hideLabel={true}
                onChange={onChange}>
                {choices.map(({text, value})=> {
                  return (
                    <SelectItem key={value} text={text} value={value} />
                  )
                })}
              </Select>
            </div>
          )})}
      </div>
    )
  }

  getHeatMapSelections = () => {
    const { locale } = this.context
    const { heatMapState: {heatMapChoices} } = this.state
    if (!this.heatMapSelections) {
      this.heatMapSelections = [
        {
          key: HeatSelections.groupBy,
          label: msgs.get('overview.heatmap.group.by', locale),
          choice: heatMapChoices[HeatSelections.groupBy] || GroupByChoices.provider,
          onChange: this.onChange.bind(this, HeatSelections.groupBy),
          choices: Object.keys(GroupByChoices).map(value=>{
            let text
            switch (value) {
            case GroupByChoices.provider:
              text = msgs.get('overview.heatmap.provider', locale)
              break
            case GroupByChoices.region:
              text = msgs.get('overview.heatmap.region', locale)
              break
            case GroupByChoices.purpose:
              text = msgs.get('overview.heatmap.purpose', locale)
              break
            case GroupByChoices.service:
              text = msgs.get('overview.heatmap.service', locale)
              break
            }
            return {text, value}
          })
        },
        {
          key: HeatSelections.size,
          label:  msgs.get('overview.heatmap.size', locale),
          choice: heatMapChoices[HeatSelections.size] || SizeChoices.nodes,
          onChange: this.onChange.bind(this, HeatSelections.size),
          choices: Object.keys(SizeChoices).map(value=>{
            let text
            switch (value) {
            case SizeChoices.nodes:
              text = msgs.get('overview.heatmap.workers', locale)
              break
            case SizeChoices.pods:
              text = msgs.get('overview.heatmap.pods', locale)
              break
            case SizeChoices.nonCompliant:
              text = msgs.get('overview.heatmap.nonCompliant', locale)
              break
            }
            return {text, value}
          })
        },
        {
          key: HeatSelections.shade,
          label:  msgs.get('overview.heatmap.shade', locale),
          choice: heatMapChoices[HeatSelections.shade] || ShadeChoices.vcpu,
          onChange: this.onChange.bind(this, HeatSelections.shade),
          choices: Object.keys(ShadeChoices).map(value=>{
            let text
            switch (value) {
            case ShadeChoices.vcpu:
              text = msgs.get('overview.heatmap.vcpu', locale)
              break
            case ShadeChoices.memory:
              text = msgs.get('overview.heatmap.memory', locale)
              break
            case ShadeChoices.storage:
              text = msgs.get('overview.heatmap.storage', locale)
              break
            }
            return {text, value}
          })
        },
      ]
    }
    return this.heatMapSelections
  }

  toggleMapSize() {
    this.setState(prevState=>{
      const heatMapState = _.cloneDeep(prevState.heatMapState)
      heatMapState.expanded = !heatMapState.expanded
      this.props.updateHeatMapState(heatMapState)
      return {heatMapState}
    })
  }

  onChange = (key, e) => {
    const {value} = this.heatMapSelections.find(s=>{return s.key===key}).choices[e.currentTarget.selectedIndex]
    this.setState(prevState=>{
      const heatMapState = _.cloneDeep(prevState.heatMapState)
      heatMapState.heatMapChoices[key] = value
      this.props.updateHeatMapState(heatMapState)
      return {heatMapState}
    })
  }
}

export default HeatCard

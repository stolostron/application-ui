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
import { Select, SelectItem } from 'carbon-components-react'
import { HeatSelections, GroupByChoices, SizeChoices, ShadeChoices } from '../constants.js'
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
    heatMapState: PropTypes.object,
    item: PropTypes.object,
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
    const { item } = this.props
    const { mapRect, heatMapState } = this.state
    const { expanded, heatMapChoices } = heatMapState
    const heatMapData = getHeatMapData(item, heatMapChoices, !expanded)
    const mapClasses = classNames({
      'heat-card': true,
      'expanded': expanded,
      'collapsed': !expanded
    })
    return (
      <GridCard item={item}>
        <div className={mapClasses}>
          <div className='heat-card-container'>
            {this.renderHeader(expanded, heatMapChoices, heatMapData)}
            {expanded && this.renderHeatMapSelections(item) }
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

  renderHeader = (expanded, {shade, size}, {average}) => {
    const {locale} = this.context
    const toggleMsg = msgs.get(expanded?'overview.collapse':'overview.expand', locale)
    const legend = [
      {title: msgs.get('overview.legend.below', locale), className:'legend below'},
      {title: msgs.get('overview.legend.average', [average], locale), className:'legend average'},
      {title: msgs.get('overview.legend.above', locale), className:'legend above'},
    ]
    let usageMsg
    switch (shade) {
    case ShadeChoices.vcpu:
      usageMsg = msgs.get('overview.usage.vcpu', locale)
      break
    case ShadeChoices.memory:
      usageMsg = msgs.get('overview.usage.memory', locale)
      break
    case ShadeChoices.storage:
      usageMsg = msgs.get('overview.usage.storage', locale)
      break
    }
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
        <div>{usageMsg}</div>
        {legend.map(({title, className})=>{
          return (
            <div key={title} className='legend-container' >
              <div className={className} />
              <div>{title}</div>
            </div>
          )
        })}
        <div>{usedByMsg}</div>
        <div className='heat-card-toggle' tabIndex='0' role={'button'}
          onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
          {toggleMsg}
        </div>
      </div>
    )
  }

  renderHeatMapSelections = () => {
    const { heatMapState: {heatMapChoices} } = this.state
    return (
      <div className='heatMapSelections'>
        {this.getHeatMapSelections().map(({key, label, choice, choices=[], onChange})=> {
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

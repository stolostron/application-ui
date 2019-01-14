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
import Masonry from 'react-masonry-component'
import { Select, SelectItem } from 'carbon-components-react'
import { HeatSelections, GroupByChoices, SizeChoices, ShadeChoices } from '../constants.js'
import { inflateKubeValue } from '../../../../lib/client/charts-helper'
import GridCard from '../GridCard'
import classNames from 'classnames'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'


resources(() => {
  require('../../../../scss/overview-heatmap.scss')
})

const COLLAPSED_COLUMNS = 80
const COLLAPSED_ROWS = 7
const COLLAPSED_SQUARES = COLLAPSED_COLUMNS * COLLAPSED_ROWS
const COLLAPSED_HEIGHT = 90 // must match in css
const COLLAPSED_PADDING = 4

const masonryOptions = {
  fitWidth: true,
  resizeContainer: false,
  columnWidth: '.grid-sizer',
  gutter: 0,
}

class HeatCard extends React.Component {

  static propTypes = {
    heatMapChoices: PropTypes.object,
    item: PropTypes.object,
    updateHeatMapChoices: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      heatMapChoices: props.heatMapChoices,
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

  toggleMapSize() {
    this.setState(({expanded})=>{
      return {expanded: !expanded}
    })
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
    const { expanded } = this.state
    const mapClasses = classNames({
      'heat-card': true,
      'expanded': expanded,
      'collapsed': !expanded
    })
    const toggleMsg = msgs.get(expanded?'overview.heatmap.collapse':'overview.heatmap.expand', this.context.locale)
    return (
      <GridCard item={item}>
        <div className={mapClasses}>
          <div className='heat-card-container'>
            {expanded && this.renderHeatMapSelections(item) }
            <div className='heat-card-map'  ref={this.setHeatMapRef}>
              {!expanded ? this.renderCollapsedMap(item) : this.renderExpandedMap(item) }
              <div className='heat-card-toggle' tabIndex='0' role={'button'}
                onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
                {toggleMsg}
              </div>
            </div>
          </div>
        </div>
      </GridCard>
    )
  }


  renderHeatMapSelections = () => {
    const { heatMapChoices } = this.state
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
    const { heatMapChoices } = this.state
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
          choice: heatMapChoices[HeatSelections.size] || SizeChoices.workers,
          onChange: this.onChange.bind(this, HeatSelections.size),
          choices: Object.keys(SizeChoices).map(value=>{
            let text
            switch (value) {
            case SizeChoices.workers:
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

  onChange = (key, e) => {
    const {value} = this.heatMapSelections.find(s=>{return s.key===key}).choices[e.currentTarget.selectedIndex]
    this.setState(prevState=>{
      const heatMapChoices = _.cloneDeep(prevState.heatMapChoices)
      heatMapChoices[key] = value
      this.props.updateHeatMapChoices(heatMapChoices)
      return {heatMapChoices}
    })
  }

  renderCollapsedMap = (item) => {
    // since we're using svg, we need to wait for map rect size before we can draw
    // -- so on first pass since size isn't known yet we just return null
    const { mapRect } = this.state
    if (!mapRect) {
      return null
    }
    const { width } = mapRect

    // get map data
    const {tsize, heatMap} = this.getHeatMap(item)

    // determine a scaling factor based on # of squares we have data for
    let scaling = 1
    if (tsize>COLLAPSED_SQUARES) {
      scaling = COLLAPSED_SQUARES/tsize
    } else {
      switch (Object.keys(heatMap).length) {
      case 1:
      case 2:
        scaling = (COLLAPSED_SQUARES/2)/tsize
        break

      default:
        scaling = (COLLAPSED_SQUARES)/tsize
        break
      }
    }

    // create an array
    const heatArray=[]
    Object.keys(heatMap).forEach(key=>{
      heatMap[key].forEach(cluster=>{
        const {size, color} = cluster
        const multiplier = Math.round(scaling*size)
        for (var i = 0; i < multiplier; i++) {
          heatArray.push(color)
        }
      })
    })

    // sort by color
    const sortOrder =['square-red', 'square-yellow', 'square-blue']
    heatArray.sort((a,b)=>{
      return sortOrder.indexOf(a) < sortOrder.indexOf(b)
    })

    // assign to squares
    let x=0
    let y=0
    let colIdx = 0
    const w = width / COLLAPSED_COLUMNS
    const h = COLLAPSED_HEIGHT / COLLAPSED_ROWS
    const collapsedData = Array.from({length: COLLAPSED_SQUARES}, (u, idx) => {
      const cn = idx<heatArray.length ? heatArray[idx] : 'square-white'
      const data = {x, y, k:x+y, cn}
      x=x+w
      colIdx++
      if (colIdx>=COLLAPSED_COLUMNS) {
        x = 0
        y = y + h
        colIdx = 0
      }
      return data
    })

    return (
      <svg className='heatMap'>
        {collapsedData.map(({x, y, cn, k})=> {
          return (
            <g key={k}>
              <rect className='grid' x={x} y={y} width={w} height={h} />
              <rect className={cn}
                x={x+COLLAPSED_PADDING}
                y={y+COLLAPSED_PADDING}
                width={w-(COLLAPSED_PADDING*2)}
                height={h-(COLLAPSED_PADDING*2)} />
            </g>
          )})}
      </svg>
    )
  }


  renderExpandedMap = (item) => {
    // get map data
    const { heatMapChoices } = this.state
    const {heatMap} = this.getHeatMap(item)
    const keys = Object.keys(heatMap)
    const nkeys = keys.length

    // determine height of all cells
    const mapHeight = Math.min(400, Math.max(200, nkeys*90))
    const cellHeight = 100

    // find 2-3 biggest sizes for each key
    keys.map((key)=> {
      // biggest at top
      heatMap[key].sort(({size:a}, {size:b})=>{
        return b-a
      })
    })
    const biggestMap = {}
    keys.map((key)=> {
      let n = heatMap[key].length
      if (n>=3) {
        n = 3
      } else if (n>1) {
        n = 2
      }
      biggestMap[key] = heatMap[key].slice(0, n).reduce((acc, {size})=>{
        return acc+size
      }, 0)
    })

    return (
      <div className='heatMap' style={{height: mapHeight+'px'}} >
        {keys.map((key)=> {
          return (
            <div className='heatMapSection' key={key} style={{height: cellHeight+'%'}} >
              <div className='heatMapLabel'>
                {key}
              </div>
              <div className='heatMapContent'>
                <Masonry
                  disableImagesLoaded
                  className={'masonry-class'}
                  options={masonryOptions}>
                  <div className='grid-sizer' />
                  {heatMap[key].map(({color, name, size, dshade})=>{
                    const dim = Math.round(size/biggestMap[key]*100) - 9
                    return (
                      <div key={key} className={'heat-item ' + color} style={{width: dim+'%', height: dim+'%'}}>
                        <div className='tooltip'>
                          <div className='tooltip-line'>
                            <div className='label'>cluster</div>
                            <div className='value'>{name}</div>
                          </div>
                          <div className='tooltip-line'>
                            <div className='label'>{heatMapChoices[HeatSelections.size]}</div>
                            <div className='value'>{size}</div>
                          </div>
                          <div className='tooltip-line'>
                            <div className='label'>{heatMapChoices[HeatSelections.shade]}</div>
                            <div className='value'>{dshade}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                  }
                </Masonry>
              </div>
            </div>
          )})}
      </div>
    )
  }

  // get data based on choices and nodes
  getHeatMap = (item) => {
    const { heatMapChoices } = this.state
    const { overview: {clusters = []} } = item
    const nclusters=clusters.length

    // how are we grouping data
    let groupKey
    switch (heatMapChoices[HeatSelections.groupBy]) {
    case GroupByChoices.provider:
      groupKey = 'cloud'
      break
    case GroupByChoices.region:
      groupKey = 'region'
      break
    case GroupByChoices.purpose:
      groupKey = 'environment'
      break
    case GroupByChoices.service:
      groupKey = 'vendor'
      break
    }

    // collect data
    let tshades = 0
    let tsize = 0
    const heatMap = {}
    clusters.forEach((cluster, idx)=>{
      const {metadata={}} = cluster
      const {name=`unknown${idx}`, labels={}} = metadata
      const key = labels[groupKey]
      let heatData = heatMap[key]
      if (!heatData) {
        heatData = heatMap[key] = []
      }

      let size
      switch (heatMapChoices[HeatSelections.size]) {
      case SizeChoices.workers:
        size = _.get(cluster, 'capacity.nodes', 0)
        break
      case SizeChoices.pods:
        size = _.get(cluster, 'usage.pods', 0)
        break
      case SizeChoices.nonCompliant:
        size = 2
        break
      }
      tsize+=size

      let dshade
      switch (heatMapChoices[HeatSelections.shade]) {
      case ShadeChoices.vcpu:
        dshade = _.get(cluster, 'usage.cpu', 0)
        break
      case ShadeChoices.memory:
        dshade = _.get(cluster, 'usage.memory', 0)
        break
      case ShadeChoices.storage:
        dshade = _.get(cluster, 'usage.storage', 0)
        break
      }
      const shade = inflateKubeValue(dshade)
      tshades+=shade

      heatData.push({
        name,
        size,
        dshade,
        shade,
      })
    })

    // assign color classname based on where it falls in spectrum
    Object.keys(heatMap).forEach(key=>{
      heatMap[key].forEach(cluster=>{
        const {shade} = cluster
        switch (nclusters) {
        case 1:
          cluster.color='square-yellow'
          break

        case 2:
          if (shade>(tshades/2)) {
            cluster.color='square-red'
          } else {
            cluster.color='square-yellow'
          }
          break

        default:
          if (shade<(tshades/3)) {
            cluster.color='square-blue'
          } else if (shade<(tshades*2/3)){
            cluster.color='square-yellow'
          } else {
            cluster.color='square-red'
          }
          break
        }
      })
    })

    return {tsize, heatMap}
  }

}

export default HeatCard

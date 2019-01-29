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
import Masonry from 'react-masonry-component'
import { HeatSelections, SizeChoices, ShadeChoices } from '../constants.js'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

const BIGGEST_BRICK_SIZE = 65
const SMALLEST_BRICK_SIZE = 15
const MIN_BRICK_SIZE = 10

const masonryOptions = {
  layoutInstant: true,
  fitWidth: true,
  resizeContainer: true,
  horizontalOrder: true,
  columnWidth: MIN_BRICK_SIZE,
  gutter: 0,
}

export default class HeatExpanded extends React.Component {

  constructor (props) {
    super(props)
    this.masonryArray = []
    this.layoutMap = this.layoutMap.bind(this)
  }

  setMapRef = ref => {
    this.mapRef = ref
    if (ref) {
      this.layoutMap()
    }
  }

  componentDidMount() {
    this.layoutMap()
  }

  componentDidUpdate() {
    this.layoutMap()
  }

  setMasonryRef = ref => {
    if (ref) {
      ref.masonry.onresize= () =>{}
    }
  }

  layoutMap() {
    if (this.mapRef) {
      let maxHeight = 0
      const sections = Array.from(this.mapRef.childNodes)
      sections.forEach(section=>{
        // masonry was given a rough size to fit a group into
        // now we shrinkwrap the container around how masonry positioned the boxes
        const {width, height} = section.getElementsByClassName('masonry-class')[0].getBoundingClientRect()
        section.style.width = width+'px'
        section.style.height = height+40+'px'
        maxHeight = Math.max(maxHeight, height)
      })
      this.mapRef.style.height = maxHeight+50+'px'
    }
  }

  shouldComponentUpdate (nextProps) {
    return !_.isEqual(this.props.heatMapChoices, nextProps.heatMapChoices) ||
        !_.isEqual(this.props.heatMapData, nextProps.heatMapData)
  }

  render() {
    const { locale } = this.context
    const { mapRect, heatMapChoices, heatMapData } = this.props
    const {mapData} = _.cloneDeep(heatMapData)

    // get map data
    const keys = Object.keys(mapData).sort()

    // set rough estimate of map height
    // we'll shrink wrap it once masonry has laid out the clusters
    const { width:mapWidth } = mapRect
    const mapHeight = 400

    // find the biggest size
    // sort sizes for each key biggest first
    let allBiggest = 0
    const sizeMap={}
    let biggestBrick = 1
    let smallestBrick = Number.MAX_SAFE_INTEGER
    keys.map((key)=> {

      // what's the max size (pods/nodes) of any grouping
      mapData[key].forEach(({size})=>{
        biggestBrick = Math.max(biggestBrick, size)
        smallestBrick = Math.min(smallestBrick, size)
      })

      // what's total size (pods/nodes) for this grouping
      sizeMap[key] = mapData[key].reduce((acc, {size})=>{
        return acc+size
      }, 0)
      allBiggest += sizeMap[key]

      // sort biggest bricks to the top
      mapData[key].sort(({size:a}, {size:b})=>{
        return b-a
      })
    })

    // grouping divisor -- used to determine how much to proportion to each grouping of heatmap
    let groupingDivisor = allBiggest
    const smallestGroup = Object.values(sizeMap).sort().slice(-1)[0]
    // don't let smallest brick get smaller then 100 pixels
    if (smallestGroup && (smallestGroup/groupingDivisor*mapWidth) < 70) {
      groupingDivisor = smallestGroup/(70/mapWidth)
    }

    const clusterLabel = msgs.get('overview.heatmap.cluster', locale)
    let sizeLabel
    switch (heatMapChoices[HeatSelections.size]) {
    default:
    case SizeChoices.nodes:
      sizeLabel = msgs.get('overview.heatmap.workers', locale)
      break
    case SizeChoices.pods:
      sizeLabel = msgs.get('overview.heatmap.pods', locale)
      break
    }

    let shadeLabel
    switch (heatMapChoices[HeatSelections.shade]) {
    case ShadeChoices.vcpu:
      shadeLabel = msgs.get('overview.heatmap.vcpu', locale)
      break
    case ShadeChoices.memory:
      shadeLabel = msgs.get('overview.heatmap.memory', locale)
      break
    case ShadeChoices.storage:
      shadeLabel = msgs.get('overview.heatmap.storage', locale)
      break
    }

    const sectionShrink = 20
    return (
      <div className='heatMap' style={{height: mapHeight+'px'}} ref={this.setMapRef} >
        {keys.map((key)=> {
          let groupingWidth = (sizeMap[key]/groupingDivisor*mapWidth)
          groupingWidth = groupingWidth - sectionShrink
          return (
            <div className='heatMapSection' key={Math.random()} style={{width: groupingWidth+'px', height: mapHeight+'px'}} >
              <div className='heatMapLabel'>
                {key}
              </div>
              <div className='heatMapContent'>
                <Masonry
                  disableImagesLoaded
                  enableResizableChildren={false}
                  className={'masonry-class'}
                  ref={this.setMasonryRef}
                  options={masonryOptions} >
                  {mapData[key].map(({color, name, size, shadeForTooltip})=>{
                    //determine width of this brick
                    // bricks must be from SMALLEST_BRICK_SIZE to BIGGEST_BRICK_SIZE
                    // so that masonry will maintain spacing
                    let boxWidth = (Math.round((size * ((BIGGEST_BRICK_SIZE-SMALLEST_BRICK_SIZE) /
                        biggestBrick))/MIN_BRICK_SIZE) * MIN_BRICK_SIZE) + SMALLEST_BRICK_SIZE
                    // not to exceed the width of the grouping
                    // not to go below SMALLEST_BRICK_SIZE
                    boxWidth = Math.max(SMALLEST_BRICK_SIZE, Math.min(groupingWidth, boxWidth))
                    const boxHeight = boxWidth
                    return (
                      <div key={key+name} className={'heat-item ' + color}
                        style={{width: boxWidth+'px', height: boxHeight+'px'}}>
                        <div className='tooltip'>
                          <div className='tooltip-line'>
                            <div className='label'>{clusterLabel}</div>
                            <div className='value'>{name}</div>
                          </div>
                          <div className='tooltip-line'>
                            <div className='label'>{sizeLabel}</div>
                            <div className='value'>{size}</div>
                          </div>
                          <div className='tooltip-line'>
                            <div className='label'>{shadeLabel}</div>
                            <div className='value'>{shadeForTooltip}</div>
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
}


HeatExpanded.propTypes = {
  heatMapChoices: PropTypes.object,
  heatMapData: PropTypes.object,
  mapRect: PropTypes.object,
}

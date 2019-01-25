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


const masonryOptions = {
  layoutInstant: true,
  fitWidth: true,
  resizeContainer: true,
  horizontalOrder: true,
  columnWidth: '.grid-sizer',
  gutter: 0,
}

export default class HeatExpanded extends React.PureComponent {

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

  render() {
    const { locale } = this.context
    const { mapRect, heatMapChoices, heatMapData } = this.props
    const {mapData} = heatMapData

    // get map data
    const keys = Object.keys(mapData).sort()

    // set rough estimate of map height
    // we'll shrink wrap it once masonry has laid out the clusters
    const { width:mapWidth } = mapRect
    const mapHeight = 400

    // find the biggest size
    // sort sizes for each key biggest first
    let biggest = 1
    let allBiggest = 0
    const sizeMap={}
    const biggestMap = {}
    let sectionShrink = 20
    keys.map((key)=> {

      // what's the max size (pods/nodes) of this grouping
      mapData[key].forEach(({size})=>{
        biggest = Math.max(biggest, size)
      })

      // what's total size (pods/nodes) for this grouping
      sizeMap[key] = mapData[key].reduce((acc, {size})=>{
        return acc+size
      }, 0)

      // sort biggest to top
      mapData[key].sort(({size:a}, {size:b})=>{
        return b-a
      })

      // will try to put the biggest 2-3 blocks width-wise into each grouping
      // so find the biggest 2-3 boxes
      keys.map((key)=> {
        let n = mapData[key].length
        if (n>=3) {
          n = 2
        } else if (n>1) {
          n = 1
        } else {
          sectionShrink = 30
        }
        biggestMap[key] = mapData[key].slice(0, n).reduce((acc, {size})=>{
          return acc+size
        }, 0)
      })
      // also keep track of all groups
      allBiggest += biggestMap[key]
    })

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

    return (
      <div className='heatMap' style={{height: mapHeight+'px'}} ref={this.setMapRef} >
        {keys.map((key)=> {
          let sectionWidth = (biggestMap[key]/allBiggest*(mapWidth))
          const ratio = (sectionWidth - sectionShrink) / sectionWidth
          sectionWidth = sectionWidth - sectionShrink
          return (
            <div className='heatMapSection' key={key} style={{width: sectionWidth+'px', height: mapHeight+'px'}} >
              <div className='heatMapLabel'>
                {key}
              </div>
              <div className='heatMapContent'>
                <Masonry
                  disableImagesLoaded
                  className={'masonry-class'}
                  options={masonryOptions} >
                  <div className='grid-sizer' />
                  {mapData[key].map(({color, name, size, shadeForTooltip})=>{
                    const boxWidth = Math.min(sectionWidth, size/allBiggest*mapWidth*ratio)
                    const boxHeight = Math.min(boxWidth, 100)
                    return (
                      <div key={key+name} className='heat-item-container'
                        style={{width: boxWidth+'px', height: boxHeight+'px'}}>
                        <div key={key+name} className={'heat-item ' + color}>
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

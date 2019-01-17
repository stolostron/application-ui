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
import { HeatSelections } from '../constants.js'
import { getHeatMapData } from '../dataHelper'


const masonryOptions = {
  layoutInstant: true,
  fitWidth: true,
  resizeContainer: true,
  horizontalOrder: true,
  columnWidth: '.grid-sizer',
  gutter: 0,
}

export default class HeatExpanded extends React.PureComponent {

  componentWillMount() {
    this.masonryArray = []
  }

  setMapRef = ref => {this.mapRef = ref}
  setMasonryRef = ref => {
    if (ref) {
      this.masonryArray.push(ref)
    } else {
      this.masonryArray = []
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
      this.masonryArray.forEach(({masonryContainer})=>{
        // masonry was given a rough size to fit a group into
        // now we shrinkwrap the container around how masonry positioned the boxes
        const {width, height} = masonryContainer.getBoundingClientRect()
        const sectionContainer = masonryContainer.parentNode.parentNode
        sectionContainer.style.width = width+'px'
        sectionContainer.style.height = height+40+'px'
        maxHeight = Math.max(maxHeight, height)
      })
      this.mapRef.style.height = maxHeight+50+'px'
    }
  }

  render() {
    const { item, mapRect, heatMapChoices } = this.props
    const { width } = mapRect

    // get map data
    const {heatMapData} = getHeatMapData(item, heatMapChoices)
    const keys = Object.keys(heatMapData).sort()

    // determine height of all cells
    const mapHeight = 400//Math.min(400, Math.max(200, nkeys*90))

    // find the biggest size
    // sort sizes for each key biggest first
    let biggest = 1
    let allBiggest = 0
    const sizeMap={}
    const biggestMap = {}
    keys.map((key)=> {

      // what's the max size of this grouping
      heatMapData[key].forEach(({size})=>{
        biggest = Math.max(biggest, size)
      })

      // what's total size for this grouping
      sizeMap[key] = heatMapData[key].reduce((acc, {size})=>{
        return acc+size
      }, 0)

      // sort biggest to top
      heatMapData[key].sort(({size:a}, {size:b})=>{
        return b-a
      })
      keys.map((key)=> {
        let n = heatMapData[key].length
        if (n>=3) {
          n = 2
        } else if (n>1) {
          n = 1
        }
        biggestMap[key] = heatMapData[key].slice(0, n).reduce((acc, {size})=>{
          return acc+size
        }, 0)
      })
      allBiggest += biggestMap[key]
    })

    return (
      <div className='heatMap' style={{height: mapHeight+'px'}} ref={this.setMapRef} >
        {keys.map((key)=> {
          const sectionWidth = (biggestMap[key]/allBiggest*(width))-20
          return (
            <div className='heatMapSection' key={key} style={{width: sectionWidth+'px', height: mapHeight+'px'}} >
              <div className='heatMapLabel'>
                {key}
              </div>
              <div className='heatMapContent'>
                <Masonry
                  disableImagesLoaded
                  className={'masonry-class'}
                  options={masonryOptions}
                  ref={this.setMasonryRef} >
                  <div className='grid-sizer' />
                  {heatMapData[key].map(({color, name, size, shadeForTooltip})=>{
                    const w = size/allBiggest*width//Math.min(size/allBiggest*width, sectionWidth-20)
                    const h = Math.min(w, 100)
                    return (
                      <div key={key+name} className='heat-item-container'
                        style={{width: w+'px', height: h+'px'}}>
                        <div key={key+name} className={'heat-item ' + color}>
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
  item: PropTypes.object,
  mapRect: PropTypes.object,
}

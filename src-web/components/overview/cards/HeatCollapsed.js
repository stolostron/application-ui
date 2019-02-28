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

const COLLAPSED_COLUMNS = 80
const COLLAPSED_ROWS = 7
const COLLAPSED_SQUARES = COLLAPSED_COLUMNS * COLLAPSED_ROWS
const COLLAPSED_HEIGHT = 90 // must match in css
const COLLAPSED_PADDING = 4

export default class HeatCollapsed extends React.PureComponent {

  render() {
    const { mapRect, heatMapData } = this.props
    const { width } = mapRect
    const {sizeTotal, filteredMapData} = heatMapData

    // determine a scaling factor based on # of squares we have data for
    let scaling = 1
    if (sizeTotal>COLLAPSED_SQUARES) {
      scaling = COLLAPSED_SQUARES/sizeTotal
    } else {
      switch (Object.keys(filteredMapData).length) {
      case 1:
      case 2:
        scaling = (COLLAPSED_SQUARES/2)/sizeTotal
        break

      default:
        scaling = (COLLAPSED_SQUARES)/sizeTotal
        break
      }
    }

    // create an array
    const heatArray=[]
    Object.keys(filteredMapData).forEach(key=>{
      filteredMapData[key].forEach(cluster=>{
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
      return sortOrder.indexOf(a) - sortOrder.indexOf(b)
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
}

HeatCollapsed.propTypes = {
  heatMapData: PropTypes.object,
  mapRect: PropTypes.object,
}

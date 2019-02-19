/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

/*
* UI helpers to help with data transformations
* */

export const getWrappedNodeLabel = (label, width, rows=3) => {
  // if too long, add elipse and split the rest
  if (label.length>width*rows) {
    if (rows===2) {
      label = label.substr(0, width)+ '..\n' + label.substr(-width)
    } else {
      label = splitLabel(label.substr(0, width*2), width, rows-1) + '..\n' +  label.substr(-width)
    }
  } else {
    label = splitLabel(label, width, rows)
  }
  return label
}

const splitLabel = (label, width, rows) => {
  let line=''
  const lines = []
  const parts = label.split(/([^A-Za-z0-9])+/)
  let remaining = label.length
  do {
    // add label part
    line += parts.shift()

    // add splitter
    if (parts.length) {
      line += parts.shift()
    }

    // if next label part puts it over width split it
    if (parts.length) {
      if (line.length+parts[0].length > width) {
        remaining -= line.length
        if (remaining>width) {
          if (rows===2) {
            // if pentulitmate row do a hard break
            const split = parts[0]
            const idx = width - line.length
            line += split.substr(0,idx)
            parts[0] = split.substr(idx)
          }
        }
        lines.push(line)
        line = ''
        rows-=1
      }
    } else {
      // nothing left, push last line
      lines.push(line)
    }
  } while (parts.length)

  // pull last line in if too short
  if (lines.length>1) {
    let lastLine = lines.pop()
    if (lastLine.length<=2) {
      lastLine = lines.pop() + lastLine
    }
    lines.push(lastLine)
  }
  return lines.join('\n')
}

//as scale decreases from max to min, return a counter zoomed value from min to max
export const counterZoom = (scale, scaleMin, scaleMax, valueMin, valueMax) => {
  if (scale>=scaleMax) {
    return valueMin
  } else if (scale<=scaleMin) {
    return valueMax
  }
  return valueMin + (1-((scale-scaleMin)/(scaleMax-scaleMin))) * (valueMax-valueMin)
}

export const getTooltip = (tooltips) => {
  return tooltips.map(({name, value})=>{
    return ReactDOMServer.renderToStaticMarkup(<div>
      <span className='label'>{name}:  </span>
      <span className='value'>{value}</span>
    </div>)
  }).join('')
}

export const getHashCode = (str) => {
  let hash = 0, i, chr
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i)
    hash  = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return hash
}

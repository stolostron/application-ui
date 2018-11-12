/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

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

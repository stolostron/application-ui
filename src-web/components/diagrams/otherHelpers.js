/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

//as scale decreases from max to min, return a counter zoomed value from min to max
export const counterZoom = (scale, scaleMin, scaleMax, valueMin, valueMax) => {
  if (scale>=scaleMax) {
    return valueMin
  } else if (scale<=scaleMin) {
    return valueMax
  }
  return valueMin + (1-((scale-scaleMin)/(scaleMax-scaleMin))) * (valueMax-valueMin)
}

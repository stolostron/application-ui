/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export const NODE_RADIUS = 28
export const NODE_SIZE = 50
export const TOPOLOGY_PADDING = 30
export const MINIMUM_ZOOM_FIT = 0.4 // auto zoom to fit won't drop below this scale

export const FilterResults = Object.freeze({
  nosearch: '',     // no search in progress
  match: 'match',   // match
  hidden: 'hidden', // doesn't match
  related: 'related', //related to match
  matched: 'matched', // a previous match--used when out of search mode
})
export const RELATED_OPACITY=0.3 // opacity of elements related to matched elements

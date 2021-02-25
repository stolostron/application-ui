/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import { NODE_SIZE } from '../constants.js'

export const getConnectedAutoLayoutOptions = ({ elements }, options) => {
  const { firstLayout, directedSearchPath } = options

  // to stabilize graph, introduce new nodes at 1000, 1000
  // so that the layout algo doesn't move any existing nodes
  const nodes = elements.nodes()
  if (!firstLayout) {
    nodes.forEach(ele => {
      const { node: { layout } } = ele.data()
      const { x = 1000, y = 1000 } = layout
      ele.position({ x, y })
    })
  }

  // if there are less nodes in this group we have room to stretch out the nodes
  const numNodes = nodes.length
  let less20 = numNodes <= 20 ? 1.1 : 1
  const less15 = numNodes <= 15 ? 1.2 : less20
  const grpStretch = numNodes <= 10 ? 1.3 : less15
  const otrStretch = ({ isMajorHub, isMinorHub }) => {
    if (isMajorHub) {
      less20 = numNodes <= 20 ? 1.5 : 1.6
      return numNodes <= 15 ? 1.2 : less20
    } else if (isMinorHub) {
      less20 = numNodes <= 20 ? 1.4 : 1.5
      return numNodes <= 15 ? 1.1 : less20
    }
    return 1
  }

  const layoutOptions = {
    name: 'cola',
    animate: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      w: 1000,
      h: 1000
    },
    // running in headless mode, we need to provide node size here
    // give hubs more space
    nodeSpacing: node => {
      const { node: { layout } } = node.data()
      const { scale = 1 } = layout
      return NODE_SIZE * scale * grpStretch * otrStretch(layout)
    },
    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20 // works on overlap
  }

  // if searching with beg>end
  let useDirected = directedSearchPath && numNodes < 8
  if (!useDirected && numNodes < 8) {
    // only one leave and not a star
    useDirected =
      nodes.leaves().length === 1 && nodes.roots().length + 1 !== numNodes
  }

  // determine if this would best be shown as a directed or undirected graph
  //const useDirected = (directedSearchPath && numNodes<8) || // using search with >
  //               ((numNodes<=6 || isConsolidation) && !searchName)
  if (useDirected) {
    // do directed graph, left to right
    layoutOptions.flow = { axis: 'x', minSeparation: NODE_SIZE * 1.2 }
  } else {
    // no direction, but try to align major hubs along y axis
    layoutOptions.alignment = node => {
      const { node: { layout: { isMajorHub } } } = node.data()
      return isMajorHub ? { y: 0 } : null
    }
  }
  return layoutOptions
}

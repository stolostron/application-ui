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

export const getConnectedPolicyLayoutOptions = ({ elements }) => {
  // pre position elements to try to keep webcola from random layouts
  positionPolicyRows(
    0,
    elements
      .nodes()
      .roots()
      .toArray(),
    new Set()
  )

  // let cola position them, nicely
  return {
    name: 'cola',
    animate: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      w: 1000,
      h: 1000
    },

    // do directed graph, top to bottom
    flow: { axis: 'y', minSeparation: NODE_SIZE * 1.2 },

    // running in headless mode, we need to provide node size here
    nodeSpacing: () => {
      return NODE_SIZE * 1.3
    },

    // put charts along y to separate design from k8 objects
    alignment: node => {
      const { node: { specs = {} } } = node.data()
      if (specs.isDivider) {
        return { y: 0 }
      }
      return null
    },

    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20 // works on overlap
  }
}

const positionPolicyRows = (y, row, placedSet) => {
  const width = row.length * NODE_SIZE * 2
  if (width) {
    // place each node in this row
    let x = -(width / 2)
    row.forEach(n => {
      placedSet.add(n.id())
      n.position({ x, y })
      x += NODE_SIZE * 2
    })

    // find and sort next row down
    let nextRow = []
    row.forEach(n => {
      const outgoers = n
        .outgoers()
        .nodes()
        .filter(n1 => {
          return !placedSet.has(n1.id())
        })
        .sort((a, b) => {
          return a.data().node.name.localeCompare(b.data().node.name)
        })
        .toArray()
      nextRow = [...nextRow, ...outgoers]
    })

    // place next row down
    positionPolicyRows(y + NODE_SIZE * 1.1, nextRow, placedSet)
  }
}

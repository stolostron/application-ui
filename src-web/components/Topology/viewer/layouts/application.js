/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { NODE_SIZE } from '../constants.js'
import _ from 'lodash'

export const getConnectedApplicationLayoutOptions = (
  typeToShapeMap,
  { elements }
) => {
  // pre position elements to try to keep webcola from random layouts
  const nodes = elements.nodes()
  const roots = nodes.roots().toArray()
  const leaves = nodes.leaves()
  positionApplicationRows(roots, typeToShapeMap)
  if (nodes.length < 40 && roots.length === 1 && leaves.length > 2) {
    return {
      name: 'preset'
    }
  }

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

    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20 // works on overlap
  }
}

const positionApplicationRows = (row, typeToShapeMap) => {
  const placeLast = []
  const deployableList = []
  const positionMap = {}
  const placedSet = new Set()

  // place rows from top to bottom
  positionRowsDown(
    0,
    0,
    row,
    placedSet,
    positionMap,
    deployableList,
    typeToShapeMap,
    placeLast
  )

  // center deployable parents above them
  const parentMap = {}
  if (
    !deployableList.some(deployable => {
      const incomers = deployable.incomers().nodes()
      if (incomers.length === 1) {
        parentMap[incomers[0].id()] = incomers[0]
        return false
      }
      return true
    })
  ) {
    Object.values(parentMap).forEach(n => {
      // get center of deployables excluding rules
      const outgoers = n
        .outgoers()
        .nodes()
        .filter(o => {
          const { node: { type } } = o.data()
          if (type === 'rules') {
            return false
          }
          return true
        })
      const bb = outgoers.boundingBox()
      const x = bb.x1 + bb.w / 2

      // center cluster and subscription
      n.point({ x })
      const { node: { type } } = n.data()
      if (type === 'clusters') {
        const subscriptions = n.incomers().nodes()
        if (subscriptions.length === 1) {
          subscriptions[0].point({ x })
        }
      }
    })
  }

  // place these nodes based on other nodes
  placeLast.forEach(n => {
    const { node: { type } } = n.data()
    if (type === 'rules') {
      const subscriptions = n.incomers().nodes()
      let x, y
      subscriptions.forEach((subscription, idx) => {
        const pos = subscription.point()
        // place rules next to first subscription that uses it
        if (idx === 0) {
          void ({ x, y } = pos)
        } else if (pos.x < x) {
          x = pos.x
        }
      })
      x += NODE_SIZE * 3
      n.position({ x, y })
    }
  })
}

const getClusterName = nodeId => {
  const startPos = nodeId.indexOf('--clusters--') + 12
  const endPos = nodeId.indexOf('--', startPos)
  const clusterName = nodeId.slice(startPos, endPos)
  return clusterName
}

const positionRowsDown = (
  idx,
  y,
  row,
  placedSet,
  positionMap,
  deployableList,
  typeToShapeMap,
  placeLast,
  offsetRow = 0
) => {
  if (row.length) {
    // remember deployables to center its parent later
    row.forEach(n => {
      const { node } = n.data()
      const { type } = node
      if (type === 'deployable') {
        deployableList.push(n)
      }
    })

    // place each node in this row
    const width = row.length * NODE_SIZE * 3

    // normally center the row
    let x = -(width / 2) + offsetRow
    if (row.length === 1) {
      // however if just node under one parent, center under its parent
      const incommers = row[0].incomers().nodes()
      if (incommers.length === 1) {
        x = incommers[0].point().x
      }
    }

    let hadRule = false
    row.forEach(n => {
      placedSet.add(n.id())
      const pos = { x, y }
      const { node: { type, name, specs, id } } = n.data()
      let key = type
      let deploymentPos
      switch (type) {
      case 'subscription':
        key = `subscription/${name}`
        if (hadRule) {
          x += NODE_SIZE * 3
          pos.x = x
        }
        hadRule = specs.hasRules
        break
      case 'clusters':
        pos.y += NODE_SIZE / 2
        break
      case 'deployment':
        key = `deployment/${name}-${getClusterName(id)}`
        break
      case 'pod':
        deploymentPos =
            positionMap[`deployment/${name}-${getClusterName(id)}`]
        if (deploymentPos !== undefined) {
          pos.x = deploymentPos.x
        }
        key = `pod/${name}`
        break
      default:
        if (!typeToShapeMap[type]) {
          pos.y += 30
        }
        break
      }
      positionMap[key] = pos
      n.position(pos)
      x += NODE_SIZE * 3
    })

    // find and sort next row down
    let nextRow = []
    const kindOrder = ['chart', 'service', 'deployment', 'other']
    row.forEach(n => {
      const outgoers = n
        .outgoers()
        .nodes()
        .filter(n => {
          return !placedSet.has(n.id())
        })
        .sort((a, b) => {
          a = a.data().node
          b = b.data().node
          if (a.type === 'subscription' && b.type === 'subscription') {
            if (a.specs.isPlaced && !b.specs.isPlaced) {
              return -1
            } else if (!a.specs.isPlaced && b.specs.isPlaced) {
              return 1
            }
            return a.name.localeCompare(b.name)
          } else if (a.type === 'deployable' && b.type === 'deployable') {
            let kinda = kindOrder.indexOf(
              _.get(a, 'specs.raw.spec.template.kind', 'other').toLowerCase()
            )
            let kindb = kindOrder.indexOf(
              _.get(b, 'specs.raw.spec.template.kind', 'other').toLowerCase()
            )
            if (kinda < 0) kinda = 10
            if (kindb < 0) kindb = 10
            return kinda - kindb
          }
          return 0
        })
        .toArray()
      nextRow = [...nextRow, ...outgoers]
    })
    nextRow = _.uniqBy(nextRow, n => {
      return n.id()
    })

    // don't put clusters and deployables on same row
    let clusterList = []
    nextRow = nextRow.filter(n => {
      const { node } = n.data()
      const { type } = node
      if (type === 'rules') {
        placeLast.push(n)
        return false
      } else if (type === 'clusters') {
        clusterList.push(n)
        return false
      }
      return true
    })
    if (nextRow.length === 0) {
      nextRow = clusterList
      clusterList = []
    }
    const hybridRow = clusterList.length > 0 // deployables and clusters

    // place next row down
    y += NODE_SIZE * 2.4
    positionRowsDown(
      idx + 1,
      y,
      nextRow,
      placedSet,
      positionMap,
      deployableList,
      typeToShapeMap,
      placeLast,
      hybridRow ? width / 2 : 0
    )
    if (hybridRow) {
      y += NODE_SIZE * 2.4
      positionRowsDown(
        idx + 1,
        y,
        clusterList,
        placedSet,
        positionMap,
        deployableList,
        typeToShapeMap,
        placeLast
      )
    }
  }
}

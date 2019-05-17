/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'

// compensate for spotty weave data
export const getBufferedResponse = (state, action) => {
  const {activeFilters={}, storedElements={nodes:[]} } = state
  let { buffer={} } = state
  const { links } = action
  let { nodes=[] } = action

  if (buffer.href!==location.href) {
    buffer = {href: location.href}
  }

  // weave scans can miss all nodes between scans
  buffer.hadNodes = buffer.hadNodes || nodes.length>0
  if (buffer.hadNodes && nodes.length===0) {
    if (buffer.latency===undefined) {
      buffer.latency = 6
    }
    buffer.latency -= 1
    // give it 3 scans where all objects are missing before we refresh topology with nothing
    if (buffer.latency>0) {
      return { nodes: buffer.nodes, links: buffer.links, buffer }
    }
  }
  delete buffer.latency

  // weave scans can:
  //  1) include multiple copies of the same node
  //  2) miss some or ALL nodes between scans
  // previous nodes can come from state buffer or from sessionStore
  const prevNodes = buffer.nodes || storedElements.nodes
  const prevNodeMap = _.keyBy(prevNodes, 'uid')

  // if user changes type or cluster or namespace, no latency
  const nodeMap = {}
  const clusterMap = {}
  nodes.forEach((node) => {
    const {
      name, type, id, uid,
    } = node
    if (type === 'cluster') {
      clusterMap[id] = name
    }
    nodeMap[uid] = node
  })
  const clusters = activeFilters.cluster||[]
  const clusterSet = new Set()
  clusters.forEach(cluster=>{
    const cn = _.get(cluster, 'filterValues[0]')
    if (cn) {
      clusterSet.add(cn)
    }
  })
  const types = activeFilters.type||[]
  const typeSet = new Set()
  types.forEach(type=>{
    typeSet.add(type.label||type)
  })
  for (var uid in prevNodeMap) {
    const prevNode = prevNodeMap[uid]
    if (!nodeMap[uid] && !(prevNode.isDesign || prevNode.isWork)
        && (typeSet.size===0 || typeSet.has(prevNode.type))
        && (clusterSet.size===0 || clusterSet.has(clusterMap[prevNode.cluster]))) {
      // if node is missing in this scan, see if it reappears in the next 3 scans
      if (prevNode.latency===undefined) {
        prevNode.latency = 3
      }
      prevNode.latency -= 1
      // give it 3 scans where an object is missing before we remove it
      if (prevNode.latency>=0) {
        nodeMap[uid] = prevNode
      }
    } else {
      // if it's back, forget it was ever gone
      delete prevNode.latency
    }
  }
  nodes = Object.values(nodeMap)
  buffer.nodes = _.cloneDeep(nodes)
  buffer.links = _.cloneDeep(links)

  return { nodes, links, buffer }
}

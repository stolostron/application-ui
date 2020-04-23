/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import {getWrappedNodeLabel} from '../../utils/diagram-helpers'
import _ from 'lodash'

export const getNodeGroups = (mode, nodes=[], activeFilters, diagramOptions={}) => {
  switch (mode) {
  case 'cluster':
    return getClusterNodeGroups(nodes)

  default:
    return getTypeNodeGroups(nodes, activeFilters, diagramOptions)
  }
}

function getClusterNodeGroups(nodes) {
  // separate into environments
  const groupMap = {}
  const allNodeMap = {}
  nodes.forEach(node=>{
    allNodeMap[node.uid] = node
    const environ = _.get(node, 'specs.cluster.metadata.labels.environment', '')
    let group = groupMap[environ]
    if (!group) {
      group = groupMap[environ] = {nodes:[]}
    }
    const label = (node.shortName||node.name||'')
    node.layout = Object.assign(node.layout || {}, {
      uid: node.uid,
      type: node.type,
      label: getWrappedNodeLabel(label, 14, 3),
      compactLabel: getWrappedNodeLabel(label, 12, 2)
    })
    delete node.layout.nodeIcons
    group.nodes.push(node)
  })
  return {nodeGroups: groupMap, allNodeMap}
}

function getTypeNodeGroups(nodes, activeFilters, diagramOptions) {
  // separate into types
  const groupMap = {}
  const allNodeMap = {}
  const deploymentMap = {}
  nodes.forEach(node=>{
    allNodeMap[node.uid] = node
    const type = node.type
    let group = groupMap[type]
    if (!group) {
      group = groupMap[type] = {nodes:[]}
    }
    const label = (node.shortName||node.name||'')
    node.layout = Object.assign(node.layout || {}, {
      uid: node.uid,
      type: node.type,
      label: getWrappedNodeLabel(label, 14, 3),
      compactLabel: getWrappedNodeLabel(label, 12, 2)
    })

    delete node.layout.source
    delete node.layout.target
    delete node.layout.nodeIcons
    delete node.layout.selfLink
    if (node.selfLink) {
      node.layout.selfLink = {
        link: node.selfLink,
        nodeLayout: node.layout
      }
    }

    // embed pods in deployments?
    if (diagramOptions.embedPodsInDeployments && node.namespace && node.name) {
      if (type === 'deployment') {
        Object.assign(node.layout, {
          qname: node.namespace+'/'+node.name,
          hasPods: false,
          pods: [],
        })
        deploymentMap[node.layout.qname] = node
      } else if (type === 'pod') {
        // get pod name w/o uid suffix
        let name = node.name.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '')
        if (name===node.name) {
          const idx = name.lastIndexOf('-')
          if (idx!==-1) {
            name = name.substr(0, idx)
          }
        }
        node.layout.qname = node.namespace+'/'+name
      }
    }

    group.nodes.push(node)
  })

  // show pods in the deployment that created it
  if (diagramOptions.embedPodsInDeployments && groupMap['deployment']) {
    if (groupMap['pod']) {
      let i=groupMap['pod'].nodes.length
      while(--i>=0) {
        const node = groupMap['pod'].nodes[i]
        if (node.layout) {
          const controller = deploymentMap[node.layout.qname]
          if (controller) {
            controller.layout.pods.push(node)
            controller.layout.hasPods = true
            groupMap['pod'].nodes.splice(i,1)
            delete allNodeMap[node.uid]
            delete node.layout
          }
        }
      }
    } else {
      // unset any pods
      groupMap['deployment'].nodes.forEach(({layout})=>{
        delete layout.nodeIcons
      })
    }
  }

  return {nodeGroups: groupMap, allNodeMap}
}


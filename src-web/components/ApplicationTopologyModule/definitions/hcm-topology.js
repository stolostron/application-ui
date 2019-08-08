/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import moment from 'moment'
import {getWrappedNodeLabel} from '../utils.js'
import { RESOURCE_TYPES } from '../../../../lib/shared/constants'
import { NODE_SIZE, PodIcon, StatusIcon } from '../visualizers/constants.js'
import config from '../../../../lib/shared/config'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

export default {

  // diagramCloneTypes: types that can appear through diagram,
  // better to clone them for each group that wants it
  // then to create one big group
  diagramCloneTypes: ['internet', 'host'],

  // general order in which to organize diagram with 'internet' at upper left and container at lower right
  shapeTypeOrder: ['internet', 'host', 'service', 'deployment', 'daemonset', 'statefulset', 'cronjob', 'pod', 'container'],

  typeToShapeMap: {
    'service': {
      shape: 'service',
      className: 'service'
    },
    'deployment': {
      shape: 'deployment',
      className: 'deployment'
    },
    'pod': {
      shape: 'pod',
      className: 'pod'
    },
  },

  diagramOptions: {
    showHubs: true,
    consolidateSmallGroups: true,
  },

  // nodes, links, clusters
  getTopologyElements,

  // get group nodes by type
  // if a controller consolidated pods into its controller
  getNodeGroups,

  // get description for under node
  updateNodeIcons,
  getNodeDescription,

  //getNodeDetails: what desciption to put in details view when node is clicked
  getNodeDetails,

  // tooltip on hover
  getNodeTooltips,

  // get section titles
  getSectionTitles,

  // cytoscape layout options
  getConnectedLayoutOptions,
  getUnconnectedLayoutOptions,
}

export function getTopologyElements(resourceItem) {
  const { nodes = [], links = [] } = resourceItem

  // We need to change "to/from" to "source/target" to satisfy D3's API.
  let modifiedLinks = links.map((l)=>({
    source: l.from.uid,
    target: l.to.uid,
    label: l.type,
    type: l.type,
    uid: l.from.uid + l.to.uid,
  }))

  // filter out links to self, then add as a new svg circular arrow on node
  const nodeMap = _.keyBy(nodes, 'uid')
  modifiedLinks = modifiedLinks.filter(l => {
    if (l.source !== l.target) {
      return true
    } else {
      nodeMap[l.source].selfLink = l
    }
  })

  // get just the clusters
  const clusterMap = {}
  const clusters = nodes.reduce((prev, curr) => {
    if (curr.cluster !== null && !prev.find(c => c.id === curr.cluster)){
      const node = nodes.find(n => n.id === curr.cluster)
      if (node && node.name) {
        // if weave can't find a cluster it creates an 'unmanaged' cluster
        clusterMap[curr.cluster] =  node.type==='unmanaged' ? node.type : node.name
        prev.push({
          id: curr.cluster,
          index: prev.length,
          name: node.name
        })
      }
    }
    return prev
  }, [])

  // get just the nodes
  const nodesWithoutClusters = nodes.filter(n => {
    if (n.type !== 'cluster' && n.type !== 'unmanaged' && n.uid) {
      n.clusterName = clusterMap[n.cluster]
      return true
    }
    return false
  })

  return {
    clusters,
    links: modifiedLinks,
    nodes: nodesWithoutClusters
  }
}

export function getNodeGroups(nodes) {
  // separate into types
  const groupMap = {}
  const allNodeMap = {}
  const deploymentMap = {}
  nodes.forEach(node=>{
    allNodeMap[node.uid] = node
    let type = node.type
    if (this.shapeTypeOrder.indexOf(type)===-1) {
      if (this.shapeTypeOrder.indexOf('unknown')===-1) {
        this.shapeTypeOrder.push('unknown')
      }
      type = 'unknown'
    }
    let group = groupMap[type]
    if (!group) {
      group = groupMap[type] = {nodes:[]}
    }
    const label = (node.name||'')
    node.layout = Object.assign(node.layout || {}, {
      uid: node.uid,
      type: node.type,
      label: getWrappedNodeLabel(label,14,3),
      compactLabel: getWrappedNodeLabel(label.replace(/[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '..'),12,2)
    })
    delete node.layout.source
    delete node.layout.target
    delete node.layout.selfLink
    if (node.selfLink) {
      node.layout.selfLink = {
        link: node.selfLink,
        nodeLayout: node.layout
      }
    }

    if (node.namespace && node.name) {
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
  if (groupMap['deployment']) {
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

export function updateNodeIcons(nodes) {
  const addStatusIcon = (node, nodeIcons) => {
    const {podModel} = node
    if (podModel) {
      let statusIcon
      const tooltips={name:'Status', value: podModel.status}
      switch (podModel.status.toLowerCase()) {
      case 'running':
      case 'succeeded':
        statusIcon = StatusIcon.success
        break
      case 'pending':
        statusIcon = StatusIcon.pending
        break
      default:
        statusIcon = StatusIcon.error
        break
      }
      nodeIcons['status'] = Object.assign(statusIcon, {tooltips})
    }
  }
  nodes.forEach(node=>{
    const nodeIcons = {}
    const {layout={}} = node
    if (layout.hasPods) {
      const tooltips = layout.pods.map(pod=>{
        addStatusIcon(pod, nodeIcons)
        return {name:'Pod', value:pod.name}
      })
      nodeIcons['pod'] = Object.assign(PodIcon, {tooltips})
    } else {
      addStatusIcon(node, nodeIcons)
    }
    if (Object.keys(nodeIcons).length>0) {
      layout.nodeIcons = Object.assign(layout.nodeIcons||{}, nodeIcons)
    }
  })
}

export function getSectionTitles(isMulticluster, clusters, types, locale) {
  const set = new Set()
  types.forEach(type=>{
    switch (type) {
    case 'pod':
      set.add(msgs.get('topology.title.pods', locale))
      break

    case 'service':
      set.add(msgs.get('topology.title.services', locale))
      break

    case 'container':
      set.add(msgs.get('topology.title.containers', locale))
      break

    case 'host':
      set.add(msgs.get('topology.title.hosts', locale))
      break

    case 'internet':
      set.add(msgs.get('topology.title.internet', locale))
      break

    case 'deployment':
    case 'daemonset':
    case 'statefulset':
    case 'cronjob':
      set.add(msgs.get('topology.title.controllers', locale))
      break

    default:
      set.add(msgs.get('topology.title.other', locale))
      break
    }
  })
  return (isMulticluster ? (clusters.join(', ') +'\n') : '') +
      Array.from(set).sort().join(', ')
}

export function getNodeDescription(node, locale) {
  let description =''
  const {layout} = node
  if (layout) {
    const {hasPods, hasService, type} = layout
    switch (type) {
    case 'internet':
      description = node.namespace
      break

    default:
      if (hasPods) {
        description = msgs.get('topology.controller.pods', [node.type, layout.pods.length], locale)
      } else if (hasService) {
        description = msgs.get('topology.service.controller', [node.type], locale)
      }
      break
    }

    // hubs are drawn bigger
    if (layout.isMajorHub) {
      layout.scale = 1.6
    } else if (layout.isMinorHub) {
      layout.scale = 1.4
    }
  }
  return description
}

function getNodeTooltips(node, locale) {
  const tooltips = []
  const {name, namespace, layout:{type}, specs} = node
  const { hasPods, pods } = specs||{}
  const contextPath = config.contextPath.replace(new RegExp('/applications'), '')
  if (type==='pod') {
    addPodTooltips(node, tooltips, contextPath, locale)
  } else {
    let kind=undefined
    switch (type) {
    case 'deployment':
    case 'service':
    case 'daemonset':
    case 'statefulset':
    case 'cronjob':
    case 'replicaset':
      kind=type
      break
    case 'persistent_volume':
      kind='persistentvolume'
      break
    case 'persistent_volume_claim':
      kind='persistentvolumeclaim'
      break
    }
    const href = kind ? `${contextPath}/search?filters={"textsearch":"kind:${kind} name:${name}"}` : undefined
    tooltips.push({name:_.capitalize(_.startCase(type)), value:name, href})
    if (hasPods) {
      pods.forEach(pod=>{
        addPodTooltips(pod, tooltips, contextPath, locale)
      })
    }
  }
  if (namespace) {
    const href = `${contextPath}/search?filters={"textsearch":"kind:namespace name:${namespace}"}`
    tooltips.push({name:msgs.get('resource.namespace', locale), value:namespace, href})
  }
  return tooltips
}

function addPodTooltips(pod, tooltips, contextPath) {
  const {name} = pod
  const href = `${contextPath}/search?filters={"textsearch":"kind:pod name:${name}"}`
  tooltips.push({name:'Pod', value:name, href})
}

export function getNodeDetails(currentNode) {
  const details = []
  if (currentNode){
    addNodeDetails(currentNode, details)
    const { layout={} } = currentNode
    const { hasPods, pods } = layout

    // pods
    if (hasPods) {
      details.push({
        type: 'spacer',
      })
      details.push({
        type: 'label',
        labelKey: 'resource.pods.deployed'
      })

      // the pod stuff
      pods.forEach((pod)=>{
        addNodeDetails(pod, details, true)
      })
    }
  }
  return details
}

function addNodeDetails(node, details, podOnly) {
  const { clusterName, name, namespace, type, podModel, layout={}, labels=[] } = node
  const { type: ltype } = layout

  const addDetails = (dets) => {
    dets.forEach(({labelKey, value})=>{
      if (value!==undefined) {
        details.push({
          type: 'label',
          labelKey,
          value,
        })
      }
    })
  }
  const getAge = (value) => {
    if (value) {
      if (value.includes('T')) {
        return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
      } else {
        return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
      }
    }
    return '-'
  }

  // the main stuff
  if (!podOnly) {
    const mainDetails = [
      {labelKey: 'resource.type',
        value: ltype||type},
      {labelKey: 'resource.cluster',
        value: clusterName},
      {labelKey: 'resource.namespace',
        value: namespace},
    ]
    addDetails(mainDetails)
  } else {
    const podName = [
      {labelKey: 'resource.name',
        value: name},
    ]
    addDetails(podName)
  }

  // labels
  if (labels.length) {
    details.push({
      type: 'label',
      labelKey: 'resource.labels'
    })
    labels.forEach(({name:lname, value:lvalue})=>{
      const labelDetails = [
        {value: `${lname} = ${lvalue}`},
      ]
      addDetails(labelDetails)
    })
  }

  // pod stuff
  if (podModel) {
    const { status, restarts, hostIP, podIP, metadata: {creationTimestamp}} = podModel
    const podDetails = [
      {labelKey: 'resource.hostip',
        value: hostIP},
      {labelKey: 'resource.podip',
        value: podIP},
      {labelKey: 'resource.created',
        value: getAge(creationTimestamp)},
      {labelKey: 'resource.status',
        value: status},
      {labelKey: 'resource.restarts',
        value: restarts},
    ]
    addDetails(podDetails)
    details.push({
      type: 'logs',
      value: {resourceType: RESOURCE_TYPES.HCM_PODS,
        data: { namespace, name, clusterName }}
    })
  }
}

export function getConnectedLayoutOptions({elements, details: {isConsolidation}}, options) {
  const {numOfSections, firstLayout, searchName, directedSearchPath} = options
  const numNodes = elements.nodes().length
  const useDAG = (directedSearchPath && numNodes<8) || // using search with >
                 ((numNodes<=6 || isConsolidation) && !searchName)
  if (useDAG) {
    return getDagreLayoutOptions(elements, numOfSections)
  } else {
    return getColaLayoutOptions(elements, firstLayout)
  }
}

export function getColaLayoutOptions(elements, firstLayout) {
  // stabilize diagram
  const nodes = elements.nodes()
  if (!firstLayout) {
    nodes.forEach(ele=>{
      const {node: {layout}} = ele.data()
      const {x=1000, y=1000} = layout
      ele.position({x, y})
    })
  }
  // if there are less nodes in this group we have room to stretch out the nodes
  const len = nodes.length
  const grpStretch = len<=10 ? 1.3 : (len<=15 ? 1.2 : (len<=20? 1.1: 1))
  const otrStretch = ({isMajorHub, isMinorHub}) => {
    if (isMajorHub) {
      return (len<=15 ? 1.2 : (len<=20? 1.5: 1.6))
    } else if (isMinorHub) {
      return (len<=15 ? 1.1 : (len<=20? 1.4: 1.5))
    }
    return 1
  }
  return {
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
    nodeSpacing: (node)=>{
      const {node:{layout}} = node.data()
      const {scale=1} = layout
      return (NODE_SIZE*scale*grpStretch*otrStretch(layout))
    },
    // align major hubs along y axis
    alignment: (node)=>{
      const {node:{layout:{isMajorHub}}} = node.data()
      return isMajorHub ? { y: 0 } : null
    },
    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20, // works on overlap
  }
}

export function getDagreLayoutOptions() {
  return {
    name: 'dagre',
    rankDir: 'LR',
    rankSep: NODE_SIZE*3, // running in headless mode, we need to provide node size here
    nodeSep: NODE_SIZE*2, // running in headless mode, we need to provide node size here
  }
}

export function getUnconnectedLayoutOptions(collection, columns, index) {
  const count = collection.elements.length
  const cols = Math.min(count, columns[index])
  const h = Math.ceil(count/columns[index])*NODE_SIZE*2.7
  const w = cols*NODE_SIZE*3
  return {
    name: 'grid',
    avoidOverlap: false, // prevents node overlap, may overflow boundingBox if not enough space
    boundingBox: {
      x1: 0,
      y1: 0,
      w,
      h
    },
    sort: (a,b) => {
      const {node: {layout: la, selfLink:aself}} = a.data()
      const {node: {layout: lb, selfLink:bself}} = b.data()
      if (!la.newComer && lb.newComer) {
        return -1
      } else if (la.newComer && !lb.newComer) {
        return 1
      } else if (la.newComer && lb.newComer) {
        if (la.newComer.displayed && !lb.newComer.displayed) {
          return -1
        } else if (!la.newComer.displayed && lb.newComer.displayed) {
          return 1
        }
        return 0
      } else if (la.nodeIcons && !lb.nodeIcons) {
        return -1
      } else if (!la.nodeIcons && lb.nodeIcons) {
        return 1
      } else if (aself && !bself) {
        return -1
      } else if (!aself && bself) {
        return 1
      }
      const r = la.type.localeCompare(lb.type)
      if (r!==0) {
        return r
      }
      return la.label.localeCompare(lb.label)
    },
    cols
  }
}

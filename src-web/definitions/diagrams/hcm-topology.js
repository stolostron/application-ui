/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import {getWrappedNodeLabel} from '../../../lib/client/diagram-helper'
import { NODE_SIZE } from '../../components/diagrams/constants.js'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

//if controller contains a pod
const podIcon = {icon:'circle', classType:'pod', width: 24, height: 24}

export default {

  // diagramCloneTypes: types that can appear through diagram,
  // better to clone them for each group that wants it
  // then to create one big group
  diagramCloneTypes: ['internet', 'host'],

  // general order in which to organize diagram with 'internet' at upper left and container at lower right
  shapeTypeOrder: ['internet', 'host', 'service', 'deployment', 'daemonset', 'statefulset', 'cronjob', 'pod', 'container'],

  typeToShapeMap: {
    'internet': {
      shape: 'cloud',
      className: 'internet'
    },
    'host': {
      shape: 'host',
      className: 'host'
    },
    'service': {
      shape: 'hexagon',
      className: 'service'
    },
    'deployment': {
      shape: 'gear',
      className: 'deployment'
    },
    'daemonset': {
      shape: 'star4',
      className: 'daemonset'
    },
    'statefulset': {
      shape: 'cylinder',
      className: 'statefulset'
    },
    'pod': {
      shape: 'circle',
      className: 'pod'
    },
    'container': {
      shape: 'irregularHexagon',
      className: 'container'
    },
    'cronjob': {
      shape: 'clock',
      className: 'default'
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
      switch (type) {
      case 'deployment':
        Object.assign(node.layout, {
          qname: node.namespace+'/'+node.name,
          hasPods: false,
          pods: [],
        })
        deploymentMap[node.layout.qname] = node
        break
      case 'pod':
        node.layout.qname = node.namespace+'/'+node.name.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '')
        break
      }
    }

    group.nodes.push(node)
  })

  // show pods in the deployment that created it
  const addPodIcon = []
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
            addPodIcon.push(controller.layout)
            groupMap['pod'].nodes.splice(i,1)
            delete allNodeMap[node.uid]
            delete node.layout
          }
        }
      }
    }
  }
  addPodIcon.forEach(layout=>{
    const tooltips = Object.keys(_.keyBy(layout.pods, 'name')).map(key=>{
      return {name:'Pod', value:key}
    })
    layout.nodeIcons = [Object.assign(podIcon, {tooltips})]
  })
  return {nodeGroups: groupMap, allNodeMap}
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

    default:
      set.add(msgs.get('topology.title.controllers', locale))
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

export function getNodeTooltips(node, locale) {
  let tooltips = []
  const {name, clusterName, namespace, layout:{type, nodeIcons}} = node
  tooltips.push({name:msgs.get('resource.name', locale), value:name})
  tooltips.push({name:msgs.get('resource.type', locale), value:type})
  tooltips.push({name:msgs.get('resource.cluster', locale), value:clusterName})
  tooltips.push({name:msgs.get('resource.namespace', locale), value:namespace})
  if (nodeIcons) {
    nodeIcons.forEach(({tooltips:ntps})=>{
      tooltips = tooltips.concat(ntps)
    })
  }
  return tooltips
}

export function getNodeDetails(currentNode) {
  const details = []
  if (currentNode){
    const { clusterName, name, namespace, topology, type, layout, labels=[] } = currentNode
    const { hasPods, hasService, pods, type: ltype } = layout

    const addDetails = (dets) => {
      dets.forEach(({labelKey, value})=>{
        if (value) {
          details.push({
            type: 'label',
            labelKey,
            value,
          })
        }
      })
    }

    // the main stuff
    const mainDetails = [
      {labelKey: 'resource.type',
        value: ltype||type},
      {labelKey: 'resource.cluster',
        value: clusterName},
      {labelKey: 'resource.namespace',
        value: namespace},
      {labelKey: 'resource.topology',
        value: topology},
    ]
    addDetails(mainDetails)

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

    // controllers
    if (hasService) {
      details.push({
        type: 'label',
        labelKey: 'resource.controllers.used'
      })
      // the controller stuff
      const ctrlDetails = [
        {labelKey: 'resource.name',
          value: name},
        {labelKey: 'resource.type',
          value: type},
      ]
      addDetails(ctrlDetails)
    }

    // pods
    if (hasPods) {
      details.push({
        type: 'label',
        labelKey: 'resource.pods.deployed'
      })

      // the pod stuff
      pods.forEach(({name:pname})=>{
        const podDetails = [
          {value: pname},
        ]
        addDetails(podDetails)

      })
    }
  }
  return details
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

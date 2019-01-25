/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import moment from 'moment'
import {dumpAndParse} from '../../../lib/client/design-helper'
import { NODE_SIZE } from '../../components/diagrams/constants.js'
import * as Actions from '../../actions'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

export default {
  //general order in which to organize diagram with 'application' at upper left
  designTypes: ['application', 'placement', 'deployable', 'chart'],
  topologyTypes: ['service', 'deployment', 'pod'],

  typeToShapeMap: {
    'application': {
      shape: 'roundedSq',
      className: 'design',
      nodeRadius: 30
    },
    'deployable': {
      shape: 'deployable',
      className: 'design'
    },
    'placement': {
      shape: 'placement',
      className: 'design'
    },
    'chart': {
      shape: 'chart',
      className: 'container'
    }
  },

  diagramOptions: {
    showLineLabels: true, // show labels on lines
    filterByType: true, //dynamic type filtering
  },

  // merge table/diagram/topology definitions
  mergeDefinitions,

  // nodes, links and yaml
  getDiagramElements,

  // get description for under node
  getNodeTitle,
  getNodeDescription: getDesignNodeDescription,
  getNodeTooltips: getDesignNodeTooltips,
  getNodeDetails: getWorkNodeDetails,

  // get section titles
  getSectionTitles,

  // cytoscape layout options
  getConnectedLayoutOptions,
  getUnconnectedLayoutOptions,
}

// merge table/diagram/topology definitions
export function mergeDefinitions(tableDefs, topologyDefs) {
  // merge diagram with table definitions
  const defs = Object.assign(this, tableDefs)

  // add topology types to design types
  defs.typeToShapeMap = Object.assign(defs.typeToShapeMap, topologyDefs.typeToShapeMap)
  defs.shapeTypeOrder = [...defs.designTypes, ...defs.topologyTypes]
  defs.getTopologyElements = topologyDefs.getTopologyElements
  defs.getNodeGroups = topologyDefs.getNodeGroups

  this.getNodeDescription = (node, locale) => {
    if (node.isDesign) {
      return getDesignNodeDescription(node, locale)
    } else if (node.isWork) {
      return getWorkNodeDescription(node)
    }
    return topologyDefs.getNodeDescription(node)
  }

  //getNodeDetails: what desciption to put in details view when node is clicked
  this.getNodeDetails = (currentNode) => {
    if (currentNode.isWork) {
      return getWorkNodeDetails(currentNode)
    }
    return topologyDefs.getNodeDetails(currentNode)
  }

  //getNodeDetails: what desciption to put in details view when node is clicked
  this.getNodeTooltips = (node, locale) => {
    if (node.isDesign) {
      return getDesignNodeTooltips(node, locale)
    } else if (node.isWork) {
      return getWorkNodeTooltips(node)
    }
    return topologyDefs.getNodeTooltips(node)
  }

  return defs
}

export function getDiagramElements(item, topology) {

  const { placementPolicies = [] } = item
  // get design elements like application
  let elements = getDesignElements(item)
  let targetClusters = []
  placementPolicies.forEach(item => {
    const clusters = _.get(item, 'status.decisions', [])
    if (clusters.length > 0) {
      for (const cluster of clusters) targetClusters.push(cluster.clusterName)
    }
  })
  targetClusters = new Set(targetClusters)
  let {nodes, links} = elements
  const {yaml, designLoaded} = elements
  const {releaseMap} = elements

  // get filters we should use to query topology
  const requiredFilters = getTopologyFilters(item, this.topologyTypes)

  // changing the active filter will cause the topology to load
  // which won't happen in this first pass
  // so we don't add its nodes and links until it's loaded
  let clusters = []
  let topologyLoaded = false
  if (designLoaded && _.isEqual(requiredFilters, topology.activeFilters) && topology.status===Actions.REQUEST_STATUS.DONE) {
    topologyLoaded = true
    elements = this.getTopologyElements(topology)
    clusters = elements.clusters
    const {nodes:tnodes, links:tlinks} = elements
    nodes = [...nodes, ...tnodes]
    links = [...links, ...tlinks]

    // add links between design nodes and topology nodes
    nodes.forEach(({uid, labels})=>{
      if (uid && labels) {
        const label = labels.find(({name})=>{
          return name==='release'
        })
        if (label) {
          const chartId = releaseMap[label.value]
          if (chartId) {
            links.push({
              source: chartId,
              target: uid,
              label: '',
              uid: chartId+uid
            })
          }
        }
      }
    })
  } else {
    nodes=[]
    links=[]
  }

  // create a set based on link's target and source
  const linksSet = new Set(links.reduce((acc, cur) => [...acc, cur.source, cur.target], []))
  nodes = nodes.filter(node => {
    const clusterName = node.clusterName
    // filter out the node doesn't have any link to others or not in the placementpolicy selector
    return linksSet.has(node.uid) && (clusterName === undefined || targetClusters.has(clusterName))
  })
  return {
    clusters,
    links,
    nodes,
    yaml,
    designLoaded,
    requiredFilters,
    topologyLoaded
  }

}

export function getDesignElements(item) {
  const links=[]
  const nodes=[]
  const releaseMap={}
  let yaml = ''
  let designLoaded = false
  if (item) {
    const dnp = dumpAndParse(item, ['applicationRelationships', 'deployables', 'placementPolicies'])
    const {parsed} = dnp
    yaml = dnp.yaml

    // create application node
    const name = _.get(parsed, 'metadata.$v.name.$v')
    const appId = `application--${name}`
    nodes.push({
      name,
      namespace: _.get(parsed, 'metadata.$v.namespace.$v'),
      application: item,
      type: 'application',
      uid: appId,
      isDesign: true,
      $r: 0
    })

    // create deployment and policy nodes and links back to application
    const deployablesIdMap = {}
    const keys = ['deployables', 'placementPolicies']
    keys.forEach(key=>{
      const arr = parsed[key]
      if (Array.isArray(arr)) {

        // create nodes and links
        arr.forEach((member, idx)=>{
          const name = _.get(member, 'metadata.$v.name', member)
          const namespace = _.get(member, 'metadata.$v.namespace.$v')
          const memberId = `member--${key}--${name.$v}--${idx}`
          nodes.push({
            name: name.$v,
            namespace,
            member,
            type: key === 'deployables' ? 'deployable' : 'placement',
            uid: memberId,
            isDesign: true,
            $r: name.$r
          })
          links.push({
            source: appId,
            target: memberId,
            label: 'uses',
            isDesign: true,
            uid: appId+memberId
          })
          if (key==='deployables') {
            deployablesIdMap[name.$v] = memberId
          }
        })
      }
    })

    // create application relationship links between deployments
    const arr = parsed['applicationRelationships']
    if (Array.isArray(arr)) {
      arr.forEach((member)=>{
        var srcId = deployablesIdMap[_.get(member, 'spec.$v.source.$v.name.$v')]
        var tgtId = deployablesIdMap[_.get(member, 'spec.$v.destination.$v.name.$v')]
        if (srcId && tgtId) {
          links.push({
            source: srcId,
            target: tgtId,
            label: _.get(member, 'spec.$v.type.$v') || 'usesCreated',
            isDesign: true,
            uid: srcId+tgtId
          })
        }
      })
    }

    // create relationship between deployable and its chart
    const applicationWorksMap = {}
    item.applicationWorks.forEach(work=>{
      const {result: {namespace, chartURL}} = work
      const key = `${namespace}///${chartURL}`
      let arr = applicationWorksMap[key]
      if (!arr) {
        arr = applicationWorksMap[key] = []
      }
      arr.push(work)
    })
    const deployerMap = {}
    item.deployables.forEach(deployable=>{
      if(deployable.deployer){
        const {deployer: {namespace, chartURL}} = deployable
        deployerMap[ `${namespace}///${chartURL}`] = deployable
      }
    })
    Object.keys(applicationWorksMap).forEach((key,idx)=>{

      // create helm chart that was deployed
      applicationWorksMap[key].forEach(work=>{
        const {release, result: {chartName, chartVersion}} = work
        const memberId = `member--${release}--${idx}`
        if(chartName || chartVersion){
          nodes.push({
            name: `${chartName} ${chartVersion}`,
            work,
            type: 'chart',
            isWork: true,
            uid: memberId,
          })
        }

        // allow weave nodes to connect to its heml chart release
        releaseMap[release] = memberId

        // create link back to deployable that asked chart to be deployed
        const deployer = deployerMap[key]
        const deployableId = deployer ? deployablesIdMap[deployer.metadata.name] : {}
        links.push({
          source: deployableId,
          target: memberId,
          label: 'deploys',
          isWork: true,
          uid: deployableId+memberId
        })
      })
    })
    designLoaded = true
  }

  return {
    links,
    nodes,
    yaml,
    releaseMap,
    designLoaded
  }
}

export function getTopologyFilters(item, topologyTypes) {
  if (item) {
    let labels = []
    const {selector={}} = item
    for (var key in selector) {
      if (selector.hasOwnProperty(key)) {
        switch (key) {

        case 'matchLabels':
          for (var k in selector[key]) {
            if (selector[key].hasOwnProperty(k)) {
              const v = selector[key][k]
              labels.push({ label: `${k}: ${v}`, name: k, value: v})
            }
          }
          break

        case 'matchExpressions':
          selector[key].forEach(({key:k='', operator='', values=[]})=>{
            switch (operator.toLowerCase()) {
            case 'in':
              labels = values.map(v => {
                return { label: `${k}: ${v}`, name: k, value:v}
              })
              break

            case 'notin':
              //TODO
              break

            default:
              break
            }
          })
          break

        default:
          break
        }
      }
    }
    return {label: labels, type: topologyTypes}
  }
  return {}
}

export function getDesignNodeDescription(node, locale) {
  let description = ''
  switch (node.type) {
  case 'application':
    description = node.namespace
    break
  case 'deployable':
    description = _.get(node, 'deployable.chartName.$v')
    break
  case 'dependency':
    description = _.get(node, 'dependency.kind.$v')
    break
  case 'policy':
    description = msgs.get('application.policy', locale)
    break
  }
  return description
}

export function getNodeTitle(node, locale) {
  switch (node.type) {
  case 'application':
    return msgs.get('topology.title.application', locale)

  case 'chart':
    return _.get(node, 'work.cluster', '')
  }

  return ''
}

export function getWorkNodeDescription(node) {
  let description = _.get(node, 'work.result.description')
  if (description && description.length>16) {
    description = `${description.slice(0,8)}...${description.slice(-8)}`
  }
  return description
}

export function getWorkNodeDetails(currentNode) {
  const details = []
  if (currentNode){
    const { work: {cluster, release, result, status }} = currentNode
    const { chartName, chartVersion, chartURL, namespace, description, firstDeployed, lastDeployed } = result
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
    const getAge = (value) => {
      if (value.includes('T')) {
        return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
      } else if (value) {
        return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
      }
      return '-'
    }
    const mainDetails = [
      {labelKey: 'resource.type', value:'chart'},
      {labelKey: 'resource.cluster', value: cluster},
      {labelKey: 'resource.name', value: chartName},
      {labelKey: 'resource.version', value: chartVersion},
      {labelKey: 'resource.namespace', value: namespace},
      {labelKey: 'resource.description', value: description},
      {labelKey: 'resource.release', value: release},
      {labelKey: 'resource.status', value: status},
      {labelKey: 'resource.firstDeployed', value: getAge(firstDeployed)},
      {labelKey: 'resource.lastDeployed', value: getAge(lastDeployed)},
      {labelKey: 'resource.url', value: chartURL},
    ]
    addDetails(mainDetails)
  }
  return details
}

export function getDesignNodeTooltips(node, locale) {
  const tooltips = []
  const {name, type, namespace} = node
  tooltips.push({name:msgs.get('resource.name', locale), value:name})
  tooltips.push({name:msgs.get('resource.type', locale), value:type})
  tooltips.push({name:msgs.get('resource.namespace', locale), value:namespace})
  return tooltips
}

export function getWorkNodeTooltips(node, locale) {
  const tooltips = []
  const {name, type, work} = node
  const {cluster, status} = work
  const description = _.get(work, 'result.description', '')
  tooltips.push({name:msgs.get('resource.name', locale), value:name})
  tooltips.push({name:msgs.get('resource.type', locale), value:type})
  tooltips.push({name:msgs.get('resource.cluster', locale), value:cluster})
  tooltips.push({name:msgs.get('resource.description', locale), value:description})
  tooltips.push({name:msgs.get('resource.status', locale), value:status})
  return tooltips
}

export function getSectionTitles(isMulticluster, clusters, types) {
  const hasTitle = ['chart','deployment','pod','service']
  types = types.filter(type=>{
    return hasTitle.indexOf(type)===-1
  })
  return types.length===0 ? clusters.join(', ') : ''
}

export function getConnectedLayoutOptions({elements}) {

  const elementArr = []
  elements.nodes().toArray().forEach(element=>{
    elementArr.push({element, node:element.data().node})
  })

  // pre position design, work and k8
  const workNodes = elementArr
    .filter(({node:{isWork, isDesign}, element})=>{
      if (!isWork) {
        element.position({x, y:(isDesign?-50:100)})
        return false
      }
      return true
    })
  let x = 0
  workNodes.sort(({node:an},{node:bn})=>{
    const r = an.work.cluster.localeCompare(bn.work.cluster)
    return (r===0) ? an.name.localeCompare(bn.name) : r
  })
    .forEach(({element})=>{
      element.position({x, y:0})
      let y=100
      element.outgoers().forEach(successor=>{
        if (successor.isNode()) {
          successor.position({x, y})
          y = y+NODE_SIZE*10
        }
      })
      x = x+NODE_SIZE*40
    })

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
    flow: { axis: 'y', minSeparation: NODE_SIZE*1.2},

    // running in headless mode, we need to provide node size here
    nodeSpacing: ()=>{
      return NODE_SIZE*1.3
    },

    // put charts along y to separate design from k8 objects
    alignment: (node)=>{
      const {node:{isWork, type}} = node.data()
      if (isWork && type==='chart') {
        return { y: 0 }
      }
      return null
    },

    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20, // works on overlap
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
      const {node: {layout: la}} = a.data()
      const {node: {layout: lb}} = b.data()
      return la.label.localeCompare(lb.label)
    },
    cols
  }
}

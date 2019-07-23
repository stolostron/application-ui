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
import {getStringAndParsed} from '../../../../lib/client/design-helper'
import { NODE_SIZE, StatusIcon } from './constants.js'
import { getStoredObject, saveStoredObject } from '../../../../lib/client/resource-helper'
import * as Actions from '../../../actions'
import msgs from '../../../../nls/platform.properties'
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
    showSectionTitles: false // show titles over sections
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

  this.updateNodeIcons = (nodes) => {
    updateNodeIcons(nodes)
    topologyDefs.updateNodeIcons(nodes)
  }

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

export function getDiagramElements(item, topology, diagramFilters, podList, localStoreKey) {

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
  let {nodes=[], links=[]} = elements
  let {yaml, designLoaded} = elements
  const {parsed, chartMap, kubeSelectors} = elements
  const hasKubeDeploments = kubeSelectors.length>0
  const hasChartDeploments = Object.keys(chartMap).length>0

  // get filters we should use to query topology
  const requiredFilters = getTopologyFilters(item, this.topologyTypes, kubeSelectors)

  // changing the active filter will cause the topology to load
  // which won't happen in this first pass
  // so we don't add its nodes and links until it's loaded
  let clusters = []
  let topologyLoaded = false
  let statusesLoaded = false
  const {activeFilters, status, reloading} = topology
  let topologyReloading = reloading
  const requiredTopologyLoaded = _.isEqual(requiredFilters, activeFilters) &&
    (reloading || status===Actions.REQUEST_STATUS.DONE)
  if (designLoaded && requiredTopologyLoaded) {
    topologyLoaded = true
    elements = this.getTopologyElements(topology)
    clusters = elements.clusters
    const {nodes:tnodes, links:tlinks} = elements
    nodes = [...nodes, ...tnodes]
    links = [...links, ...tlinks]

    // get pod map
    statusesLoaded = podList.status===Actions.REQUEST_STATUS.DONE
    const podMap = _.keyBy(podList.items, (item)=>{
      const cluster = _.get(item, 'cluster.metadata.name', 'unknown')
      const name = _.get(item, 'metadata.name', 'unknown')
      return `${cluster}//${name}`
    })

    // add links between design nodes and topology nodes
    // don't add k8 node if it has no connection to design
    nodes = nodes.filter((node)=>{
      const {uid, labels, clusterName, name, type} = node
      if (uid && labels) {
        let shapeId=null

        // if deployable connected directly to k8, use selector to match the k8 object
        if (hasKubeDeploments) {
          const selector = kubeSelectors.find(({kubeCluster, kubeKind, kubeName})=>{
            // must be in same cluster
            if (clusterName!==kubeCluster) {
              return false
            }
            // must be service if kind is Service
            // pod and deployment if kind is Deployment
            if (kubeKind === 'Service' && type!=='service') {
              return false
            }
            // must be same name
            const k8Name = type==='pod' ? name.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '') : name
            if (k8Name!==kubeName) {
              return false
            }
            return true
          })
          if (selector) {
            shapeId = selector.deployableId
            node.isCRDDeployment = true
          }
        }

        // else if deployable used a chart, connect the chart to the k8 object
        if (!shapeId && hasChartDeploments) {
          const label = labels.find(({name})=>{
            return name==='release'
          })
          if (label) {
            shapeId = chartMap[`${clusterName}//${label.value}`] //chart id through "release" label
          }
        }
        if (shapeId) {
          links.push({
            source: shapeId,
            target: uid,
            label: '',
            uid: shapeId+uid
          })
          // kube data on this pod
          const podModel = podMap[`${clusterName}//${name}`]
          if (podModel) {
            node.podModel = podModel
          }
          return true
        }
        return false
      } else {
        return true
      }
    })
    // save in storage
    if (requiredTopologyLoaded && !topologyReloading) {
      saveStoredObject(localStoreKey, {
        clusters,
        links,
        nodes,
        yaml,
      })
    }
  } else if (!topologyReloading) {
    // if not loaded yet, see if there's a stored version
    // with the same diagram filters
    const storedElements = getStoredObject(localStoreKey)
    if (storedElements) {
      topology.storedElements=storedElements
      clusters = storedElements.clusters || clusters
      nodes = storedElements.nodes || nodes
      links = storedElements.links || links
      yaml = storedElements.yaml || yaml
      designLoaded = topologyLoaded = topologyReloading = true
    } else {
      // if topology not loaded yet and no stored version,
      // don't even show design, it looks messy w/o topology
      nodes = []
      links = []
    }
    if (topology.status===Actions.REQUEST_STATUS.ERROR) {
      topologyLoaded = true
    }
  }

  // filter nodes based on current diagram filters
  const typeMap = _.keyBy(diagramFilters, 'label')
  nodes = nodes.filter(({type})=>{
    return !!typeMap[type]
  })

  return {
    clusters,
    links,
    nodes,
    yaml,
    parsed,
    designLoaded,
    requiredFilters,
    topologyLoaded,
    statusesLoaded,
    topologyReloading,
  }
}

export function getDesignElements(item) {
  const links=[]
  const nodes=[]
  const chartMap={}
  const kubeSelectors=[]
  const deployablesMap = {}
  let yaml = ''
  let parsed = {}
  // wait for full application to load
  const designLoaded = !!(item && item.raw)
  if (designLoaded) {
    const dnp = getStringAndParsed(item, ['applicationRelationships', 'deployables', 'placementPolicies', 'placementBindings'])
    parsed = dnp.parsed
    yaml = dnp.yaml

    // create application node
    const name = _.get(parsed, 'metadata.$v.name')
    const appId = `application--${name.$v}`
    nodes.push({
      name: name.$v,
      namespace: _.get(parsed, 'metadata.$v.namespace.$v'),
      application: item,
      type: 'application',
      uid: appId,
      isDesign: true,
      $r: name.$r
    })

    // to simiplify diagram remove links between app and deployable if there's another link
    const removeAppLink = (deployableId) => {
      const idx = links.findIndex(({uid})=>{
        return uid === appId+deployableId
      })
      if (idx!==-1) {
        links.splice(idx,1)
      }
    }

    // create deployables and policy nodes and links back to application
    const policiesIdMap = {}
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
          const deployable = {
            name: name.$v,
            namespace,
            member,
            type: key === 'deployables' ? 'deployable' : 'placement',
            uid: memberId,
            isDesign: true,
            $r: name.$r
          }
          if (key === 'deployables') {
            deployablesMap[memberId] = deployable
          }
          nodes.push(deployable)
          links.push({
            source: appId,
            target: memberId,
            label: '',
            isDesign: true,
            uid: appId+memberId
          })
          if (key==='deployables') {
            deployablesIdMap[name.$v] = memberId
          } else {
            policiesIdMap[name.$v] = memberId
          }
        })
      }
    })

    // create application relationship links between deployables
    let arr = parsed['applicationRelationships']
    if (Array.isArray(arr)) {
      arr.forEach((member)=>{
        var srcId = deployablesIdMap[_.get(member, 'spec.$v.source.$v.name.$v')]
        var tgtId = deployablesIdMap[_.get(member, 'spec.$v.destination.$v.name.$v')]
        if (srcId && tgtId) {
          // add link between deployables
          links.push({
            source: srcId,
            target: tgtId,
            label: _.get(member, 'spec.$v.type.$v') || 'usesCreated',
            isDesign: true,
            uid: srcId+tgtId
          })
          // remove link between app and deployable
          removeAppLink(tgtId)
        }
      })
    }

    // create placement binding links between policies and deployables
    arr = parsed['placementBindings']
    if (Array.isArray(arr)) {
      arr.forEach((member)=>{
        var srcId = policiesIdMap[_.get(member, 'placementRef.$v.name.$v')]
        if (srcId) {
          var subjects = _.get(member, 'subjects.$v')
          if (Array.isArray(subjects)) {
            subjects.forEach((subject)=>{
              var tgtId = deployablesIdMap[_.get(subject, '$v.name.$v')]
              if (tgtId) {
                // add link between policy and deployable
                links.push({
                  source: srcId,
                  target: tgtId,
                  label: 'binds',
                  isDesign: true,
                  uid: srcId+tgtId
                })
                // remove link between app and deployable
                removeAppLink(tgtId)
              }
            })
          }
        }
      })
    }

    // create a relationship between deployable and works
    const deployerMap = {}
    item.deployables.forEach(deployable=>{
      if(deployable.deployer){
        const {deployer: {namespace, chartURL, kubeKind, kubeName}} = deployable
        // when a chart was used or when a k8 object was selected
        const key = chartURL ? `${namespace}///${chartURL}` : `${kubeKind}///${kubeName}`
        deployerMap[key] = deployable
      }
    })
    const applicationWorksMap = {}
    item.applicationWorks.forEach(work=>{
      const {result: {namespace, chartURL, kubeKind, kubeName}} = work
      // when a chart was used or when a k8 object was selected
      const key = chartURL ? `${namespace}///${chartURL}` : `${kubeKind}///${kubeName}`
      let arr = applicationWorksMap[key]
      if (!arr) {
        arr = applicationWorksMap[key] = []
      }
      arr.push(work)
    })

    // create set of deployables that are a target of another deployable
    // used when no charts in app and we divide diagram by deployable (se below)
    const nonDividerSet = new Set()
    const nodeMap = _.keyBy(nodes, 'uid')
    links.forEach(({source, target})=>{
      if (nodeMap[source].type==='deployable' && nodeMap[target].type==='deployable') {
        nonDividerSet.add(target)
      }
    })

    // connect each works between deployable and k8 object
    // insert a chart shape in between if that was used
    Object.keys(applicationWorksMap).forEach((key,idx)=>{

      applicationWorksMap[key].forEach(work=>{
        const {release, status, reason, cluster, result: {chartName, chartVersion, chartURL, kubeKind, kubeName, kubeCluster}} = work

        // if a chart was used:
        //  create its shape, connect it to deployable
        //  and add a relationship to be used to connect chart to k8 objects (in chartMap)
        if(chartName || chartVersion || chartURL) {

          let name, chartId, statusIcon
          if (chartName || chartVersion) {
            name= `${chartName} ${chartVersion}`
            chartId = `member--${release}--${idx}`
          } else {
            name= chartURL.split('\\').pop().split('/').pop()
            chartId = `member--failed--${idx}`
          }

          // create chart shape
          nodes.push({
            name,
            work,
            status,
            reason,
            statusIcon,
            type: 'chart',
            isWork: true,
            isDivider: true, // organize diagram so that charts form barrier between design and k8
            uid: chartId,
          })

          // create link between deployable to chart
          const deployer = deployerMap[key]
          const deployableId = deployer ? deployablesIdMap[deployer.metadata.name] : {}
          links.push({
            source: deployableId,
            target: chartId,
            label: 'deploys',
            isWork: true,
            uid: deployableId+chartId
          })

          // tell how to connect chart to k8 object (thru release label on k8 object)
          chartMap[`${cluster}//${release}`] = chartId

        } else {
          // if no chart, use work to directly connect deployable to k8 object thru kind/name/cluster
          const deployer = deployerMap[key]
          if (deployer) {
            const name = deployer.metadata.name
            const deployableId = deployablesIdMap[name]

            // pass a selector back that will find a topology element that thios deployer connects to
            kubeSelectors.push({
              deployableId, kubeKind, kubeName, kubeCluster
            })

            // organize diagram so that deployables form barrier between design and k8
            const deployable = deployablesMap[deployableId]
            deployable.isDivider = !nonDividerSet.has(deployableId)
          }
        }
      })
    })
  }

  return {
    links,
    nodes,
    yaml,
    parsed,
    chartMap,
    kubeSelectors,
    designLoaded
  }
}

export function getTopologyFilters(item, topologyTypes, kubeSelectors) {
  if (item) {
    let labels = []
    const filters = {type: topologyTypes}
    // if any k8 objects are used, we need to pull in everything from weave from selecter clusters
    // and then match up the types and names
    if (kubeSelectors.length>0) {
      filters.cluster = Object.keys(_.keyBy(kubeSelectors, 'kubeCluster'))
    } else {
      // else we can use the labels on the application to find k8 objects
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
      filters.label = labels
    }
    return filters
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

  case 'service':
  case 'deployment':
  case 'pod':
    // if we skip the chart for a custom resource def
    // add cluster name as node title
    if (node.isCRDDeployment) {
      return _.get(node, 'clusterName', '')
    }
  }

  return ''
}

export function updateNodeIcons(nodes) {
  nodes.forEach(node=>{
    if (node.status) {
      let statusIcon
      let tooltips=''
      switch (node.status.toLowerCase()) {
      case 'completed':
        statusIcon = StatusIcon.success
        break

      default:
        statusIcon = StatusIcon.error
        tooltips = [{name:'Reason', value: node.reason}]
        break
      }
      let nodeIcons = node.layout.nodeIcons
      if (!nodeIcons) {
        nodeIcons = node.layout.nodeIcons = {}
      }
      nodeIcons['status'] = Object.assign(statusIcon, {tooltips})
    }
  })
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
    const { work: {cluster, release, result, status, reason }} = currentNode
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
      if (value) {
        if (value.includes('T')) {
          return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
        } else {
          return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
        }
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
      {labelKey: 'resource.status', value: status},
    ]
    let extraDetails
    if (firstDeployed) {
      extraDetails = [
        {labelKey: 'resource.release', value: release},
        {labelKey: 'resource.firstDeployed', value: getAge(firstDeployed)},
        {labelKey: 'resource.lastDeployed', value: getAge(lastDeployed)},
        {labelKey: 'resource.url', value: chartURL},
      ]
    } else {
      extraDetails = [
        {labelKey: 'resource.reason', value: reason},
        {labelKey: 'resource.url', value: chartURL},
      ]
    }
    addDetails([...mainDetails, ...extraDetails])
  }
  return details
}

export function getDesignNodeTooltips(node, locale) {
  let tooltips = []
  const {name, type, namespace, layout:{nodeIcons}} = node
  tooltips.push({name:msgs.get('resource.name', locale), value:name})
  tooltips.push({name:msgs.get('resource.type', locale), value:type})
  tooltips.push({name:msgs.get('resource.namespace', locale), value:namespace})
  if (nodeIcons) {
    Object.keys(nodeIcons).forEach(key => {
      const {tooltips:ntps} = nodeIcons[key]
      if (ntps) tooltips = tooltips.concat(ntps)
    })
  }
  return tooltips
}

export function getWorkNodeTooltips(node, locale) {
  let tooltips = []
  const {name, type, work, layout:{nodeIcons}} = node
  const {cluster, status} = work
  const description = _.get(work, 'result.description', '')
  tooltips.push({name:msgs.get('resource.name', locale), value:name})
  tooltips.push({name:msgs.get('resource.type', locale), value:type})
  tooltips.push({name:msgs.get('resource.cluster', locale), value:cluster})
  tooltips.push({name:msgs.get('resource.description', locale), value:description})
  tooltips.push({name:msgs.get('resource.status', locale), value:status})
  if (nodeIcons) {
    Object.keys(nodeIcons).forEach(key => {
      const {tooltips:ntps} = nodeIcons[key]
      if (ntps) tooltips = tooltips.concat(ntps)
    })
  }
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

  // pre position elements to try to keep webcola from random layouts
  positionRow(0, elements.nodes().roots().toArray(), new Set())


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
      const {node:{isDivider}} = node.data()
      if (isDivider) {
        return { y: 0 }
      }
      return null
    },

    unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
    userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis))
    allConstIter: 20, // works on overlap
  }
}

const positionRow = (y, row, placedSet) => {
  const width = row.length * NODE_SIZE * 2
  if (width) {
    // place each node in this row
    let x = -(width/2)
    row.forEach(n=>{
      placedSet.add(n.id())
      n.position({x, y})
      x+=NODE_SIZE*2
    })

    // find and sort next row down
    let nextRow = []
    row.forEach(n=>{
      const outgoers = n.outgoers().nodes().filter(n=>{
        return !placedSet.has(n.id())
      }).sort((a,b)=>{
        return a.data().node.name.localeCompare(b.data().node.name)
      }).toArray()
      nextRow = [...nextRow, ...outgoers]
    })

    // place next row down
    positionRow(y+NODE_SIZE*1.1, nextRow, placedSet)
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

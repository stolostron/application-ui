/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import jsYaml from 'js-yaml'
import {
  getStoredObject,
  saveStoredObject
} from '../../../../lib/client/resource-helper'
import * as Actions from '../../../actions'
import _ from 'lodash'

export default {

  // merge table/diagram/topology definitions
  mergeDefinitions,

  // nodes, links and yaml
  getActiveChannel,
  getDiagramElements,
}

// merge table/diagram/topology definitions
function mergeDefinitions(topologyDefs) {
  // merge diagram with table definitions
  const defs = Object.assign(this, {})
  defs.getTopologyElements = topologyDefs.getTopologyElements
  return defs
}

// remove the system stuff
const system = [
  'creationTimestamp',
  'selfLink',
  'status',
  'uid',
  'annotations',
  'livenessProbe',
  'resourceVersion'
]
const removeMeta = obj => {
  for (const key in obj) {
    if (system.indexOf(key) !== -1) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      removeMeta(obj[key])
    }
  }
}
const sortKeys = (a, b) => {
  if (a === 'name' && b !== 'name') {
    return -1
  } else if (a !== 'name' && b === 'name') {
    return 1
  } else if (a === 'namespace' && b !== 'namespace') {
    return -1
  } else if (a !== 'namespace' && b === 'namespace') {
    return 1
  }
  return a.localeCompare(b)
}

function getActiveChannel(localStoreKey) {
  const storedActiveChannel = getStoredObject(localStoreKey)
  if (storedActiveChannel) {
    return storedActiveChannel.activeChannel
  }
}

function getDiagramElements(item, topology, localStoreKey) {
  const { status, loaded, reloading, willLoadDetails, detailsLoaded, detailsReloading } = topology
  const topologyReloading =  reloading
  const topologyLoadError = status === Actions.REQUEST_STATUS.ERROR
  if (loaded && !topologyLoadError) {
    // topology from api will have raw k8 objects, pods status
    const { links, nodes } = this.getTopologyElements(topology)

    // create yaml and what row links to what node
    let row = 0
    const yamls = []
    const clusters = []
    let activeChannel
    let channels = []
    const originalMap = {}
    const podMap = {}
    nodes.forEach(node => {
      const { type, name } = node
      switch (type) {
      case 'application':
        activeChannel = _.get(node, 'specs.activeChannel', '__ALL__/__ALL__//__ALL__/__ALL__')
        channels = _.get(node, 'specs.channels', [])
        break
      case 'pod':
        podMap[name] = node
        break
      }

      const raw = _.get(node, 'specs.raw')
      if (raw) {
        node.specs.row = row
        originalMap[raw.kind] = raw
        const dumpRaw =  _.cloneDeep(raw)
        removeMeta(dumpRaw)
        const yaml = jsYaml.safeDump(dumpRaw, { sortKeys })
        yamls.push(yaml)
        row += yaml.split('\n').length
      }
    })
    const yaml = yamls.join('---\n')

    // save results
    saveStoredObject(localStoreKey, {
      activeChannel,
      channels,
    })
    saveStoredObject(`${localStoreKey}-${activeChannel}`, {
      clusters,
      links,
      nodes,
      yaml
    })

    // details are requested separately for faster load
    // if loaded, we add those details now
    addDiagramDetails(topology, nodes, podMap, activeChannel, localStoreKey)

    return {
      clusters,
      activeChannel,
      channels,
      links,
      nodes,
      pods: topology.pods,
      yaml,
      originalMap,
      topologyLoaded: true,
      storedVersion: false,
      topologyLoadError,
      topologyReloading,
      willLoadDetails,
      detailsLoaded,
      detailsReloading,
    }
  }

  // if not loaded yet, see if there's a stored version
  // with the same diagram filters
  if (!topologyReloading) {
    let channels = []
    let activeChannel
    const storedActiveChannel = getStoredObject(localStoreKey)
    if (storedActiveChannel) {
      activeChannel = storedActiveChannel.activeChannel
      channels = storedActiveChannel.channels || []
    }
    //console.log('localkey '+localStoreKey+ ' fetch '+ JSON.stringify(_.get(topology, 'fetchFilters.application')))
    activeChannel = _.get(topology, 'fetchFilters.application.channel', activeChannel)
    if (activeChannel) {
      const storedElements = getStoredObject(`${localStoreKey}-${activeChannel}`)
      if (storedElements) {
        const {
          clusters = [],
          links = [],
          nodes = [],
          yaml = ''
        } = storedElements
        return {
          clusters,
          activeChannel,
          channels,
          links,
          nodes,
          yaml,
          topologyLoaded: true,
          storedVersion: true,
          topologyLoadError,
          topologyReloading
        }
      }
    }
  }

  // if no topology yet, create diagram with search item
  const links = []
  const nodes = []
  const clusters = []
  const channels = []
  const yaml = ''

  // create application node
  const { name: an, namespace: ans } = item
  const appId = `application--${an}`
  nodes.push({
    name: an,
    namespace: ans,
    type: 'application',
    uid: appId,
    specs: { isDesign: true }
  })
  return {
    clusters,
    channels,
    links,
    nodes,
    yaml,
    topologyLoaded: false,
    topologyLoadError,
    topologyReloading
  }
}

function addDiagramDetails(topology, nodes, podMap, activeChannel, localStoreKey) {
  const { status, detailsLoaded, detailsReloading } = topology
  // get extra details from topology or from localstore
  let pods = []
  if (detailsLoaded && status !== Actions.REQUEST_STATUS.ERROR) {
    pods = topology.pods
    // save in local store
    saveStoredObject(`${localStoreKey}-${activeChannel}-details`, {
      pods,
    })
  } else if (!detailsReloading) {
  // if not loaded yet, see if there's a stored version
  // with the same diagram filters
    const storedElements = getStoredObject(`${localStoreKey}-${activeChannel}-details`)
    if (storedElements) {
      ({pods=[]} = storedElements)
    }
  }

  // associate pods with status
  if (pods) {
    pods.forEach(pod=>{
      const {name:pname} = pod
      if (pname) {
        // get pod name w/o uid suffix
        let name = pname.replace(
          /-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/,
          ''
        )
        if (name === pname) {
          const idx = name.lastIndexOf('-')
          if (idx !== -1) {
            name = name.substr(0, idx)
          }
        }
        if (podMap[name]) {
          const podModel = _.get(podMap[name], 'specs.podModel', {})
          podModel[pod.name] = pod
          _.set(podMap[name], 'specs.podModel', podModel)
        }
      }
    })
  }
}


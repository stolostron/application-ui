/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'
import R from 'ramda'
import _ from 'lodash'
import { LOCAL_HUB_NAME } from '../../../../lib/shared/constants'
import msgs from '../../../../nls/platform.properties'

const checkmarkCode = 3
const warningCode = 2
const pendingCode = 1
const failureCode = 0
const checkmarkStatus = 'checkmark'
const warningStatus = 'warning'
const pendingStatus = 'pending'
const failureStatus = 'failure'
const pulseValueArr = ['red', 'orange', 'yellow', 'green']
const metadataName = 'metadata.name'

export const isDeployableResource = node => {
  //check if this node has been created using a deployable object
  //used to differentiate between app, subscription, rules deployed using an app deployable
  return _.get(node, 'id', '').indexOf('--member--deployable--') !== -1
}

export const nodeMustHavePods = node => {
  //returns true if the node should deploy pods

  if (
    !node ||
    !node.type ||
    R.contains(node.type, ['application', 'placements', 'subscription'])
  ) {
    return false
  }

  if (
    R.contains(R.pathOr('', ['type'])(node), [
      'pod',
      'replicaset',
      'daemonset',
      'statefulset',
      'replicationcontroller',
      'deployment',
      'deploymentconfig',
      'controllerrevision'
    ])
  ) {
    //pod deployables must have pods
    return true
  }
  const hasContainers =
    R.pathOr([], ['specs', 'raw', 'spec', 'template', 'spec', 'containers'])(
      node
    ).length > 0
  const hasReplicas = R.pathOr(undefined, ['specs', 'raw', 'spec', 'replicas'])(
    node
  ) //pods will go under replica object
  const hasDesired = R.pathOr(undefined, ['specs', 'raw', 'spec', 'desired'])(
    node
  ) //deployables from subscription package have this set only, not containers
  if ((hasContainers || hasDesired) && !hasReplicas) {
    return true
  }

  if (hasReplicas) {
    return true
  }

  return false
}

export const getClusterName = (nodeId, node, findAll) => {
  if (node && _.get(node, 'clusters.id', '') === 'member--clusters--') {
    //cluster info is not set on the node id, get it from here
    if (findAll) {
      //get all cluster names as set by argo target, ignore deployable status
      return _.union(
        _.get(node, 'specs.clustersNames', []),
        _.get(node, 'clusters.specs.appClusters', [])
      ).join(',')
    }
    return _.get(node, 'specs.clustersNames', []).join(',')
  }

  if (nodeId === undefined) {
    return ''
  }
  const clusterIndex = nodeId.indexOf('--clusters--')
  if (clusterIndex !== -1) {
    const startPos = nodeId.indexOf('--clusters--') + 12
    const endPos = nodeId.indexOf('--', startPos)
    return nodeId.slice(startPos, endPos > 0 ? endPos : nodeId.length)
  }
  //node must be deployed locally on hub, such as ansible jobs
  return LOCAL_HUB_NAME
}

/*
* If this is a route generated from an Ingress resource, remove generated hash
* relatedKind = Route object deployed on remote cluster
* relateKindName = relatedKind.name, processed by other routines prior to this call
*/
export const getRouteNameWithoutIngressHash = (relatedKind, relateKindName) => {
  let name = relateKindName
  const isRouteGeneratedByIngress =
    relatedKind.kind === 'route' &&
    !_.get(relatedKind, '_hostingDeployable', '').endsWith(name)
  if (isRouteGeneratedByIngress) {
    //this is a route generated from an Ingress resource, remove generated hash
    const names = _.get(relatedKind, '_hostingDeployable', '').split(
      'Ingress-'
    )
    if (names.length === 2) {
      name = names[1]
    }
  }

  return name
}

export const getActiveFilterCodes = resourceStatuses => {
  const activeFilterCodes = new Set()
  resourceStatuses.forEach(rStatus => {
    if (rStatus === 'green') {
      activeFilterCodes.add(checkmarkCode)
    } else if (rStatus === 'yellow') {
      activeFilterCodes.add(warningCode)
    } else if (rStatus === 'orange') {
      activeFilterCodes.add(pendingCode)
    } else if (rStatus === 'red') {
      activeFilterCodes.add(failureCode)
    }
  })

  return activeFilterCodes
}

export const filterSubscriptionObject = (resourceMap, activeFilterCodes) => {
  const filteredObject = {}
  Object.entries(resourceMap).forEach(([key, values]) => {
    values.forEach(value => {
      if (
        value.status === 'Subscribed' &&
        activeFilterCodes.has(checkmarkCode)
      ) {
        filteredObject[key] = value
      }
      if (value.status === 'Propagated' && activeFilterCodes.has(warningCode)) {
        filteredObject[key] = value
      }
      if (value.status === 'Fail' && activeFilterCodes.has(failureCode)) {
        filteredObject[key] = value
      }
    })
  })
  return filteredObject
}

export const getOnlineClusters = (clusterNames, clusterObjs) => {
  const onlineClusters = []
  clusterNames.forEach(clsName => {
    const cluster = clsName.trim()
    if (cluster === LOCAL_HUB_NAME) {
      onlineClusters.push(cluster)
    } else {
      const matchingCluster = _.find(
        clusterObjs,
        cls =>
          _.get(cls, 'name', '') === cluster ||
          _.get(cls, metadataName, '') === cluster
      )
      if (
        matchingCluster &&
        (_.includes(
          ['ok', 'pendingimport', 'OK'],
          _.get(matchingCluster, 'status', '')
        ) ||
          _.get(matchingCluster, 'ManagedClusterConditionAvailable', '') ===
            'True')
      ) {
        onlineClusters.push(cluster)
      }
    }
  })
  return onlineClusters
}

export const getClusterHost = consoleURL => {
  if (!consoleURL) {
    return ''
  }
  const consoleURLInstance = new URL(consoleURL)
  const ocpIdx = consoleURL ? consoleURLInstance.host.indexOf('.') : -1
  if (ocpIdx < 0) {
    return ''
  }
  return consoleURLInstance.host.substr(ocpIdx + 1)
}

export const getPulseStatusForSubscription = node => {
  let pulse = 'green'

  const resourceMap = _.get(node, `specs.${node.type}Model`)
  if (!resourceMap) {
    pulse = 'orange' //resource not available
    return pulse
  }
  let isPlaced = false
  _.flatten(Object.values(resourceMap)).forEach(subscriptionItem => {
    if (subscriptionItem.status) {
      if (R.contains('Failed', subscriptionItem.status)) {
        pulse = 'red'
      }
      if (subscriptionItem.status === 'Subscribed') {
        isPlaced = true // at least one cluster placed
      }
      if (
        subscriptionItem.status !== 'Subscribed' &&
        subscriptionItem.status !== 'Propagated' &&
        pulse !== 'red'
      ) {
        pulse = 'yellow' // anything but failed or subscribed
      }
    }
  })
  if (pulse === 'green' && !isPlaced) {
    pulse = 'yellow' // set to yellow if not placed
  }

  return pulse
}

export const getExistingResourceMapKey = (resourceMap, name, relatedKind) => {
  // bofore loop, find all items with the same type as relatedKind
  const isSameType = item => item.indexOf(`${relatedKind.kind}-`) === 0
  const keys = R.filter(isSameType, Object.keys(resourceMap))
  let i
  for (i = 0; i < keys.length; i++) {
    const keyObject = resourceMap[keys[i]]
    if (
      (keys[i].indexOf(name) > -1 &&
        keys[i].indexOf(relatedKind.cluster) > -1) || //node id doesn't contain cluster name, match cluster using the object type
      (_.includes(
        _.get(keyObject, 'specs.clustersNames', []),
        relatedKind.cluster
      ) &&
        name.indexOf(`${keyObject.type}-${keyObject.name}`) === 0)
    ) {
      return keys[i]
    }
  }

  return null
}

// The controllerrevision resource doesn't contain any desired pod count so
// we need to get it from the parent; either a daemonset or statefulset
export const syncControllerRevisionPodStatusMap = resourceMap => {
  Object.keys(resourceMap).forEach(resourceName => {
    if (resourceName.startsWith('controllerrevision-')) {
      const controllerRevision = resourceMap[resourceName]
      const parentName = _.get(
        controllerRevision,
        'specs.parent.parentName',
        ''
      )
      const parentType = _.get(
        controllerRevision,
        'specs.parent.parentType',
        ''
      )
      const parentId = _.get(controllerRevision, 'specs.parent.parentId', '')
      const clusterName = getClusterName(parentId)
      const parentResource =
        resourceMap[`${parentType}-${parentName}-${clusterName}`]
      const parentModel = {
        ..._.get(parentResource, `specs.${parentResource.type}Model`, '')
      }

      if (parentModel) {
        _.set(controllerRevision, 'specs.controllerrevisionModel', parentModel)
      }
    }
  })
}

//for items with pods and not getting ready or available state, default those values to the current state
//this is a workaround for defect 8935, search doesn't return ready and available state for resources such as StatefulSets
export const fixMissingStateOptions = items => {
  items.forEach(item => {
    if (_.get(item, 'available') === undefined) {
      item.available = item.current //default to current state
    }
    if (_.get(item, 'ready') === undefined) {
      item.ready = item.current //default to current state
    }
  })
  return items
}

//last attempt to match the resource namespace with the server target namespace ( argo )
export const namespaceMatchTargetServer = (
  relatedKind,
  resourceMapForObject
) => {
  const namespace = _.get(relatedKind, 'namespace', '')
  const findTargetClustersByNS = _.filter(
    _.get(resourceMapForObject, 'clusters.specs.clusters', []),
    filtertype => _.get(filtertype, 'destination.namespace', '') === namespace
  )
  //fix up the cluster on this object
  if (findTargetClustersByNS.length > 0) {
    relatedKind.cluster = _.get(findTargetClustersByNS[0], metadataName, '')
  }
  return findTargetClustersByNS.length > 0
}

export const setArgoApplicationDeployStatus = (node, details) => {
  // show error if app is not healthy
  const appHealth = _.get(node, 'specs.raw.status.health.status')
  const appStatusConditions = _.get(node, 'specs.raw.status.conditions')

  if (
    (appHealth === 'Unknown' ||
      appHealth === 'Degraded' ||
      appHealth === 'Missing') &&
    appStatusConditions
  ) {
    details.push({
      labelKey: 'resource.rule.clusters.error.label',
      value: msgs.get('resource.argo.application.error.msg'),
      status: failureStatus
    })
  }
  const relatedArgoApps = _.get(node, 'specs.relatedApps', [])

  // related Argo apps
  details.push({
    type: 'label',
    labelValue: msgs.get('resource.related.apps', [relatedArgoApps.length])
  })

  details.push({
    type: 'spacer'
  })

  const sortByNameCaseInsensitive = R.sortBy(
    R.compose(R.toLower, R.prop('name'))
  )
  sortByNameCaseInsensitive(relatedArgoApps).forEach(app => {
    const relatedAppName = app.name
    const relatedLinkId = `application--${relatedAppName}`
    const relatedAppHealth = _.get(app, 'status.health.status', 'Healthy')
    const statusStr = getStatusForArgoApp(relatedAppHealth)

    details.push({
      labelKey: 'resource.name',
      value: relatedAppName,
      status: statusStr
    })
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.argocd.editor'),
        id: `${relatedLinkId}-argo-editor`,
        data: {
          action: 'open_argo_editor',
          cluster: _.get(app, 'cluster'),
          namespace: _.get(app, 'namespace'),
          name: relatedAppName
        }
      },
      indent: true
    })

    details.push({
      labelKey: 'resource.argo.app.cluster',
      value: _.get(app, 'cluster'),
      indent: true
    })
    details.push({
      labelKey: 'resource.argo.app.target.cluster',
      value: _.get(app, 'destinationCluster'),
      indent: true
    })
    details.push({
      labelKey: 'resource.argo.app.target.cluster.ns',
      value: _.get(app, 'destinationNamespace'),
      indent: true
    })
    details.push({
      type: 'spacer'
    })
  })
}

export const getStatusForArgoApp = healthStatus => {
  if (healthStatus === 'Healthy') {
    return checkmarkStatus
  }
  if (healthStatus === 'Progressing') {
    return pendingStatus
  }
  if (healthStatus === 'Unknown') {
    return failureStatus
  }
  return warningStatus
}

export const translateArgoHealthStatus = healthStatus => {
  if (healthStatus === 'Healthy') {
    return 3
  }
  if (healthStatus === 'Missing' || healthStatus === 'Unknown') {
    return 1
  }
  if (healthStatus === 'Degraded') {
    return 0
  }
  return 2
}

export const getPulseStatusForArgoApp = node => {
  const appHealth = _.get(node, 'specs.raw.status.health.status')
  const healthArr = [translateArgoHealthStatus(appHealth)]
  const relatedApps = _.get(node, 'specs.relatedApps', [])

  relatedApps.forEach(app => {
    const relatedAppHealth = _.get(app, 'status.health.status', 'Healthy')
    healthArr.push(translateArgoHealthStatus(relatedAppHealth))
  })

  const minPulse = Math.min.apply(null, healthArr)
  return pulseValueArr[minPulse]
}

// try to match app destination clusters with hub clusters using search data
export const updateAppClustersMatchingSearch = (node, searchClusters) => {
  //get only clusters in a url format looking like a cluster api url
  const appClusters = _.get(node, 'specs.appClusters', [])
  const appClustersUsingURL = _.filter(appClusters, cls => isValidHttpUrl(cls))

  appClustersUsingURL.forEach(appCls => {
    try {
      let possibleMatch
      const clsUrl = new URL(appCls)
      const isOCPUrl = _.startsWith(clsUrl.hostname, 'api')
      const clusterIdx = appCls.indexOf(':cluster/')
      if (clusterIdx !== -1) {
        const kubeClusterName = appCls.substring(clusterIdx + 9)
        // this is a non ocp cluster, server destination set by name
        possibleMatch = _.find(searchClusters, cls => {
          const clsName = _.get(cls, 'name', '_')
          return _.includes([clsName, `${clsName}-cluster`], kubeClusterName)
        })
      } else {
        if (isOCPUrl) {
          possibleMatch = _.find(searchClusters, cls =>
            _.endsWith(
              _.get(cls, 'consoleURL', '_'),
              clsUrl.hostname.substring(3)
            )
          )
        }
      }
      if (possibleMatch || !isOCPUrl) {
        // remove the URL cluster destination only for matched clusters or non ocp clusters
        _.pull(appClusters, appCls)
      }
      if (possibleMatch) {
        //found the cluster matching the app destination server url, use the cluster name
        const matchedClusterName = _.get(possibleMatch, 'name', '')
        if (!_.includes(appClusters, matchedClusterName)) {
          appClusters.push(matchedClusterName)
        }
        //now move all target namespaces to this cluster name
        const targetNamespaces = _.get(node, 'specs.targetNamespaces', {})
        const targetNSForAppCls = targetNamespaces[appCls]
        const targetNSForMatchedName = targetNamespaces[matchedClusterName]
        targetNamespaces[matchedClusterName] = _.sortBy(
          _.union(targetNSForAppCls, targetNSForMatchedName)
        )
      }
    } catch (err) {
      //ignore error
    }
  })
  _.set(node, 'specs.appClusters', _.sortBy(appClusters))
  _.set(node, 'specs.clusters', searchClusters)
  return node
}

export const isValidHttpUrl = value => {
  let validUrl = true
  try {
    new URL(value)
  } catch (err) {
    validUrl = false
  }
  return validUrl
}

//show warning when no deployed resources are not found by search on this cluster name
export const showMissingClusterDetails = (clusterName, node, details) => {
  if (clusterName.length === 0) {
    // there are no deployed clusters for this app group
    const clsNames = Object.keys(
      _.get(node, 'clusters.specs.targetNamespaces', { unknown: [] })
    )
    clsNames.forEach(clsName => {
      details.push({
        labelValue: clsName,
        value: msgs.get('spec.deploy.not.deployed'),
        status: pendingStatus
      })
    })
  } else if (isValidHttpUrl(clusterName)) {
    // this cluster name could not be mapped to a cluster name
    // search clusters mapping fails when there are no deployed resources or clusters not found..
    if (_.startsWith(clusterName, 'https://api.')) {
      // ocp cluster, mapping not found which means there is no deployment on this cluster
      details.push({
        labelValue: clusterName,
        value: msgs.get('spec.deploy.not.deployed'),
        status: pendingStatus
      })
    } else {
      details.push({
        labelValue: clusterName,
        value: msgs.get('resource.cluster.notmapped'),
        status: pendingStatus
      })
    }
  } else {
    details.push({
      labelValue: clusterName,
      value: msgs.get('resource.cluster.offline'),
      status: warningStatus
    })
  }
  return details
}

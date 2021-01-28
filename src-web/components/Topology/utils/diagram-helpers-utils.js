/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import R from 'ramda'
import _ from 'lodash'
import { LOCAL_HUB_NAME } from '../../../../lib/shared/constants'

const checkmarkCode = 3
const warningCode = 2
const pendingCode = 1
const failureCode = 0

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

export const getClusterName = nodeId => {
  if (nodeId === undefined) {
    return ''
  }
  const clusterIndex = nodeId.indexOf('--clusters--')
  if (clusterIndex !== -1) {
    const startPos = nodeId.indexOf('--clusters--') + 12
    const endPos = nodeId.indexOf('--', startPos)
    return nodeId.slice(startPos, endPos)
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
  Object.entries(resourceMap).forEach(([key, value]) => {
    if (value.status === 'Subscribed' && activeFilterCodes.has(checkmarkCode)) {
      filteredObject[key] = value
    }
    if (value.status === 'Propagated' && activeFilterCodes.has(warningCode)) {
      filteredObject[key] = value
    }
    if (value.status === 'Fail' && activeFilterCodes.has(failureCode)) {
      filteredObject[key] = value
    }
  })

  return filteredObject
}

export const getOnlineClusters = (clusterNames, clusterObjs) => {
  const onlineClusters = []

  clusterNames.forEach(clsName => {
    if (clsName.trim() === LOCAL_HUB_NAME) {
      onlineClusters.push(clsName)
      return
    }
    for (let i = 0; i < clusterObjs.length; i++) {
      const clusterObjName = _.get(clusterObjs[i], 'metadata.name')
      if (clusterObjName === clsName.trim()) {
        if (
          clusterObjs[i].status === 'ok' ||
          clusterObjs[i].status === 'pendingimport'
        ) {
          onlineClusters.push(clsName)
        }
        break
      }
    }
  })

  return onlineClusters
}

export const getClusterHost = consoleURL => {
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
  Object.values(resourceMap).forEach(subscriptionItem => {
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
  const keys = Object.keys(resourceMap)

  let i
  for (i = 0; i < keys.length; i++) {
    if (
      keys[i].indexOf(name) > -1 &&
      keys[i].indexOf(relatedKind.cluster) > -1
    ) {
      return keys[i]
    }
  }

  return null
}

// The controllerrevision resource doesn't contain any desired pod count so
// we need to get it from the parent; either a daemonset or statefulset
export const syncControllerRevisionPodStatusMap = (
  resourceMap,
  controllerRevisionArr
) => {
  controllerRevisionArr.forEach(crName => {
    const controllerRevision = resourceMap[crName]
    const parentName = _.get(controllerRevision, 'specs.parent.parentName', '')
    const parentType = _.get(controllerRevision, 'specs.parent.parentType', '')
    const parentId = _.get(controllerRevision, 'specs.parent.parentId', '')
    const clusterName = getClusterName(parentId)
    const parentResource =
      resourceMap[`${parentType}-${parentName}-${clusterName}`]
    const parentPodModel = {
      ..._.get(parentResource, `specs.${parentResource.type}Model`, '')
    }

    if (parentPodModel) {
      _.set(
        controllerRevision,
        'specs.controllerrevisionModel',
        parentPodModel
      )
    }
  })
}

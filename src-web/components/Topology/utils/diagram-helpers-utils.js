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
      'deploymentconfig'
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

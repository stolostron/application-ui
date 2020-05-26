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
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import _ from 'lodash'
import moment from 'moment'
import msgs from '../../../../nls/platform.properties'

const metadataName = 'specs.raw.metadata.name'
const notDeployedStr = msgs.get('spec.deploy.not.deployed')
const deployedStr = msgs.get('spec.deploy.deployed')
const specPulse = 'specs.pulse'

const podErrorStates = [
  'CrashLoopBackOff',
  'ImageLoopBackOff',
  'Error',
  'InvalidImageName',
  'OOMKilled'
]

/*
* UI helpers to help with data transformations
* */
export const getAge = value => {
  if (value) {
    if (value.includes('T')) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
    } else {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    }
  }
  return '-'
}

export const addDetails = (details, dets) => {
  dets.forEach(({ labelKey, labelValue, value, indent, isError }) => {
    if (value !== undefined) {
      details.push({
        type: 'label',
        labelKey,
        labelValue,
        value,
        indent,
        isError: isError
      })
    }
  })
}

export const getClusterName = nodeId => {
  const startPos = nodeId.indexOf('--clusters--') + 12
  const endPos = nodeId.indexOf('--', startPos)

  return nodeId.slice(startPos, endPos)
}

export const getWrappedNodeLabel = (label, width, rows = 3) => {
  // if too long, add elipse and split the rest
  const ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(label)
  if (ip) {
    label = label.substr(0, ip.index) + '\n' + ip[0]
  } else {
    if (label.length > width * rows) {
      if (rows === 2) {
        label = label.substr(0, width) + '..\n' + label.substr(-width)
      } else {
        label =
          splitLabel(label.substr(0, width * 2), width, rows - 1) +
          '..\n' +
          label.substr(-width)
      }
    } else {
      label = splitLabel(label, width, rows)
    }
  }
  return label
}

const splitLabel = (label, width, rows) => {
  let line = ''
  const lines = []
  const parts = label.split(/([^A-Za-z0-9])+/)
  let remaining = label.length
  do {
    // add label part
    line += parts.shift()

    // add splitter
    if (parts.length) {
      line += parts.shift()
    }

    // if next label part puts it over width split it
    if (parts.length) {
      if (line.length + parts[0].length > width) {
        remaining -= line.length
        if (remaining > width) {
          if (rows === 2) {
            // if pentulitmate row do a hard break
            const split = parts[0]
            const idx = width - line.length
            line += split.substr(0, idx)
            parts[0] = split.substr(idx)
          }
        }
        lines.push(line)
        line = ''
        rows -= 1
      }
    } else {
      // nothing left, push last line
      lines.push(line)
    }
  } while (parts.length)

  // pull last line in if too short
  if (lines.length > 1) {
    let lastLine = lines.pop()
    if (lastLine.length <= 2) {
      lastLine = lines.pop() + lastLine
    }
    lines.push(lastLine)
  }
  return lines.join('\n')
}

//as scale decreases from max to min, return a counter zoomed value from min to max
export const counterZoom = (scale, scaleMin, scaleMax, valueMin, valueMax) => {
  if (scale >= scaleMax) {
    return valueMin
  } else if (scale <= scaleMin) {
    return valueMax
  }
  return (
    valueMin +
    (1 - (scale - scaleMin) / (scaleMax - scaleMin)) * (valueMax - valueMin)
  )
}

export const getTooltip = tooltips => {
  return ReactDOMServer.renderToStaticMarkup(
    <React.Fragment>
      {tooltips.map(
        ({
          name,
          value,
          href,
          target = '_blank',
          rel = 'noopener noreferrer'
        }) => {
          return (
            <div key={Math.random()}>
              <span className="label">{name}: </span>
              {href ? (
                <a className="link" href={href} target={target} rel={rel}>
                  {value}
                </a>
              ) : (
                <span className="value">{value}</span>
              )}
            </div>
          )
        }
      )}
    </React.Fragment>
  )
}

export const getHashCode = str => {
  let hash = 0,
      i,
      chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

export const getNodePropery = (
  node,
  propPath,
  key,
  defaultValue,
  showAsError
) => {
  const dataObj = R.pathOr(undefined, propPath)(node)

  let data = dataObj
  if (data) {
    data = R.replace(/:/g, '=', R.toString(data))
    data = R.replace(/{/g, '', data)
    data = R.replace(/}/g, '', data)
    data = R.replace(/"/g, '', data)
    data = R.replace(/ /g, '', data)
    data = R.replace(/\/\//g, ',', data)
  } else {
    if (defaultValue) {
      data = defaultValue
    }
  }

  if (data) {
    return {
      labelKey: key,
      value: data,
      isError: showAsError && !dataObj //show as error message if data not defined and marked for error
    }
  }

  return undefined
}

export const addPropertyToList = (list, data) => {
  if (list && data) {
    list.push(data)
  }

  return list
}

export const nodeMustHavePods = node => {
  //returns true if the node should deploy pods
  let mustHavePods = false
  if (
    node &&
    !R.contains(node.type, ['application', 'rules', 'subscription']) &&
    (R.length(
      R.pathOr([], ['specs', 'raw', 'spec', 'template', 'spec', 'containers'])(
        node
      )
    ) > 0 ||
      R.pathOr(undefined, ['specs', 'raw', 'spec', 'replicas'])(node)) //for chart packages, where the containers info is not available
  ) {
    mustHavePods = true
  }

  return mustHavePods
}

const getPulseStatusForSubscription = node => {
  let pulse = 'green'

  const resourceMap = _.get(node, `specs.${node.type}Model`)
  if (!resourceMap) {
    pulse = 'orange' //resource not available
    return pulse
  }

  let isPlaced = false
  Object.values(resourceMap).forEach(subscriptionItem => {
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
  })
  if (pulse === 'green' && !isPlaced) {
    pulse = 'yellow' // set to yellow if not placed
  }

  return pulse
}

const getPulseStatusForGenericNode = node => {
  let pulse = _.get(node, specPulse, 'green')
  if (pulse === 'red') {
    return pulse //no need to check anything else, return red
  }

  const resourceName = _.get(node, metadataName, '')
  const resourceMap = _.get(node, `specs.${node.type}Model`)
  if (!resourceMap) {
    pulse = 'orange' //resource not available
    return pulse
  }

  const clusterNames = R.split(',', getClusterName(node.id))

  //go through all clusters to make sure all pods are counted, even if they are not deployed there
  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)
    const resourceItem = resourceMap[`${resourceName}-${clusterName}`]

    if (!resourceItem) {
      // resource not created on a cluster
      pulse = 'yellow'
    }
  })

  return pulse
}

//count pod state
const getPodState = (podItem, clusterName, types) => {
  if (
    clusterName.indexOf(podItem.cluster) > -1 &&
    R.contains(podItem.status, types)
  ) {
    return 1
  }

  return 0
}

export const getPulseForData = (
  previousPulse,
  available,
  desired,
  podsUnavailable
) => {
  if (previousPulse === 'red') {
    return 'red' //don't overwrite a red state
  }

  if (podsUnavailable > 0) {
    return 'red'
  }

  if (available < desired) {
    return 'red'
  }

  if (desired <= 0) {
    return 'yellow'
  }

  return 'green'
}

export const getPulseForNodeWithPodStatus = node => {
  let pulse = 'green'
  const resourceMap = _.get(node, `specs.${node.type}Model`)
  const desired = _.get(node, 'specs.raw.spec.replicas', 'NA')
  const resourceName = _.get(node, metadataName, '')

  if (!resourceMap) {
    pulse = 'orange' //resource not available
    return pulse
  }

  const clusterNames = R.split(',', getClusterName(node.id))

  //must have pods, set the pods status here
  const podStatusMap = {}
  const podList = _.get(node, 'specs.podModel', {})

  //go through all clusters to make sure all pods are counted, even if they are not deployed there
  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)

    const resourceItem = resourceMap[`${resourceName}-${clusterName}`]
    const processItem = Object.keys(podList).length === 0 && resourceItem

    let podsReady = 0
    let podsUnavailable = 0
    //find pods status and pulse from pods model, if available
    Object.values(podList).forEach(podItem => {
      podsUnavailable =
        podsUnavailable + getPodState(podItem, clusterName, podErrorStates) //podsUnavailable + 1
      podsReady = podsReady + getPodState(podItem, clusterName, 'Running')
    })

    podStatusMap[clusterName] = {
      available: 0,
      current: 0,
      desired: desired,
      ready: podsReady,
      unavailable: podsUnavailable
    }

    pulse = getPulseForData(pulse, podsReady, desired, podsUnavailable)
    if (processItem) {
      //no pods linked to the resource, check if we have enough information on the actual resource
      podStatusMap[clusterName] = {
        available: resourceItem.available || 0,
        current: resourceItem.current || 0,
        desired: resourceItem.desired || 0,
        ready: resourceItem.ready || 0
      }

      pulse = getPulseForData(
        pulse,
        resourceItem.available,
        resourceItem.desired,
        0
      )
    }
  })

  _.set(node, 'podStatusMap', podStatusMap)

  return pulse
}

export const computeNodeStatus = node => {
  let pulse = 'green'

  if (nodeMustHavePods(node)) {
    pulse = getPulseForNodeWithPodStatus(node)
    _.set(node, specPulse, pulse)
  }

  switch (node.type) {
  case 'package':
    break
  case 'application':
    if (!_.get(node, 'specs.channels')) {
      pulse = 'red'
    }
    break
  case 'rules':
    if (!_.get(node, 'specs.raw.status.decisions')) {
      pulse = 'red'
    }
    break
  case 'subscription':
    pulse = getPulseStatusForSubscription(node)
    break
  default:
    pulse = getPulseStatusForGenericNode(node)
  }

  _.set(node, specPulse, pulse)
}

export const createDeployableYamlLink = (node, details) => {
  //returns yaml for the deployable
  if (details && node) {
    const row = R.pathOr(undefined, ['specs', 'row'])(node)
    if (row !== undefined) {
      details.push({
        type: 'link',
        value: {
          label: msgs.get('props.view.yaml'),
          id: node.id,
          data: {
            specs: {
              row: row,
              isDesign: true
            }
          },
          indent: true
        }
      })
    }
  }

  return details
}

export const createResourceSearchLink = (node, details) => {
  //returns search link for resource
  if (details && node && R.pathOr('', ['specs', 'pulse'])(node) !== 'orange') {
    //pulse orange means not deployed on any cluster so don't show link to search page
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.search.view'),
        id: node.id,
        data: {
          action: 'show_search',
          name: node.name,
          namespace: node.namespace,
          kind: node.type
        },
        indent: true
      }
    })
  }

  return details
}

const computeResourceName = (
  relatedKind,
  deployableName,
  name,
  isClusterGrouped
) => {
  if (relatedKind.kind === 'pod' && !deployableName) {
    const pname = name
    // get pod name w/o uid suffix
    name = pname.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '')
    if (name === pname) {
      const idx = name.lastIndexOf('-')
      if (idx !== -1) {
        name = name.substr(0, idx)
      }
    }
  }

  if (relatedKind.kind !== 'subscription') {
    //expect for subscriptions, use cluster name to group resources
    name = isClusterGrouped.value
      ? `${relatedKind.kind}-${name}`
      : `${relatedKind.kind}-${name}-${relatedKind.cluster}`
  }

  return name
}

//creates a map with all related kinds for this app, not only pod types
export const setupResourceModel = (list, resourceMap, isClusterGrouped) => {
  if (list && resourceMap) {
    list.forEach(kindArray => {
      const relatedKindList = R.pathOr([], ['items'])(kindArray)

      relatedKindList.forEach(relatedKind => {
        let name = relatedKind.name
        const kind = relatedKind.kind
        let podHash = null
        let deployableName = null

        //look for pod template hash and remove it from the name if there
        const labelsList = relatedKind.label
          ? R.split(';')(relatedKind.label)
          : []
        labelsList.forEach(resLabel => {
          const values = R.split('=')(resLabel)
          if (values.length === 2) {
            const labelKey = values[0].trim()
            if (labelKey === 'pod-template-hash') {
              podHash = values[1].trim()
              name = R.replace(`-${podHash}`, '')(name)
            }
            if (
              labelKey === 'openshift.io/deployment-config.name' ||
              R.contains('deploymentconfig')(resLabel)
            ) {
              //look for deployment config info in the label; the name of the resource could be different than the one defined by the deployable
              //openshift.io/deployment-config.name
              deployableName = values[1].trim()
              name = deployableName
            }
          }
        })

        name = computeResourceName(
          relatedKind,
          deployableName,
          name,
          isClusterGrouped
        )

        if (resourceMap[name]) {
          const kindModel = _.get(resourceMap[name], `specs.${kind}Model`, {})
          kindModel[`${relatedKind.name}-${relatedKind.cluster}`] = relatedKind
          _.set(resourceMap[name], `specs.${kind}Model`, kindModel)
        }
      })
    })
  }

  return resourceMap
}

//show resource deployed status on the remote clusters
//for resources not producing pods
export const setResourceDeployStatus = (node, details) => {
  if (
    nodeMustHavePods(node) ||
    R.contains(node.type, [
      'application',
      'rules',
      'cluster',
      'subscription',
      'package'
    ])
  ) {
    //resource with pods info is processed separately
    //ignore packages
    return
  }

  const resourceName = _.get(node, metadataName, '')
  const clusterNames = R.split(',', getClusterName(node.id))
  const resourceMap = _.get(node, `specs.${node.type}Model`, {})

  details.push({
    type: 'label',
    labelKey: 'resource.deploy.statuses'
  })

  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)
    const res = resourceMap[`${resourceName}-${clusterName}`]
    const deployedKey = res ? deployedStr : notDeployedStr

    details.push({
      labelValue: clusterName,
      value: deployedKey,
      isError: deployedKey === notDeployedStr
    })

    if (res) {
      details.push({
        type: 'link',
        value: {
          label: msgs.get('props.show.yaml'),
          data: {
            action: 'show_resource_yaml',
            cluster: res.cluster,
            selfLink: res.selfLink
          }
        },
        indent: true
      })
    }
  })

  details.push({
    type: 'spacer'
  })
}

//show resource deployed status for resources producing pods
export const setPodDeployStatus = (node, details) => {
  if (!nodeMustHavePods(node)) {
    return //process only resources with pods
  }

  details.push({
    type: 'label',
    labelKey: 'resource.deploy.pods.statuses'
  })

  const podModel = _.get(node, 'specs.podModel', {})
  const podStatusModel = _.get(node, 'podStatusMap', {})

  const clusterNames = R.split(',', getClusterName(node.id))
  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)
    const res = podStatusModel[clusterName]
    const valueStr = res ? `${res.ready}/${res.desired}` : notDeployedStr
    const isErrorMsg = valueStr === notDeployedStr || res.ready < res.desired
    details.push({
      labelValue: clusterName,
      value: valueStr,
      isError: isErrorMsg
    })
  })

  details.push({
    type: 'spacer'
  })

  Object.values(podModel).forEach(pod => {
    const { status, restarts, hostIP, podIP, startedAt, cluster } = pod
    const podError = R.contains(pod.status, podErrorStates)
    details.push({
      type: 'label',
      labelKey: 'resource.container.logs'
    })
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.log'),
        data: {
          action: 'show_pod_log',
          name: pod.name,
          namespace: pod.namespace,
          cluster: pod.cluster
        }
      },
      indent: true
    })

    addDetails(details, [
      {
        labelKey: 'resource.clustername',
        value: cluster
      },
      {
        labelKey: 'resource.pod',
        value: pod.name
      },
      {
        labelKey: 'resource.hostip',
        value: hostIP
      },
      {
        labelKey: 'resource.podip',
        value: podIP
      },
      {
        labelKey: 'resource.created',
        value: getAge(startedAt)
      },
      {
        labelKey: 'resource.status',
        value: status,
        isError: podError
      },
      {
        labelKey: 'resource.restarts',
        value: restarts
      }
    ])
    details.push({
      type: 'spacer'
    })
  })
}

export const setSubscriptionDeployStatus = (node, details) => {
  if (node.type !== 'subscription') {
    return details
  }
  details.push({
    type: 'label',
    labelKey: 'resource.deploy.statuses'
  })

  const resourceMap = _.get(node, 'specs.subscriptionModel', {})
  Object.values(resourceMap).forEach(subscription => {
    details.push({
      labelValue: subscription.cluster,
      value: subscription.status,
      isError: R.contains('Fail', subscription.status)
    })
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.yaml'),
        data: {
          action: 'show_resource_yaml',
          cluster: subscription.cluster,
          selfLink: subscription.selfLink
        }
      },
      indent: true
    })
  })

  if (Object.keys(resourceMap).length === 1) {
    //no remote subscriptions
    details.push({
      labelValue: msgs.get('resource.subscription.remote'),
      value: msgs.get('resource.subscription.placed.error', [node.namespace]),
      isError: true
    })
  }
  details.push({
    type: 'spacer'
  })

  return details
}

export const setApplicationDeployStatus = (node, details) => {
  if (node.type !== 'application') {
    return
  }
  addPropertyToList(
    details,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'selector'],
      'spec.selector.matchExpressions',
      msgs.get('spec.selector.matchExpressions.err'),
      true
    )
  )

  details.push({
    type: 'spacer'
  })

  addPropertyToList(
    details,
    getNodePropery(
      node,
      ['specs', 'channels'],
      'spec.app.channels',
      msgs.get('resource.application.error.msg'),
      true
    )
  )
}

const addNodeOCPRouteLocationForCluster = (
  node,
  typeObject,
  clusterName,
  details
) => {
  const clustersList = R.pathOr([], ['clusters', 'specs', 'clusters'])(node)

  let hostName = R.pathOr(undefined, ['specs', 'raw', 'spec', 'host'])(node)

  let hostLink = 'NA'
  if (!hostName) {
    //build up the name using <route_name>-<ns>.router.default.svc.cluster.local
    Object.values(clustersList).forEach(clusterObject => {
      if (R.pathOr('NA', ['metadata', 'name'])(clusterObject) === clusterName) {
        hostName = `${node.name}-${node.namespace}.${clusterObject.clusterip}`
      }
    })
  }
  const transport = R.pathOr(undefined, ['specs', 'raw', 'spec', 'tls'])(node)
    ? 'https'
    : 'http'
  hostLink = `${transport}://${hostName}/`

  details.push({
    type: 'link',
    value: {
      label: hostLink,
      id: `${typeObject.id}-location`,
      data: {
        action: 'open_link',
        targetLink: hostLink
      },
      indent: true
    }
  })
}

//route
export const addOCPRouteLocation = (node, details) => {
  if (R.pathOr('', ['specs', 'raw', 'kind'])(node) === 'Route') {
    return addNodeInfoPerCluster(
      node,
      details,
      addNodeOCPRouteLocationForCluster
    )
  }

  return details //process only routes
}

//for service
export const addNodeServiceLocation = (node, details) => {
  if (R.pathOr('', ['specs', 'raw', 'kind'])(node) === 'Service') {
    return addNodeInfoPerCluster(
      node,
      details,
      addNodeServiceLocationForCluster
    ) //process only services
  }
  return details
}

//generic function to write location info
const addNodeInfoPerCluster = (node, details, getDetailsFunction) => {
  const resourceName = _.get(node, metadataName, '')
  const resourceMap = _.get(node, `specs.${node.type}Model`, {})
  const clusterNames = R.split(',', getClusterName(node.id))
  const locationDetails = []

  let counter = 0
  clusterNames.forEach(clusterName => {
    if (counter > 2) {
      return //too much info for the dialog, show first 5 clusters
    }
    counter = counter + 1
    clusterName = R.trim(clusterName)
    const typeObject = resourceMap[`${resourceName}-${clusterName}`]
    if (typeObject) {
      getDetailsFunction(node, typeObject, clusterName, locationDetails)
    }
  })

  if (locationDetails.length > 0) {
    details.push({
      type: 'spacer'
    })

    details.push({
      type: 'label',
      labelKey: 'raw.spec.host.location'
    })

    locationDetails.forEach(locationDetail => {
      details.push(locationDetail)
    })

    details.push({
      type: 'spacer'
    })
  }

  return details
}

const addNodeServiceLocationForCluster = (
  node,
  typeObject,
  clusterName,
  details
) => {
  if (node && typeObject.clusterIP && typeObject.port) {
    let port = R.split(':', typeObject.port)[0] // take care of 80:etc format
    port = R.split('/', port)[0] //now remove any 80/TCP

    const location = `${typeObject.clusterIP}:${port}`

    details.push({
      type: 'label',
      labelValue: clusterName,
      value: location
    })
  }
}

export const processResourceActionLink = resource => {
  let targetLink = ''
  const linkPath = R.pathOr('', ['action'])(resource)
  const { name, namespace, cluster, selfLink, kind } = resource
  switch (linkPath) {
  case 'show_pod_log':
    targetLink = `/multicloud/details/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/logs`
    break
  case 'show_resource_yaml':
    targetLink = `/multicloud/details/${cluster}${selfLink}`
    break
  case 'show_search':
    targetLink = `/multicloud/search?filters={"textsearch":"kind:${kind} name:${name} namespace:${namespace}"}`
    break
  default:
    targetLink = R.pathOr('', ['targetLink'])(resource)
  }
  if (targetLink !== '') {
    window.open(targetLink, '_blank')
  }
  return targetLink
}

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
const metadataNamespace = 'specs.raw.metadata.namespace'
const notDeployedStr = msgs.get('spec.deploy.not.deployed')
const notDeployedNSStr = msgs.get('spec.deploy.not.deployed.ns')
const deployedStr = msgs.get('spec.deploy.deployed')
const deployedNSStr = msgs.get('spec.deploy.deployed.ns')
const specPulse = 'specs.pulse'
const specsPropsYaml = 'props.show.yaml'
const showLocalYaml = 'props.show.local.yaml'
const showResourceYaml = 'show_resource_yaml'
const specLocation = 'raw.spec.host.location'

//pod state contains any of these strings
const podErrorStates = ['err', 'off', 'invalid', 'kill']

const podWarningStates = ['pending', 'creating']

const podSuccessStates = ['run']

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
  dets.forEach(({ labelKey, labelValue, value, indent, status }) => {
    if (value !== undefined) {
      details.push({
        type: 'label',
        labelKey,
        labelValue,
        value,
        indent,
        status: status
      })
    }
  })
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
  return 'local-cluster'
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
  let parts = label.split(/([^A-Za-z0-9])+/)
  if (parts.length === 1 && label.length > width) {
    //split if length > width and no split separator in label
    parts = R.splitAt(width, label)
  }
  let remaining = label.length
  do {
    // add label part
    line += parts.shift()

    // add splitter, check if next item is a splitter, 1 char
    if (parts.length && parts[0].length === 1) {
      line += parts.shift()
    }

    // if next label part puts it over width split it
    if (parts.length) {
      if (line.length + parts[0].length > width) {
        remaining -= line.length
        if (remaining > width && rows === 2) {
          // if penultimate row do a hard break
          const split = parts[0]
          const idx = width - line.length
          line += split.substr(0, idx)
          parts[0] = split.substr(idx)
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
              {name && name.length > 0 ? (
                <span className="label">{name}: </span>
              ) : (
                <span>&nbsp;</span>
              )}
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

export const getNodePropery = (node, propPath, key, defaultValue, status) => {
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

  if (data !== undefined) {
    // must show 0 values as well
    return {
      labelKey: key,
      value: data,
      status: status && !dataObj //show as error message if data not defined and marked for error
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

  if (
    !node ||
    !node.type ||
    R.contains(node.type, ['application', 'rules', 'subscription'])
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

const getPulseStatusForGenericNode = node => {
  let pulse = _.get(node, specPulse, 'green')
  if (pulse === 'red') {
    return pulse //no need to check anything else, return red
  }
  const name = _.get(node, metadataName, '')
  const channel = _.get(node, 'specs.raw.spec.channel', '')
  const resourceName = channel.length > 0 ? `${channel}-${name}` : name

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
export const getPodState = (podItem, clusterName, types) => {
  const podStatus = R.toLower(R.pathOr('unknown', ['status'])(podItem))

  let result = 0
  if (
    !clusterName ||
    R.equals(clusterName, R.pathOr('unkown', ['cluster'])(podItem))
  ) {
    types.forEach(type => {
      if (R.contains(type, podStatus)) {
        result = 1
      }
    })
  }
  return result
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
    return 'yellow'
  }

  if (desired <= 0) {
    return 'yellow'
  }

  return 'green'
}

export const getPulseForNodeWithPodStatus = node => {
  let pulse = 'green'
  const pulseArr = []
  const pulseValueArr = ['red', 'orange', 'yellow', 'green']
  const resourceMap = _.get(node, `specs.${node.type}Model`)
  let desired =
    _.get(node, 'specs.raw.spec.replicas') ||
    _.get(node, 'specs.raw.spec.desired', 'NA')

  // special case, pod type can only deploy 1 pod
  if (node.type === 'pod') {
    desired = 1
  }
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

    if (resourceItem && resourceItem.kind === 'daemonset') {
      desired = resourceItem.desired
    }

    let podsReady = 0
    let podsUnavailable = 0
    //find pods status and pulse from pods model, if available
    Object.values(podList).forEach(podItem => {
      podsUnavailable =
        podsUnavailable + getPodState(podItem, clusterName, podErrorStates) //podsUnavailable + 1
      podsReady =
        podsReady + getPodState(podItem, clusterName, podSuccessStates)
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
        resourceItem.available ? resourceItem.available : 0,
        resourceItem.desired,
        0
      )
    }
    // assign a number to each pulse with lowest number being most critical
    if (pulse === 'green') {
      pulseArr.push(3)
    } else if (pulse === 'yellow') {
      pulseArr.push(2)
    } else if (pulse === 'orange') {
      pulseArr.push(1)
    } else if (pulse === 'red') {
      pulseArr.push(0)
    }
  })

  // set node icon to the most critical status
  const minPulse = Math.min.apply(null, pulseArr)
  pulse = pulseValueArr[minPulse]
  _.set(node, 'podStatusMap', podStatusMap)

  return pulse
}

export const computeNodeStatus = node => {
  let pulse = 'green'

  if (nodeMustHavePods(node)) {
    pulse = getPulseForNodeWithPodStatus(node)
    _.set(node, specPulse, pulse)
    return
  }

  switch (node.type) {
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
  if (
    details &&
    node &&
    R.contains(_.get(node, 'type', ''), [
      'application',
      'rules',
      'subscription'
    ])
  ) {
    const selfLink = _.get(node, 'specs.raw.metadata.selfLink')
    selfLink &&
      details.push({
        type: 'link',
        value: {
          label: msgs.get(showLocalYaml),
          data: {
            action: showResourceYaml,
            cluster: 'local-cluster',
            selfLink: selfLink
          }
        }
      })
  }

  return details
}

export const inflateKubeValue = value => {
  if (value) {
    const match = value.match(/\D/g)
    if (match) {
      // if value has suffix
      const unit = match.join('')
      const val = value.match(/\d+/g).map(Number)[0]
      const BINARY_PREFIXES = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
      const SI_PREFIXES = ['m', 'k', 'M', 'G', 'T', 'P', 'E']
      const num =
        unit && unit.length === 2
          ? factorize(BINARY_PREFIXES, unit, 'binary')
          : factorize(SI_PREFIXES, unit, 'si')
      return val * num
    }
    return parseFloat(value)
  }
  return ''
}

function factorize(prefixes, unit, type) {
  let factorizeNb = 1
  for (let index = 0; index < prefixes.length; index++) {
    if (unit === prefixes[index]) {
      const base = type === 'binary' ? 1024 : 1000
      const unitM = unit === 'm' ? -1 : index
      const exponent = type === 'binary' ? index + 1 : unitM
      factorizeNb = Math.pow(base, exponent)
    }
  }
  return factorizeNb
}

export const getPercentage = (value, total) => {
  return Math.floor(100 * (total - value) / total) || 0
}

export const setClusterStatus = (node, details) => {
  const specs = _.get(node, 'specs', {})
  const { cluster, clusters = [] } = specs
  const clusterArr = cluster ? [cluster] : clusters

  if (clusterArr.length > 1) {
    addPropertyToList(
      details,
      getNodePropery(node, ['specs', 'clusterNames'], 'resource.clusters')
    )

    details.push({
      type: 'spacer'
    })
  }

  clusterArr.forEach(c => {
    const {
      metadata = {},
      capacity = {},
      allocatable = {},
      clusterip,
      status
    } = c
    const { name, namespace, creationTimestamp } = metadata
    //void ({ labels } = metadata)
    const { nodes, cpu: cc, memory: cm } = capacity
    const { pods, cpu: ac, memory: am } = allocatable
    details.push({ labelKey: 'resource.name', value: name })
    details.push({ labelKey: 'resource.namespace', value: namespace })
    if (c.consoleURL) {
      const href = c.consoleURL
      details.push({
        type: 'link',
        value: {
          label: msgs.get('details.cluster.console'),
          id: `${href}-location`,
          data: {
            action: 'open_link',
            targetLink: href
          }
        },
        indent: true
      })
    }

    // general details
    addDetails(details, [
      { labelKey: 'resource.clusterip', value: clusterip },
      { labelKey: 'resource.pods', value: pods },
      { labelKey: 'resource.nodes', value: nodes },
      { labelKey: 'resource.status', value: status },
      {
        labelKey: 'resource.cpu',
        value: `${getPercentage(inflateKubeValue(ac), inflateKubeValue(cc))}%`
      },
      {
        labelKey: 'resource.memory',
        value: `${getPercentage(inflateKubeValue(am), inflateKubeValue(cm))}%`
      },
      { labelKey: 'resource.created', value: getAge(creationTimestamp) }
    ])
    details.push({
      type: 'spacer'
    })
  })

  return details
}

export const createResourceSearchLink = node => {
  let result = {
    type: 'link',
    value: null
  }

  const nodeType = _.get(node, 'type', '')
  //returns search link for resource
  if (nodeType === 'cluster') {
    result = {
      type: 'link',
      value: {
        label: msgs.get('props.show.search.view'),
        id: node.id,
        data: {
          action: 'show_search',
          name: (node.name && R.replace(/ /g, '')(node.name)) || 'undefined', // take out spaces
          kind: 'cluster'
        },
        indent: true
      }
    }
  } else if (node && R.pathOr('', ['specs', 'pulse'])(node) !== 'orange') {
    const kindModel = _.get(node, `specs.${nodeType}Model`, {})
    let computedNameList = []
    let computedNSList = []
    Object.values(kindModel).forEach(item => {
      computedNameList = R.union(computedNameList, [item.name])
      computedNSList = R.union(computedNSList, [item.namespace])
    })
    let computedName = ''
    computedNameList.forEach(item => {
      computedName =
        computedName.length === 0 ? item : `${computedName},${item}`
    })
    let computedNS = ''
    computedNSList.forEach(item => {
      computedNS = computedNS.length === 0 ? item : `${computedNS},${item}`
    })

    //get the list of all names from the related list; for helm charts, they are different than the deployable name
    //pulse orange means not deployed on any cluster so don't show link to search page
    result = {
      type: 'link',
      value: {
        label: msgs.get('props.show.search.view'),
        id: node.id,
        data: {
          action: 'show_search',
          name:
            computedName && computedName.length > 0 ? computedName : node.name,
          namespace:
            computedNS && computedNS.length > 0
              ? computedNS
              : R.pathOr('', ['specs', 'raw', 'metadata', 'namespace'])(node),
          kind: nodeType === 'rules' ? 'placementrule' : _.get(node, 'type', '')
        },
        indent: true
      }
    }
  }
  return result
}

export const removeReleaseGeneratedSuffix = name => {
  return name.replace(/-[0-9a-zA-Z]{4,5}$/, '')
}

//for charts remove release name
export const getNameWithoutChartRelease = (
  relatedKind,
  name,
  isHelmRelease
) => {
  const kind = _.get(relatedKind, 'kind', '')
  if (kind === 'subscription' || !isHelmRelease.value) {
    return name //ignore subscription objects or objects where the name is not created from the _hostingDeployable
  }

  //for resources deployed from charts, remove release name
  //note that the name parameter is the _hostingDeployable
  //and is in this format ch-git-helm/git-helm-chart1-1.1.1
  const savedName = name
  const labelAttr = _.get(relatedKind, 'label', '')
  const labels = _.split(labelAttr, ';')
  let foundReleaseLabel = false
  labels.forEach(label => {
    const splitLabelContent = _.split(label, '=')
    if (
      splitLabelContent.length === 2 &&
      _.trim(splitLabelContent[0]) === 'release'
    ) {
      //get label for release name
      foundReleaseLabel = true
      const releaseName = _.trim(splitLabelContent[1])
      name = _.replace(name, `${releaseName}-`, '')
      name = _.replace(name, releaseName, '')

      if (name.length === 0) {
        // release name is used as name, need to strip generated suffix
        name = removeReleaseGeneratedSuffix(savedName)
      }
    }
  })

  if (!foundReleaseLabel && kind === 'helmrelease') {
    //try to guess the release name from the name, which is the _hostingDeployable
    //and is in this format ch-git-helm/git-helm-chart1-1.1.1 - we want chart1-1.1.1
    const resourceName = _.get(relatedKind, 'name', '')
    let resourceNameNoHash = resourceName.replace(
      /-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/,
      ''
    )
    if (resourceName === resourceNameNoHash) {
      const idx = resourceNameNoHash.lastIndexOf('-')
      if (idx !== -1) {
        resourceNameNoHash = resourceNameNoHash.substr(0, idx)
      }
    }

    const values = _.split(name, '-')
    if (values.length > 2) {
      //take the last value which is the version
      name = `${resourceNameNoHash}-${values[values.length - 1]}`
    }
  }

  return name
}

export const computeResourceName = (
  relatedKind,
  deployableName,
  name,
  isClusterGrouped
) => {
  if (
    relatedKind.kind === 'pod' &&
    !_.get(relatedKind, '_hostingDeployable') &&
    !deployableName
  ) {
    //if pod has hosting deployable it is owned by a pod object; don't remove suffix
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

//look for pod template hash and remove it from the name if there
export const getNameWithoutPodHash = relatedKind => {
  let nameNoHash = relatedKind.name
  let podHash = null
  let deployableName = null

  if (_.get(relatedKind, 'kind', '') === 'helmrelease') {
    //for helm releases use hosting deployable to match parent
    nameNoHash = _.get(relatedKind, '_hostingDeployable', nameNoHash)
  }

  const labelsList = relatedKind.label ? R.split(';')(relatedKind.label) : []
  labelsList.forEach(resLabel => {
    const values = R.split('=')(resLabel)
    if (values.length === 2) {
      const labelKey = values[0].trim()
      if (labelKey === 'pod-template-hash') {
        podHash = values[1].trim()
        nameNoHash = R.replace(`-${podHash}`, '')(nameNoHash)
      }
      if (
        labelKey === 'openshift.io/deployment-config.name' ||
        R.contains('deploymentconfig')(resLabel)
      ) {
        //look for deployment config info in the label; the name of the resource could be different than the one defined by the deployable
        //openshift.io/deployment-config.name
        deployableName = values[1].trim()
        nameNoHash = deployableName
      }
    }
  })

  return { nameNoHash, deployableName }
}

//creates a map with all related kinds for this app, not only pod types
export const setupResourceModel = (
  list,
  resourceMap,
  isClusterGrouped,
  isHelmRelease
) => {
  if (list && resourceMap) {
    list.forEach(kindArray => {
      if (
        R.contains(_.get(kindArray, 'kind', ''), [
          'cluster',
          'placementrule',
          'channel',
          'deployable'
        ])
      ) {
        return //ignore these type of resources
      }

      const relatedKindList = R.pathOr([], ['items'])(kindArray)

      relatedKindList.forEach(relatedKind => {
        const kind = relatedKind.kind

        //look for pod template hash and remove it from the name if there
        const { nameNoHash, deployableName } = getNameWithoutPodHash(
          relatedKind
        )

        const nameWithoutChartRelease = getNameWithoutChartRelease(
          relatedKind,
          nameNoHash,
          isHelmRelease
        )

        const name = computeResourceName(
          relatedKind,
          deployableName,
          nameWithoutChartRelease,
          isClusterGrouped
        )

        if (resourceMap[name]) {
          const kindModel = _.get(resourceMap[name], `specs.${kind}Model`, {})
          kindModel[
            `${nameWithoutChartRelease}-${relatedKind.cluster}`
          ] = relatedKind
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
    return details
  }
  const name = _.get(node, metadataName, '')
  const channel = _.get(node, 'specs.raw.spec.channel', '')
  const resourceName = channel.length > 0 ? `${channel}-${name}` : name

  const clusterNames = R.split(',', getClusterName(node.id))
  const resourceMap = _.get(node, `specs.${node.type}Model`, {})

  details.push({
    type: 'spacer'
  })
  details.push({
    type: 'label',
    labelKey: 'resource.deploy.statuses'
  })

  clusterNames.forEach(clusterName => {
    details.push({
      type: 'spacer'
    })
    clusterName = R.trim(clusterName)
    const res = resourceMap[`${resourceName}-${clusterName}`]

    if (res && _.get(node, 'type', '') === 'ansiblejob') {
      addDetails(details, [
        {
          labelKey: 'description.ansible.job',
          value: _.get(res, 'label')
        }
      ])
    }

    const deployedKey = res
      ? node.type === 'namespace' ? deployedNSStr : deployedStr
      : node.type === 'namespace' ? notDeployedNSStr : notDeployedStr
    const statusStr =
      deployedKey === deployedStr || deployedKey === deployedNSStr
        ? 'checkmark'
        : 'pending'

    details.push({
      labelValue: clusterName,
      value: deployedKey,
      status: statusStr
    })

    if (res) {
      //for open shift routes show location info
      addOCPRouteLocation(node, clusterName, details)

      //for service
      addNodeServiceLocation(node, clusterName, details)

      details.push({
        type: 'link',
        value: {
          label: msgs.get(specsPropsYaml),
          data: {
            action: showResourceYaml,
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

  return details
}

//show resource deployed status for resources producing pods
export const setPodDeployStatus = (node, details) => {
  if (!nodeMustHavePods(node)) {
    return details //process only resources with pods
  }

  details.push({
    type: 'spacer'
  })
  details.push({
    type: 'label',
    labelKey: 'resource.deploy.pods.statuses'
  })

  const podModel = _.get(node, 'specs.podModel', {})
  const podStatusModel = _.get(node, 'podStatusMap', {})
  const podDataPerCluster = {} //pod details list for each cluster name

  const clusterNames = R.split(',', getClusterName(node.id))
  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)
    const res = podStatusModel[clusterName]
    let pulse = 'orange'
    if (res) {
      pulse = getPulseForData('', res.ready, res.desired, res.unavailable)
    }
    const valueStr = res ? `${res.ready}/${res.desired}` : notDeployedStr

    let statusStr
    switch (pulse) {
    case 'red':
      statusStr = 'failure'
      break
    case 'yellow':
      statusStr = 'warning'
      break
    case 'orange':
      statusStr = 'pending'
      break
    default:
      statusStr = 'checkmark'
      break
    }

    details.push({
      labelValue: clusterName,
      value: valueStr,
      status: statusStr
    })

    podDataPerCluster[clusterName] = []
  })

  details.push({
    type: 'spacer'
  })

  Object.values(podModel).forEach(pod => {
    const { status, restarts, hostIP, podIP, startedAt, cluster } = pod

    const podError = getPodState(pod, undefined, podErrorStates)
    const podWarning = getPodState(pod, undefined, podWarningStates)
    const clusterDetails = podDataPerCluster[cluster]
    if (clusterDetails) {
      const statusStr = podError
        ? 'failure'
        : podWarning ? 'warning' : 'checkmark'

      addDetails(clusterDetails, [
        {
          labelKey: 'resource.pod',
          value: pod.name
        },
        {
          labelKey: 'resource.status',
          value: status,
          status: statusStr
        }
      ])
      clusterDetails.push({
        type: 'link',
        value: {
          label: msgs.get('props.show.log'),
          data: {
            action: showResourceYaml,
            cluster: pod.cluster,
            selfLink: pod.selfLink
          }
        },
        indent: true
      })
      addDetails(clusterDetails, [
        {
          labelKey: 'resource.restarts',
          value: `${restarts}`
        },
        {
          labelKey: 'resource.hostip',
          value: `${hostIP}, ${podIP}`
        },
        {
          labelKey: 'resource.created',
          value: getAge(startedAt)
        }
      ])
      clusterDetails.push({
        type: 'spacer'
      })
    }
  })

  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)

    const clusterDetails = podDataPerCluster[clusterName]

    if (clusterDetails && clusterDetails.length > 0) {
      details.push({
        type: 'spacer'
      })

      details.push({
        type: 'label',
        labelValue: msgs.get('resource.container.logs', [clusterName])
      })

      clusterDetails.forEach(podDetail => {
        details.push(podDetail)
      })
    }
  })

  return details
}

export const setSubscriptionDeployStatus = (node, details) => {
  if (R.pathOr('', ['type'])(node) !== 'subscription') {
    return details
  }

  const isLocalPlacementSubs = _.get(node, 'specs.raw.spec.placement.local')
  if (isLocalPlacementSubs) {
    details.push({
      labelKey: 'resource.subscription.local',
      value: 'true'
    })
  }

  details.push({
    type: 'spacer'
  })
  details.push({
    type: 'label',
    labelKey: 'resource.deploy.statuses'
  })

  let localSubscriptionFailed = false
  const resourceMap = _.get(node, 'specs.subscriptionModel', {})
  Object.values(resourceMap).forEach(subscription => {
    details.push({
      type: 'spacer'
    })

    const isLocalFailedSubscription =
      subscription._hubClusterResource &&
      R.contains('Fail', R.pathOr('Fail', ['status'])(subscription))
    if (isLocalFailedSubscription) {
      localSubscriptionFailed = true
    }
    if (
      isLocalPlacementSubs ||
      !subscription._hubClusterResource ||
      isLocalFailedSubscription
    ) {
      const subscriptionPulse = R.contains(
        'Fail',
        R.pathOr('', ['status'])(subscription)
      )
        ? 'failure'
        : R.pathOr(null, ['status'])(subscription) === null
          ? 'warning'
          : 'checkmark'

      //if subscription has not status show an error message
      const emptyStatusErrorMsg = subscription._hubClusterResource
        ? msgs.get('resource.subscription.nostatus.hub', ['Propagated'])
        : msgs.get('resource.subscription.nostatus.remote', ['Subscribed'])

      const subscriptionStatus = R.pathOr(emptyStatusErrorMsg, ['status'])(
        subscription
      )
      details.push({
        labelValue: subscription.cluster,
        value: subscriptionStatus,
        status: subscriptionPulse
      }) &&
        details.push({
          type: 'link',
          value: {
            label: msgs.get(specsPropsYaml),
            data: {
              action: showResourceYaml,
              cluster: subscription.cluster,
              selfLink: subscription.selfLink
            }
          },
          indent: true
        })
    }
  })

  //show missing remote placement error only if local subscription is successful and is not local placement
  if (
    Object.keys(resourceMap).length === 1 &&
    !localSubscriptionFailed &&
    !isLocalPlacementSubs
  ) {
    //no remote subscriptions
    details.push({
      labelValue: msgs.get('resource.subscription.remote'),
      value: msgs.get('resource.subscription.placed.error', [node.namespace]),
      status: 'failure'
    })
    const ruleSearchLink = `/multicloud/search?filters={"textsearch":"kind%3Aplacementrule%20namespace%3A${
      node.namespace
    }%20cluster%3Alocal-cluster"}`
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.yaml.rules.ns', [node.namespace]),
        id: `${node.id}-subscrSearch`,
        data: {
          action: 'open_link',
          targetLink: ruleSearchLink
        }
      }
    })
  }

  details.push({
    type: 'spacer'
  })

  return details
}

export const setPlacementRuleDeployStatus = (node, details) => {
  if (R.pathOr('', ['type'])(node) !== 'rules') {
    return details
  }

  const clusterStatus = _.get(node, 'specs.raw.status.decisions', [])
  if (clusterStatus.length === 0) {
    details.push({
      labelValue: msgs.get('resource.rule.clusters.error.label'),
      value: msgs.get('resource.rule.placed.error.msg'),
      status: 'failure'
    })
  }

  return details
}

export const setApplicationDeployStatus = (node, details) => {
  if (node.type !== 'application') {
    return details
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

  //show error if no channel, meaning there is no linked subscription
  if (!_.get(node, 'specs.channels')) {
    const appNS = _.get(node, metadataNamespace, 'NA')

    details.push({
      labelKey: 'resource.rule.clusters.error.label',
      value: msgs.get('resource.application.error.msg', [appNS]),
      status: 'failure'
    })
    const subscrSearchLink = `/multicloud/search?filters={"textsearch":"kind%3Asubscription%20namespace%3A${appNS}%20cluster%3Alocal-cluster"}`
    details.push({
      type: 'link',
      value: {
        label: msgs.get('props.show.yaml.subscr.ns', [appNS]),
        id: `${node.id}-subscrSearch`,
        data: {
          action: 'open_link',
          targetLink: subscrSearchLink
        }
      }
    })
  }

  return details
}

export const addNodeOCPRouteLocationForCluster = (
  node,
  typeObject,
  details
) => {
  const clustersList = R.pathOr([], ['clusters', 'specs', 'clusters'])(node)
  let hostName = R.pathOr(undefined, ['specs', 'raw', 'spec', 'host'])(node)

  if (hostName && typeObject) {
    return details // this info is in the main Location status since we have a spec host
  }

  let hostLink = 'NA'
  const linkId = typeObject
    ? _.get(typeObject, 'id', '0')
    : _.get(node, 'uid', '0')

  if (!typeObject) {
    //this is called from the main details
    if (!hostName) {
      return details //return since there is no global host
    }

    details.push({
      type: 'spacer'
    })

    details.push({
      type: 'label',
      labelKey: specLocation
    })
  }

  if (!hostName && typeObject) {
    //build up the name using <route_name>-<ns>.router.default.svc.cluster.local
    Object.values(clustersList).forEach(clusterObject => {
      if (
        R.pathOr('NA', ['metadata', 'name'])(clusterObject) ===
        _.get(typeObject, 'cluster', '')
      ) {
        const clusterHost = getClusterHost(clusterObject.consoleURL)
        hostName = `${node.name}-${node.namespace}.${clusterHost}`
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
      id: `${linkId}-location`,
      data: {
        action: 'open_link',
        targetLink: hostLink
      }
    },
    indent: true
  })

  !typeObject &&
    details.push({
      type: 'spacer'
    })

  return details
}

//route
export const addOCPRouteLocation = (node, clusterName, details) => {
  if (R.pathOr('', ['specs', 'raw', 'kind'])(node) === 'Route') {
    return addNodeInfoPerCluster(
      node,
      clusterName,
      details,
      addNodeOCPRouteLocationForCluster
    )
  }

  return details //process only routes
}

//ingress
export const addIngressNodeInfo = (node, details) => {
  if (R.pathOr('', ['specs', 'raw', 'kind'])(node) === 'Ingress') {
    details.push({
      type: 'label',
      labelKey: specLocation
    })

    //ingress - single service
    addPropertyToList(
      details,
      getNodePropery(
        node,
        ['specs', 'raw', 'spec', 'backend', 'serviceName'],
        'raw.spec.ingress.service'
      )
    )
    addPropertyToList(
      details,
      getNodePropery(
        node,
        ['specs', 'raw', 'spec', 'backend', 'servicePort'],
        'raw.spec.ingress.service.port'
      )
    )

    const rules = R.pathOr([], ['specs', 'raw', 'spec', 'rules'])(node)
    rules.forEach(ruleInfo => {
      const hostName = R.pathOr('NA', ['host'])(ruleInfo)
      details.push({
        labelKey: 'raw.spec.ingress.host',
        value: hostName
      })
      const paths = R.pathOr([], ['http', 'paths'])(ruleInfo)
      paths.forEach(pathInfo => {
        details.push({
          labelKey: 'raw.spec.ingress.service',
          value: R.pathOr('NA', ['backend', 'serviceName'])(pathInfo)
        })
        details.push({
          labelKey: 'raw.spec.ingress.service.port',
          value: R.pathOr('NA', ['backend', 'servicePort'])(pathInfo)
        })
      })
      details.push({
        type: 'spacer'
      })
    })
  }

  return details //process only routes
}

//for service
export const addNodeServiceLocation = (node, clusterName, details) => {
  if (R.pathOr('', ['specs', 'raw', 'kind'])(node) === 'Service') {
    return addNodeInfoPerCluster(
      node,
      clusterName,
      details,
      addNodeServiceLocationForCluster
    ) //process only services
  }
  return details
}

//generic function to write location info
export const addNodeInfoPerCluster = (
  node,
  clusterName,
  details,
  getDetailsFunction
) => {
  const resourceName = _.get(node, metadataName, '')
  const resourceMap = _.get(node, `specs.${node.type}Model`, {})
  const locationDetails = []
  const typeObject = resourceMap[`${resourceName}-${clusterName}`]

  if (typeObject) {
    getDetailsFunction(node, typeObject, locationDetails)
  }

  locationDetails.forEach(locationDetail => {
    details.push(locationDetail)
  })

  return details
}

export const addNodeServiceLocationForCluster = (node, typeObject, details) => {
  if (node && typeObject && typeObject.clusterIP && typeObject.port) {
    let port = R.split(':', typeObject.port)[0] // take care of 80:etc format
    port = R.split('/', port)[0] //now remove any 80/TCP

    const location = `${typeObject.clusterIP}:${port}`
    details.push({
      labelKey: specLocation,
      value: location
    })
  }

  return details
}

export const processResourceActionLink = resource => {
  let targetLink = ''
  const linkPath = R.pathOr('', ['action'])(resource)
  const { name, namespace, cluster, selfLink, kind } = resource
  const nsData = namespace ? ` namespace:${namespace}` : ''
  switch (linkPath) {
  case 'show_pod_log':
    targetLink = `/multicloud/details/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/logs`
    break
  case showResourceYaml:
    targetLink = `/multicloud/details/${cluster}${selfLink}`
    break
  case 'show_search':
    targetLink = `/multicloud/search?filters={"textsearch":"kind:${kind}${nsData} name:${name}"}`
    break
  default:
    targetLink = R.pathOr('', ['targetLink'])(resource)
  }
  if (targetLink !== '') {
    window.open(targetLink, '_blank')
  }
  return targetLink
}

export const getType = (type, locale) => {
  const nlsType = msgs.get(`resource.${type}`, locale)
  return !nlsType.startsWith('!resource.')
    ? nlsType
    : _.capitalize(_.startCase(type))
}

export const getClusterHost = consoleURL => {
  const ocpIdx = consoleURL
    ? consoleURL.indexOf('https://console-openshift-console.')
    : -1
  if (ocpIdx < 0) {
    return ''
  }
  return consoleURL.substr(ocpIdx + 34)
}

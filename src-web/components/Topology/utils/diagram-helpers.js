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
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import _ from 'lodash'
import moment from 'moment'
import msgs from '../../../../nls/platform.properties'
import { LOCAL_HUB_NAME } from '../../../../lib/shared/constants'
import {
  isDeployableResource,
  nodeMustHavePods,
  getClusterName,
  getRouteNameWithoutIngressHash,
  getActiveFilterCodes,
  filterSubscriptionObject,
  getOnlineClusters,
  getClusterHost,
  getPulseStatusForSubscription,
  getExistingResourceMapKey,
  syncControllerRevisionPodStatusMap,
  fixMissingStateOptions,
  namespaceMatchTargetServer,
  setArgoApplicationDeployStatus,
  getPulseStatusForArgoApp
} from './diagram-helpers-utils'
import { getEditLink } from '../../../../lib/client/resource-helper'

const metadataName = 'specs.raw.metadata.name'
const metadataNamespace = 'specs.raw.metadata.namespace'
const notDeployedStr = msgs.get('spec.deploy.not.deployed')
const notDeployedNSStr = msgs.get('spec.deploy.not.deployed.ns')
const deployedStr = msgs.get('spec.deploy.deployed')
const deployedNSStr = msgs.get('spec.deploy.deployed.ns')
const specPulse = 'specs.pulse'
const specShapeType = 'specs.shapeType'
const specsPropsYaml = 'props.show.yaml'
const showLocalYaml = 'props.show.local.yaml'
const showResourceYaml = 'show_resource_yaml'
const specLocation = 'raw.spec.host.location'
const clusterObjsPath = 'clusters.specs.clusters'
const checkmarkStatus = 'checkmark'
const warningStatus = 'warning'
const pendingStatus = 'pending'
const failureStatus = 'failure'
const checkmarkCode = 3
const warningCode = 2
const pendingCode = 1
const failureCode = 0
//pod state contains any of these strings
const podErrorStates = ['err', 'off', 'invalid', 'kill']
const podWarningStates = [pendingStatus, 'creating']
const podSuccessStates = ['run']
const apiVersionPath = 'specs.raw.apiVersion'

import {
  showAnsibleJobDetails,
  getPulseStatusForAnsibleNode
} from './ansible-task'

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

export const getPulseStatusForCluster = node => {
  const clusters = _.get(node, 'specs.clusters')
  let okCount = 0,
      pendingCount = 0,
      offlineCount = 0

  clusters.forEach(cluster => {
    if (cluster.status === 'ok') {
      okCount++
    } else if (cluster.status === 'pendingimport') {
      pendingCount++
    } else if (cluster.status === 'offline') {
      offlineCount++
    }
  })

  if (offlineCount > 0) {
    return 'red'
  }
  if (pendingCount === clusters.length) {
    return 'orange'
  }
  if (okCount < clusters.length) {
    return 'yellow'
  }

  return 'green'
}

const getPulseStatusForGenericNode = node => {
  //ansible job status
  if (
    _.get(node, 'type', '') === 'ansiblejob' &&
    _.get(node, 'specs.raw.hookType')
  ) {
    // process here only ansible hooks
    return getPulseStatusForAnsibleNode(node)
  }
  let pulse = _.get(node, specPulse, 'green')

  if (pulse === 'red') {
    return pulse //no need to check anything else, return red
  }
  const name = _.get(node, metadataName, '')
  const channel = _.get(node, 'specs.raw.spec.channel', '')
  const resourceName =
    !isDeployableResource(node) && channel.length > 0
      ? `${channel}-${name}`
      : name

  const resourceMap = _.get(node, `specs.${node.type}Model`)
  const clusterNames = R.split(',', getClusterName(node.id))
  const clusterObjs = _.get(node, clusterObjsPath, [])
  const onlineClusters = getOnlineClusters(clusterNames, clusterObjs)
  if (!resourceMap || onlineClusters.length === 0) {
    pulse = 'orange' //resource not available
    return pulse
  }

  if (onlineClusters.length < clusterNames.length) {
    pulse = 'yellow'
    return pulse
  }

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

  if (desired === 'NA' && available === 0) {
    return 'red'
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
  //if desired info is missing use the desired value returned by search
  if (
    (desired === 'NA' || desired === 0 || node.type === 'controllerrevision') &&
    resourceMap &&
    Object.keys(resourceMap).length > 0
  ) {
    desired = resourceMap[Object.keys(resourceMap)[0]].desired
      ? resourceMap[Object.keys(resourceMap)[0]].desired
      : 'NA'
  }

  const resourceName = _.get(node, metadataName, '')
  const clusterNames = R.split(',', getClusterName(node.id))
  const clusterObjs = _.get(node, clusterObjsPath, [])
  const onlineClusters = getOnlineClusters(clusterNames, clusterObjs)

  if (!resourceMap || onlineClusters.length === 0) {
    pulse = 'orange' //resource not available
    return pulse
  }

  //must have pods, set the pods status here
  const podStatusMap = {}
  const podList = _.get(node, 'specs.podModel', {})

  //go through all clusters to make sure all pods are counted, even if they are not deployed there
  clusterNames.forEach(clusterName => {
    clusterName = R.trim(clusterName)
    const resourceItem = fixMissingStateOptions(
      resourceMap[`${resourceName}-${clusterName}`]
    )

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

  if (onlineClusters.length < clusterNames.length) {
    pulse = 'yellow'
  }

  return pulse
}

export const getShapeTypeForSubscription = node => {
  const blocked = _.includes(
    _.get(node, 'specs.raw.status.message', ''),
    'Blocked'
  )
  if (blocked) {
    return 'subscriptionblocked'
  } else {
    return 'subscription'
  }
}

export const computeNodeStatus = node => {
  let pulse = 'green'
  let shapeType = node.type
  let apiVersion

  if (nodeMustHavePods(node)) {
    pulse = getPulseForNodeWithPodStatus(node)
    _.set(node, specPulse, pulse)
    _.set(node, specShapeType, shapeType)
    return pulse
  }

  const isDeployable = isDeployableResource(node)
  switch (node.type) {
  case 'application':
    apiVersion = _.get(node, apiVersionPath)
    if (apiVersion && apiVersion.indexOf('argoproj.io') > -1) {
      pulse = getPulseStatusForArgoApp(node)
    } else {
      if (isDeployable) {
        pulse = getPulseStatusForGenericNode(node)
      } else if (!_.get(node, 'specs.channels')) {
        pulse = 'red'
      }
    }
    break
  case 'placements':
    if (isDeployable) {
      pulse = getPulseStatusForGenericNode(node)
    } else if (!_.get(node, 'specs.raw.status.decisions')) {
      pulse = 'red'
    }
    break
  case 'subscription':
    if (isDeployable) {
      pulse = getPulseStatusForGenericNode(node)
    } else {
      pulse = getPulseStatusForSubscription(node)
      shapeType = getShapeTypeForSubscription(node)
    }
    break
  case 'cluster':
    pulse = getPulseStatusForCluster(node)
    break
  default:
    pulse = getPulseStatusForGenericNode(node)
  }

  _.set(node, specPulse, pulse)
  _.set(node, specShapeType, shapeType)
  return pulse
}

export const createEditLink = node => {
  const kind = _.get(node, 'specs.raw.kind') || _.get(node, 'kind')
  const apigroup = _.get(node, 'apigroup')
  const apiversion = _.get(node, 'apiversion')
  const cluster = _.get(node, 'cluster')
  let apiVersion = _.get(node, apiVersionPath)
  if (!apiVersion) {
    apiVersion =
      apigroup && apiversion ? apigroup + '/' + apiversion : apiversion
  }

  return getEditLink({
    name: _.get(node, 'name'),
    namespace: _.get(node, 'namespace'),
    kind: kind ? kind.toLowerCase() : undefined,
    apiVersion,
    cluster: cluster ? cluster : undefined
  })
}

export const createDeployableYamlLink = (node, details) => {
  //returns yaml for the deployable
  if (
    details &&
    node &&
    R.contains(_.get(node, 'type', ''), [
      'application',
      'placements',
      'subscription'
    ])
  ) {
    const editLink = createEditLink(node)
    editLink &&
      details.push({
        type: 'link',
        value: {
          label: msgs.get(showLocalYaml),
          data: {
            action: showResourceYaml,
            cluster: LOCAL_HUB_NAME,
            editLink: editLink
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
  const { id } = node
  const specs = _.get(node, 'specs', {})
  const { cluster, clusters = [] } = specs
  const clusterArr = cluster ? [cluster] : clusters

  details.push({
    type: 'label',
    labelValue: `Clusters (${clusterArr.length})`
  })

  details.push({
    type: 'clusterdetailcombobox',
    comboboxdata: {
      clusterList: clusterArr,
      clusterID: id
    }
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
          kind:
            nodeType === 'placements'
              ? 'placementrule'
              : _.get(node, 'type', '')
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
  const labelMap = {}
  let foundReleaseLabel = false
  labels.forEach(label => {
    const splitLabelContent = _.split(label, '=')

    if (splitLabelContent.length === 2) {
      const splitLabelTrimmed = _.trim(splitLabelContent[0])
      labelMap[splitLabelTrimmed] = splitLabelContent[1]
      if (splitLabelTrimmed === 'release') {
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

  if (
    !foundReleaseLabel &&
    kind !== 'helmrelease' &&
    labelMap['app.kubernetes.io/name']
  ) {
    name = labelMap['app.kubernetes.io/name']
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
      if (
        labelKey === 'pod-template-hash' ||
        labelKey === 'controller-revision-hash' ||
        labelKey === 'controller.kubernetes.io/hash'
      ) {
        podHash = values[1].trim()
        if (podHash.indexOf('-') > -1) {
          // for hashes that include prefix, always take last section
          const hashValues = R.split('-')(podHash)
          podHash = hashValues[hashValues.length - 1]
        }
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
  //return podHash as well, it will be used to map pods with parent resource
  return { nameNoHash, deployableName, podHash }
}

//add deployed object to the matching resource in the map
const addResourceToModel = (
  resourceMapObject,
  kind,
  relatedKind,
  nameWithoutChartRelease
) => {
  const kindModel = _.get(resourceMapObject, `specs.${kind}Model`, {})
  kindModel[`${nameWithoutChartRelease}-${relatedKind.cluster}`] = relatedKind
  _.set(resourceMapObject, `specs.${kind}Model`, kindModel)
}

// reduce complexity for code smell
export const checkNotOrObjects = (obj1, obj2) => {
  return !obj1 || !obj2
}

// reduce complexity for code smell
export const checkAndObjects = (obj1, obj2) => {
  return obj1 && obj2
}

//creates a map with all related kinds for this app, not only pod types
export const setupResourceModel = (
  list,
  resourceMap,
  isClusterGrouped,
  isHelmRelease
) => {
  if (checkNotOrObjects(list, resourceMap)) {
    return resourceMap
  }
  const podIndex = _.findIndex(list, ['kind', 'pod'])
  //move pods last in the list to be processed after all resources producing pods have been processed
  //we want to add the pods to the map by using the pod hash
  let orderedList =
    podIndex === -1
      ? list
      : _.concat(
        _.slice(list, 0, podIndex),
        _.slice(list, podIndex + 1),
        list[podIndex]
      )
  orderedList = _.pullAllBy(
    orderedList,
    [{ kind: 'deployable' }, { kind: 'cluster' }],
    'kind'
  )
  orderedList.forEach(kindArray => {
    const relatedKindList = R.pathOr([], ['items'])(kindArray)
    relatedKindList.forEach(relatedKind => {
      const kind = relatedKind.kind

      //look for pod template hash and remove it from the name if there
      const { nameNoHash, deployableName, podHash } = getNameWithoutPodHash(
        relatedKind
      )

      //for routes generated by Ingress, remove route name hash
      const nameNoHashIngressPod = getRouteNameWithoutIngressHash(
        relatedKind,
        nameNoHash
      )

      const nameWithoutChartRelease = getNameWithoutChartRelease(
        relatedKind,
        nameNoHashIngressPod,
        isHelmRelease
      )

      let name = computeResourceName(
        relatedKind,
        deployableName,
        nameWithoutChartRelease,
        isClusterGrouped
      )

      if (
        kind === 'subscription' &&
        _.get(relatedKind, 'cluster', '') === LOCAL_HUB_NAME &&
        _.get(relatedKind, 'localPlacement', '') === 'true' &&
        _.endsWith(name, '-local')
      ) {
        //match local hub subscription after removing -local suffix
        name = _.trimEnd(name, '-local')
      }

      const existingResourceMapKey = getExistingResourceMapKey(
        resourceMap,
        name,
        relatedKind
      )
      if (checkAndObjects(podHash, existingResourceMapKey)) {
        //update resource map key with podHash if the resource has a pod hash ( deployment, replicaset, deploymentconig, etc )
        //this is going to be used to link pods with this parent resource
        resourceMap[`pod-${podHash}`] = resourceMap[existingResourceMapKey]
      } else if (checkAndObjects(deployableName, existingResourceMapKey)) {
        resourceMap[`pod-deploymentconfig-${deployableName}`] =
          resourceMap[existingResourceMapKey]
      }

      let resourceMapForObject = resourceMap[name]
      if (!resourceMapForObject && kind === 'pod' && podHash) {
        //just found a pod object, try to map it to the parent resource using the podHash
        resourceMapForObject = resourceMap[`pod-${podHash}`]
      } else if (!resourceMapForObject && kind === 'pod' && deployableName) {
        resourceMapForObject =
          resourceMap[`pod-deploymentconfig-${deployableName}`]
      }

      if (resourceMapForObject) {
        addResourceToModel(
          resourceMapForObject,
          kind,
          relatedKind,
          nameWithoutChartRelease
        )
      } else {
        //get resource by looking at the cluster grouping
        Object.keys(resourceMap).forEach(key => {
          resourceMapForObject = resourceMap[key]
          if (
            _.startsWith(key, name) &&
            (_.includes(
              _.get(
                resourceMapForObject,
                'clusters.specs.sortedClusterNames',
                [LOCAL_HUB_NAME] // if no cluster found for this resource, this could be a local deployment
              ),
              _.get(relatedKind, 'cluster')
            ) ||
              namespaceMatchTargetServer(relatedKind, resourceMapForObject))
          ) {
            addResourceToModel(
              resourceMapForObject,
              kind,
              relatedKind,
              nameWithoutChartRelease
            )
          }
        })
      }
    })
  })

  // need to preprocess and sync up podStatusMap for controllerrevision to parent
  syncControllerRevisionPodStatusMap(resourceMap)
  return resourceMap
}

//show resource deployed status on the remote clusters
//for resources not producing pods
export const setResourceDeployStatus = (node, details, activeFilters) => {
  const isDeployable = isDeployableResource(node)
  const { resourceStatuses = new Set() } = activeFilters
  const activeFilterCodes = getActiveFilterCodes(resourceStatuses)
  if (
    nodeMustHavePods(node) ||
    node.type === 'package' ||
    (!isDeployable &&
      R.contains(node.type, [
        'application',
        'placements',
        'cluster',
        'subscription'
      ]))
  ) {
    //resource with pods info is processed separately
    //ignore packages or any resources from the above list not defined as a deployable
    return details
  }
  const name = _.get(node, metadataName, '')
  const channel = _.get(node, 'specs.raw.spec.channel', '')
  const resourceName =
    !isDeployable && channel.length > 0 ? `${channel}-${name}` : name

  const clusterNames = R.split(',', getClusterName(node.id))
  const resourceMap = _.get(node, `specs.${node.type}Model`, {})
  const clusterObjs = _.get(node, clusterObjsPath, [])
  const onlineClusters = getOnlineClusters(clusterNames, clusterObjs)

  if (
    _.get(node, 'type', '') === 'ansiblejob' &&
    _.get(node, 'specs.raw.hookType')
  ) {
    // process here only ansible hooks
    showAnsibleJobDetails(node, details)

    if (!_.get(node, 'specs.raw.spec')) {
      return details // no other status info so return here
    }
  } else {
    details.push({
      type: 'spacer'
    })
    details.push({
      type: 'label',
      labelKey: 'resource.deploy.statuses'
    })
  }

  onlineClusters.forEach(clusterName => {
    details.push({
      type: 'spacer'
    })
    clusterName = R.trim(clusterName)
    let res = resourceMap[`${resourceName}-${clusterName}`]

    if (
      _.get(node, 'type', '') !== 'ansiblejob' ||
      !_.get(node, 'specs.raw.hookType')
    ) {
      // process here only regular ansible tasks
      const deployedKey = res
        ? node.type === 'namespace' ? deployedNSStr : deployedStr
        : node.type === 'namespace' ? notDeployedNSStr : notDeployedStr
      const statusStr =
        deployedKey === deployedStr || deployedKey === deployedNSStr
          ? checkmarkStatus
          : pendingStatus

      let addItemToDetails = false
      if (resourceStatuses.size > 0) {
        if (
          (statusStr === checkmarkStatus &&
            activeFilterCodes.has(checkmarkCode)) ||
          (statusStr === pendingStatus &&
            (activeFilterCodes.has(pendingCode) ||
              activeFilterCodes.has(warningCode)))
        ) {
          addItemToDetails = true
        }
      } else {
        addItemToDetails = true
      }

      if (addItemToDetails) {
        details.push({
          labelValue: clusterName,
          value: deployedKey,
          status: statusStr
        })
      } else {
        res = null
      }
    }

    if (res) {
      //for open shift routes show location info
      addOCPRouteLocation(node, clusterName, details)

      //for service
      addNodeServiceLocation(node, clusterName, details)

      // add apiversion if not exist
      if (!res.apiversion) {
        _.assign(res, { apiversion: _.get(node, apiVersionPath) })
      }

      details.push({
        type: 'link',
        value: {
          label: msgs.get(specsPropsYaml),
          data: {
            action: showResourceYaml,
            cluster: res.cluster,
            editLink: createEditLink(res)
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
export const setPodDeployStatus = (
  node,
  updatedNode,
  details,
  activeFilters
) => {
  const { resourceStatuses = new Set() } = activeFilters
  const activeFilterCodes = getActiveFilterCodes(resourceStatuses)

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
  const podStatusModel = _.get(updatedNode, 'podStatusMap', {})
  const podDataPerCluster = {} //pod details list for each cluster name

  const clusterNames = R.split(',', getClusterName(node.id))
  const clusterObjs = _.get(node, clusterObjsPath, [])
  const onlineClusters = getOnlineClusters(clusterNames, clusterObjs)

  onlineClusters.forEach(clusterName => {
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
      statusStr = failureStatus
      break
    case 'yellow':
      statusStr = warningStatus
      break
    case 'orange':
      statusStr = pendingStatus
      break
    default:
      statusStr = checkmarkStatus
      break
    }

    let addItemToDetails = false
    if (resourceStatuses.size > 0) {
      const pendingOrWanrning =
        statusStr === pendingStatus || statusStr === warningStatus
      if (
        (statusStr === checkmarkStatus &&
          activeFilterCodes.has(checkmarkCode)) ||
        (statusStr === warningStatus && activeFilterCodes.has(warningCode)) ||
        (pendingOrWanrning && activeFilterCodes.has(pendingCode)) ||
        (statusStr === failureStatus && activeFilterCodes.has(failureCode))
      ) {
        addItemToDetails = true
      }
    } else {
      addItemToDetails = true
    }

    if (addItemToDetails) {
      details.push({
        labelValue: clusterName,
        value: valueStr,
        status: statusStr
      })
    }

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
        ? failureStatus
        : podWarning ? warningStatus : checkmarkStatus

      let addPodDetails = false
      if (resourceStatuses.size > 0) {
        if (
          (statusStr === failureStatus && activeFilterCodes.has(failureCode)) ||
          (statusStr === warningStatus && activeFilterCodes.has(warningCode)) ||
          (statusStr === checkmarkStatus &&
            activeFilterCodes.has(checkmarkCode))
        ) {
          addPodDetails = true
        }
      } else {
        addPodDetails = true
      }

      if (addPodDetails) {
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
              editLink: createEditLink(pod)
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

const setClusterWindowStatus = (windowStatusArray, subscription, details) => {
  windowStatusArray.forEach(wstatus => {
    if (_.startsWith(_.trimStart(wstatus), `${subscription.cluster}:`)) {
      details.push({
        labelKey: 'spec.subscr.timeWindow',
        value: _.split(wstatus, ':')[1]
      })
    }
  })
}

export const setSubscriptionDeployStatus = (node, details, activeFilters) => {
  const { resourceStatuses = new Set() } = activeFilters
  const activeFilterCodes = getActiveFilterCodes(resourceStatuses)
  //check if this is a subscription created from the app deployable
  if (
    R.pathOr('', ['type'])(node) !== 'subscription' ||
    isDeployableResource(node)
  ) {
    return details //ignore subscriptions defined from deployables or any other types
  }
  const timeWindow = _.get(node, 'specs.raw.spec.timewindow.windowtype')
  const timezone = _.get(node, 'specs.raw.spec.timewindow.location', 'NA')
  const timeWindowDays = _.get(node, 'specs.raw.spec.timewindow.daysofweek')
  const timeWindowHours = _.get(node, 'specs.raw.spec.timewindow.hours', [])

  let windowStatusArray = []

  if (timeWindow) {
    windowStatusArray = _.split(
      _.get(node, 'specs.raw.status.message', ''),
      ','
    )

    details.push({
      type: 'label',
      labelKey: 'spec.subscr.timeWindow.title'
    })
    details.push({
      labelKey: 'spec.subscr.timeWindow.type',
      value: timeWindow
    })
    timeWindowDays &&
      details.push({
        labelKey: 'spec.subscr.timeWindow.days',
        value: R.toString(timeWindowDays)
      })

    if (timeWindowHours) {
      timeWindowHours.forEach(timeH => {
        details.push({
          labelKey: 'spec.subscr.timeWindow.hours',
          value: `${_.get(timeH, 'start', 'NA')}-${_.get(timeH, 'end', 'NA')}`
        })
      })
    }
    details.push({
      labelKey: 'spec.subscr.timeWindow.timezone',
      value: timezone
    })
  }

  const isLocalPlacementSubs = _.get(node, 'specs.raw.spec.placement.local')
  if (isLocalPlacementSubs) {
    details.push({
      type: 'spacer'
    })
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
  let resourceMap = _.get(node, 'specs.subscriptionModel', {})
  const filteredResourceMap = filterSubscriptionObject(
    resourceMap,
    activeFilterCodes
  )

  if (resourceStatuses.size > 0) {
    resourceMap = filteredResourceMap
  }
  Object.values(resourceMap).forEach(subscription => {
    const isLocalFailedSubscription =
      subscription._hubClusterResource &&
      R.contains('Fail', R.pathOr('Fail', ['status'])(subscription))
    if (isLocalFailedSubscription) {
      localSubscriptionFailed = true
    }
    const isLinkedLocalPlacementSubs =
      isLocalPlacementSubs ||
      (_.get(subscription, 'localPlacement', '') === 'true' &&
        _.get(subscription, 'cluster', '') === LOCAL_HUB_NAME)
    if (
      isLinkedLocalPlacementSubs ||
      !subscription._hubClusterResource ||
      isLocalFailedSubscription
    ) {
      const subscriptionPulse = R.contains(
        'Fail',
        R.pathOr('', ['status'])(subscription)
      )
        ? failureStatus
        : R.pathOr(null, ['status'])(subscription) === null
          ? warningStatus
          : checkmarkStatus

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
      })
      !isLocalPlacementSubs &&
        isLinkedLocalPlacementSubs &&
        details.push({
          labelKey: 'resource.subscription.local',
          value: 'true'
        })

      setClusterWindowStatus(windowStatusArray, subscription, details)

      details.push({
        type: 'link',
        value: {
          label: msgs.get(specsPropsYaml),
          data: {
            action: showResourceYaml,
            cluster: subscription.cluster,
            editLink: createEditLink(subscription)
          }
        },
        indent: true
      })
    }

    details.push({
      type: 'spacer'
    })
  })

  //show missing remote placement error only if local subscription is successful and is not local placement
  if (
    Object.keys(resourceMap).length === 0 &&
    !localSubscriptionFailed &&
    !isLocalPlacementSubs &&
    resourceStatuses.size === 0
  ) {
    //no remote subscriptions
    details.push({
      labelValue: msgs.get('resource.subscription.remote'),
      value: msgs.get('resource.subscription.placed.error', [node.namespace]),
      status: failureStatus
    })
    const ruleSearchLink = `/search?filters={"textsearch":"kind%3Aplacementrule%20namespace%3A${
      node.namespace
    }%20cluster%3A${LOCAL_HUB_NAME}"}`
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
  if (R.pathOr('', ['type'])(node) !== 'placements') {
    return details
  }

  const clusterStatus = _.get(node, 'specs.raw.status.decisions', [])
  if (clusterStatus.length === 0) {
    details.push({
      labelValue: msgs.get('resource.rule.clusters.error.label'),
      value: msgs.get('resource.rule.placed.error.msg'),
      status: failureStatus
    })
  }

  return details
}

export const setApplicationDeployStatus = (node, details) => {
  if (node.type !== 'application') {
    return details
  }

  const apiVersion = _.get(node, apiVersionPath)
  if (apiVersion && apiVersion.indexOf('argoproj.io') > -1) {
    setArgoApplicationDeployStatus(node, details)
  } else {
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
    if (!isDeployableResource(node) && !_.get(node, 'specs.channels')) {
      const appNS = _.get(node, metadataNamespace, 'NA')

      details.push({
        labelKey: 'resource.rule.clusters.error.label',
        value: msgs.get('resource.application.error.msg', [appNS]),
        status: failureStatus
      })
      const subscrSearchLink = `/search?filters={"textsearch":"kind%3Asubscription%20namespace%3A${appNS}%20cluster%3A${LOCAL_HUB_NAME}"}`
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
  }

  return details
}

export const addNodeOCPRouteLocationForCluster = (
  node,
  typeObject,
  details
) => {
  const rules = R.pathOr([], ['specs', 'raw', 'spec', 'rules'])(node)
  if (rules.length > 1) {
    //we don't know how to process more then one hosts if the Ingress generates more than one route
    return details
  }

  const clustersList = R.pathOr([], ['clusters', 'specs', 'clusters'])(node)
  let hostName = R.pathOr(undefined, ['specs', 'raw', 'spec', 'host'])(node)

  if (typeObject && _.get(node, 'name', '') !== _.get(typeObject, 'name', '')) {
    //if route name on remote cluster doesn't match the main route name ( generated from Ingress ), show the name here
    //this is to cover the scenario when the Ingress object defines multiple routes,
    //so it generates multiple Route objects on the same cluster
    addPropertyToList(
      details,
      getNodePropery(typeObject, ['name'], 'spec.route.cluster.name')
    )
  }

  if (!hostName && rules.length === 1) {
    //check rules path, for route generated by Ingress
    hostName = _.get(rules[0], 'host')
  }

  if (clustersList.length === 0 && !hostName) {
    // this is a local app deploy, check hostname in ingress
    const ingress = R.pathOr([], ['specs', 'raw', 'spec', 'ingress'])(node)
    if (ingress.length > 0) {
      hostName = ingress[0].host
    }
  }

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

  //argo app doesn't have spec info
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
  const { name, namespace, editLink, kind } = resource
  const nsData = namespace ? ` namespace:${namespace}` : ''
  switch (linkPath) {
  case showResourceYaml:
    targetLink = editLink
    break
  case 'show_search':
    targetLink = `/search?filters={"textsearch":"kind:${kind}${nsData} name:${name}"}`
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

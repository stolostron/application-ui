/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import msgs from '../../../../../nls/platform.properties'
import _ from 'lodash'

export const getNodeTooltips = (searchUrl, node, locale) => {
  const tooltips = []
  const { name, namespace, type, layout = {} } = node
  const { hasPods, pods } = layout
  if (type === 'pod') {
    addPodTooltips(node, tooltips, searchUrl, locale)
  } else if (type === 'package') {
    return []
  } else {
    let kind = undefined
    switch (type) {
    case 'persistent_volume':
      kind = 'persistentvolume'
      break
    case 'persistent_volume_claim':
      kind = 'persistentvolumeclaim'
      break
    case 'rules':
      kind = 'placementrule'
      break
    default:
      kind = type
      break
    }
    var href
    if (searchUrl && kind) {
      if (kind === 'cluster' && name.includes(',')) {
        const clusterList = name.replace(/\s/g, '')
        href = `${searchUrl}?filters={"textsearch":"kind:${kind} name:${clusterList}"}`
      } else {
        const searchName = kind === 'helmrelease' ? name : `name:${name}`
        const searchNS = namespace ? `namespace:${namespace}` : ''
        href = namespace
          ? `${searchUrl}?filters={"textsearch":"kind:${kind} ${searchName} ${searchNS}"}`
          : `${searchUrl}?filters={"textsearch":"kind:${kind} ${searchName}"}`
      }
    }
    tooltips.push({ name: getType(type, locale), value: name, href })
    if (hasPods) {
      pods.forEach(pod => {
        addPodTooltips(pod, tooltips, searchUrl, locale)
      })
    }
  }
  if (type === 'cluster') {
    const label = msgs.get('tooltips.console', locale)
    const clusters = _.get(node, 'specs.clusters')
    if (clusters) {
      clusters.forEach(n => {
        if (n.consoleURL) {
          const href = n.consoleURL
          tooltips.push({
            name: label,
            value: `${n.metadata.name}-console`,
            href
          })
        }
      })
    } else {
      const href = _.get(node, 'specs.cluster.consoleURL')
      tooltips.push({ name: label, value: `${name}-console`, href })
    }
  }
  if (namespace) {
    const href = `${searchUrl}?filters={"textsearch":"kind:namespace name:${namespace}"}`
    tooltips.push({
      name: msgs.get('resource.namespace', locale),
      value: namespace,
      href
    })
  }
  return tooltips
}

function addPodTooltips(pod, tooltips, searchUrl, locale) {
  const { name } = pod
  const href = searchUrl
    ? `${searchUrl}?filters={"textsearch":"kind:deployment name:${name}"}&showrelated=pod`
    : null
  tooltips.push({ name: getType('pod', locale), value: name, href })
}

function getType(type, locale) {
  const nlsType = msgs.get(`resource.${type}`, locale)
  return !nlsType.startsWith('!resource.')
    ? nlsType
    : _.capitalize(_.startCase(type))
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import R from 'ramda'
import msgs from '../../../../../nls/platform.properties'
import _ from 'lodash'

export const getNodeTooltips = (searchUrl, node, locale) => {
  const tooltips = []
  const { name, namespace, type } = node

  if (!searchUrl || !type || type === '' || type === 'package') {
    return []
  }

  let kind = R.replace(/_/g, '')(type) //remove globally _ occurences
  if (kind === 'rules') {
    kind = 'placementrule'
  }

  if (kind === 'cluster') {
    addClustersTooltip(node, searchUrl, name, tooltips, locale)
  } else {
    const pulse = _.get(node, 'specs.pulse', '')
    if (pulse === 'orange') {
      //not created, don't set the href to search page
      tooltips.push({ name: getType(type, locale), value: name })
    } else {
      let href = ''
      const searchName = kind === 'helmrelease' ? name : `name:${name}`
      href = namespace
        ? `${searchUrl}?filters={"textsearch":"kind:${kind} ${searchName} namespace:${namespace}"}`
        : `${searchUrl}?filters={"textsearch":"kind:${kind} ${searchName}"}`

      tooltips.push({ name: getType(type, locale), value: name, href })
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

const addClustersTooltip = (node, searchUrl, name, tooltips, locale) => {
  const kind = 'cluster'
  let href = `${searchUrl}?filters={"textsearch":"kind:${kind} name:${name}"}`
  if (name.includes(',')) {
    const clusterList = name.replace(/\s/g, '')
    href = `${searchUrl}?filters={"textsearch":"kind:${kind} name:${clusterList}"}`
  }

  tooltips.push({ name: getType(kind, locale), value: name, href })

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

const getType = (type, locale) => {
  const nlsType = msgs.get(`resource.${type}`, locale)
  return !nlsType.startsWith('!resource.')
    ? nlsType
    : _.capitalize(_.startCase(type))
}

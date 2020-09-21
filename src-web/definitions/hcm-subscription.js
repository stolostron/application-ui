/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import React from 'react'
import R from 'ramda'
import { validator } from './validators/hcm-subscription-validator'
import {
  getAge,
  getClusterCount,
  getSearchLink
} from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createSubscriptionLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.channel',
      resourceKey: 'channel',
      transformFunction: createChannelLink,
      tooltipKey: 'table.header.subscriptions.channel.tooltip'
    },
    {
      msgKey: 'table.header.applications',
      resourceKey: 'appCount',
      transformFunction: createApplicationsLink,
      tooltipKey: 'table.header.subscriptions.applications.tooltip'
    },
    {
      msgKey: 'table.header.clusters',
      tooltipKey: 'table.header.subscriptions.clusters.tooltip',
      resourceKey: 'clusterCount',
      transformFunction: createClustersLink
    },
    {
      msgKey: 'table.header.timeWindow',
      tooltipKey: 'table.header.subscriptions.timeWindow.tooltip',
      resourceKey: 'timeWindow',
      transformFunction: getTimeWindow
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
  ],
  tableActions: [
    {
      key: 'table.actions.subscriptions.edit',
      link: {
        url: item => `/multicloud/details/local-cluster/${item.selfLink}`
      }
    },
    {
      key: 'table.actions.subscriptions.remove',
      modal: true,
      delete: true
    }
  ]
}

export function createSubscriptionLink(item) {
  return item.name
}

export function createChannelLink(item) {
  if (item.channel) {
    const [namespace, name] = item.channel.split('/')
    const channelLink = getSearchLink({
      properties: {
        name,
        namespace,
        kind: 'channel',
        apigroup: 'apps.open-cluster-management.io'
      }
    })
    return <a href={channelLink}>{name}</a>
  }
  return '-'
}

export function createApplicationsLink(item) {
  if (item.appCount) {
    const channelLink = getSearchLink({
      properties: {
        name: item.name,
        namespace: item.namespace,
        kind: 'subscription',
        apigroup: 'apps.open-cluster-management.io'
      },
      showRelated: 'cluster'
    })
    return <a href={channelLink}>{item.appCount}</a>
  }
  return item.appCount === 0 ? item.appCount : '-'
}

export function createClustersLink(item, locale) {
  const clusterCount = R.path(['clusterCount'], item) || 0
  const localPlacement = R.path(['localPlacement'], item) || false
  return getClusterCount({
    locale,
    remoteCount: clusterCount,
    localPlacement,
    name: item.name,
    namespace: item.namespace,
    kind: 'subscription'
  })
}

export function getTimeWindow(item = {}, locale = '') {
  const timeWindow = R.path(['timeWindow'], item)
  return ['active', 'blocked'].includes(timeWindow)
    ? msgs.get(`table.cell.timeWindow.${timeWindow}`, locale)
    : ''
}

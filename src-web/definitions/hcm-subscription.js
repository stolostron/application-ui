/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import React from 'react'
import R from 'ramda'
import {
  createEditLink,
  getAge,
  getClusterCount,
  getClusterCountString,
  getEditLink,
  getSearchLink
} from '../../lib/client/resource-helper'
import {
  isSearchAvailable,
  isYAMLEditAvailable
} from '../../lib/client/search-helper'
import { cellWidth } from '@patternfly/react-table'
import msgs from '../../nls/platform.properties'

const apigroup = 'apps.open-cluster-management.io'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  pluralKey: 'table.plural.subscription',
  emptyTitle: getEmptyTitle,
  emptyMessage: getEmptyMessage,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createEditLink,
      transforms: [cellWidth(20)]
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
      transforms: [cellWidth(20)]
    },
    {
      msgKey: 'table.header.channel',
      resourceKey: 'channel',
      transformFunction: createChannelLink,
      tooltipKey: 'table.header.subscriptions.channel.tooltip',
      transforms: [cellWidth(20)],
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.applications',
      resourceKey: 'appCount',
      transformFunction: createApplicationsLink,
      tooltipKey: 'table.header.subscriptions.applications.tooltip',
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.clusters',
      tooltipKey: 'table.header.subscriptions.clusters.tooltip',
      resourceKey: 'clusterCount',
      transformFunction: createClustersLink,
      textFunction: createClustersText,
      disabled: () => !isSearchAvailable()
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
  tableActionsResolver: tableActionsResolver
}

function tableActionsResolver() {
  const actions = []
  if (isYAMLEditAvailable()) {
    actions.push({
      key: 'table.actions.subscriptions.edit',
      link: {
        url: getEditLink
      }
    })
  }
  if (isSearchAvailable()) {
    actions.push({
      key: 'table.actions.subscriptions.search',
      link: {
        url: item =>
          getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              kind: 'subscription',
              apigroup
            }
          })
      }
    })
  }
  actions.push({
    key: 'table.actions.subscriptions.remove',
    modal: true,
    delete: true
  })
  return actions
}

function createChannelLink(item) {
  if (item.channel) {
    const [namespace, name] = item.channel.split('/')
    const channelLink = getSearchLink({
      properties: {
        name,
        namespace,
        kind: 'channel',
        apigroup
      }
    })
    return <a href={channelLink}>{name}</a>
  }
  return '-'
}

function createApplicationsLink(item) {
  if (item.appCount) {
    const channelLink = getSearchLink({
      properties: {
        name: item.name,
        namespace: item.namespace,
        kind: 'subscription',
        apigroup
      },
      showRelated: 'application'
    })
    return <a href={channelLink}>{item.appCount}</a>
  }
  return item.appCount === 0 ? item.appCount : '-'
}

export function getClusterCounts(item) {
  const clusterCount = R.path(['clusterCount'], item) || {}
  const localPlacement = R.path(['localPlacement'], item) || false
  return {
    remoteCount: clusterCount.remoteCount,
    localPlacement: localPlacement || clusterCount.localCount
  }
}

function createClustersLink(item, locale) {
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCount({
    locale,
    remoteCount,
    localPlacement,
    name: item.name,
    namespace: item.namespace,
    kind: 'subscription'
  })
}

export function createClustersText(item = {}, locale = '') {
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCountString(locale, remoteCount, localPlacement)
}

function getTimeWindow(item = {}, locale = '') {
  const timeWindow = R.path(['timeWindow'], item)
  return ['active', 'blocked'].includes(timeWindow)
    ? msgs.get(`table.cell.timeWindow.${timeWindow}`, locale)
    : ''
}

function getEmptyTitle(locale = '') {
  return msgs.get('no-resource.subscription.title', locale)
}

export function getEmptyMessage(locale = '') {
  return <p>{msgs.get('no-resource.documentation.message', locale)}</p>
}

/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import R from 'ramda'
import React from 'react'
import {
  getAge,
  getClusterCount,
  getClusterCountString,
  getSearchLink,
  groupByChannelType,
  getChannelLabel,
  CHANNEL_TYPES
} from '../../lib/client/resource-helper'
import { cellWidth } from '@patternfly/react-table'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import ChannelLabels from '../components/common/ChannelLabels'
import { Label, Split, SplitItem } from '@patternfly/react-core'

export default {
  defaultSortField: 'name',
  uriKey: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  pluralKey: 'table.plural.application',
  emptyTitle: getEmptyTitle,
  emptyMessage: getEmptyMessage,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createApplicationLink,
      transforms: [cellWidth(20)]
    },
    {
      msgKey: 'table.header.namespace',
      tooltipKey: 'table.header.application.namespace.tooltip',
      resourceKey: 'namespace',
      transforms: [cellWidth(20)],
      transformFunction: createNamespaceText,
      textFunction: createNamespaceText
    },
    {
      msgKey: 'table.header.clusters',
      tooltipKey: 'table.header.application.clusters.tooltip',
      resourceKey: 'clusterCount',
      transformFunction: createClustersLink,
      textFunction: createClustersText
    },
    {
      msgKey: 'table.header.resource',
      tooltipKey: 'table.header.application.resource.tooltip',
      resourceKey: 'hubChannels',
      transformFunction: createChannels,
      textFunction: createChannelsText
    },
    {
      msgKey: 'table.header.timeWindow',
      tooltipKey: 'table.header.application.timeWindow.tooltip',
      resourceKey: 'hubSubscriptions',
      transformFunction: getTimeWindow,
      textFunction: getTimeWindow
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
  ],
  tableActions: [
    {
      key: 'table.actions.applications.view',
      link: {
        url: item => getApplicationLink(item)
      }
    },
    {
      key: 'table.actions.applications.edit',
      link: {
        url: item => getApplicationLink(item, true),
        state: { cancelBack: true }
      }
    },
    {
      key: 'table.actions.applications.search',
      link: {
        url: item => {
          const [apigroup, apiversion] = item.apiVersion.split('/')
          return getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              cluster: item.cluster,
              kind: item.kind,
              apigroup,
              apiversion
            }
          })
        }
      }
    },
    {
      key: 'table.actions.applications.remove',
      modal: true,
      delete: true
    }
  ]
}

function getApplicationLink(item = {}, edit = false) {
  const { name, namespace = 'default' } = item
  const params = queryString.stringify({
    apiVersion: item.apiVersion,
    cluster: item.cluster === 'local-cluster' ? undefined : item.cluster
  })
  return `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}${edit ? '/edit' : ''}?${params}`
}

export function createApplicationLink(item = {}) {
  const { name } = item
  return (
    <Split hasGutter style={{ alignItems: 'baseline' }}>
      <SplitItem align="baseline">
        <Link to={getApplicationLink(item)}>{name}</Link>
      </SplitItem>
      {isArgoApp(item) && (
        <SplitItem>
          <Label color="blue">Argo CD</Label>
        </SplitItem>
      )}
    </Split>
  )
}

function getClusterCounts(item) {
  const clusterCount = R.path(['clusterCount'], item) || {}
  const localPlacement = (R.path(['hubSubscriptions'], item) || []).some(
    sub => sub.localPlacement
  )
  return {
    remoteCount: clusterCount.remoteCount,
    localPlacement: localPlacement || clusterCount.localCount
  }
}

function createClustersLink(item = {}, locale = '') {
  if (isArgoApp(item)) {
    return item.destinationCluster ? (
      <a
        className="cluster-count-link"
        href={getSearchLink({
          properties: {
            name: item.destinationCluster,
            kind: 'cluster'
          }
        })}
      >
        {item.destinationCluster}
      </a>
    ) : (
      msgs.get('cluster.name.unknown', locale)
    )
  }
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCount({
    locale,
    remoteCount,
    localPlacement,
    name: item.name,
    namespace: item.namespace,
    kind: 'application',
    apigroup: 'app.k8s.io'
  })
}

function createClustersText(item = {}, locale = '') {
  if (isArgoApp(item)) {
    return item.destinationCluster || msgs.get('cluster.name.unknown', locale)
  }
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCountString(locale, remoteCount, localPlacement)
}

function createNamespaceText(item = {}) {
  return isArgoApp(item) ? item.destinationNamespace : item.namespace
}

function isArgoApp(item = {}) {
  return item.apiVersion && item.apiVersion.includes('argoproj.io')
}

function getChannels(item = {}) {
  if (isArgoApp(item)) {
    return [
      {
        type: item.chart ? 'helmrepo' : 'git',
        pathname: item.repoURL,
        gitPath: item.path,
        chart: item.chart,
        targetRevision: item.targetRevision
      }
    ]
  }
  return (R.path(['hubChannels'], item) || []).map(ch => ({
    type: ch['ch.type'],
    pathname: ch['ch.pathname'],
    gitBranch: ch['sub._gitbranch'],
    gitPath: ch['sub._gitpath'],
    package: ch['sub.package'],
    packageFilterVersion: ch['sub.packageFilterVersion']
  }))
}

function createChannels(item = {}, locale = '') {
  const channels = getChannels(item)
  return (
    <ChannelLabels
      channels={channels}
      locale={locale}
      isArgoApp={isArgoApp(item)}
    />
  )
}

function createChannelsText(item = {}, locale = '') {
  const channels = getChannels(item).map(ch => ({
    type: ch['ch.type']
  }))
  const channelMap = groupByChannelType(channels || [])
  return CHANNEL_TYPES.filter(chType => channelMap[chType])
    .map(chType => getChannelLabel(chType, channelMap[chType].length, locale))
    .join(' ')
}

function getTimeWindow(item = {}, locale = '') {
  // Check for 'active' or 'blocked' subscription, ignoring 'none'
  return (R.path(['hubSubscriptions'], item) || []).some(sub =>
    ['active', 'blocked'].includes(sub.timeWindow)
  )
    ? msgs.get('table.cell.timeWindow.yes', locale)
    : ''
}

function getEmptyTitle(locale = '') {
  return msgs.get('no-resource.application.title', locale)
}

function getEmptyMessage(locale = '') {
  const buttonName = msgs.get('actions.create.application', locale)
  const buttonText = `<span class="emptyStateButtonReference">${buttonName}</span>`
  const message = msgs.get(
    'no-resource.application.message',
    [buttonText],
    locale
  )
  return (
    <p>
      <span dangerouslySetInnerHTML={{ __html: message }} />
      <br />
      {msgs.get('no-resource.documentation.message', locale)}
    </p>
  )
}

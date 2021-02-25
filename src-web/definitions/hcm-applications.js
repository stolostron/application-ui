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
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import ChannelLabels from '../components/common/ChannelLabels'

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
      resourceKey: 'namespace',
      transforms: [cellWidth(20)]
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
      transformFunction: getChannels,
      textFunction: getChannelsText
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
        url: item =>
          `/multicloud/applications/${encodeURIComponent(
            item.namespace
          )}/${encodeURIComponent(item.name)}`
      }
    },
    {
      key: 'table.actions.applications.edit',
      link: {
        url: item =>
          `/multicloud/applications/${encodeURIComponent(
            item.namespace
          )}/${encodeURIComponent(item.name)}/edit`,
        state: { cancelBack: true }
      }
    },
    {
      key: 'table.actions.applications.search',
      link: {
        url: item =>
          getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              kind: 'application',
              apigroup: 'app.k8s.io'
            }
          })
      }
    },
    {
      key: 'table.actions.applications.remove',
      modal: true,
      delete: true
    }
  ]
}

export function createApplicationLink(item = {}, ...param) {
  const { name, namespace = 'default' } = item
  if (param[2]) {
    return item.name
  }
  const link = `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}`
  return <Link to={link}>{name}</Link>
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
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCountString(locale, remoteCount, localPlacement)
}

function getChannels(item = {}, locale = '') {
  return (
    <ChannelLabels
      channels={(R.path(['hubChannels'], item) || []).map(ch => ({
        type: ch['ch.type'],
        pathname: ch['ch.pathname'],
        gitBranch: ch['sub._gitbranch'],
        gitPath: ch['sub._gitpath'],
        package: ch['sub.package'],
        packageFilterVersion: ch['sub.packageFilterVersion']
      }))}
      locale={locale}
    />
  )
}

function getChannelsText(item = {}, locale = '') {
  const channels = (R.path(['hubChannels'], item) || []).map(ch => ({
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

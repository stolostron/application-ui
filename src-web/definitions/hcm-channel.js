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
import {
  createEditLink,
  getAge,
  getChannelLabel,
  getEditLink,
  getSearchLink,
  normalizeChannelType,
  CHANNEL_TYPES
} from '../../lib/client/resource-helper'
import {
  isSearchAvailable,
  isYAMLEditAvailable
} from '../../lib/client/search-helper'
import { cellWidth } from '@patternfly/react-table'
import { createClustersText, getEmptyMessage } from './hcm-subscription'
import ChannelLabels from '../components/common/ChannelLabels'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  pluralKey: 'table.plural.channel',
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
      msgKey: 'table.header.type',
      resourceKey: 'type',
      transformFunction: getChannels,
      textFunction: getChannelsText,
      tooltipKey: 'table.header.channels.type.tooltip'
    },
    {
      msgKey: 'table.header.subscriptions',
      resourceKey: 'subscriptionCount',
      transformFunction: createSubscriptionsLink,
      tooltipKey: 'table.header.channels.subscriptions.tooltip',
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.clusters',
      resourceKey: 'clusterCount',
      transformFunction: createClustersText,
      textFunction: createClustersText,
      tooltipKey: 'table.header.channels.clusters.tooltip',
      disabled: () => !isSearchAvailable()
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
      key: 'table.actions.channels.edit',
      link: {
        url: getEditLink
      }
    })
  }
  if (isSearchAvailable()) {
    actions.push({
      key: 'table.actions.channels.search',
      link: {
        url: item =>
          getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              kind: 'channel',
              apigroup: 'apps.open-cluster-management.io'
            }
          })
      }
    })
  }
  actions.push({
    key: 'table.actions.channels.remove',
    modal: true,
    delete: true
  })
  return actions
}

function createSubscriptionsLink(item) {
  if (item.subscriptionCount) {
    const channelLink = getSearchLink({
      properties: {
        name: item.name,
        namespace: item.namespace,
        kind: 'channel'
      },
      showRelated: 'subscription'
    })
    return <a href={channelLink}>{item.subscriptionCount}</a>
  }
  return item.subscriptionCount === 0 ? item.subscriptionCount : '-'
}

function getChannels(item = {}, locale = '') {
  return (
    <ChannelLabels
      channels={[
        {
          type: item.type,
          pathname: item.pathname
        }
      ]}
      locale={locale}
      showSubscriptionAttributes={false}
    />
  )
}

function getChannelsText(item = {}, locale = '') {
  const normalizedType = normalizeChannelType(item.type)
  return CHANNEL_TYPES.includes(normalizedType)
    ? getChannelLabel(normalizedType, 0, locale)
    : ''
}

function getEmptyTitle(locale = '') {
  return msgs.get('no-resource.channel.title', locale)
}

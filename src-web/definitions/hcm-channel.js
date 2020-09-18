/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import React from 'react'
import R from 'ramda'
import { validator } from './validators/hcm-channel-validator'
import { getAge, getClusterCount, getSearchLink } from '../../lib/client/resource-helper'
import ChannelLabels from '../components/common/ChannelLabels'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      //transformFunction: createApplicationLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.type',
      resourceKey: 'type',
      transformFunction: getChannels,
      tooltipKey: 'table.header.channels.type.tooltip'
    },
    {
      msgKey: 'table.header.subscriptions',
      resourceKey: 'subscriptionCount',
      transformFunction: createSubscriptionsLink,
      tooltipKey: 'table.header.channels.subscriptions.tooltip'
    },
    {
      msgKey: 'table.header.clusters',
      resourceKey: 'clusterCount',
      transformFunction: createClustersLink,
      tooltipKey: 'table.header.channels.clusters.tooltip'
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
  ],
  tableActions: [
    {
      key: 'table.actions.channels.edit',
      link: {
        url: item =>
          `/multicloud/details/local-cluster/${item.selfLink}`
      }
    },
    {
      key: 'table.actions.channels.remove',
      modal: true,
      delete: true
    }
  ]
}

export function createSubscriptionsLink(item) {
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

export function createClustersLink(item, locale) {
  const clusterCount = R.path(['clusterCount'], item) || 0
  const localPlacement = R.path(['localPlacement'], item) || false
  return getClusterCount({
    locale,
    remoteCount: clusterCount,
    localPlacement,
    name: item.name,
    namespace: item.namespace,
    kind: 'placementrule'
  })
}

export function getChannels(item = {}, locale = '') {
  return (
    <ChannelLabels
      channels={[{
        type: item.type,
        pathname: item.pathname,
      }]}
      locale={locale}
      showSubscriptionAttributes={false}
    />
  )
}

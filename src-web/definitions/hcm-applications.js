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
  CHANNEL_TYPES,
  getEditLink
} from '../../lib/client/resource-helper'
import { isSearchAvailable } from '../../lib/client/search-helper'
import { cellWidth } from '@patternfly/react-table'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import config from '../../lib/shared/config'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'
import ChannelLabels from '../components/common/ChannelLabels'
import TableRowActionMenu from '../components/common/TableRowActionMenu'
import { Label, Split, SplitItem, Tooltip } from '@patternfly/react-core'
import _ from 'lodash'
import LabelWithPopover from '../components/common/LabelWithPopover'

export default {
  defaultSortField: 'name',
  uriKey: 'name',
  primaryKey: '_uid',
  pluralKey: 'table.plural.application',
  emptyTitle: getEmptyTitle,
  emptyMessage: getEmptyMessage,
  keyFn: item => `${item.cluster}/${item.namespace}/${item.name}`,
  groupFn: item => {
    if (isArgoApp(item)) {
      if (item.applicationSet) {
        const key = _.pick(item, ['applicationSet', 'namespace', 'cluster'])
        return JSON.stringify(key)
      } else if (item.repoURL) {
        const key = _.pick(item, [
          'repoURL',
          'path',
          'chart',
          'targetRevision'
        ])
        if (!key.targetRevision) {
          key.targetRevision = 'HEAD'
        }
        return JSON.stringify(key)
      } else {
        return item._uid // When search is not available, Argo apps still must have a group identifier
      }
    }
    return null
  },
  groupSummaryFn: (items, locale) => {
    const cells = [
      { title: createApplicationLink(items, locale) } // pass full array for count
    ]
    if (items.length > 1) {
      cells.push({ title: createTypeCell(items[0], locale, true) })
      cells.push({ title: '' }) // Empty Namespace
      if (isSearchAvailable()) {
        cells.push({ title: createClustersLink(items, locale) }) // pass full array for all clusters
        cells.push({ title: createChannels(items[0], locale) })
        cells.push({ title: '' }) // Empty Time window
      }
      cells.push({ title: '' }) // Empty Created
      if (items[0].applicationSet) {
        // We know from above this array has at least one item
        cells.push({
          title: (
            <TableRowActionMenu
              actions={tableActionsResolver(items[0], true)}
              itemGroup={items}
              resourceType={RESOURCE_TYPES.QUERY_APPLICATIONSET}
            />
          )
        })
      } else {
        cells.push({ title: '' }) // Empty Actions
      }
    } else {
      cells.push({ title: createTypeCell(items[0], locale, true) })
      cells.push({ title: createNamespaceText(items[0]) })
      if (isSearchAvailable()) {
        cells.push({ title: createClustersLink(items[0], locale) })
        cells.push({ title: createChannels(items[0], locale) })
        cells.push({ title: getTimeWindow(items[0], locale) })
      }
      cells.push({ title: getAge(items[0], locale) })
      cells.push({
        title: (
          <TableRowActionMenu
            actions={tableActionsResolver(items[0])}
            item={items[0]}
            resourceType={RESOURCE_TYPES.HCM_APPLICATIONS}
          />
        )
      })
    }
    return { cells }
  },
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createApplicationLink,
      textFunction: createApplicationText,
      transforms: [cellWidth(20)]
    },
    {
      msgKey: 'table.header.type',
      resourceKey: 'type',
      transforms: [cellWidth(20)],
      transformFunction: createTypeCell, // renders the cell on the table
      textFunction: createTypeText // renders the text used by search bar
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
      textFunction: createClustersText,
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.resource',
      tooltipKey: 'table.header.application.resource.tooltip',
      resourceKey: 'hubChannels',
      transformFunction: createChannelsRow,
      textFunction: createChannelsText,
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.timeWindow',
      tooltipKey: 'table.header.application.timeWindow.tooltip',
      resourceKey: 'hubSubscriptions',
      transformFunction: getTimeWindow,
      textFunction: getTimeWindow,
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
  ],
  tableActionsResolver: tableActionsResolver,
  tableDropdown: {
    msgKey: 'actions.create.application',
    disableMsgKey: 'actions.create.application.access.denied',
    actions: [
      {
        msgKey: 'application.type.acm',
        path: `${config.contextPath}/create`
      },
      {
        msgKey: 'application.type.argo',
        path: `${config.contextPath}/argoappset`
      }
    ]
  },
  tableFilter: {
    labelKey: 'table.filter.type.acm.application.label',
    options: [
      {
        labelKey: 'table.filter.type.acm.application',
        valueKey: 'table.filter.type.acm.application.value'
      },
      {
        labelKey: 'table.filter.type.argo.application',
        valueKey: 'table.filter.type.argo.application.value'
      }
    ],
    tableFilterFn: (selectedValues, item) => {
      return selectedValues.includes(item['apiVersion'])
    }
  }
}

function tableActionsResolver(item, isAppSet = false) {
  const actions = [
    {
      key: 'table.actions.applications.view',
      link: {
        url: item => getApplicationLink(item)
      }
    }
  ]
  if (!isArgoApp(item) || isAppSet) {
    actions.push({
      key: 'table.actions.applications.edit',
      link: {
        url: item => getApplicationLink(item, true),
        state: { cancelBack: true }
      }
    })
  }
  if (isSearchAvailable()) {
    actions.push({
      key: 'table.actions.applications.search',
      link: {
        url: item => {
          const [apigroup, apiversion] = item.apiVersion.split('/')
          return getSearchLink({
            properties: {
              name: isAppSet ? item.applicationSet : item.name,
              namespace: item.namespace,
              cluster: item.cluster,
              kind: isAppSet ? 'applicationset' : item.kind.toLowerCase(),
              apigroup,
              apiversion
            }
          })
        }
      }
    })
  }
  if (!isArgoApp(item) || isAppSet) {
    actions.push({
      key: 'table.actions.applications.remove',
      modal: true,
      delete: true
    })
  }
  return actions
}

function getApplicationLink(item = {}, edit = false) {
  const { applicationSet, name, namespace = 'default' } = item
  const params = queryString.stringify({
    apiVersion: item.apiVersion,
    cluster: item.cluster === 'local-cluster' ? undefined : item.cluster,
    applicationset: applicationSet == null ? undefined : applicationSet
  })
  return `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}${edit ? '/edit' : ''}?${params}`
}

export function createApplicationText(item = {}) {
  const prefix = item.applicationSet ? `${item.applicationSet}/` : ''
  return `${prefix}${item.name}`
}

export function createApplicationLink(item = {}, locale) {
  const group = Array.isArray(item)
  const firstItem = group ? item[0] : item
  const { name, applicationSet } = firstItem
  const displayAsApplicationSet = group && applicationSet && item.length > 1
  const tooltipKey = displayAsApplicationSet
    ? 'application.argo.applicationset'
    : 'application.argo.group'
  const substitutions = displayAsApplicationSet ? [applicationSet] : []
  const displayName = displayAsApplicationSet ? applicationSet : name
  return (
    <Split hasGutter style={{ alignItems: 'baseline' }}>
      <SplitItem align="baseline">
        <Link to={getApplicationLink(firstItem)}>{displayName}</Link>
      </SplitItem>
      {group &&
        isArgoApp(item[0]) && (
          <SplitItem>
            {item.length > 1 && (
              <Tooltip
                position="top"
                content={msgs.get(tooltipKey, substitutions, locale)}
              >
                <Label color="grey">{item.length}</Label>
              </Tooltip>
            )}
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
  const multiArgo = Array.isArray(item)
  if (!multiArgo && isArgoApp(item)) {
    let link
    if (item.destinationCluster) {
      link = getSearchLink({
        properties: {
          name: item.destinationCluster,
          kind: 'cluster'
        }
      })
    }
    const clusterText =
      item.destinationCluster || msgs.get('cluster.name.unknown', locale)
    return link ? (
      <a className="cluster-count-link" href={link}>
        {clusterText}
      </a>
    ) : (
      clusterText
    )
  }

  const [apigroup] = (multiArgo ? item[0] : item).apiVersion.split('/')
  let remoteCount, localPlacement, clusterNames
  if (multiArgo) {
    const names = new Set()
    item.forEach(i => {
      if (i.destinationCluster) {
        names.add(i.destinationCluster)
      }
    })
    clusterNames = Array.from(names)
    localPlacement = clusterNames.includes('local-cluster')
    remoteCount = clusterNames.length - (localPlacement ? 1 : 0)
  } else {
    const clusterCounts = getClusterCounts(item)
    localPlacement = clusterCounts.localPlacement
    remoteCount = clusterCounts.remoteCount
  }

  return getClusterCount({
    locale,
    remoteCount,
    localPlacement,
    name: item.name,
    namespace: item.namespace,
    kind: 'application',
    apigroup,
    clusterNames
  })
}

function createClustersText(item = {}, locale = '') {
  if (isArgoApp(item)) {
    return item.destinationCluster || msgs.get('cluster.name.unknown', locale)
  }
  const { remoteCount, localPlacement } = getClusterCounts(item)
  return getClusterCountString(locale, remoteCount, localPlacement)
}

function renderTypeText(msgKey, locale) {
  const appTypeStyle = { color: '#6A6E73' }
  return <span style={appTypeStyle}>{msgs.get(msgKey, locale)}</span>
}

export function createTypeText(item = {}, locale = '') {
  if (item.applicationSet) {
    return msgs.get('table.header.type.appset', locale)
  }

  if (isArgoApp(item)) {
    return msgs.get('table.header.type.argo', locale)
  }

  return msgs.get('table.header.type.subscription', locale)
}

export function createTypeCell(item = {}, locale = '', isGroupSummary = false) {
  if (item.applicationSet) {
    if (!isGroupSummary) {
      return ''
    }
    const linkData = {
      name: item.applicationSet,
      namespace: item.namespace,
      kind: 'ApplicationSet',
      apiVersion: 'argoproj.io/v1alpha1',
      cluster: 'local-cluster'
    }
    return (
      <React.Fragment>
        <Link target="_blank" to={getEditLink(linkData)}>
          {linkData.name}
        </Link>
        <br />
        {renderTypeText('table.header.type.appset', locale)}
      </React.Fragment>
    )
  }
  if (isArgoApp(item)) {
    if (!isGroupSummary) {
      if (item.cluster !== 'local-cluster') {
        return 'Remote discovery'
      }
      return 'Local discovery'
    }
    return renderTypeText('table.header.type.argo', locale)
  }

  let subscriptionLinks
  const labelLinks = []
  const subscriptionCount = item.hubSubscriptions.length - 1
  const labelContent = `${subscriptionCount} more`
  if (item.hubSubscriptions.length > 0) {
    const firstItem = {
      name: item.hubSubscriptions[0].name,
      namespace: item.namespace,
      kind: 'Subscription',
      apiVersion: 'apps.open-cluster-management.io/v1',
      cluster: 'local-cluster'
    }
    subscriptionLinks = (
      <Link target="_blank" to={getEditLink(firstItem)}>
        {firstItem.name}
      </Link>
    )

    if (item.hubSubscriptions.length > 1) {
      for (let i = 1; i < item.hubSubscriptions.length; i++) {
        const subscriptionItem = {
          name: item.hubSubscriptions[i].name,
          namespace: item.namespace,
          kind: 'Subscription',
          apiVersion: 'apps.open-cluster-management.io/v1',
          cluster: 'local-cluster'
        }
        labelLinks.push(
          <Link
            key={subscriptionItem.name}
            target="_blank"
            to={getEditLink(subscriptionItem)}
          >
            {subscriptionItem.name}
          </Link>
        )
      }

      subscriptionLinks = (
        <React.Fragment>
          {subscriptionLinks}
          &nbsp;
          <LabelWithPopover
            key={item.name}
            labelContent={labelContent}
            popoverHeader={msgs.get(
              'table.header.type.subscription.popup.label',
              locale
            )}
            popoverPosition="top"
          >
            <div align="center" style={{ 'padding-bottom': '10px' }}>
              {labelLinks}
            </div>
          </LabelWithPopover>
        </React.Fragment>
      )
    }
  }
  return (
    <React.Fragment>
      {subscriptionLinks}
      <br />
      {renderTypeText('table.header.type.subscription', locale)}
    </React.Fragment>
  )
}

function createNamespaceText(item = {}) {
  return isArgoApp(item) ? item.destinationNamespace : item.namespace
}

function isArgoApp(item = {}) {
  return item.apiVersion && item.apiVersion.includes('argoproj.io')
}

function getChannels(item = {}) {
  if (isArgoApp(item) && item.repoURL) {
    return [
      {
        type: item.chart ? 'helmrepo' : 'git',
        pathname: item.repoURL,
        gitPath: item.path,
        chart: item.chart,
        targetRevision: item.targetRevision || 'HEAD'
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

function createChannelsRow(item = {}, locale = '') {
  return !isArgoApp(item) ? createChannels(item, locale) : null
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

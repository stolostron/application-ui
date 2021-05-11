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
import {
  createEditLink,
  getAge,
  getEditLink,
  getSearchLink,
  getClusterCountString
} from '../../lib/client/resource-helper'
import {
  isSearchAvailable,
  isYAMLEditAvailable
} from '../../lib/client/search-helper'
import { cellWidth } from '@patternfly/react-table'
import { getEmptyMessage } from './hcm-subscription'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  pluralKey: 'table.plural.placementrule',
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
      msgKey: 'table.header.clusters',
      resourceKey: 'clusterCount',
      transformFunction: createClustersText,
      textFunction: createClustersText,
      tooltipKey: 'table.header.placementrules.clusters.tooltip',
      disabled: () => !isSearchAvailable()
    },
    {
      msgKey: 'table.header.replicas',
      resourceKey: 'replicas',
      tooltipKey: 'table.header.placementrules.replicas.tooltip'
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
      key: 'table.actions.placementrules.edit',
      link: {
        url: getEditLink
      }
    })
  }
  if (isSearchAvailable()) {
    actions.push({
      key: 'table.actions.placementrules.search',
      link: {
        url: item =>
          getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              kind: 'placementrule',
              apigroup: 'apps.open-cluster-management.io'
            }
          })
      }
    })
  }
  actions.push({
    key: 'table.actions.placementrules.remove',
    modal: true,
    delete: true
  })
  return actions
}

function createClustersText(item, locale) {
  const clusterCount = R.path(['clusterCount'], item) || {}
  return getClusterCountString(
    locale,
    clusterCount.remoteCount,
    clusterCount.localCount
  )
}

function getEmptyTitle(locale = '') {
  return msgs.get('no-resource.placementrule.title', locale)
}

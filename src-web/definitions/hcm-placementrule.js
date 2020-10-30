/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import {
  createEditLink,
  getAge,
  getEditLink,
  getSearchLink,
  getClusterCount
} from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createEditLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.clusters',
      resourceKey: 'clusterCount',
      transformFunction: createClustersLink,
      tooltipKey: 'table.header.placementrules.clusters.tooltip'
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
  tableActions: [
    {
      key: 'table.actions.placementrules.edit',
      link: {
        url: getEditLink
      }
    },
    {
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
    },
    {
      key: 'table.actions.placementrules.remove',
      modal: true,
      delete: true
    }
  ]
}

export function createClustersLink(item, locale) {
  const clusterCount = R.path(['clusterCount'], item) || {}
  return getClusterCount({
    locale,
    remoteCount: clusterCount.remoteCount,
    localPlacement: clusterCount.localCount,
    name: item.name,
    namespace: item.namespace,
    kind: 'placementrule'
  })
}

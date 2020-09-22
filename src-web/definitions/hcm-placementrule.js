/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import { validator } from './validators/hcm-placementrule-validator'
import { getAge, getClusterCount } from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name'
      //transformFunction: createApplicationLink
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
        url: item => `/multicloud/details/local-cluster/${item.selfLink}`
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
  const clusterCount = R.path(['clusterCount'], item) || 0
  return getClusterCount({
    locale,
    remoteCount: clusterCount,
    localPlacement: false,
    name: item.name,
    namespace: item.namespace,
    kind: 'placementrule'
  })
}

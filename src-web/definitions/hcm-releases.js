/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'Namespace',
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'Status',
      transformFunction: getStatus
    },
    {
      msgKey: 'table.header.chartName',
      resourceKey: 'ChartName',
    },
    {
      msgKey: 'table.header.currentVersion',
      resourceKey: 'ChartVersion',
    },
    {
      msgKey: 'table.header.updated',
      resourceKey: 'lastDeployed',
      type: 'timestamp'
    },
  ],
}

export function getStatus(item, locale) {
  // more information at https://docs.helm.sh/helm/#helm-status
  switch (item.Status) {
  case 'DEPLOYED':
    return msgs.get('table.cell.deployed', locale)

  case 'DELETED':
    return msgs.get('table.cell.deleted', locale)

  case 'SUPERSEDED':
    return msgs.get('table.cell.superseded', locale)

  case 'FAILED':
    return msgs.get('table.cell.failed', locale)

  case 'DELETING':
    return msgs.get('table.cell.deleting', locale)

  default:
    return msgs.get('table.cell.unknown', locale)
  }
}


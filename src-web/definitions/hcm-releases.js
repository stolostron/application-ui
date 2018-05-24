/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

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
      resourceKey: 'HDetails.LastDeployed.seconds',
      type: 'timestamp'
    },
  ],
  tableActions: [
    'table.actions.remove',
  ]
}


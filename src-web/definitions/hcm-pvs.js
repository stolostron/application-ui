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
      msgKey: 'table.header.capacity',
      resourceKey: 'PVDetails.Capacity',
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'PVDetails.Status',
    },
    {
      msgKey: 'table.header.storageClass',
      resourceKey: 'PVDetails.StorageClass',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
    },
  ],
}


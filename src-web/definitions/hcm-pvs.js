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
      link: false
    },
    {
      msgKey: 'table.header.capacity',
      resourceKey: 'PVDetails.Capacity',
      link: false
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'PVDetails.Status',
      link: false
    },
    {
      msgKey: 'table.header.storageClass',
      resourceKey: 'PVDetails.StorageClass',
      link: false
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
      link: false
    },
  ],
  detailKeys: {
    title: 'serviceinstance.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'name',
            type: 'i18n'
          },
          {
            resourceKey: 'name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'PVDetails.Capacity',
            type: 'i18n'
          },
          {
            resourceKey: 'PVDetails.Capacity'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'PVDetails.StorageClass',
            type: 'i18n'
          },
          {
            resourceKey: 'PVDetails.StorageClass'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'cluster',
            type: 'i18n'
          },
          {
            resourceKey: 'cluster'
          }
        ]
      }
    ]
  },
}


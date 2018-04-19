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
  defaultSortField: 'name',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      link: false
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'Namespace',
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
            resourceKey: 'Namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'Namespace'
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

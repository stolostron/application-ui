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
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
      link: false
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'NodeDetails.Status',
      link: false
    },
    {
      msgKey: 'table.header.osimage',
      resourceKey: 'NodeDetails.OSImage',
      link: false
    },
    {
      msgKey: 'table.header.cpus',
      resourceKey: 'NodeDetails.Cpu',
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
            resourceKey: 'cluster',
            type: 'i18n'
          },
          {
            resourceKey: 'cluster'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'NodeDetails.Status',
            type: 'i18n'
          },
          {
            resourceKey: 'NodeDetails.Status'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'NodeDetails.OSImage',
            type: 'i18n'
          },
          {
            resourceKey: 'NodeDetails.OSImage'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'NodeDetails.Cpu',
            type: 'i18n'
          },
          {
            resourceKey: 'NodeDetails.Cpu'
          }
        ]
      },
    ]
  },
}


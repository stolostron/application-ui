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
  defaultSortField: 'Name',
  primaryKey: 'Name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'Name',
    },
    {
      msgKey: 'table.header.url',
      resourceKey: 'URL',
    }
  ],
  tableActions: [
    'table.actions.remove',
  ]
}


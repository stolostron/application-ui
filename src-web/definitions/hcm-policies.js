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
  defaultSortField: 'name',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatus,
    },
  ],
}

export function getStatus(item, locale) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'invalid']
  if (expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
  }
  return msgs.get('policy.status.unknown', locale)
}

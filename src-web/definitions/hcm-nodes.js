/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getAge } from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'metadata.name',
  secondaryKey: 'cluster.metadata.name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster.metadata.name',
    },
    {
      msgKey: 'table.header.role',
      resourceKey: 'metadata.labels',
      transformFunction: getRole
    },
    {
      msgKey: 'table.header.arch',
      resourceKey: 'architecture',
    },
    {
      msgKey: 'table.header.osimage',
      resourceKey: 'osImage',
    },
    {
      msgKey: 'table.header.cpus',
      resourceKey: 'capacity.cpu',
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'metadata.creationTimestamp',
      transformFunction: getAge,
    },
  ],
}

export function getRole(item) {
  return (item.roles && item.roles.length > 0) ? item.roles.join(', ') : 'worker'
}

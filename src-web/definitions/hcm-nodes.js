/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import lodash from 'lodash'

export default {
  defaultSortField: 'cluster',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
    },
    {
      msgKey: 'table.header.role',
      resourceKey: 'NodeDetails.Labels',
      transformFunction: getRole
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'NodeDetails.Status',
    },
    {
      msgKey: 'table.header.arch',
      resourceKey: 'NodeDetails.Arch',
    },
    {
      msgKey: 'table.header.osimage',
      resourceKey: 'NodeDetails.OSImage',
    },
    {
      msgKey: 'table.header.cpus',
      resourceKey: 'NodeDetails.Cpu',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
    },
  ],
}

export function getRole(item) {
  const roles = []
  if (lodash.get(item, 'NodeDetails.Labels.proxy') === 'true') {
    roles.push('proxy')
  }
  if (lodash.get(item, 'NodeDetails.Labels.management') === 'true') {
    roles.push('management')
  }
  if (lodash.get(item, 'NodeDetails.Labels.role') === 'master') {
    roles.push('master')
  }
  if (lodash.get(item, 'NodeDetails.Labels.va') === 'true') {
    roles.push('va')
  }
  return roles.length > 0 ? roles.join(', ') : 'worker'
}

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
      msgKey: 'table.header.labels',
      resourceKey: 'PDetails.labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'State',
      transformFunction: getStatus
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'Namespace',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
    },
  ],
}
export function getLabels(item) {
  const labels = lodash.map(item.PDetails.Labels, (value, key) => {
    if (key !== 'controller-revision-hash' && key != 'pod-template-generation' && key != 'pod-template-hash')
      return `${key}=${value}`
  })
  return lodash.compact(labels).join(',')
}

export function getStatus(item, locale) {
  return item.State ? msgs.get('table.cell.running', locale) : msgs.get('table.cell.notrunning', locale)
}

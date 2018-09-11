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
import React from 'react'
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
      resourceKey: 'labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatus
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster',
    },
    {
      msgKey: 'table.header.hostIP',
      resourceKey: 'hostIP',
    },
    {
      msgKey: 'table.header.podIP',
      resourceKey: 'podIP',
    },
  ],
}

export function getLabels(item) {
  return <ul>
    {lodash.map(item.labels, (value, key) => {
      if (key !== 'controller-revision-hash' && key != 'pod-template-generation' && key != 'pod-template-hash')
        return <li key={`${key}=${value}`}>{`${key}=${value}`}</li>
    })
    }
  </ul>
}

export function getStatus(item, locale) {
  switch (item.status) {
  case 'Running':
    return msgs.get('table.cell.running', locale)

  case 'Succeeded':
    return msgs.get('table.cell.succeeded', locale)

  case 'Pending':
    return msgs.get('table.cell.pending', locale)

  case 'Failed':
    return msgs.get('table.cell.failed', locale)

  default:
    return msgs.get('table.cell.notrunning', locale)
  }
}

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
  defaultSortField: 'Name',
  primaryKey: 'Name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'Name',
    },
    {
      msgKey: 'table.header.components',
      resourceKey: 'Components',
    },
    {
      msgKey: 'table.header.dependencies',
      resourceKey: 'Dependencies',
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'Labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.annotations',
      resourceKey: 'Annotations',
      transformFunction: getAnnotations
    },
  ],
}
export function getAnnotations(item) {
  const annotations = lodash.map(item.Annotations, (value, key) => {
    return `${key}=${value !== '' ? value : '""'}`
  })
  return lodash.compact(annotations).join(', ')
}

export function getLabels(item) {
  const labels = lodash.map(item.Labels, (value, key) => {
    return `${key}=${value !== '' ? value : '""'}`
  })
  return lodash.compact(labels).join(', ')
}


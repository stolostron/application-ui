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
import TruncateText from '../components/common/TruncateText'
import msgs from '../../nls/platform.properties'
import { getAge, getClusterLink } from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'cluster.metadata.name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
      transformFunction: getTruncatedText,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster.metadata.name',
      transformFunction: getClusterLink,
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'metadata.labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.images',
      resourceKey: 'images',
      transformFunction: getListWithTruncatedValues,
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatus
    },
    {
      msgKey: 'table.header.hostIP',
      resourceKey: 'hostIP',
    },
    {
      msgKey: 'table.header.podIP',
      resourceKey: 'podIP',
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'metadata.creationTimestamp',
      transformFunction: getAge,
    },
  ],
}

export function getTruncatedText(item){
  return <TruncateText text={item.metadata.name} />
}

export function getListWithTruncatedValues(item) {
  return item.images ?
    <ul>{item.images.map(image => (<li key={image}><TruncateText text={image} /></li>))}</ul>
    :
    '-'
}

export function getLabels(item) {
  return <ul>
    {lodash.map(item.metadata.labels, (value, key) => {
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

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getAge, getClusterLink, getLabelsToString, transformPVStatus } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
    },
    {
      msgKey: 'table.header.cluster',
      resourceKey: 'cluster.metadata.name',
      transformFunction: getClusterLink
    },
    {
      msgKey: 'table.header.type',
      resourceKey: 'type',
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'metadata.labels',
      transformFunction: getLabelsToString
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: transformPVStatus
    },
    {
      msgKey: 'table.header.capacity',
      resourceKey: 'capacity',
    },
    {
      msgKey: 'table.header.accessMode',
      resourceKey: 'accessModes',
    },
    {
      msgKey: 'table.header.claim',
      resourceKey: 'claimRef',
      transformFunction: getClaim
    },
    {
      msgKey: 'table.header.reclaimPolicy',
      resourceKey: 'reclaimPolicy',
    },
    {
      msgKey: 'table.header.path',
      resourceKey: 'claim',
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'metadata.creationTimestamp',
      transformFunction: getAge
    },
  ],
  // tableActions: [
  //   'table.actions.edit',
  // ],
}

export function getClaim(item) {
  return item.claimRef.namespace && item.claimRef.name
    ? item.claimRef.namespace + '/' + item.claimRef.name
    : '-'
}

export function getType(item, locale) {
  return item.spec.local
    ? msgs.get('table.cell.localVolume', locale)
    : msgs.get('table.cell.hostPath', locale)
}

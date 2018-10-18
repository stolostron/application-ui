/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getAge, getClusterLink, transformPVStatus } from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey:'cluster.metadata.name',
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
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: transformPVStatus
    },
    {
      msgKey: 'table.header.persistent.volume',
      resourceKey: 'persistentVolume',
    },
    {
      msgKey: 'table.header.requests',
      resourceKey: 'requests',
    },
    {
      msgKey: 'table.header.accessMode',
      resourceKey: 'accessModes',
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'metadata.creationTimestamp',
      transformFunction: getAge
    },
  ],
  // tableActions: [
  //   'table.actions.edit,
  // ],
}

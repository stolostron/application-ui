/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { validator } from './validators/hcm-subscription-validator'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      //transformFunction: createApplicationLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.channel',
      resourceKey: 'channel'
    },
    {
      msgKey: 'table.header.applications',
      resourceKey: 'appCount'
    },
    {
      msgKey: 'table.header.clusters',
      tooltipKey: 'table.header.clusters.tooltip',
      resourceKey: 'clusterCount',
      //transformFunction: createClustersLink
    },
    {
      msgKey: 'table.header.timeWindow',
      tooltipKey: 'table.header.timeWindow.tooltip',
      resourceKey: 'timeWindow',
      //transformFunction: getTimeWindow
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      //transformFunction: getCreated
    }
  ],
}

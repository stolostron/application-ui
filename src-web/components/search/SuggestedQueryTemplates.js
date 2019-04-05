/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export default {
  templates: [
    {
      name: 'Workloads',
      description: 'A pre-defined search to help you review your workloads.',
      resultHeader: 'search.tile.results',
      searchText: 'kind:daemonset,deployment,job,statefulset,replicaset'
    },
    {
      name: 'Configuration resources',
      description: 'A pre-defined search to help you review your configuration resources.',
      resultHeader: 'search.tile.results',
      searchText: 'kind:configmap,secret'
    },
    {
      name: 'Unhealthy Pods',
      description: 'Show pods with status failed, pending, or unknown.',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'kind:pod status:Pending,pending,Failed,failed,Unknown,unknown'
    }
  ]
}

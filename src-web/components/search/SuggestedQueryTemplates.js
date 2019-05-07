/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
      name: 'Unhealthy Pods',
      description: 'Show pods with unhealthy status.',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'kind:pod status:Pending,Failed,Terminating,ImagePullBackOff,CrashLoopBackOff,RunContainerError,ContainerCreating'
    },
    {
      name: 'Created last hour',
      description: 'Search for resources created within the last hour.',
      resultHeader: 'search.tile.results',
      searchText: 'created:hour'
    },
    // Disabled because layout looks better with 3 cards.
    // Will re-enable when we add a rotating suggestion mechanism.
    // {
    //   name: 'Configuration resources',
    //   description: 'A pre-defined search to help you review your configuration resources.',
    //   resultHeader: 'search.tile.results',
    //   searchText: 'kind:configmap,secret'
    // },
  ]
}

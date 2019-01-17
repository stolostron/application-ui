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
      name: 'Clusters',
      description: 'A pre-defined search to help you review your clusters.',
      resultHeader: 'search.tile.results',
      searchText: 'kind:cluster'
    },
    {
      name: 'Applications',
      description: 'A pre-defined search to help you review your applications.',
      resultHeader: 'search.tile.results',
      searchText: 'kind:application'
    },
    {
      name: 'Unhealthy Pods',
      description: 'Show pods with status failed, pending, or unknown.',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'kind:pod status:pending,failed,unknown'
    }
  ]
}

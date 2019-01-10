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
      name: 'Failed Storage (template)',
      description: 'A pre-defined query to help you review ...',
      resultHeader: 'table.cell.failed',
      searchText: 'kind:storage status:Failed'
    },
    {
      name: 'Unhealthy Pods (template)',
      description: 'A pre-defined query to help you review ...',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'kind:pod status:Pending,Failed,Unknown'
    },
    {
      name: 'Services (template)',
      description: 'A pre-defined query to help you review ...',
      resultHeader: 'table.header.status.healthy',
      searchText: 'kind:service'
    }
  ]
}

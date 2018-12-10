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
      searchText: 'failed storage'
    },
    {
      name: 'Unhealthy Pods (template)',
      description: 'A pre-defined query to help you review ...',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'unhealthy pod'
    },
    {
      name: 'Inactive Services (template)',
      description: 'A pre-defined query to help you review ...',
      resultHeader: 'table.header.status.unhealthy',
      searchText: 'inactive services'
    }
  ]
}

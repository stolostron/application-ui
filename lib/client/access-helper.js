/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { ROLES } from '../shared/constants'
import apolloClient from '../client/apollo-client'

export function filterTableAction(actions,userRole,resourceType){
  let actionList = []
  switch (userRole){

  case ROLES.VIEWER:
    return actionList

  case ROLES.EDITOR:
  case ROLES.OPERATOR:
    if(resourceType && resourceType.name ==='HCMCompliance'){
      return actionList
    }
    actionList = actions.filter((action) => (action === 'table.actions.edit' || action === 'table.actions.cluster.edit.labels' || action==='table.actions.cluster.view.pods'))
    return actionList

  case ROLES.ADMIN:
    if(resourceType && resourceType.name ==='HCMCompliance'){
      return actionList
    }
    actionList = actions.filter((action) => (action !== 'table.actions.policy.remove' && action !== 'table.actions.compliance.remove'))
    return actionList

  case ROLES.CLUSTER_ADMIN:
  default:
    return actions
  }
}

export function showCreate(userRole, resourceType){
  if(resourceType && resourceType.name === 'HCMCompliance' && userRole !== ROLES.CLUSTER_ADMIN){
    return false
  }
  return userRole !== ROLES.VIEWER && userRole!== ROLES.EDITOR
}

export function canCallAction(resource, action) {
  return apolloClient.getUserAccess({ resource, action })
}

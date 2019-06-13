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

export function filterTableAction(actions,userRole){
  let actionList = []
  switch (userRole){

  case ROLES.VIEWER:
    return actionList

  case ROLES.EDITOR:
  case ROLES.OPERATOR:
    actionList = actions.filter((action) => (action === 'table.actions.edit' || action === 'table.actions.cluster.edit.labels'))
    return actionList

  case ROLES.ADMIN:
    actionList = actions.filter((action) => (action !== 'table.actions.policy.remove' && action !== 'table.actions.compliance.remove'))
    return actionList

  case ROLES.CLUSTER_ADMIN:
  default:
    return actions
  }
}

export function showCreate(userRole){
  return userRole !== ROLES.VIEWER && userRole!== ROLES.EDITOR
}

export function canCallAction(resource, action, namespace, apiGroup) {
  return apolloClient.getUserAccess({ resource, action, namespace, apiGroup })
}

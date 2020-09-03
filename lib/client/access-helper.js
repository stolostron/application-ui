/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { ROLES } from '../shared/constants'
import apolloClient from '../client/apollo-client'

export function filterTableAction(actions, userRole) {
  let actionList = []
  switch (userRole) {
  case ROLES.VIEWER:
    return actionList

  case ROLES.EDITOR:
  case ROLES.OPERATOR:
    actionList = actions.filter(
      action =>
        action.key === 'table.actions.edit' ||
          action.key === 'table.actions.cluster.edit.labels'
    )
    return actionList

  case ROLES.ADMIN:
    return actions
  case ROLES.CLUSTER_ADMIN:
  default:
    return actions
  }
}

export function showCreate(userRole) {
  return userRole !== ROLES.VIEWER && userRole !== ROLES.EDITOR
}

export function canCallAction(resource, action, namespace, apiGroup) {
  return apolloClient.getUserAccess({ resource, action, namespace, apiGroup })
}

export function canCreateActionAllNamespaces(resource, action, apiGroup) {
  return apolloClient.getUserAccessAllNamespaces({
    resource,
    action,
    apiGroup
  })
}

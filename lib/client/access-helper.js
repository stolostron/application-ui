/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import apolloClient from '../client/apollo-client'

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

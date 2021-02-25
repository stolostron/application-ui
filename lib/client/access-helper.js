/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import apolloClient from '../client/apollo-client'

export function canCallAction(kind, action, namespace, apiGroup, version) {
  return apolloClient.getUserAccess({
    kind,
    action,
    namespace,
    apiGroup,
    version
  })
}

export function canCreateActionAllNamespaces(resource, action, apiGroup) {
  return apolloClient.getUserAccessAllNamespaces({
    resource,
    action,
    apiGroup
  })
}

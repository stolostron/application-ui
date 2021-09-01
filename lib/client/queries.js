/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import gql from 'graphql-tag'

export const QueryApplicationList = gql`
  query applicationsList {
    applications {
      _uid
      apiVersion
      name
      namespace
      cluster
      dashboard
      clusterCount
      hubChannels
      hubSubscriptions {
        _uid
        name
        localPlacement
        timeWindow
        status
        channel
      }
      created
      applicationSet
      destinationCluster
      destinationNamespace
      repoURL
      path
      chart
      targetRevision
    }
  }
`

export const QuerySubscriptionList = gql`
  query subscriptionsList {
    subscriptions {
      _uid
      name
      namespace
      appCount
      clusterCount
      localPlacement
      timeWindow
      status
      channel
      created
    }
  }
`

export const QueryPlacementRuleList = gql`
  query placementRulesList {
    placementRules {
      _uid
      name
      namespace
      clusterCount
      replicas
      created
    }
  }
`

export const QueryChannelList = gql`
  query channelsList {
    channels {
      _uid
      name
      namespace
      subscriptionCount
      clusterCount
      type
      pathname
      localPlacement
      created
    }
  }
`

export const HCMChannel = gql`
  query getSingleChannel($name: String!, $namespace: String!) {
    items: channels(name: $name, namespace: $namespace) {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
        resourceVersion
        creationTimestamp
      }
      type
      secretRef
      objectPath
      raw
    }
  }
`

export const HCMSubscription = gql`
  query getSingleSubscription($name: String!, $namespace: String!) {
    items: subscriptions(name: $name, namespace: $namespace) {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
        resourceVersion
        creationTimestamp
      }
      raw
    }
  }
`

export const HCMPlacementRule = gql`
  query getSinglePlacementRule($name: String!, $namespace: String!) {
    items: placementrules(name: $name, namespace: $namespace) {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
        resourceVersion
        creationTimestamp
      }
      raw
    }
  }
`

export const HCMChannelList = gql`
  query getChannels {
    items: channels {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
        resourceVersion
        creationTimestamp
      }
      type
      secretRef
      objectPath
      raw
    }
  }
`

export const gitChannelBranches = gql`
  query getGitChannelBranches(
    $gitUrl: String!
    $namespace: String
    $secretRef: String
    $user: String
    $accessToken: String
  ) {
    items: gitChannelBranches(
      gitUrl: $gitUrl
      namespace: $namespace
      secretRef: $secretRef
      user: $user
      accessToken: $accessToken
    )
  }
`

export const gitChannelPaths = gql`
  query getGitChannelPaths(
    $gitUrl: String!
    $branch: String!
    $path: String
    $namespace: String
    $secretRef: String
    $user: String
    $accessToken: String
  ) {
    items: gitChannelPaths(
      gitUrl: $gitUrl
      branch: $branch
      path: $path
      namespace: $namespace
      secretRef: $secretRef
      user: $user
      accessToken: $accessToken
    )
  }
`
export const argoAppRouteURL = gql`
  query getArgoAppRouteURL(
    $cluster: String!
    $namespace: String!
    $name: String!
    $apiVersion: String!
  ) {
    argoAppRouteURL(
      cluster: $cluster
      namespace: $namespace
      name: $name
      apiVersion: $apiVersion
    )
  }
`

export const argoServerNS = gql`
  query getargoServerNS {
    argoServers {
      argoServerNS
    }
  }
`

export const HCMAnsibleTower = gql`
  query getSecrets($label: String!, $value: String!) {
    secrets(label: $label, value: $value) {
      ansibleSecretName
      ansibleSecretNamespace
    }
  }
`

export const managedClusterStatus = gql`
  query getManagedCluster($clusterName: String!) {
    isManagedClusterConditionAvailable(clusterName: $clusterName)
  }
`

export const routeResourceURL = gql`
  query getRouteResourceURL(
    $cluster: String!
    $namespace: String!
    $name: String!
    $apiVersion: String!
  ) {
    routeResourceURL(
      cluster: $cluster
      namespace: $namespace
      name: $name
      apiVersion: $apiVersion
    )
  }
`

export const HCMContainer = gql`
  query getResource(
    $selfLink: String
    $namespace: String
    $kind: String
    $name: String
    $cluster: String
  ) {
    getResource(
      selfLink: $selfLink
      namespace: $namespace
      kind: $kind
      name: $name
      cluster: $cluster
    )
  }
`

export const HCMSubscriptionList = gql`
  query searchSchema {
    subscriptions {
      metadata {
        name
        namespace
        creationTimestamp
      }
      raw
    }
  }
`

export const HCMPlacementRuleList = gql`
  query getPlacementRules($namespace: String) {
    placementrules(namespace: $namespace) {
      metadata {
        name
        namespace
        creationTimestamp
      }
      raw
    }
  }
`

export const HCMPlacementList = gql`
  query getPlacements($namespace: String) {
    placements(namespace: $namespace) {
      metadata {
        name
        namespace
        creationTimestamp
      }
      raw
    }
  }
`

export const HCMApplicationList = gql`
  query searchResult($input: [SearchInput]) {
    searchResult: search(input: $input) {
      items
    }
  }
`

export const getApplication = gql`
  query getApplication($name: String!, $namespace: String!) {
    application(name: $name, namespace: $namespace) {
      metadata {
        annotations
        creationTimestamp
        labels
        name
        namespace
        resourceVersion
        selfLink
        uid
      }
      name
      namespace
      app
      subscriptions
    }
  }
`

export const getArgoApplication = gql`
  query getApplication(
    $name: String!
    $namespace: String!
    $apiversion: String
  ) {
    application(name: $name, namespace: $namespace, apiversion: $apiversion) {
      metadata {
        annotations
        creationTimestamp
        labels
        name
        namespace
        resourceVersion
        selfLink
        uid
      }
      name
      namespace
      app
      subscriptions
      placement
    }
  }
`

export const getApplications = gql`
  query getApplications {
    applications {
      metadata {
        annotations
        creationTimestamp
        labels
        name
        namespace
        resourceVersion
        uid
      }
      raw
    }
  }
`

export const getApplicationSetRelatedResources = gql`
  query applicationSetRelatedResources($name: String, $namespace: String) {
    applicationSetRelatedResources(name: $name, namespace: $namespace)
  }
`

export const createApplication = gql`
  mutation createApplication($application: [JSON]!) {
    createApplication(application: $application)
  }
`

export const updateApplication = gql`
  mutation updateApplication($application: [JSON]!) {
    updateApplication(application: $application)
  }
`

export const createResources = gql`
  mutation createResources($resources: [JSON]!) {
    createResources(resources: $resources)
  }
`

export const removeQuery = gql`
  mutation deleteQuery($resource: JSON!) {
    deleteQuery(resource: $resource)
  }
`

export const updateResource = gql`
  mutation updateResource(
    $resourceType: String!
    $namespace: String!
    $name: String!
    $body: JSON
    $selfLink: String
    $resourcePath: String
  ) {
    updateResource(
      resourceType: $resourceType
      namespace: $namespace
      name: $name
      body: $body
      selfLink: $selfLink
      resourcePath: $resourcePath
    )
  }
`

export const deleteResource = gql`
  mutation deleteResource(
    $apiVersion: String
    $kind: String
    $name: String
    $namespace: String
    $childResources: JSON
  ) {
    deleteResource(
      apiVersion: $apiVersion
      kind: $kind
      name: $name
      namespace: $namespace
      childResources: $childResources
    )
  }
`

export const HCMPod = gql`
  query getPod($name: String!, $namespace: String!, $clusterName: String!) {
    items: pod(name: $name, namespace: $namespace, clusterName: $clusterName) {
      cluster {
        metadata {
          name
        }
        clusterip
      }
      hostIP
      images
      containers {
        name
      }
      metadata {
        creationTimestamp
        labels
        name
        namespace
        selfLink
      }
      podIP
      restarts
      status
    }
  }
`

export const HCMTopologyFilters = gql`
  query getTopologyFilters {
    clusters {
      metadata {
        name
        labels
      }
    }
    namespaces {
      metadata {
        name
      }
    }
    labels {
      name
      value
    }
    resourceTypes
  }
`

export const HCMTopology = gql`
  query getTopology($filter: TopologyFilter) {
    topology(filter: $filter) {
      resources {
        id
        uid
        name
        cluster
        clusterName
        type
        specs
        namespace
        topology
        labels {
          name
          value
        }
      }
      relationships {
        type
        specs
        to {
          uid
        }
        from {
          uid
        }
      }
      error
    }
  }
`

export const createUserQueries = gql`
  mutation saveQuery($resource: JSON!) {
    saveQuery(resource: $resource)
  }
`

export const userAccess = gql`
  query userAccess(
    $resource: String
    $kind: String
    $action: String!
    $namespace: String
    $apiGroup: String
    $version: String
  ) {
    userAccess(
      resource: $resource
      kind: $kind
      action: $action
      namespace: $namespace
      apiGroup: $apiGroup
      version: $version
    )
  }
`

export const userAccessAnyNamespaces = gql`
  query userAccessAnyNamespaces(
    $resource: String!
    $action: String!
    $apiGroup: String
  ) {
    userAccessAnyNamespaces(
      resource: $resource
      action: $action
      apiGroup: $apiGroup
    )
  }
`

export const userInfo = gql`
  query userInfo {
    items: userInfo {
      userId
      activeAccountId
      activeAccountName
    }
  }
`
export const HCMNamespaceList = gql`
  query applicationNamespaces {
    items: applicationNamespaces {
      metadata {
        annotations
        name
      }
    }
  }
`

export const HCMNamespace = gql`
  query applicationNamespaces($namespace: String!) {
    items: applicationNamespaces(namespace: $namespace) {
      metadata {
        annotations
        name
      }
    }
  }
`

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import gql from 'graphql-tag'

export const ApplicationsList = gql`
  query applicationsList {
    applications {
      _uid
      name
      selfLink
      namespace
      dashboard
      clusterCount
      labels
      remoteSubscriptionStatusCount
      podStatusCount
      hubSubscriptions {
        _uid
        status
        channel
      }
      created
    }
  }
`

//get counter data for all applications
export const GlobalApplicationsData = gql`
  query globalApplicationsData {
    globalAppData {
      clusterCount
      remoteSubscriptionStatusCount
      hubSubscriptionCount
      channelsCount
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
  query searchSchema {
    placementrules {
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

export const HCMApplication = gql`
  query getApplications($name: String!, $namespace: String!) {
    items: applications(name: $name, namespace: $namespace) {
      dashboard
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
      applicationRelationships {
        destination {
          kind
          name
        }
        metadata {
          annotations
          creationTimestamp
          labels
          name
          namespace
          resourceVersion
          selfLink
          status
          uid
        }
        raw
        source {
          kind
          name
        }
        type
      }
      applicationWorks {
        metadata {
          name
          namespace
          creationTimestamp
          labels
          selfLink
        }
        release
        status
        reason
        cluster
        result {
          chartName
          chartVersion
          chartURL
          namespace
          kubeKind
          kubeName
          kubeCluster
          description
          firstDeployed
          lastDeployed
          status
          version
        }
      }
      deployables {
        dependencies {
          kind
          name
        }
        deployer {
          chartName
          namespace
          repository
          version
          chartURL
          kubeKind
          kubeName
        }
        metadata {
          name
          namespace
          creationTimestamp
        }
        raw
      }
      placementBindings {
        metadata {
          name
          namespace
          creationTimestamp
          selfLink
        }
        placementRef {
          name
          kind
        }
        subjects {
          name
          kind
        }
        raw
      }
      placementPolicies {
        metadata {
          annotations
          name
          namespace
          creationTimestamp
          selfLink
        }
        clusterLabels
        clusterReplicas
        resourceSelector
        status
        raw
      }
      raw
      selector
    }
  }
`

export const createApplication = gql`
  mutation createApplication($application: [JSON]!) {
    createApplication(application: $application)
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
  mutation deleteResource($selfLink: String!, $childResources: JSON) {
    deleteResource(selfLink: $selfLink, childResources: $childResources)
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
    $resource: String!
    $action: String!
    $namespace: String
    $apiGroup: String
  ) {
    userAccess(
      resource: $resource
      action: $action
      namespace: $namespace
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

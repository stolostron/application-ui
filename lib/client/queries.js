/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import gql from 'graphql-tag'

export const HCMCluster = gql`
  query getSingleCluster($name: String!, $namespace: String!) {
    items: cluster(name: $name, namespace: $namespace) {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
      }
      nodes
      status
      clusterip
      consoleURL
      totalMemory
      totalStorage
      totalCPU
      klusterletVersion
      k8sVersion
    }
  }
`

export const HCMClusterList = gql`
  query getClusters {
    items: clusters {
      metadata {
        labels
        name
        namespace
        uid
        selfLink
      }
      nodes
      status
      clusterip
      consoleURL
      totalMemory
      totalStorage
      totalCPU
      klusterletVersion
      k8sVersion
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

export const HCMNodeList = gql`
  query getNodes {
    items: nodes {
      architecture
      capacity {
        cpu
      }
      cluster {
        metadata {
          name
        }
      }
      metadata {
        creationTimestamp
        labels
        name
      }
      osImage
      roles
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

// export const HCMApplicationList = gql`
//   query getApplications {
//     items: applications {
//       applicationRelationships {
//         metadata {
//           name
//           selfLink
//         }
//       }
//       applicationWorks {
//         metadata {
//           name
//           selfLink
//         }
//         status
//       }
//       dashboard
//       deployables {
//         metadata {
//           name
//           selfLink
//         }
//       }
//       metadata {
//         name
//         namespace
//         creationTimestamp
//         labels
//         selfLink
//       }
//       placementBindings {
//         metadata {
//           name
//           selfLink
//         }
//       }
//       placementPolicies {
//         metadata {
//           name
//           selfLink
//         }
//         status
//       }
//     }
//   }
// `

export const createPolicy = gql`
  mutation createPolicy($resources: [JSON]!) {
    createPolicy(resources: $resources)
  }
`

export const createCompliance = gql`
  mutation createCompliance($resources: [JSON]!) {
    createCompliance(resources: $resources)
  }
`

export const createApplication = gql`
  mutation createApplication($resources: [JSON]!) {
    createApplication(resources: $resources)
  }
`

export const createResources = gql`
  mutation createResources($resources: [JSON]!) {
    createResources(resources: $resources)
  }
`

export const updateResourceLabels = gql`
  mutation updateResourceLabels(
    $resourceType: String!
    $namespace: String!
    $name: String!
    $body: JSON
    $selfLink: String
    $resourcePath: String
  ) {
    updateResourceLabels(
      resourceType: $resourceType
      namespace: $namespace
      name: $name
      body: $body
      selfLink: $selfLink
      resourcePath: $resourcePath
    )
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

export const deleteHelm = gql`
  mutation deleteHelm($name: String!, $namespace: String!, $cluster: String!) {
    deleteHelm(name: $name, namespace: $namespace, cluster: $cluster)
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

export const HCMPodList = gql`
  query getPods {
    items: pods {
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

export const HCMPersistentVolumeList = gql`
  query getPVs {
    items: pvs {
      accessModes
      capacity
      claim
      claimRef
      cluster {
        clusterip
        metadata {
          name
        }
      }
      metadata {
        name
        creationTimestamp
        labels
        selfLink
      }
      reclaimPolicy
      status
      type
    }
  }
`

export const HCMPersistentVolumeClaimList = gql`
  query getPVsClaims {
    items: pvsClaims {
      accessModes
      cluster {
        clusterip
        metadata {
          name
          namespace
        }
      }
      metadata {
        name
        namespace
        creationTimestamp
        selfLink
      }
      persistentVolume
      requests
      status
    }
  }
`

export const HCMChartList = gql`
  query getCharts {
    items: charts {
      Name: name
      RepoName: repoName
      URLs: urls
    }
  }
`

export const HCMRelease = gql`
  query getRelease($name: String!, $namespace: String!, $clusterName: String) {
    items: release(
      name: $name
      namespace: $namespace
      clusterName: $clusterName
    ) {
      ChartName: chartName
      ChartVersion: chartVersion
      Namespace: namespace
      Status: status
      lastDeployed
      name
      cluster {
        clusterip
        metadata {
          name
        }
      }
    }
  }
`

export const HCMReleaseList = gql`
  query getReleases {
    items: releasesFromSearch {
      ChartName: chartName
      ChartVersion: chartVersion
      Namespace: namespace
      Status: status
      lastDeployed
      name
      cluster {
        clusterip
        metadata {
          name
        }
      }
    }
  }
`

export const HCMRepositoryList = gql`
  query getRepos {
    items: repos {
      Name
      URL
    }
  }
`

export const HCMSetRepository = gql`
  mutation setRepo($repo: HelmRepoInput) {
    setHelmRepo(input: $repo) {
      Name
      URL
    }
  }
`

export const HCMInstallHelmChart = gql`
  mutation installHelmChart($input: InstallHelmChartInput) {
    installHelmChart(input: $input) {
      Status: status
      code
      message
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

export const HCMPolicyList = gql`
  query getPolicies {
    items: policies {
      metadata {
        name
        namespace
      }
      status
      enforcement
    }
  }
`

export const HCMPolicy = gql`
  query getPolicies($name: String!, $namespace: String, $clusterName: String) {
    items: policies(
      name: $name
      namespace: $namespace
      clusterName: $clusterName
    ) {
      cluster
      metadata {
        name
        namespace
        selfLink
        creationTimestamp
        annotations
        resourceVersion
        uid
      }
      status
      enforcement
      detail {
        exclude_namespace
        include_namespace
      }
      raw
      roleTemplates {
        name
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      roleBindingTemplates {
        name
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      objectTemplates {
        name
        kind
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      violations {
        name
        cluster
        status
        message
        reason
        selector
      }
      rules {
        complianceType
        templateType
        ruleUID
        verbs
        apiGroups
        resources
      }
    }
  }
`

export const HCMComplianceList = gql`
  query getCompliances {
    items: compliances {
      metadata {
        name
        namespace
        selfLink
      }
      raw
      apiVersion
      policyCompliant
      clusterCompliant
      placementPolicies {
        metadata {
          name
          selfLink
        }
      }
      placementBindings {
        metadata {
          name
          selfLink
        }
      }
    }
  }
`

export const HCMCompliance = gql`
  query getSingleCompliance($name: String!, $namespace: String) {
    items: compliances(name: $name, namespace: $namespace) {
      raw
      metadata {
        creationTimestamp
        name
        namespace
        resourceVersion
        selfLink
        uid
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
      }
      complianceStatus {
        clusterNamespace
        localCompliantStatus
        localValidStatus
      }
      compliancePolicy {
        name
        status
        complianceName
        complianceNamespace
        complianceSelfLink
        roleTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        roleBindingTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        objectTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        detail
        raw
      }
      compliancePolicies {
        name
        clusterCompliant
        clusterNotCompliant
        complianceName
        complianceNamespace
        policies {
          name
          cluster
          compliant
          complianceName
          complianceNamespace
          valid
          enforcement
          status
          raw
          metadata {
            annotations
            creationTimestamp
            name
            resourceVersion
            selfLink
            uid
          }
          roleTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            raw
          }
          roleBindingTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            raw
          }
          objectTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            kind
            raw
          }
          rules {
            complianceType
            templateType
            ruleUID
            apiGroups
            verbs
            resources
          }
          violations {
            name
            cluster
            status
            message
            reason
            selector
          }
        }
      }
      policyCompliant
      clusterCompliant
    }
  }
`

export const createUserQueries = gql`
  mutation saveQuery($resource: JSON!) {
    saveQuery(resource: $resource)
  }
`

export const getLogs = gql`
  query getLogs(
    $containerName: String!
    $podName: String!
    $podNamespace: String!
    $clusterName: String!
  ) {
    logs(
      containerName: $containerName
      podName: $podName
      podNamespace: $podNamespace
      clusterName: $clusterName
    )
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

export const genericUpdate = gql`
  query updateResource(
    $selfLink: String
    $namespace: String
    $kind: String
    $name: String
    $body: JSON
    $cluster: String
  ) {
    updateResource(
      selfLink: $selfLink
      namespace: $namespace
      kind: $kind
      name: $name
      body: $body
      cluster: $cluster
    )
  }
`
export const CEMIncidentList = gql`
  query cemIncidents {
    items: cemIncidents {
      id
      createdTime
      lastChanged
      priority
      escalated
      correlationDetails
      incidentURL
      eventsURL
      timelineURL
      owner
      team
      state
      summary
      description
    }
  }
`
export const CEMIncident = gql`
  query cemIncidentsForApplication($name: String!) {
    items: cemIncidentsForApplication(name: $name) {
      id
      createdTime
      lastChanged
      priority
      escalated
      correlationDetails
      incidentURL
      eventsURL
      timelineURL
      owner
      team
      state
      summary
      description
    }
  }
`

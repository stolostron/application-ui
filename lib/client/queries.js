/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import gql from 'graphql-tag'

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
        consoleURL
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
        }
        metadata {
          name
          namespace
          creationTimestamp
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
        clusterSelector
        replicas
        resourceSelector
        status
        raw
      }
      raw
      selector
    }
  }
`

export const HCMApplicationList = gql`
  query getApplications {
    items: applications {
      applicationRelationships {
        metadata {
          name
          selfLink
        }
      }
      dashboard
      deployables {
        metadata {
          name
          selfLink
        }
      }
      metadata {
        name
        namespace
        creationTimestamp
        labels
        selfLink
      }
      placementPolicies {
        metadata {
          name
          selfLink
        }
        status
      }
    }
  }
`

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
export const updateResourceLabels = gql`
  mutation updateResourceLabels($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String, $resourcePath: String) {
    updateResourceLabels(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink, resourcePath: $resourcePath)
  }
`

export const updateResource = gql`
  mutation updateResource($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String) {
    updateResource(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink)
  }
`

export const deleteApplication = gql`
  mutation deleteApplication($path: String!, $resources: JSON) {
    deleteApplication(path: $path, resources: $resources)
  }
`

export const deletePolicy = gql`
  mutation deletePolicy($name: String!, $namespace: String!) {
    deletePolicy(name: $name, namespace: $namespace)
  }
`

export const deleteCompliance = gql`
  mutation deleteCompliance($name: String!, $namespace: String!) {
    deleteCompliance(name: $name, namespace: $namespace)
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
      metadata {
        creationTimestamp
        labels
        name
        namespace
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


export const HCMReleaseList = gql`
  query getReleases {
    items: releases {
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
      Name,
      URL
    }
  }
`

export const HCMSetRepository = gql`
    mutation setRepo($repo: HelmRepoInput){
      setHelmRepo(input: $repo){
        Name
        URL
    }
  }
`

export const HCMRemoveRepository = gql`
  mutation deleteHelmRepository($repo: HelmRepoInput) {
    deleteHelmRepository(input: $repo) {
      Name
      URL
    }
  }
`

export const HCMInstallHelmChart = gql`
  mutation installHelmChart($input: InstallHelmChartInput){
    installHelmChart(input: $input) {
      Status: status
      code
      message
    }
  }
`

export const HCMRemoveRelease = gql`
  mutation deleteHelmRelease($input: DeleteHelmReleaseInput) {
    deleteHelmRelease(input: $input) {
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
  query getTopology ($filter: Filter) {
    topology (filter: $filter) {
      resources {
        id
        uid
        name
        cluster
        type
        namespace
        topology
        labels {
          name
          value
        }
      }
      relationships {
        type
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

export const HCMDashboardList = gql`
  query getHCMDashboardQuery {
    dashboard {
      cardItems {
        name
        type
        healthy
        critical
        warning
        error
      }
    }
  }
`

// export const HCMFilterList = gql`
// query getResourceFilters {
//   filters {
//     clusterLabels {
//       name
//       id
//       key
//       value
//       type
//     }
//     clusterNames {
//       name
//       id
//       value
//       type
//     }
//   }
// }
// `

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
  query getPolicies($name: String!, $namespace: String) {
    items: policies(name: $name, namespace: $namespace) {
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
      message
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
    }
  }
`

export const HCMCompliance = gql`
  query getSingleCompliance($name: String!, $namespace: String) {
    items: compliances(name: $name, namespace: $namespace) {
      clusterSelector
      raw
      metadata {
        creationTimestamp
        name
        namespace
        resourceVersion
        selfLink
        uid
      }
      complianceStatus {
        clusterNamespace
        localCompliantStatus
        localValidStatus
      }
      compliancePolicies {
        name
        clusterCompliant
        clusterNotCompliant
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

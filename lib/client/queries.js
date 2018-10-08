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
        status
        uid
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
        }
        metadata {
          name
        }
        raw
      }
      placementPolicies {
        metadata {
          annotations
          name
          namespace
        }
        clusterSelector
        replicas
        resourceSelector
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
      dashboard
      deployables {
        metadata {
          name
        }
      }
      metadata {
        name
        namespace
        creationTimestamp
        labels
      }
      placementPolicies {
        metadata {
          name
        }
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

export const updateLabels = gql`
  mutation updateLabels($namespace: String!, $name: String!, $resourceType: String!, $labels: JSON) {
    updateLabels(namespace: $namespace, name: $name, resourceType: $resourceType, labels: $labels)
  }
`


export const deleteApplication = gql`
  mutation deleteApplication($namespace: String, $name: String!) {
    deleteApplication(namespace: $namespace, name: $name)
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
        table {
          status
          clusterIP
          resourceName
          percentage
          namespace
        }
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
      roleRef {
        apiGroup
        kind
        name
      }
      roleSubjects {
        apiGroup
        kind
        name
      }
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
      templates {
        name
        lastTransition
        complianceType
        apiVersion
        compliant
        validity
        selector
        templateType
      }
      rules {
        complianceType
        apiGroups
        resources
        verbs
        templateType
        ruleUID
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
      }
      policyCompliant
      clusterCompliant
    }
  }
`

export const HCMCompliance = gql`
  query getCompliances($name: String!, $namespace: String) {
    items: compliances(name: $name, namespace: $namespace) {
      clusterSelector
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
        metadata {
          annotations
          creationTimestamp
          name
          namespace
          resourceVersion
          selfLink
          uid
        }
        cluster
        compliant
        complianceName
        complianceNamespace
        valid
        enforcement
        status
        templates {
          name
          lastTransition
          complianceType
          apiVersion
          compliant
          validity
          templateType
          selector
        }
        rules {
          complianceType
          templateType
          ruleUID
        }
        violations {
          name
          cluster
          status
          message
          reason
          selector
        }
        roleRef {
          apiGroup
          kind
          name
        }
        roleSubjects {
          apiGroup
          kind
          name
        }
      }
      policyCompliant
      clusterCompliant
    }
  }
`

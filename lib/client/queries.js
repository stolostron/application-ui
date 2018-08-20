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
      name
      nodes
      namespace
      uid
      status
      createdAt
      clusterip
      totalMemory
      totalStorage
      labels
    }
  }
`

export const HCMApplication = gql`
  query getApplications($name: String!, $namespace: String!) {
    items: applications(name: $name, namespace: $namespace) {
      details {
        annotations
        creationTimestamp
        dashboard
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
        name
      }
      placementPolicies {
        name
      }
      selector
    }
  }
`

export const HCMApplicationList = gql`
  query getApplications {
    items: applications {
      details {
        name
        dashboard
        namespace
        creationTimestamp
        labels
      }
      deployables {
        name
      }
      placementPolicies {
        name
      }
    }
  }
`

export const createPolicy = gql`
  mutation createPolicy($resources: [JSON]!) {
    createPolicy(resources: $resources)
  }
`

export const deployApplication = gql`
  mutation deployApplication($appName: String!) {
    deployApplication(appName: $appName)
  }
`

export const registerApplication = gql`
  mutation registerApplication($yaml: String!) {
    registerApplication(yaml: $yaml)
  }
`

export const undeployApplication = gql`
  mutation undeployApplication($appName: String!) {
    undeployApplication(appName: $appName)
  }
`

export const deleteApplication = gql`
  mutation deleteApplication($appName: String!) {
    deleteApplication(appName: $appName)
  }
`

export const deletePolicy = gql`
  mutation deletePolicy($name: String!, $namespace: String!) {
    deletePolicy(name: $name, namespace: $namespace)
  }
`

export const HCMPodList = gql`
  query getPods {
    items: pods {
      cluster
      createdAt
      hostIP
      labels
      name
      namespace
      podIP
      startedAt
      status
      uid
    }
  }
`

export const HCMNodeList = gql`
  query getNodes{
    items: nodes {
      NodeName
      name
      cluster
      NodeDetails {
        Arch
        Status
        OSImage
        Cpu
        Labels
      }
    }
  }
`

export const HCMPersistentVolumeList = gql`
  query getPVs {
    items: pvs {
      PVName
      name
      cluster
      PVDetails {
        Status
        StorageClass
        Capacity
      }
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

export const HCMNamespaceList = gql`
  query getNamespaces {
    items: namespaces {
      name
      cluster
      status
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
      cluster
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
  mutation deleteHelmRepository($repo: DeleteHelmRepositoryInput) {
    deleteHelmRepository(input: $repo) {
      Name
      URL
    }
  }
`

export const HCMInstallHelmChart = gql`
  mutation installHelmChart($input: InstallHelmChartInput){
    installHelmChart(input: $input) {
      Status
      code
      message
    }
  }
`

export const HCMRemoveRelease = gql`
  mutation deleteHelmRelease($input: DeleteHelmReleaseInput) {
    deleteHelmRelease(input: $input) {
      Status
      code
      message
    }
  }
`

export const HCMTopologyFilters = gql`
  query getTopologyFilters {
    clusters {
      name
      labels
    }
    namespaces {
      name
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
        healthy
        critical
        warning
        table {
          status
          link
          resourceName
          percentage
        }
        error
      }
      pieChartItems {
        name
        data
      }
    }
  }
`

export const HCMFilterList = gql`
query getResourceFilters {
  filters {
    clusterLabels {
      name
      id
      key
      value
      type
    }
    clusterNames {
      name
      id
      value
      type
    }
  }
}
`

export const HCMPolicyList = gql`
  query getPolicies {
    items: policies {
      name
      namespace
      status
      enforcement
      detail {
        selfLink
        creationTime
      }
    }
  }
`

export const HCMPolicy = gql`
  query getPolicies($name: String!, $namespace: String) {
    items: policies(name: $name, namespace: $namespace) {
      name
      namespace
      status
      enforcement
      detail {
        selfLink
        creationTime
        exclude_namespace
        include_namespace
        annotations
        resourceVersion
        uid
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
    }
  }
`

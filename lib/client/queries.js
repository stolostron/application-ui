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
      ClusterName
      ClusterEndpoint
      Labels
      Status
      TotalNodes
      TotalStorage
      TotalCpus
      TotalMemory
      TotalPods
      TotalDeployments
      TotalServices
    }
  }
`

export const HCMApplicationList = gql`
  query getApplications {
    items: applications {
      Name
      Annotations
      Labels
      Components {
        Name
        Cluster
      }
      Dependencies {
        Name
        Cluster
      }
    }
  }
`

export const HCMPodList = gql`
  query getPods {
    items: pods {
      Namespace
      PodName
      name
      cluster
      State
      PDetails {
        Labels
      }
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
      Name
      RepoName
      URLs
    }
  }
`

export const HCMNamespaceList = gql`
  query getNamespaces {
    items: namespaces {
      name
      cluster
      Status
    }
  }
`

export const HCMReleaseList = gql`
  query getReleases{
    items: releases {
      ChartName
      ChartVersion
      HelmName
      Namespace
      Status
      name
      cluster
      HDetails {
        LastDeployed {
            seconds
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
      ClusterName
      Labels
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
      healthy
      name
      critical
      warning
      table {
        resourceName
        link
        status
        percentage
      }
    }
  }
`

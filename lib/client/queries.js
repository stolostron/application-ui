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
      Status
      TotalNodes
      TotalDeployments
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
        Status
        OSImage
        Cpu
        Labels {
          management
          master
          proxy
          role
          va
        }
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

export const HCMChartsList = gql`
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

export const HCMInstallHelmChart = gql`
  mutation installHelmChart($input: InstallHelmChartInput){
    installHelmChart(input: $input) {
      Status
    }
  }
`


export const HCMTopologyFilters = gql`
  query getTopologyFilters {
    clusters {
      ClusterName
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

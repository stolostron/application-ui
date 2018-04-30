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
    query {
        items: clusters {
            ClusterName
            Status
            TotalNodes
            TotalDeployments
        }
    }
`

export const HCMPodList = gql`
    query {
        items: pods {
            Namespace
            PodName
            name
            cluster
        }
    }
`
export const HCMNodeList = gql`
    query {
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
    query {
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

export const HCMNamespaceList = gql`
    query {
        items: namespaces {
            name
            cluster
            Status
        }
    }
`

export const HCMReleaseList = gql`
    query {
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

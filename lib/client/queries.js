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
    query getNodes {
        items: nodes {
            NodeName
            name
            cluster
        }
    }
`

export const HCMPersistentVolumeList = gql`
    query getPVS {
        items: pvs {
            PVName
            name
            cluster
        }
    }
`

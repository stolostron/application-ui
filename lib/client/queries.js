import gql from 'graphql-tag'

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

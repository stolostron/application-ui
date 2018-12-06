/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'
import { withClientState } from 'apollo-link-state'
import lodash from 'lodash'

import { RESOURCE_TYPES } from '../shared/constants'
import config from '../shared/config'
import * as Query from './queries'

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all'
  }
}


const stateLink = withClientState({
  cache: new InMemoryCache(),
  defaults: {
    searchInput: {
      __typename: 'SearchInput',
      text: '',
    },
  },
  resolvers: {
    Mutation: {
      updateNetworkStatus: (_, { isConnected }, { cache }) => {
        const data = {
          networkStatus: {
            __typename: 'NetworkStatus',
            isConnected
          },
        }
        cache.writeData({ data })
        return null
      },
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([stateLink, new HttpLink({
    uri: `${config.contextPath}/graphql`,
    credentials: 'same-origin',
    headers: {
      'XSRF-Token': document.cookie.split(';').find(cookie => cookie.indexOf('XSRF-TOKEN=') >=0 ).trim().substr(11),
    },
  }) ]),
  defaultOptions,
})

class apolloClient {

  getClient(){
    return client
  }

  // gets list
  get(resourceType, variables = {}) {
    return client.query({ query: lodash.get(Query, resourceType.list), variables })
  }

  // gets one resource
  getResource(resourceType, variables = {}) {
    return client.query({ query: lodash.get(Query, resourceType.name), variables })
  }

  getTopologyFilters(){
    return client.query({ query: Query.HCMTopologyFilters })
  }

  getLogs(containerName, podName, podNamespace, clusterName) {
    const variables = { containerName, podName, podNamespace, clusterName }
    return client.query({ query: Query.getLogs, variables })
  }

  createResource(resourceType, input){
    switch (resourceType.name) {
    case RESOURCE_TYPES.HCM_REPOSITORIES.name:
      return client.mutate({ mutation: Query.HCMSetRepository, variables: { repo: input } })
    default:
      console.error('Unable to handle creating resource of type', resourceType.name) // eslint-disable-line no-console
    }
  }

  installHelmChart(input) {
    return client.mutate({ mutation: Query.HCMInstallHelmChart, variables: { input } })
  }
  createPolicy(resources) {
    return client.mutate({ mutation: Query.createPolicy, variables: { resources } })
  }
  createCompliance(resources) {
    return client.mutate({ mutation: Query.createCompliance, variables: { resources } })
  }
  createApplication(resources){
    return client.mutate({ mutation: Query.createApplication, variables: { resources } })
  }
  createResources(resources){
    return client.mutate({ mutation: Query.createResources, variables: { resources } })
  }
  updateResource(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({ mutation: Query.updateResource, variables: { resourceType, namespace, name, body, selfLink, resourcePath } })
  }
  updateResourceLabels(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({ mutation: Query.updateResourceLabels, variables: { resourceType, namespace, name, body, selfLink, resourcePath } })
  }

  remove(resourceType, input) {
    switch(resourceType.name) {
    case RESOURCE_TYPES.HCM_RELEASES.name: {
      const queryInput = {
        chartName: input.ChartName,
        cluster: input.cluster,
        name: input.name,
        namespace: input.Namespace,
      }

      return client.mutate({ mutation: Query.HCMRemoveRelease, variables: { input: queryInput }})
    }
    case RESOURCE_TYPES.HCM_REPOSITORIES.name: {
      const queryInput = {
        Name: input.Name,
        URL: input.URL
      }
      return client.mutate({ mutation: Query.HCMRemoveRepository, variables: { repo: queryInput }})
    }
    case RESOURCE_TYPES.HCM_APPLICATIONS.name: {
      const appRes = input.selected.filter((res) => res.selected === true)
      return client.mutate({ mutation: Query.deleteApplication, variables: { path: input.metadata.selfLink, resources: appRes } })}
    case RESOURCE_TYPES.HCM_POLICIES.name: {
      return client.mutate({ mutation: Query.deletePolicy, variables: { name: input.metadata.name, namespace: input.metadata.namespace } })
    }
    case RESOURCE_TYPES.HCM_COMPLIANCES.name: {
      return client.mutate({ mutation: Query.deleteCompliance, variables: { name: input.metadata.name, namespace: input.metadata.namespace } })
    }
    case RESOURCE_TYPES.HCM_PODS.name: {
      return client.mutate({ mutation: Query.deletePod, variables: { name: input.metadata.name, namespace: input.metadata.namespace, cluster: input.cluster.metadata.name } })
    }
    default:
      console.error('Unable to handle removing resource of type', resourceType.name) // eslint-disable-line no-console
    }
  }
}

export default new apolloClient()

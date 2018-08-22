/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${config.contextPath}/graphql`,
    credentials: 'same-origin'
  }),
  defaultOptions
})

class apolloClient {

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
  deployApplication(appName){
    return client.mutate({ mutation: Query.deployApplication, variables: { appName } })
  }
  createApplication(resources){
    return client.mutate({ mutation: Query.createApplication, variables: { resources } })
  }
  undeployApplication(appName){
    return client.mutate({ mutation: Query.undeployApplication, variables: { appName } })
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
      return client.mutate({ mutation: Query.deleteApplication, variables: { name: input.details.name, namespace: input.details.namespace } })
    }
    case RESOURCE_TYPES.HCM_POLICIES.name: {
      return client.mutate({ mutation: Query.deletePolicy, variables: { name: input.name, namespace: input.namespace } })
    }
    case RESOURCE_TYPES.HCM_COMPLIANCES.name: {
      return client.mutate({ mutation: Query.deleteCompliance, variables: { name: input.name, namespace: input.namespace } })
    }
    default:
      console.error('Unable to handle removing resource of type', resourceType.name) // eslint-disable-line no-console
    }
  }
}

export default new apolloClient()

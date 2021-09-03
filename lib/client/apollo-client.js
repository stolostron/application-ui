/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from 'apollo-boost'
import fetch from 'cross-fetch'
import { withClientState } from 'apollo-link-state'
import { RetryLink } from 'apollo-link-retry'
import { onError } from 'apollo-link-error'
import _ from 'lodash'
import gql from 'graphql-tag'
import config from '../shared/config'
import * as Query from './queries'
import msgs from '../../nls/platform.properties'

const locale = 'en-US'
const newTabText = msgs.get('tabs.new.title', [1], locale)

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}

const typeDefs = gql`
  scalar JSON

  type Modal {
    open: Boolean
    type: String
    data: JSON
  }

  type SearchQueryTab {
    queryName: String
    description: String
    searchText: String
    updated: Boolean
    id: String
  }

  type SearchQueryTabs {
    unsavedCount: Int
    openedTabName: String
    openedTabId: String
    tabs: [SearchQueryTab]
  }

  type Query {
    modal: Modal
    searchQueryTabs: SearchQueryTabs
  }

  type Mutation {
    updateModal(
      __typename: String
      open: Boolean
      type: String
      data: JSON
    ): JSON
    updateActionModal(
      __typename: String
      open: Boolean
      type: String
      resourceType: JSON
      data: JSON
    ): JSON
  }
`

const stateLink = withClientState({
  cache: new InMemoryCache(),
  defaults: {
    searchInput: {
      __typename: 'SearchInput',
      text: ''
    },
    modal: {
      __typename: 'modal',
      open: false,
      type: '',
      data: {
        __typename: 'ModalData',
        name: '',
        searchText: '',
        description: ''
      }
    },
    actionModal: {
      __typename: 'actionModal',
      open: false,
      type: '',
      resourceType: {
        __typename: 'resourceType',
        name: '',
        list: ''
      },
      data: {
        __typename: 'ModalData',
        name: '',
        namespace: '',
        clusterName: '',
        selfLink: '',
        _uid: '',
        kind: '',
        apiVersion: '',
        itemGroup: []
      }
    },
    searchQueryTabs: {
      __typename: 'SearchQueryTabs',
      tabs: [
        {
          __typename: 'QueryTab',
          queryName: newTabText,
          searchText: '',
          description: '',
          updated: false,
          id: newTabText
        }
      ],
      // Default unsavedCount to 1 more than current unsaved amount (will always initally have 1 unsaved)
      unsavedCount: 2,
      openedTabName: newTabText,
      openedTabId: newTabText
    },
    relatedResources: {
      __typename: 'RelatedResources',
      visibleKinds: []
    }
  },
  typeDefs: typeDefs,
  resolvers: {
    Mutation: {
      updateModal: (_, variables, { cache }) => {
        const data = {
          modal: variables
        }
        cache.writeData({ data })
        return {}
      },
      updateActionModal: (_, variables, { cache }) => {
        const data = {
          actionModal: variables
        }
        cache.writeData({ data })
        return {}
      }
    }
  }
})

const getXsrfToken = () => {
  const token = document.getElementById('app-access')
    ? document.getElementById('app-access').value
    : ''
  return token.toString('ascii')
}

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: error => !!error
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(
      ({ message }) => console.error(`GraphQL Error: ${message}`) // eslint-disable-line no-console
    )
  if (networkError) console.error(`Network Error: ${networkError.message}`) // eslint-disable-line no-console
})

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    stateLink,
    retryLink,
    errorLink,
    new HttpLink({
      fetch,
      uri: `${config.contextPath}/graphql`,
      credentials: 'same-origin',
      headers: {
        'XSRF-Token': getXsrfToken()
      }
    })
  ]),
  defaultOptions
})

const searchClient = new ApolloClient({
  connectDevTools: process.env.NODE_ENV === 'development',
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    withClientState({
      cache: new InMemoryCache()
    }),
    retryLink,
    errorLink,
    new HttpLink({
      fetch,
      uri: `${config.contextPath}/search/graphql`,
      credentials: 'same-origin',
      headers: {
        'XSRF-Token': getXsrfToken()
      }
    })
  ]),
  defaultOptions
})

class apolloClient {
  getClient() {
    return client
  }

  getSearchClient() {
    return searchClient
  }

  // gets list
  get(resourceType, variables = {}) {
    const resourceList = _.get(Query, resourceType.list)
    if (resourceList) {
      return searchClient.query({ query: resourceList, variables })
    }
    return Promise.resolve()
  }

  // gets fallback to console-api
  fallback(resourceType, variables = {}) {
    const resourceFallback = _.get(Query, resourceType.fallback)
    if (resourceFallback) {
      return client.query({ query: resourceFallback, variables })
    }
    return Promise.resolve()
  }

  // Determines if user is able to perform a particular action on a resource
  getUserAccess(variables) {
    return client.query({ query: Query.userAccess, variables })
  }

  // Return a list of namespaces where the user can perform this particular action
  getUserAccessAllNamespaces(variables) {
    return client.query({ query: Query.userAccessAnyNamespaces, variables })
  }

  // gets application
  getApplication(variables) {
    return client.query({ query: Query.getApplication, variables })
  }

  // get applicationset related resources
  getApplicationSetRelatedResources(variables) {
    return client.query({
      query: Query.getApplicationSetRelatedResources,
      variables
    })
  }

  // get argo applications
  getArgoApplication(variables) {
    return client.query({ query: Query.getArgoApplication, variables })
  }

  // get Git channel branches
  getGitChannelBranches(variables) {
    return client.query({ query: Query.gitChannelBranches, variables })
  }

  // get Git channel paths
  getGitChannelPaths(variables) {
    return client.query({ query: Query.gitChannelPaths, variables })
  }

  // get Argo app route
  getArgoAppRouteURL(variables) {
    return client.query({ query: Query.argoAppRouteURL, variables })
  }

  // get Argo server namespace
  getArgoServerNS() {
    return client.query({ query: Query.argoServerNS })
  }

  // get managed cluster status
  getManagedClusterStatus(variables) {
    return client.query({ query: Query.managedClusterStatus, variables })
  }

  // get Route resource url
  getRouteResourceURL(variables) {
    return client.query({ query: Query.routeResourceURL, variables })
  }

  // gets one resource
  getResource(resourceType, variables = {}) {
    return client.query({
      query: _.get(Query, resourceType.name),
      variables
    })
  }
  getTopologyFilters() {
    return client.query({ query: Query.HCMTopologyFilters })
  }

  // general search
  search(q, variables = {}) {
    return searchClient.query({ query: q, variables })
  }

  createApplication(application) {
    return client.mutate({
      mutation: Query.createApplication,
      variables: { application }
    })
  }

  updateApplication(application) {
    return client.mutate({
      mutation: Query.updateApplication,
      variables: { application }
    })
  }

  createResources(resources) {
    return client.mutate({
      mutation: Query.createResources,
      variables: { resources }
    })
  }
  updateResource(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({
      mutation: Query.updateResource,
      variables: { resourceType, namespace, name, body, selfLink, resourcePath }
    })
  }

  remove(input) {
    return client.mutate({
      mutation: Query.deleteResource,
      variables: {
        apiVersion: input.apiVersion,
        kind: input.kind,
        name: input.name,
        namespace: input.namespace,
        selfLink: input.selfLink,
        childResources: input.childResources
      }
    })
  }
}

export default new apolloClient()

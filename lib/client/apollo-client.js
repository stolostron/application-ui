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
import gql from 'graphql-tag'
import { RESOURCE_TYPES } from '../shared/constants'
import config from '../shared/config'
import * as Query from './queries'
import { GET_SEARCH_TABS } from '../../src-web/apollo-client/queries/SearchQueries'

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
    updateModal(__typename: String, open: Boolean, type: String, data: JSON): JSON
    updateActionModal(__typename: String, open: Boolean, type: String, resourceType: JSON, data: JSON): JSON
    updateQueryTabs(__typename: String, unsavedCount: Int, openedTabName: String, openedTabId: String, data: JSON, tabs: [JSON]): JSON
    updateSingleQueryTab(openedTabName: String, openedTabId: String, description: String, searchText: String, updateUnsavedOrExisting: Boolean): JSON
    removeSingleQueryTab(id: String): JSON
  }
`

const stateLink = withClientState({
  cache: new InMemoryCache(),
  defaults: {
    searchInput: {
      __typename: 'SearchInput',
      text: '',
    },
    modal: {
      __typename: 'modal',
      open: false,
      type:'',
      data: {
        __typename: 'ModalData',
        name: '',
        searchText:'',
        description:''
      }
    },
    actionModal: {
      __typename: 'actionModal',
      open: false,
      type:'',
      resourceType: {
        __typename: 'resourceType',
        name: '',
        list: ''
      },
      data: {
        __typename: 'ModalData',
        item: '',
        errors: ''
      }
    },
    searchQueryTabs: {
      __typename: 'SearchQueryTabs',
      tabs: [{
        __typename: 'QueryTab',
        queryName: 'New Search (Unsaved)',
        searchText:'',
        description:'',
        updated: false,
        id: 'New Search (Unsaved)'
      }],
      unsavedCount: 1,
      openedTabName: 'New Search (Unsaved)',
      openedTabId: 'New Search (Unsaved)'
    },
    relatedResources: {
      __typename: 'RelatedResources',
      visibleKinds: []
    }
  },
  typeDefs: typeDefs,
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
      },
      updateQueryTabs: (_, variables, { cache }) => {
        const updated = lodash.cloneDeep(variables)
        const data = cache.readQuery({query: GET_SEARCH_TABS})
        const tabs = lodash.get(data, 'searchQueryTabs.tabs', [])
        const unsavedCount = lodash.get(data, 'searchQueryTabs.unsavedCount', 1)
        if (updated.data) {
          updated.tabs = [...tabs, updated.data]
        }
        if (!variables.unsavedCount) updated.unsavedCount = unsavedCount
        delete updated.data
        const updatedData = {
          searchQueryTabs: updated
        }
        cache.writeData({ data: updatedData })
        return {}
      },
      updateSingleQueryTab: (_, variables, { cache }) => {
        const data = cache.readQuery({query: GET_SEARCH_TABS})
        const unsavedCount = lodash.get(data, 'searchQueryTabs.unsavedCount', 0)
        const tabs = lodash.get(data, 'searchQueryTabs.tabs', [])
        const index = tabs.findIndex(tab => tab.id === variables.openedTabId)
        if (variables.updateUnsavedOrExisting) {
          if (index !== -1) {
            tabs[index].searchText = variables.searchText
            tabs[index].queryName = variables.openedTabName
            tabs[index].id = variables.openedTabName + '-' + Date.now()
            tabs[index].description = variables.description
            tabs[index].updated = false
          }
          if (unsavedCount) {
            data.searchQueryTabs.unsavedCount = unsavedCount - 1
          }
          cache.writeData({ data })
        } else {
          if (index !== -1) {
            tabs[index].searchText = variables.searchText
            tabs[index].updated = true
          }
          cache.writeData({ data })
        }
        return {}
      },
      removeSingleQueryTab: (_, variables, { cache }) => {
        const data = cache.readQuery({query: GET_SEARCH_TABS})
        const tabs = lodash.get(data, 'searchQueryTabs.tabs', [])
        const index = tabs.findIndex(tab => tab.id === variables.id)

        if (index !== -1 && tabs.length > 1) {
          tabs.splice(index, 1)
          if (index >= tabs.length) {
            data.searchQueryTabs.openedTabName = tabs[index - 1].queryName
            data.searchQueryTabs.openedTabId = tabs[index - 1].id
          } else {
            data.searchQueryTabs.openedTabName = tabs[index].queryName
            data.searchQueryTabs.openedTabId = tabs[index].id
          }
        }

        cache.writeData({ data })
        return {}
      }
    },
  }
})

const client = new ApolloClient({
  connectToDevTools: true,
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

  // get logs
  getLogs(containerName, podName, podNamespace, clusterName) {
    const variables = { containerName, podName, podNamespace, clusterName }
    return client.query({ query: Query.getLogs, variables })
  }

  // gets list
  get(resourceType, variables = {}) {
    const resourceList = lodash.get(Query, resourceType.list)
    if (resourceList) {
      return client.query({ query: resourceList, variables })
    }
    return Promise.resolve()
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
  createApplication(resources){
    return client.mutate({ mutation: Query.createApplication, variables: { resources } })
  }
  saveUserQueries(resource){
    return client.mutate({ mutation: Query.createUserQueries, variables: { resource } })
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
  deleteUserQueries(resource) {
    return client.mutate({ mutation: Query.removeQuery, variables: {resource}})
  }

  remove(resourceType, input) {
    switch(resourceType.name) {
    case RESOURCE_TYPES.HCM_RELEASES.name: {
      return client.mutate({ mutation: Query.deleteHelm, variables: { name: input.name, namespace: input.Namespace, cluster: input.cluster.metadata.name } })
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
      if (input.metadata) {
        return client.mutate({ mutation: Query.deleteApplication, variables: { path: input.metadata.selfLink, resources: appRes } })
      }
      return client.mutate({ mutation: Query.deleteApplication, variables: { path: input.selfLink, resources: appRes } })
    }
    case RESOURCE_TYPES.HCM_POLICIES.name: {
      if (input.metadata) {
        return client.mutate({ mutation: Query.deletePolicy, variables: { name: input.metadata.name, namespace: input.metadata.namespace } })
      }
      return client.mutate({ mutation: Query.deletePolicy, variables: { name: input.name, namespace: input.namespace } })
    }
    case RESOURCE_TYPES.HCM_COMPLIANCES.name: {
      const comRes = input.selected.filter((res) => res.selected === true)
      if (input.metadata) {
        return client.mutate({ mutation: Query.deleteCompliance, variables: { name: input.metadata.name, namespace: input.metadata.namespace, resources: comRes } })
      }
      return client.mutate({ mutation: Query.deleteCompliance, variables: { name: input.name, namespace: input.namespace, resources: comRes } })
    }
    case RESOURCE_TYPES.HCM_PODS.name: {
      if (input.metadata) {
        return client.mutate({ mutation: Query.deletePod, variables: { name: input.metadata.name, namespace: input.metadata.namespace, cluster: input.cluster.metadata.name } })
      }
      return client.mutate({ mutation: Query.deletePod, variables: { name: input.name, namespace: input.namespace, cluster: input.cluster } })
    }
    default:
      console.error('Unable to handle removing resource of type', resourceType.name) // eslint-disable-line no-console
    }
  }
}

export default new apolloClient()

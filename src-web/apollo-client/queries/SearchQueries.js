/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import gql from 'graphql-tag'

export const GET_RESOURCE = gql`
  query getResource(
    $selfLink: String
    $namespace: String
    $kind: String
    $name: String
    $cluster: String
  ) {
    getResource(
      selfLink: $selfLink
      namespace: $namespace
      kind: $kind
      name: $name
      cluster: $cluster
    )
  }
`

export const GET_SEARCH_SCHEMA = gql`
  query searchSchema {
    searchSchema
  }
`

export const GET_SEARCH_COMPLETE = gql`
  query searchComplete($property: String!, $query: SearchInput) {
    searchComplete(property: $property, query: $query)
  }
`

export const GET_SEARCH_INPUT_TEXT = gql`
  {
    searchInput @client {
      text
    }
  }
`

export const GET_SEARCH_TABS = gql`
  {
    searchQueryTabs @client {
      unsavedCount
      openedTabName
      openedTabId
      tabs {
        queryName
        searchText
        description
        updated
        id
      }
    }
  }
`

export const GET_RELATED_RESOURCES = gql`
  {
    relatedResources @client {
      visibleKinds
    }
  }
`

export const SEARCH_QUERY = gql`
  query searchResult($input: [SearchInput]) {
    searchResult: search(input: $input) {
      items
    }
  }
`

export const SEARCH_QUERY_RELATED = gql`
  query searchResult($input: [SearchInput]) {
    searchResult: search(input: $input) {
      items
      related {
        kind
        items
      }
    }
  }
`

export const GET_SAVED_USER_QUERY = gql`
  query userQueries {
    items: userQueries {
      name
      description
      searchText
    }
  }
`

export const SAVE_USER_QUERY = gql`
  mutation saveQuery($resource: JSON!) {
    saveQuery(resource: $resource)
  }
`

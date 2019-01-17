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

export const SEARCH_QUERY = gql`
  query searchResult($input: [SearchInput]) {
    searchResult: search(input: $input){
      count
      items
      updatedTimestamp
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

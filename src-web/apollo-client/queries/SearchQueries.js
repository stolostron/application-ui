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
  query searchResult($keywords: [String], $filters: [SearchFilter]) {
    searchResult: search(keywords: $keywords, filters: $filters){
      items
      relatedResources {
        kind
        count
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

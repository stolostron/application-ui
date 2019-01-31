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

export const GET_MODAL_STATE = gql`
  {
    modal @client {
      open
      type
      data {
        name
        description
        searchText
      }
    }
  }
`

export const UPDATE_MODAL = gql`
  mutation UpdateModal($__typename: String, $open: Boolean, $type: String, $data: JSON) {
    updateModal(__typename: $__typename, open:$open, type:$type, data:$data) @client
  }
`

export const UPDATE_QUERY_TABS = gql`
  mutation UpdateQueryTabs($__typename: String, $unsavedCount: Int, $openedTabName: String, $data: JSON, $tabs: [JSON]) {
    updateQueryTabs(__typename: $__typename, unsavedCount:$unsavedCount, openedTabName:$openedTabName, data:$data, tabs: $tabs) @client
  }
`

export const UPDATE_SINGLE_QUERY_TAB = gql`
  mutation UpdateSingleQueryTab($openedTabName: String, $description: String, $searchText: String, $updateUnsavedOrExisting: Boolean) {
    updateSingleQueryTab(openedTabName: $openedTabName, description: $description, searchText:$searchText, updateUnsavedOrExisting:$updateUnsavedOrExisting) @client
  }
`

export const REMOVE_SINGLE_QUERY_TAB = gql`
  mutation RemoveSingleQueryTab($queryName: String) {
    removeSingleQueryTab(queryName: $queryName) @client
  }
`

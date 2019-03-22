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

export const GET_ACTION_MODAL_STATE = gql`
  {
    actionModal @client {
      open
      type
      resourceType {
        name
        list
      }
      data {
        item
      }
    }
  }
`

export const UPDATE_MODAL = gql`
  mutation UpdateModal($__typename: String, $open: Boolean, $type: String, $data: JSON) {
    updateModal(__typename: $__typename, open:$open, type:$type, data:$data) @client
  }
`

export const UPDATE_ACTION_MODAL = gql`
  mutation UpdateActionModal($__typename: String, $open: Boolean, $type: String, $resourceType: JSON, $data: JSON) {
    updateActionModal(__typename: $__typename, open:$open, type:$type, resourceType:$resourceType, data:$data) @client
  }
`

export const UPDATE_QUERY_TABS = gql`
  mutation UpdateQueryTabs($__typename: String, $unsavedCount: Int, $openedTabName: String, $openedTabId: String, $data: JSON, $tabs: [JSON]) {
    updateQueryTabs(__typename: $__typename, unsavedCount:$unsavedCount, openedTabName:$openedTabName, openedTabId:$openedTabId, data:$data, tabs: $tabs) @client
  }
`

export const UPDATE_SINGLE_QUERY_TAB = gql`
  mutation UpdateSingleQueryTab($openedTabName: String, $openedTabId: String, $description: String, $searchText: String, $updateUnsavedOrExisting: Boolean) {
    updateSingleQueryTab(openedTabName: $openedTabName, openedTabId: $openedTabId, description: $description, searchText:$searchText, updateUnsavedOrExisting:$updateUnsavedOrExisting) @client
  }
`

export const REMOVE_SINGLE_QUERY_TAB = gql`
  mutation RemoveSingleQueryTab($id: String) {
    removeSingleQueryTab(id: $id) @client
  }
`

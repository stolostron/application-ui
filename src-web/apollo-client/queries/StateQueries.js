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
        apiVersion
        name
        namespace
        clusterName
        selfLink
        _uid
        kind
        itemGroup {
          destinationNamespace
          name
          _uid
        }
      }
    }
  }
`

export const UPDATE_MODAL = gql`
  mutation UpdateModal(
    $__typename: String
    $open: Boolean
    $type: String
    $data: JSON
  ) {
    updateModal(__typename: $__typename, open: $open, type: $type, data: $data)
      @client
  }
`

export const UPDATE_ACTION_MODAL = gql`
  mutation UpdateActionModal(
    $__typename: String
    $open: Boolean
    $type: String
    $resourceType: JSON
    $data: JSON
  ) {
    updateActionModal(
      __typename: $__typename
      open: $open
      type: $type
      resourceType: $resourceType
      data: $data
    ) @client
  }
`

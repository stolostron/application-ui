/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow
import { createAction } from '../../shared/utils/state'
import { convertStringToQuery } from '../../../lib/client/search-helper'
import { SEARCH_QUERY_RELATED } from '../../apollo-client/queries/SearchQueries'
// import R from 'ramda'

const SET_DEPLOYABLE_DATA = 'SET_DEPLOYABLE_DATA'
const SET_LOADING = 'SET_LOADING'

export const initialStateDeployables = {
  displaySubscriptionModal: false,
  deployableData: {}
}
export const DeployablesReducer = (state = initialStateDeployables, action) => {
  switch (action.type) {
  case SET_DEPLOYABLE_DATA: {
    return {
      ...state,
      deployableData: action.payload
    }
  }
  case SET_LOADING: {
    return { ...state, loading: action.payload }
  }
  default:
    return state
  }
}
export default DeployablesReducer

export const setDeployables = createAction(SET_DEPLOYABLE_DATA)
export const setLoading = createAction(SET_LOADING)

// ApolloClient requires CONTEXT so I have to pass it in from a file where it
// can be defined with context.
export const fetchDeployableResource = (apolloClient, name) => {
  const queryString = convertStringToQuery(`kind:deployable name:${name}`)
  return dispatch => {
    dispatch(setLoading(true))
    return apolloClient
      .search(SEARCH_QUERY_RELATED, {
        input: [queryString]
      })
      .then(response => {
        dispatch(setLoading(false))
        return dispatch(setDeployables(response))
      })
      .catch(err => {
        dispatch(setLoading(false))
        dispatch(setDeployables(err))
      })
  }
}

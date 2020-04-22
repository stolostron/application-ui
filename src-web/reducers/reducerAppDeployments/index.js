/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow
import { createAction } from '../../shared/utils/state'

import R from 'ramda'

const OPEN_DISPLAY_SUBSCRIPTION_MODAL = 'OPEN_DISPLAY_SUBSCRIPTION_MODAL'
const UPDATE_APP_DROPDOWN_LIST = 'UPDATE_APP_DROPDOWN_LIST'
const SET_BULK_SUBSCRIPTION_LIST = 'SET_BULK_SUBSCRIPTION_LIST'
const SET_BULK_SUBSCRIPTION_ERROR = 'SET_BULK_SUBSCRIPTION_ERROR'
const SET_SUBSCRIPTION_MODAL_HEADERS = 'SET_SUBSCRIPTION_MODAL_HEADERS'
const SET_DEPLOYABLE_SUBSCRIPTION_INFO = 'SET_DEPLOYABLE_SUBSCRIPTION_INFO'
const SET_SUBSCRIPTION_MODAL_DATA = 'SET_SUBSCRIPTION_MODAL_DATA'
const SET_DEPLOYMENT_SEARCH = 'SET_DEPLOYMENT_SEARCH'
const SET_CURRENT_CHANNEL_INFO = 'SET_CURRENT_CHANNEL_INFO'
const SET_CURRENT_APPLICATION_INFO = 'SET_CURRENT_APPLICATION_INFO'
const SET_CURRENT_SUBSCRIPTION_INFO = 'SET_CURRENT_SUBSCRIPTION_INFO'
const SET_CURRENT_PLACEMENT_RULE_INFO = 'SET_CURRENT_PLACEMENT_RULE_INFO'
const SET_LOADING = 'SET_LOADING'
const CLOSE_MODALS = 'CLOSE_MODALS'
const CLEAR_APP_DROPDOWN_LIST = 'CLEAR_APP_DROPDOWN_LIST'

export const initialStateDeployments = {
  displaySubscriptionModal: false,
  subscriptionModalHeaderInfo: {
    application: '',
    subscription: ''
  },
  appDropDownList: [],
  subscriptionModalSubscriptionInfo: {},
  subscriptionModalData: [],
  deploymentPipelineSearch: '',
  currentChannelInfo: {},
  currentApplicationInfo: {},
  currentPlacementRuleInfo: {},
  currentSubscriptionInfo: {},
  bulkSubscriptionList: [],
  bulkSubscriptionError: '',
  openEditChannelModal: false,
  openEditApplicationModal: false,
  openEditSubscriptionModal: false,
  openEditPlacementRuleModal: false,
  loading: false
}
export const AppDeployments = (state = initialStateDeployments, action) => {
  switch (action.type) {
  case OPEN_DISPLAY_SUBSCRIPTION_MODAL: {
    return { ...state, displaySubscriptionModal: true }
  }
  case SET_SUBSCRIPTION_MODAL_HEADERS: {
    // Verify Contents makes sure the data is coming in properly
    const verifiedContents = {
      application: action.payload.application || '',
      subscription: action.payload.subscription || ''
    }
    return { ...state, subscriptionModalHeaderInfo: verifiedContents }
  }
  case SET_DEPLOYABLE_SUBSCRIPTION_INFO: {
    return { ...state, subscriptionModalSubscriptionInfo: action.payload }
  }
  case SET_SUBSCRIPTION_MODAL_DATA: {
    return { ...state, subscriptionModalData: action.payload }
  }
  case SET_BULK_SUBSCRIPTION_LIST: {
    return { ...state, bulkSubscriptionList: action.payload }
  }
  case SET_BULK_SUBSCRIPTION_ERROR: {
    return { ...state, bulkSubscriptionError: action.payload }
  }
  case UPDATE_APP_DROPDOWN_LIST: {
    const containsApp = state.appDropDownList.includes(action.payload)
    // if it contains the application, remove it
    if (containsApp) {
      // Gather all names that are not in the payload to form the new list
      // This basically removes the payload from the appDeployables
      const filterRemoveName = name => name !== action.payload
      const newList = R.filter(filterRemoveName, state.appDropDownList)
      return { ...state, appDropDownList: newList }
    } else {
      // if its not there add it
      const newList = state.appDropDownList.concat([action.payload])
      return { ...state, appDropDownList: newList }
    }
  }
  case CLEAR_APP_DROPDOWN_LIST: {
    return { ...state, appDropDownList: [] }
  }
  case SET_DEPLOYMENT_SEARCH: {
    if (action.payload) {
      return { ...state, deploymentPipelineSearch: action.payload }
    }
    return { ...state, deploymentPipelineSearch: '' }
  }
  case SET_CURRENT_CHANNEL_INFO: {
    return {
      ...state,
      openEditChannelModal: true,
      currentChannelInfo: action.payload
    }
  }
  case SET_CURRENT_APPLICATION_INFO: {
    return {
      ...state,
      openEditApplicationModal: true,
      currentApplicationInfo: action.payload
    }
  }
  case SET_CURRENT_SUBSCRIPTION_INFO: {
    return {
      ...state,
      openEditSubscriptionModal: true,
      currentSubscriptionInfo: action.payload
    }
  }
  case SET_CURRENT_PLACEMENT_RULE_INFO: {
    return {
      ...state,
      openEditPlacementRuleModal: true,
      currentPlacementRuleInfo: action.payload
    }
  }
  case SET_LOADING: {
    return { ...state, loading: action.payload }
  }
  case CLOSE_MODALS: {
    return {
      ...state,
      displaySubscriptionModal: false,
      openEditChannelModal: false,
      openEditApplicationModal: false,
      openEditSubscriptionModal: false,
      openEditPlacementRuleModal: false
    }
  }
  default:
    return state
  }
}
export default AppDeployments

export const setDeploymentSearch = createAction(SET_DEPLOYMENT_SEARCH)
export const setBulkSubscriptionList = createAction(SET_BULK_SUBSCRIPTION_LIST)
export const setBulkSubscriptionError = createAction(
  SET_BULK_SUBSCRIPTION_ERROR
)
export const setSubscriptionModalHeaderInfo = createAction(
  SET_SUBSCRIPTION_MODAL_HEADERS
)
export const setCurrentDeployableSubscriptionData = createAction(
  SET_DEPLOYABLE_SUBSCRIPTION_INFO
)
export const setCurrentsubscriptionModalData = createAction(
  SET_SUBSCRIPTION_MODAL_DATA
)
export const openDisplaySubscriptionModal = createAction(
  OPEN_DISPLAY_SUBSCRIPTION_MODAL
)
export const updateAppDropDownList = createAction(UPDATE_APP_DROPDOWN_LIST)
export const clearAppDropDownList = createAction(CLEAR_APP_DROPDOWN_LIST)
const setCurrentApplicationInfo = createAction(SET_CURRENT_APPLICATION_INFO)
const setCurrentChannelInfo = createAction(SET_CURRENT_CHANNEL_INFO)
const setCurrentSubscriptionInfo = createAction(SET_CURRENT_SUBSCRIPTION_INFO)
const setCurrentPlacementRuleInfo = createAction(
  SET_CURRENT_PLACEMENT_RULE_INFO
)
const setLoading = createAction(SET_LOADING)
export const closeModals = createAction(CLOSE_MODALS)

// ApolloClient requires CONTEXT so I have to pass it in from a file where it
// can be defined with context.
export const fetchApplicationResource = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  return dispatch => {
    dispatch(setLoading(true))
    return apolloClient
      .getResource(
        { name: 'HCMApplication', list: 'HCMApplicationList' },
        {
          selfLink: `${selfLink}`,
          namespace: `${namespace}`,
          kind: 'application',
          name: `${name}`,
          cluster: `${cluster}`
        }
      )
      .then(response => {
        dispatch(setLoading(false))
        return dispatch(setCurrentApplicationInfo(response))
      })
      .catch(err => {
        dispatch(setLoading(false))
        dispatch(setCurrentApplicationInfo(err))
      })
  }
}

// ApolloClient requires CONTEXT so I have to pass it in from a file where it
// can be defined with context.
export const fetchChannelResource = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  return dispatch => {
    dispatch(setLoading(true))
    return apolloClient
      .getResource(
        { name: 'HCMChannel', list: 'HCMChannelList' },
        {
          selfLink: `${selfLink}`,
          namespace: `${namespace}`,
          kind: 'channels',
          name: `${name}`,
          cluster: `${cluster}`
        }
      )
      .then(response => {
        dispatch(setLoading(false))
        return dispatch(setCurrentChannelInfo(response))
      })
      .catch(err => {
        dispatch(setLoading(false))
        dispatch(setCurrentChannelInfo(err))
      })
  }
}

// ApolloClient requires CONTEXT so I have to pass it in from a file where it
// can be defined with context.
export const fetchSubscriptionResource = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  return dispatch => {
    dispatch(setLoading(true))
    return apolloClient
      .getResource(
        { name: 'HCMSubscription', list: 'HCMSubscriptionList' },
        {
          selfLink: `${selfLink}`,
          namespace: `${namespace}`,
          kind: 'subscription',
          name: `${name}`,
          cluster: `${cluster}`
        }
      )
      .then(response => {
        dispatch(setLoading(false))
        return dispatch(setCurrentSubscriptionInfo(response))
      })
      .catch(err => {
        dispatch(setLoading(false))
        dispatch(setCurrentSubscriptionInfo(err))
      })
  }
}

export const fetchPlacementRuleResource = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  return dispatch => {
    dispatch(setLoading(true))
    return apolloClient
      .getResource(
        { name: 'HCMPlacementRule', list: 'HCMPlacementRuleList' },
        {
          selfLink: `${selfLink}`,
          namespace: `${namespace}`,
          kind: 'placementrule',
          name: `${name}`,
          cluster: `${cluster}`
        }
      )
      .then(response => {
        dispatch(setLoading(false))
        return dispatch(setCurrentPlacementRuleInfo(response))
      })
      .catch(err => {
        dispatch(setLoading(false))
        dispatch(setCurrentPlacementRuleInfo(err))
      })
  }
}

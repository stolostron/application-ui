/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
import { createAction } from '../../shared/utils/state'
import apolloClient from '../../../lib/client/apollo-client'

const OPEN_DISPLAY_DEPLOYABLE_MODAL = 'OPEN_DISPLAY_DEPLOYABLE_MODAL'
const SET_DEPLOYABLE_MODAL_HEADERS = 'SET_DEPLOYABLE_MODAL_HEADERS'
const SET_DEPLOYABLE_SUBSCRIPTION_INFO = 'SET_DEPLOYABLE_SUBSCRIPTION_INFO'
const SET_DEPLOYMENT_SEARCH = 'SET_DEPLOYMENT_SEARCH'
const SET_CURRENT_CHANNEL_INFO = 'SET_CURRENT_CHANNEL_INFO'
const SET_LOADING = 'SET_LOADING'
const CLOSE_MODALS = 'CLOSE_MODALS'

export const initialStateDeployments = {
  displayDeployableModal: false,
  deployableModalHeaderInfo: {
    application: '',
    deployable: ''
  },
  deployableModalSubscriptionInfo: {},
  deploymentPipelineSearch: '',
  currentChannelInfo: {},
  openEditChannelModal: false,
  loading: false
}

export const AppDeployments = (state = initialStateDeployments, action) => {
  switch (action.type) {
  case OPEN_DISPLAY_DEPLOYABLE_MODAL: {
    return { ...state, displayDeployableModal: true }
  }
  case SET_DEPLOYABLE_MODAL_HEADERS: {
    // Verify Contents makes sure the data is coming in properly
    const verifiedContents = {
      application: action.payload.application || '',
      deployable: action.payload.deployable || ''
    }
    return { ...state, deployableModalHeaderInfo: verifiedContents }
  }
  case SET_DEPLOYABLE_SUBSCRIPTION_INFO: {
    return { ...state, deployableModalSubscriptionInfo: action.payload }
  }
  case SET_DEPLOYMENT_SEARCH: {
    return { ...state, deploymentPipelineSearch: action.payload }
  }
  case SET_CURRENT_CHANNEL_INFO: {
    return { ...state,
      openEditChannelModal: true,
      currentChannelInfo: action.payload
    }
  }
  case SET_LOADING: {
    return { ...state, loading: action.payload }
  }
  case CLOSE_MODALS: {
    return { ...state,
      displayDeployableModal: false,
      openEditChannelModal: false
    }
  }
  default:
    return state
  }
}
export default AppDeployments

export const setDeploymentSearch = createAction(SET_DEPLOYMENT_SEARCH)
export const setDeployableModalHeaderInfo = createAction(
  SET_DEPLOYABLE_MODAL_HEADERS
)
export const setCurrentDeployableSubscriptionData = createAction(
  SET_DEPLOYABLE_SUBSCRIPTION_INFO
)
export const openDisplayDeployableModal = createAction(
  OPEN_DISPLAY_DEPLOYABLE_MODAL
)
const setCurrentChannelInfo = createAction(SET_CURRENT_CHANNEL_INFO)
export const closeModals = createAction(CLOSE_MODALS)

export const fetchChannelResource = (selfLink, namespace, name, cluster) => {
  return dispatch => {
    return apolloClient
      .getResource({name: 'HCMChannel', list: 'HCMChannelList'}, {selfLink:`${selfLink}`, namespace:`${namespace}`, kind:'channels', name:`${name}`, cluster:`${cluster}`})
      .then(response => {
        return dispatch(setCurrentChannelInfo(response))
      })
      .catch(err => {
        dispatch(setCurrentChannelInfo(err))
      })
  }
}

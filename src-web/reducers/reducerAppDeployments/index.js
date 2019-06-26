/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/



// TODO TODO TODO TODO TODO TODO
// Most of this file will need to be modified, just kept the basic format in
// with examples
// TODO TODO TODO TODO TODO TODO



// @flow
/* eslint-disable no-console */
import { createAction } from '../../shared/utils/state'
import mapDeployments from '../data-mappers/mapAllDeployments'

const SET_DEPLOYMENTS = 'SET_DEPLOYMENTS'
const SET_LOADING = 'SET_LOADING'

export const initialStateDeployments = {
  deployments: [],
  loading: false,
}

const repositories = (state = initialStateDeployments, action) => {
  switch (action.type) {
  case SET_DEPLOYMENTS: {
    return { ...state, repositories: action.payload }
  }
  case SET_LOADING: {
    return { ...state, loading: action.payload }
  }
  default:
    return state
  }
}
export default repositories

const setDeployments = createAction(SET_DEPLOYMENTS)
const setLoading = createAction(SET_LOADING)

export const fetchDeployments = () => {
  return (dispatch) => {
    dispatch(setLoading(true))
    fetchDeployments()
      .then((response) => {
        if (response.length > 0) {
          const newRepos = response.map(eachRepo => mapDeployments(eachRepo))
          dispatch(setDeployments(newRepos))
        } else {
          dispatch(setLoading(false))
        }
      })
      .catch((err) => {
        console.warn(err)
        dispatch(setLoading(false))
      })
  }
}

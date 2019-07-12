/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
/* eslint-disable no-console */
import { createAction } from '../../shared/utils/state';
// import mapDeployments from '../data-mappers/mapAllDeployments'

const SET_DEPLOYMENT_SEARCH = 'SET_DEPLOYMENT_SEARCH';
const SET_LOADING = 'SET_LOADING';

export const initialStateDeployments = {
  deploymentPipelineSearch: '',
  loading: false,
};

export const AppDeployments = (state = initialStateDeployments, action) => {
  switch (action.type) {
    case SET_DEPLOYMENT_SEARCH: {
      return { ...state, deploymentPipelineSearch: action.payload };
    }
    case SET_LOADING: {
      return { ...state, loading: action.payload };
    }
    default:
      return state;
  }
};
export default AppDeployments;

export const setDeploymentSearch = createAction(SET_DEPLOYMENT_SEARCH);

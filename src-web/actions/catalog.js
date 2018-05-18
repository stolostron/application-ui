/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import apolloClient from '../../lib/client/apollo-client'
import * as Actions from './index'
import { contextPath } from '../../lib/shared/config'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

/* Resource URL constructors */
export const getIndividualResourceUrl = (
  repoName,
  resourceName,
  resourceType,
  version,
  clusterServiceName,
) => {
  const urlMap = {
    chart: `catalogdetails/${repoName}/${resourceName}/${version}`,
    clusterserviceclass: `catalogservicedetails/${clusterServiceName}`,
  }
  return `${contextPath}/${urlMap[resourceType]}`
}

const catalogFetchErrorStatusChange = status => ({
  type: Actions.CATALOG_FETCH_ERROR_STATUS_CHANGE,
  payload: { status },
})

const resourcesFetchRequestSuccess = items => ({
  type: Actions.RESOURCES_FETCH_REQUEST_SUCCESS,
  payload: { items },
})

const resourcesFetchRequestLoading = status => ({
  type: Actions.RESOURCES_FETCH_REQUEST_LOADING,
  payload: { status },
})

export const fetchResources = () => {
  return (dispatch) => {
    dispatch(resourcesFetchRequestLoading(true))

    return apolloClient.get(RESOURCE_TYPES.HCM_CHARTS)
      .then((res) => {
        dispatch(resourcesFetchRequestLoading(false))
        dispatch(resourcesFetchRequestSuccess(res.data.items))
      })
      .catch((err) => {
        dispatch(resourcesFetchRequestLoading(false))
        dispatch(catalogFetchErrorStatusChange(true))
        return err
      })
  }
}

export const catalogReleaseInstall = input => async (dispatch) => {
  dispatch(catalogInstallLoading(true))

  try {
    const result = await apolloClient.installHelmChart(input)

    if (result.errors && result.errors.length) {
      throw result.errors
    }

    dispatch(catalogInstallLoading(false))
    dispatch(catalogInstallSuccess())
  } catch (err) {
    dispatch(catalogInstallFailure(true))
    throw err
  }
}

export const catalogResourceSelect = ({ name, url, repoName }) => ({
  type: Actions.CATALOG_RESOURCE_SELECT,
  payload: { name, url, repoName },
})

export const catalogResourceFilterSearch = searchText => ({
  type: Actions.CATALOG_RESOURCE_FILTER_SEARCH,
  payload: { searchText },
})

export const catalogResourceFilterRepos = repo => ({
  type: Actions.CATALOG_RESOURCE_FILTER_REPOS,
  payload: { repo },
})

export const catalogInstallFailure = (status) => ({
  type: Actions.CATALOG_INSTALL_FAILURE,
  payload: { status }
})

export const catalogInstallValidationFailure = (status) => ({
  type: Actions.CATALOG_INSTALL_VALIDATION_FAILURE,
  payload: { status }
})

export const catalogInstallSuccess = () => ({
  type: Actions.CATALOG_INSTALL_SUCCESS
})

export const catalogInstallLoading = status => ({
  type: Actions.CATALOG_INSTALL_LOADING,
  payload: { status },
})

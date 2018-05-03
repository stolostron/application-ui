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
        // eslint-disable-next-line no-console
        console.warn(err)
        dispatch(catalogFetchErrorStatusChange(true))
        return err
      })
  }
}

export const catalogReleaseInstall = (input) => {
  return (dispatch) => {
    dispatch(resourcesFetchRequestLoading(true))

    return apolloClient.installHelmChart(input)
      .then(() => {
        // TODO: Add a success screen to the flow - 05/02/18 14:01:43 sidney.wijngaarde1@ibm.com
        dispatch(resourcesFetchRequestLoading(false))
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn(err)
        dispatch(catalogFetchErrorStatusChange(true))
        return err
      })
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

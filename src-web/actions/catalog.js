import { sortBy } from 'lodash'

import apolloClient from '../../lib/client/apollo-client'
import * as Actions from './index'
import { contextPath } from '../../lib/shared/config'

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

// TODO: Uncomment and use with fetchRepos - 04/26/18 16:17:12 sidney.wijngaarde1@ibm.com
// const repoFetchRequestSuccess = repos => ({
//   type: Actions.REPO_FETCH_REQUEST_SUCCESS,
//   payload: { repos },
// })

const resourcesFetchRequestSuccess = items => ({
  type: Actions.RESOURCES_FETCH_REQUEST_SUCCESS,
  payload: { items },
})

const resourcesFetchRequestLoading = status => ({
  type: Actions.RESOURCES_FETCH_REQUEST_LOADING,
  payload: { status },
})

// export const fetchRepos = () => {
//   return (dispatch) => {
//     // TODO: Use Apollo Client - 04/26/18 16:17:12 sidney.wijngaarde1@ibm.com
//   }
// }

export const fetchResources = () => {
  return (dispatch) => {
    dispatch(resourcesFetchRequestLoading(true))

    return apolloClient.get({ list: 'HCMChartsList' })
      .then((res={ data: { items: [] } }) => {
        const sortedResources = sortBy(res.data.items, chart => chart.Name)
        dispatch(resourcesFetchRequestLoading(false))
        dispatch(resourcesFetchRequestSuccess(sortedResources))
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn(err)
        dispatch(catalogFetchErrorStatusChange(true))
        return err
      })
  }
}

export const catalogResourceSelect = selection => ({
  type: Actions.CATALOG_RESOURCE_SELECT,
  payload: { selection },
})

export const catalogResourceFilterSearch = searchText => ({
  type: Actions.CATALOG_RESOURCE_FILTER_SEARCH,
  payload: { searchText },
})

export const catalogResourceFilterRepos = repo => ({
  type: Actions.CATALOG_RESOURCE_FILTER_REPOS,
  payload: { repo },
})

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

export const catalogReleaseInstall = (input, history) => async (dispatch) => {
  dispatch(catalogInstallLoading(true))

  try {
    const result = await apolloClient.installHelmChart(input)

    if (result.errors && result.errors.length) {
      throw result.errors
    }

    if (result.code || result.message) {
      throw new Error(result.message)
    }

    dispatch(catalogInstallLoading(false))
    dispatch(catalogInstallSuccess())
    sessionStorage.removeItem('chartName')
    sessionStorage.removeItem('repoName')
    sessionStorage.removeItem('tarFiles')
    sessionStorage.removeItem('values')
    sessionStorage.removeItem('version')
    history.push('/hcmconsole/releases')
  } catch (err) {
    dispatch(catalogInstallFailure(true))
    throw err
  }
}

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

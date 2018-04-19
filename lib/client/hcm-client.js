/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import http from './http-util'
import { RESOURCE_TYPES } from '../shared/constants'
import lodash from 'lodash'

const contextPath = http.getContextRoot(),
      HCM_PATH = `${contextPath}/hcm`

const DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

const transformResource = (clusterName, resource, resourceName) => ({
  ...resource,
  name: resourceName,
  cluster: clusterName,
})

const transform = (clusterName, resources) =>
  lodash.reduce(resources, (transformed, resource, resourceName) => {
    transformed.push(transformResource(clusterName, resource, resourceName))
    return transformed
  }, [])

const clustersToItems = (clusterData) =>
  lodash.reduce(clusterData, (accum, { Results: resources }, clusterName) => {
    // Transform all resources for the cluster
    transform(clusterName, resources)
      .forEach(resource => accum.push(resource))

    return accum
  }, [])

class HCMClient {
  get(resourceType, success_cb, error_cb) {
    if (resourceType.name === RESOURCE_TYPES.HCM_CLUSTER)
      return this.getClusters(success_cb, error_cb)

    this.getResource(resourceType, success_cb, error_cb)
  }

  getClusters(success_cb, error_cb) {
    http.fetch(`${HCM_PATH}/api/v1alpha1/clusters`,
      (result) => {
        const clustersJSON = JSON.parse(result.RetString).Result

        // TODO: Jorge: Define a correct data structure. Most likely we'll also
        //       need to move this logic to either the server or a selector.
        const topology = { nodes: [
          { uid: 'manager', type: '1', name: 'Cluster Manager' }
        ], links: []}

        Object.values(clustersJSON).forEach((cluster) =>{
          const clustName = cluster.ClusterName
          topology.nodes.push({ uid: clustName, type: '2', name: clustName, cluster })
          topology.links.push({ source: 'manager', target: clustName, label: 'manages', type: '1' })
        })

        success_cb({ items: Object.values(clustersJSON), topology })
      },
      error_cb, DEFAULT_OPTIONS)
  }

  getResource({ api_prefix, api_version, resource}, success_cb, error_cb) {
    http.fetch(`${HCM_PATH}/${api_prefix}/${api_version}/${resource}`,
      result => success_cb({ items: clustersToItems(result) }),
      error_cb, DEFAULT_OPTIONS)
  }
}

export default new HCMClient()

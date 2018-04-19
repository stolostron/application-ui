/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.RESOURCE_TYPES = {
  HCM_CLUSTER: {name: 'HCMCluster', list: 'HCMClusterList' },
  HCM_NODES: { name: 'HCMNode', list: 'HCMNodeList', resource: 'nodes', api_prefix: 'api', api_version: 'v1alpha1'},
  HCM_PODS: { name: 'HCMPod', list: 'HCMPodList', resource: 'pods', api_prefix: 'api', api_version: 'v1alpha1'},
  HCM_PVS: {name: 'HCMPersistentVolume', list: 'HCMPersistentVolumeList', resource: 'pvs', api_prefix: 'api', api_version: 'v1alpha1' }
}

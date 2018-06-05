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
  HCM_APPLICATIONS: { name: 'HCMApplication', list: 'HCMApplicationList' },
  HCM_CLUSTERS: { name: 'HCMCluster', list: 'HCMClusterList' },
  HCM_CHARTS: { name: 'HCMChart', list: 'HCMChartList' },
  HCM_NODES: { name: 'HCMNode', list: 'HCMNodeList' },
  HCM_NAMESPACES: { name: 'HCMNamespace', list: 'HCMNamespaceList' },
  HCM_PODS: { name: 'HCMPod', list: 'HCMPodList' },
  HCM_PVS:  {name: 'HCMPersistentVolume', list: 'HCMPersistentVolumeList' },
  HCM_RELEASES: { name: 'HCMRelease', list: 'HCMReleaseList' },
  HCM_REPOSITORIES: { name: 'HCMRepository', list: 'HCMRepositoryList' },
  HCM_TOPOLOGY: { name: 'HCMTopology', list: 'HCMTopology' },
  HCM_DASHBOARD: { name: 'HCMDashboard', list: 'HCMDashboard' }
}

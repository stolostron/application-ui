/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.CFC_ACCESS_COOKIE = 'cfc-access-token-cookie'
module.exports.CFC_AUTH_COOKIE = 'cfc-acs-auth-cookie'
module.exports.HCM_TOPOLOGY_FILTER_COOKIE = 'mcm-topology-filter-cookie'
module.exports.MCM_DESIGN_SPLITTER_COOKIE = 'mcm-design-splitter-cookie'

module.exports.RESOURCE_TYPES = {
  HCM_APPLICATIONS: { name: 'HCMApplication', list: 'HCMApplicationList' },
  HCM_CHARTS: { name: 'HCMChart', list: 'HCMChartList' },
  HCM_CLUSTERS: { name: 'HCMCluster', list: 'HCMClusterList'},// filter: true },
  HCM_COMPLIANCES: { name: 'HCMCompliance', list: 'HCMComplianceList' },
  HCM_DASHBOARD: { name: 'HCMDashboardQuery', list: 'HCMDashboardList' },
  HCM_PVS: { name: 'HCMPersistentVolume', list: 'HCMPersistentVolumeList'},// filter: true },
  HCM_PVS_CLAIM: { name: 'HCMPersistentVolumeClaim', list: 'HCMPersistentVolumeClaimList'},
  HCM_FILTER_LIST: { name: 'HCMFilterList', list: 'HCMFilterList' },
  HCM_NODES: { name: 'HCMNode', list: 'HCMNodeList' },
  HCM_PLACEMENT_POLICIES: { name: 'HCMPlacementPolicy', list: 'HCMPlacementPolicyList' },
  HCM_PODS: { name: 'HCMPod', list: 'HCMPodList'},// filter: true },
  HCM_POLICIES: { name: 'HCMPolicy', list: 'HCMPolicyList' },
  HCM_RELEASES: { name: 'HCMRelease', list: 'HCMReleaseList'},// filter: true },
  HCM_REPOSITORIES: { name: 'HCMRepository', list: 'HCMRepositoryList' },
  HCM_TOPOLOGY: { name: 'HCMTopology', list: 'HCMTopology' },
}

// keep order from lowest to highest role
module.exports.ROLES = {
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
  ADMIN: 'Administrator',
  CLUSTER_ADMIN: 'ClusterAdministrator'
}

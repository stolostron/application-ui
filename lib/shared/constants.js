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
module.exports.MCM_DIAGRAM_FILTER_COOKIE = 'mcm-diagram-filter-cookie'
module.exports.OVERVIEW_REFRESH_INTERVAL_COOKIE = 'mcm-overview-interval-refresh-cookie'
module.exports.DIAGRAM_REFRESH_INTERVAL_COOKIE = 'mcm-diagram-interval-refresh-cookie'
module.exports.TOPOLOGY_REFRESH_INTERVAL_COOKIE = 'mcm-topology-interval-refresh-cookie'
module.exports.MCM_OPEN_DIAGRAM_TAB_COOKIE = 'mcm-open-diagram-tab-cookie'
module.exports.REFRESH_TIMES = [20, 40, 60, 5*60, 30*60, 0]

module.exports.OVERVIEW_QUERY_COOKIE = 'mcm-overview-query-cookie'
module.exports.OVERVIEW_STATE_COOKIE = 'mcm-overview-state-cookie'
module.exports.DIAGRAM_QUERY_COOKIE = 'mcm-diagram-query-cookie'

module.exports.MAX_CHART_DATA_SIZE = 30

module.exports.RESOURCE_TYPES = {
  HCM_APPLICATIONS: { name: 'HCMApplication', list: 'HCMApplicationList' },
  HCM_CHARTS: { name: 'HCMChart', list: 'HCMChartList' },
  HCM_CLUSTERS: { name: 'HCMCluster', list: 'HCMClusterList'},// filter: true },
  HCM_COMPLIANCES: { name: 'HCMCompliance', list: 'HCMComplianceList' },
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

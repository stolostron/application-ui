/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.CFC_ACCESS_COOKIE = 'cfc-access-token-cookie'
module.exports.CFC_AUTH_COOKIE = 'cfc-acs-auth-cookie'
module.exports.MCM_DIAGRAM_FILTER_COOKIE = 'mcm-diagram-filter-cookie'
module.exports.MCM_DESIGN_SPLITTER_OPEN_COOKIE =
  'mcm-design-splitter-open-cookie'
module.exports.MCM_DESIGN_SPLITTER_SIZE_COOKIE =
  'mcm-design-splitter-size-cookie'
module.exports.OVERVIEW_REFRESH_INTERVAL_COOKIE =
  'mcm-overview-interval-refresh-cookie'
module.exports.DIAGRAM_REFRESH_INTERVAL_COOKIE =
  'mcm-diagram-interval-refresh-cookie'
module.exports.TOPOLOGY_REFRESH_INTERVAL_COOKIE =
  'mcm-topology-interval-refresh-cookie'
module.exports.REFRESH_TIMES = [5, 10, 30, 60, 5 * 60, 30 * 60, 0]
module.exports.DEFAULT_REFRESH_TIME = 10

module.exports.OVERVIEW_QUERY_COOKIE = 'mcm-overview-query-cookie'
module.exports.OVERVIEW_STATE_COOKIE = 'mcm-overview-state-cookie'
module.exports.DIAGRAM_QUERY_COOKIE = 'mcm-diagram-query-cookie'

module.exports.MAX_CHART_DATA_SIZE = 30

module.exports.RESOURCE_TYPES = {
  HCM_APPLICATIONS: { name: 'HCMApplication', list: 'HCMApplicationList' },
  HCM_CHANNELS: { name: 'HCMChannel', list: 'HCMChannelList' },
  HCM_SUBSCRIPTIONS: { name: 'HCMSubscription', list: 'HCMSubscriptionList' },
  HCM_PLACEMENT_RULES: {
    name: 'HCMPlacementRule',
    list: 'HCMPlacementRuleList'
  },
  HCM_FILTER_LIST: { name: 'HCMFilterList', list: 'HCMFilterList' },
  HCM_PODS: { name: 'HCMPod', list: 'HCMPodList' },
  HCM_TOPOLOGY: { name: 'HCMTopology', list: 'HCMTopology' },
  CEM_INCIDENTS: { name: 'CEMIncident', list: 'CEMIncidentList' },
  USER_INFO: { name: 'userInfo', list: 'userInfoList' },
  HCM_NAMESPACES: { name: 'HCMNamespace', list: 'HCMNamespaceList' }
}

// keep order from lowest to highest role
module.exports.ROLES = {
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
  ADMIN: 'Administrator',
  ACCOUNT_ADMIN: 'AccountAdministrator',
  CLUSTER_ADMIN: 'ClusterAdministrator'
}

module.exports.MCM_CLUSTERS_SERVICES_ACTIONS = {
  GRAFANA: {
    name: 'monitoring-grafana',
    action: 'table.actions.applications.grafana'
  },
  ICAM: {
    name: 'ibmcloudappmgmt-amui',
    action: 'table.actions.applications.icam'
  }
}

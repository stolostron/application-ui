/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
var requireServer = require('./require-server'),
    nconf = requireServer('nconf')

var WHITELIST = [
  'API_SERVER_URL',
  'contextPath',
  'hcmUiApiUrl',
  'searchApiUrl',
  'searchQueryLimit',
  'overview',
  'featureFlags: filters',
  'featureFlags:dashboardLiveUpdates',
  'featureFlags:dashboardRefreshInterval',
  'featureFlags:fullDashboard',
  'featureFlags:liveUpdates',
  'featureFlags:liveUpdatesPollInterval',
  'featureFlags:search',
  'featureFlags:clusterFeature',
  'feature_searchRelated',
  'featureFlags:enableSegment',
  'featureFlags:segmentKey'
]

var config = {}

if (nconf) {
  WHITELIST.forEach(i => (config[i] = nconf.get(i)))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

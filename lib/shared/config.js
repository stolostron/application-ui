/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
var requireServer = require('./require-server'),
    nconf = requireServer('nconf')

var WHITELIST = [
  'contextPath',
  'hcmUiApiUrl',
  'overview',
  'featureFlags: filters',
  'featureFlags:dashboardLiveUpdates',
  'featureFlags:dashboardRefreshInterval',
  'featureFlags:fullDashboard',
  'featureFlags:liveUpdates',
  'featureFlags:liveUpdatesPollInterval',
  'featureFlags:search',
  'feature_searchRelated'
]

var config = {}

if (nconf) {
  WHITELIST.forEach(i => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

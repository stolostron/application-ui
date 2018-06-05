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
  'featureFlags:liveUpdates',
  'featureFlags:liveUpdatesPollInterval',
  'featureFlags:fullDashboard'
]

var config = {
  'featureFlags:fullDashboard': true
}

if (nconf) {
  WHITELIST.forEach(i => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  let configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

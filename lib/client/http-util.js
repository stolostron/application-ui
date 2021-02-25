/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

var client = require('../shared/client')
var config = require('../shared/config')

var DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}

module.exports.getHostUrl = function() {
  var port = window.location.port ? `:${window.location.port}` : ''
  var url = `${window.location.protocol}//${window.location.hostname}${port}`
  return url
}

module.exports.getContextRoot = function() {
  if (client) {
    return CONSOLE_CONTEXT_URL //eslint-disable-line no-undef
  }
  return config.contextPath
}

module.exports.fetch = function(url, success_cb, error_cb, options) {
  options = options || DEFAULT_OPTIONS
  fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(json => success_cb && success_cb(json))
    .catch(ex => error_cb && error_cb({ error: ex }))
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  // '' and 'OK' is not a valid json response, need to check
  return response
    .text()
    .then(text => (text && text.trim() !== 'OK' ? JSON.parse(text) : {}))
}

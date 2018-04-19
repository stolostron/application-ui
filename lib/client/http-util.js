/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var client = require('../shared/client')
var config = require('../shared/config')
var _ = require('lodash')

var DEFAULT_OPTIONS = {
  credentials: 'same-origin',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
}

module.exports.getHostUrl = function () {
  var port = window.location.port ? `:${window.location.port}` : ''
  var url = `${window.location.protocol}//${window.location.hostname}${port}`
  return url
}

module.exports.getBaseUrl = function () {
  var path = window.location.pathname
  path = path.split('/').slice(0, 4).join('/')
  return module.exports.getHostUrl() + path
}

module.exports.getContextRoot = function() {
  if (client) {
    return CONSOLE_CONTEXT_URL //eslint-disable-line no-undef
  }
  return config.contextPath
}

module.exports.getQueryString = function (field, url) {

  if (!client && !url)
    return null

  let href = url ? url : window.location.href,
      reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i'),
      string = reg.exec(href)

  return string ? string[1] : null
}

module.exports.appendQueryString = function (url, queryVars) {

  if (!queryVars || Object.keys(queryVars).length === 0)
    return url

  var firstSeparator = (url.indexOf('?') == -1 ? '?' : '&')
  var queryStringParts = new Array()
  for (var key in queryVars) {
    if (!module.exports.getQueryString(key, url) && queryVars[key]) {
      queryStringParts.push(key + '=' + queryVars[key])
    }
  }

  if (queryStringParts.length === 0)
    return url

  var queryString = queryStringParts.join('&')
  return url + firstSeparator + queryString
}

module.exports.fetch = function (url, success_cb, error_cb, options) {

  options = options || DEFAULT_OPTIONS
  fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(json => success_cb && success_cb(json))
    .catch(ex => error_cb && error_cb({ error: ex }))
}

module.exports.fetchWithReduce = function (url, success_cb, error_cb, options, params) {
  options = options || DEFAULT_OPTIONS
  fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(json => {
      if (params) {
        _.remove(json.items, x => {
          return (params.field).split('.').reduce(index, x) !== params.match
        })
      }
      success_cb && success_cb(json)
    })
    .catch(ex => error_cb && error_cb({ error: ex }))
}

function index(obj,i) {
  return obj[i]
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
  return response.text().then(text => (text && text.trim() !== 'OK') ? JSON.parse(text) : {})
}

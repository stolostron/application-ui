// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

var requireServer = require('./require-server'),
    i18n = requireServer('node-i18n-util')

/*
 * A function that wraps i18n.locale to choose a default locale when any is accepted.
 */

module.exports = function(req) {
  if (req) {
    const locale = i18n.locale(req)
    return !locale || locale === '*' ? 'en-US' : locale
  }
  return JSON.parse(document.getElementById('context').textContent)
}

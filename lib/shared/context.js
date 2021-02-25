/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

var requireServer = require('./require-server'),
    locale = requireServer('./locale')
/*
 * A function that provides context information for a given page or request. e.g. who the logged in user is.
 * Uses the session on the server, and the context payload script on the client.
 */

module.exports = function(req) {
  if (req) {
    return {
      locale: locale(req)
    }
  }
  return JSON.parse(document.getElementById('context').textContent)
}

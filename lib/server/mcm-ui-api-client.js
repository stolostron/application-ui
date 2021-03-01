/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

var request = require('./request'),
    httpUtil = require('./http-util'),
    log4js = require('log4js'),
    logger = log4js.getLogger('mcm-ui-api-client')

exports.checkStatus = (req, cb) => {
  const options = httpUtil.getOptions(
    req,
    'https://mcm-ibm-mcm-dev-mcmuiapi:4000/status'
  )
  doRequest(req, options, cb)
}

function doRequest(req, options, cb) {
  options.json = true
  options.headers = { Cookie: req.headers.cookie }
  request(
    options,
    null,
    [200, 201, 204],
    (err, res) => {
      if (err) {
        return cb(err, null)
      }
      cb(err, res.body)
    },
    logger
  )
}

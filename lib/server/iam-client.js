/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

const request = require('./request'),
      httpUtil = require('../server/http-util')

exports.getPlatformIdentity = (req, cb) => {
  const options = httpUtil.getOptions(
    req,
    'https://platform-identity-management:4500'
  )
  options.json = true
  doRequest(req, options, cb)
}

function doRequest(req, options, cb) {
  //TODO change bearer to Bearer once it's supported
  request(options, null, [200, 201, 204], (err, res) => {
    if (err) {
      return cb(err, null)
    }
    cb(err, res.body)
  })
}

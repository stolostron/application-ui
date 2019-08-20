/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var request = require('./request'),
    config = require('../../config'),
    httpUtil = require('../server/http-util'),
    i18n = require('node-i18n-util')

const PLATFORM_HEADER_CONTEXT_PATH = '/header'

exports.getHeader = (req, cb) => {
  const options = httpUtil.getOptions(
    req,
    `${config.get(
      'cfcRouterUrl'
    )}${PLATFORM_HEADER_CONTEXT_PATH}/api/v1/header?serviceId=mcm-ui&dev=${process
      .env.NODE_ENV === 'development'}`
  )

  options.headers = {
    Cookie: req.headers.cookie,
    'Accept-Language': i18n.locale(req)
  }
  request(options, null, [200, 201, 204], (err, result) => {
    if (err) {
      return cb(err, null)
    }

    cb(err, JSON.parse(result.body))
  })
}

exports.checkStatus = (req, cb) => {
  const options = httpUtil.getOptions(
    req,
    'http://platform-header:3000/status'
  )
  doRequest(req, options, cb)
}

function doRequest(req, options, cb) {
  options.json = true
  options.headers = { Cookie: req.headers.cookie }
  request(options, null, [200, 201, 204], (err, res) => {
    if (err) {
      return cb(err, null)
    }
    cb(err, res.body)
  })
}

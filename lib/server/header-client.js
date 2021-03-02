/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

var request = require('./request')
var config = require('../../config')
var httpUtil = require('../server/http-util')
var locale = require('../shared/locale')

exports.getHeader = (req, cb) => {
  const options = httpUtil.getOptions(
    req,
    `${config.get('headerUrl')}${config.get(
      'headerContextPath'
    )}/api/v1/header?serviceId=app-ui&dev=${process.env.NODE_ENV ===
      'development'}`
  )

  options.headers = {
    Cookie: req.headers.cookie,
    Authorization:
      req.headers.Authorization ||
      req.headers.authorization ||
      `Bearer ${req.cookies['acm-access-token-cookie']}`,
    'Accept-Language': locale(req)
  }
  request(options, null, [200, 201, 204], (err, result) => {
    if (err) {
      return cb(err, null)
    }

    cb(err, JSON.parse(result.body))
  })
}

exports.checkStatus = (req, cb) => {
  const options = httpUtil.getOptions(req, 'http://common-web-ui:3000/status')
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

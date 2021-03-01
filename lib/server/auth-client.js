/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

var request = require('./request')
var config = require('../../config')
var log4js = require('log4js')
var logger = log4js.getLogger('auth')

exports.auth = (req, cb) => {
  var redirectUrl
  if (process.env.NODE_ENV === 'development') {
    redirectUrl = `${config.get('OAUTH2_REDIRECT_URL')}`
  } else {
    const callbackUrl = req.cookies.icpHost
    if (callbackUrl) {
      redirectUrl = callbackUrl + '/auth/liberty/callback'
    } else {
      redirectUrl = 'https://' + req.headers['host'] + '/auth/liberty/callback'
    }
  }
  logger.debug('redirectUrl:' + redirectUrl)
  var reqBody = {
    client_id: `${config.get('OAUTH2_CLIENT_ID')}`,
    client_secret: `${config.get('OAUTH2_CLIENT_SECRET')}`,
    code: req.query.code,
    redirect_uri: redirectUrl,
    grant_type: 'authorization_code',
    scope: 'openid email profile'
  }

  var options = {
    method: 'POST',
    url: `${config.get('headerUrl')}/idprovider/v1/auth/token`,
    json: reqBody
  }

  var reqOptions = {
    strictSSL: false,
    maxSockets: 200,
    timeout: 60 * 1000,
    maxAttempts: 1
  }

  request(
    options,
    null,
    [200],
    (err, res) => {
      if (err) {
        return cb(err, null)
      }
      cb(err, res)
    },
    null,
    null,
    reqOptions
  )
}

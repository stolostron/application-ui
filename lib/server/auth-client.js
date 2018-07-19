/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var request = require('./request')
var config = require('../../config')
var log4js = require('log4js'),
    logger = log4js.getLogger('auth')

exports.auth = (req, cb) => {
  var redirectUrl
  if (process.env.NODE_ENV === 'development') {
    redirectUrl = `${config.get('WLP_REDIRECT_URL')}`
  } else {
    const callbackUrl = req.cookies.icpHost
    if (callbackUrl) {
      redirectUrl = callbackUrl+'/auth/liberty/callback'
    } else {
      redirectUrl = 'https://'+req.headers['host']+'/auth/liberty/callback'
    }
  }
  logger.debug('redirectUrl:'+redirectUrl)
  var reqBody = {
    'client_id': `${config.get('WLP_CLIENT_ID')}`,
    'client_secret': `${config.get('WLP_CLIENT_SECRET')}`,
    'code' : req.query.code,
    'redirect_uri' : redirectUrl,
    'grant_type' : 'authorization_code',
    'scope' : 'openid email profile'
  }

  var options = {
    method: 'POST',
    url: `${config.get('PLATFORM_IDENTITY_PROVIDER_URL')}/v1/auth/token`,
    json: reqBody
  }

  var reqOptions = {
    strictSSL: false,
    maxSockets: 200,
    timeout: 60 * 1000,
    maxAttempts: 1
  }

  request(options, null, [200], (err, res) => {
    if (err) {
      return cb(err, null)
    }
    cb(err, res)
  }, null, null, reqOptions)
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var express = require('express'),
    router = express.Router(),
    authClient = require('../lib/server/auth-client'),
    config = require('../config'),
    log4js = require('log4js'),
    logger = log4js.getLogger('auth'),
    url = require('url'),
    cookieUtil = require('../lib/server/cookie-util')

router.get('*', (req, res) => {

  authClient.auth(req, (err, response) => {

    if (err) {
      if (err.statusCode === 400) {
        var host = req.headers['host']
        var baseUrl = process.env.NODE_ENV !== 'development' && host ? `https://${host}` : config.get('cfcRouterUrl')
        cookieUtil.deleteAuthCookies(res)
        return res.redirect(`${baseUrl}/oidc/logout.jsp?error=noteam`)
      } else {
        return res.status(500).send(err.details)
      }
    }

    res.set('Set-Cookie', response.headers['set-cookie'])
    logger.debug('req.cookies.redirect_uri : '+req.cookies.redirect_uri)
    let redirectUrl = req.cookies.redirect_uri || config.get('contextPath')
    res.clearCookie('redirect_uri')
    redirectUrl = process.env.NODE_ENV === 'development' ? `https://localhost:3000${redirectUrl}` : redirectUrl
    var consoleUrl, path
    var redirectParse = url.parse(redirectUrl, true)
    if (redirectParse.pathname) {
      path = redirectParse.pathname + redirectParse.search
    }
    if (req.cookies.icpHost) {
      var parsedUrl = url.parse(req.cookies.icpHost, true)
      res.clearCookie('icpHost')
      if (parsedUrl.host) {
        consoleUrl = parsedUrl.protocol+'//'+parsedUrl.host+path
      }
    }
    else {
      consoleUrl = redirectUrl
    }
    logger.debug('Final consoleUrl '+ consoleUrl+'/')
    res.redirect(consoleUrl)
  })
})

module.exports = router

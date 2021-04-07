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

const express = require('express'),
      context = require('../../lib/shared/context'),
      msgs = require('../../nls/platform.properties'),
      config = require('../../config'),
      // cookieUtil = require('../../lib/server/cookie-util'),
      appUtil = require('../../lib/server/app-util'),
      router = express.Router({ mergeParams: true })

// router.get('/logout', (req, res) => {
//   var LOGOUT_API = '/v1/auth/logout'
//   var callbackUrl = req.headers['host']
//   cookieUtil.deleteAuthCookies(res)
//   logger.debug('headers host:' + callbackUrl)
//   var redirectUrl =
//     process.env.NODE_ENV !== 'development' && callbackUrl
//       ? `https://${callbackUrl}${LOGOUT_API}`
//       : `${config.get('headerUrl')}${LOGOUT_API}`
//   logger.debug('Final logout url:' + redirectUrl)
//   return res.send({ redirectUrl })
// })

router.get('*', (req, res) => {
  const ctx = getContext(req)
  return res.render(
    'home',
    Object.assign(
      {
        manifest: appUtil.app().locals.manifest,
        contextPath: config.get('contextPath'),
        props: ctx
      },
      ctx
    )
  )
})

function getContext(req) {
  const req_context = context(req)
  return {
    title: msgs.get('common.app.name', req_context.locale),
    context: req_context,
    xsrfToken: req.csrfToken()
  }
}

module.exports = router

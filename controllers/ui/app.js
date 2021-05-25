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
      appUtil = require('../../lib/server/app-util'),
      router = express.Router({ mergeParams: true })

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

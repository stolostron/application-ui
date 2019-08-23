/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var express = require('express'),
    router = express.Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger('status'),
    async = require('async'),
    iamClient = require('../lib/server/iam-client'),
    headerClient = require('../lib/server/header-client')

router.get('/', (req, res) => {
  logger.debug('/')
  res.sendStatus(200)
})

router.get('/status', (req, res) => res.sendStatus(200))

router.get('/livenessProbe', (req, res) => {
  logger.debug('/livenessProbe')
  res.sendStatus(200)
})

router.get('/readinessProbe', (req, res) => {
  const iamPlatformIdentity = iamClient.getPlatformIdentity.bind(
    iamClient,
    req
  )
  const header = headerClient.checkStatus.bind(headerClient, req)
  const calls = [iamPlatformIdentity, header]
  async.parallel(calls, err => {
    let statusCode
    if (err) {
      logger.error(`GET ${req.path} ${err.message} ${err.statusCode || 500}`)
      statusCode = err.statusCode
    } else {
      logger.debug(req.path)
      statusCode = res.statusCode
    }
    return res.sendStatus(
      statusCode >= 100 && statusCode < 600 ? statusCode : 500
    )
  })
})

module.exports = router

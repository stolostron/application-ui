/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright Contributors to the Open Cluster Management project
'use strict'

var express = require('express'),
    router = express.Router(),
    serviceDiscovery = require('../../lib/server/service-discovery.js'),
    log4js = require('log4js'),
    logger = log4js.getLogger('serviceDiscoveryApi')

router.get('/servicediscovery/:serviceId', (req, res) => {
  const serviceId = req.params.serviceId || null
  if (serviceId) {
    res.set('Content-Type', 'application/json')
    try {
      const isEnabled = serviceDiscovery.serviceEnabled(serviceId)
      logger.debug('isEnabled ', isEnabled)
      if (serviceId === 'cam' && isEnabled.enabled) {
        return res.send({ ...isEnabled })
      }
      return res.send(isEnabled)
    } catch (err) {
      logger.debug('Cannot find service id: ', serviceId)
      return res.send(false).end()
    }
  }
  logger.debug('ServiceID was not supplied')
  res.send(false).end()
})

module.exports = router

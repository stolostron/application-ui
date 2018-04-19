/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var express = require('express'),
    router = express.Router(),
    hcmClient = require('../../lib/server/hcm-client')

const get = (req, res) => {
  hcmClient.get(req, (err, body) => {
    if (err)
      return res.status(err.statusCode || 500).send(err.details)

    res.json(body)
  })
}

const post = (req, res) => {
  hcmClient.post(req, (err, body) => {
    if (err)
      return res.status(err.statusCode || 500).send(err.details)

    res.json(body)
  })
}

router.get('/hcm/api/v1alpha1/clusters', get)
router.get('/hcm/api/v1alpha1/:type', hcmClient.getWorkID, hcmClient.poll)
router.post('/*', post)

module.exports = router

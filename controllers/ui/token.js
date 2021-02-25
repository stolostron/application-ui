/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright Contributors to the Open Cluster Management project
'use strict'

var express = require('express'),
    router = express.Router(),
    authClient = require('../../lib/server/auth-client')

router.get('*', (req, res) => {
  authClient.getAccessToken(req, (err, body) => {
    if (err) return res.status(err.statusCode || 500).send(err.details)
    return res.send(body)
  })
})

module.exports = router

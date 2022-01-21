/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'
var express = require('express'),
    router = express.Router(),
    inspect = require('@stolostron/security-middleware')

//controllers
var app = require('./app'),
    tokenController = require('./token')

router.all('/token', tokenController)
router.all(['/', '/*'], inspect.ui(), app)

module.exports = router

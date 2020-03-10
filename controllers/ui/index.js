/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var express = require('express'),
    router = express.Router()

var inspect = require('@icp/security-middleware')

//controllers
var app = require('./app')

// router.use(csrf) TODO: Revisit csrf
router.all(['/', '/*'], inspect.ui, app)

module.exports = router

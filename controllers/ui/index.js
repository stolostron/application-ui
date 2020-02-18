/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
<<<<<<< HEAD

=======
/* eslint-disable import/no-unresolved */
require('babel-polyfill')
>>>>>>> master
var express = require('express'),
  router = express.Router(),
  app = require('./app'),
  inspect = require('security-middleware')

router.all(['/', '/*'], inspect.ui(), app)

module.exports = router


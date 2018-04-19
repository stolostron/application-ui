/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var dust = require('dustjs-helpers'),
    config = require('./config'),
    i18n = require('node-i18n-util'),
    path = require('path')

dust.helpers.properties = (chunk, context, bodies, params) => {
  var relativePath = `../../${params.href}` // load the properties

  require(relativePath)

  // resolve the bundle locale being used
  var bundlePath = path.join(__dirname, relativePath),
      locale = i18n._resolveBundle(bundlePath, params.locale).locale,
      basePath = params.href.substring(0, params.href.indexOf('.properties'))

  params.href = basePath + (locale ? '_' + locale.replace('-', '_') : '') + '.js'

  return `${config.contextPath}/${params.href}`
}

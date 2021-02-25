/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var log4js = require('log4js'),
    logger = log4js.getLogger('request')

module.exports = log4js.connectLogger(logger, {
  level: 'auto',
  format: ':method :url :status - :response-time ms'
})

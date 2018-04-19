/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var request = require('./request'),
    config = require('../../config'),
    httpUtil = require('../server/http-util'),
    async = require('async'),
    log4js = require('log4js'),
    logger = log4js.getLogger('hcm-client')

const HCM_POLL_INTERVAL = config.get('hcmPollInterval') || 200
const HCM_POLL_TIMEOUT = config.get('hcmPollTimeout') || 10000

const getOptions = (overrides) => {
  const defaults = {
    SrcClusters: {
      Names: null,
      Labels: null,
      Status: null
    },
    DstClusters: {
      Names: [
        '*'
      ],
      Labels: null,
      Status: [
        'healthy'
      ]
    },
    ClientID: '',
    UUID: '',
    Operation: 'get',
    Work: {
      Names: '',
      Namespaces: '',
      Status: '',
      Labels: '',
      Image: ''
    },
    Timestamp: new Date(),
    NextRequest: null,
  }

  return Object.assign({}, defaults, overrides)
}

exports.get = (req, cb) => {
  var options = httpUtil.getOptions(req, `${config.get('hcmUrl')}${req.path.substr(4)}`) // TODO: Handle /hcm prefix better
  options.method = 'GET'
  options.json = req.body
  doRequest(options, cb)
}

exports.getWorkID = (req, res, next) => {
  const url = `${config.get('hcmUrl')}/api/v1alpha1/work`
  var options = httpUtil.getOptions(req, url)
  options.method = 'POST'
  // TODO: Allow users to pass a query string to filter the results
  // 04/06/18 10:48:55 sidney.wijngaarde1@ibm.com
  options.json = getOptions({ Resource: req.params.type })

  request(options, null, [200, 201, 202], (err, hcmRes) => {
    if (err)
      return res.status(err.statusCode || 500).send(err.details)

    req.workID = hcmRes.body.RetString
    next()
  }, logger)
}

exports.poll = (req, res) => {
  let intervalID
  let timeout

  if (!req.workID) {
    return res.status(400).send('WorkID is not defined')
  }

  async.race([
    (cb) => {
      timeout = setTimeout(() => {
        clearInterval(intervalID)
        const error = new Error('Manager request timed out')
        error.statusCode = 408
        error.details = error.message
        cb(error, null)
      }, HCM_POLL_TIMEOUT)
    },
    (cb) => {
      const url = `${config.get('hcmUrl')}/api/v1alpha1/work/${req.workID}`
      var options = httpUtil.getOptions(req, url)
      options.method = 'GET'

      intervalID = setInterval(() => {
        request(options, null, [200, 201, 202], (err, hcmRes) => {
          if (err) {
            clearInterval(intervalID)
            clearTimeout(timeout)
            return cb(err)
          }
          const hcmBody = JSON.parse(JSON.parse(hcmRes.body).RetString)
          if (hcmBody.Result.Completed) {
            clearInterval(intervalID)
            clearTimeout(timeout)
            cb(null, hcmBody.Result.Results)
          }
        }, logger)
      }, HCM_POLL_INTERVAL)
    }
  ], (err, result) => {
    if (err)
      return res.status(err.statusCode || 500).send(err.details)
    res.json(result)
  })
}

exports.post = (req, cb) => {
  var options = httpUtil.getOptions(req, `${config.get('hcmUrl')}${req.path}`)
  options.method = 'POST'
  options.json = req.body
  doRequest(options, cb)
}

function doRequest(options, cb) {
  request(options, null, [200, 201, 202], (err, res) => {
    if (err) {
      return cb(err, null)
    }

    cb(err, res.body)
  }, logger)
}

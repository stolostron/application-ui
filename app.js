/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var log4js = require('log4js'),
    logger = log4js.getLogger('server'),
    watchr = require('watchr'),
    moment = require('moment'),
    mime = require('mime-types')


var log4js_config = process.env.LOG4JS_CONFIG ? JSON.parse(process.env.LOG4JS_CONFIG) : undefined
log4js.configure(log4js_config || 'config/log4js.json')

logger.info(`[pid ${process.pid}] [env ${process.env.NODE_ENV}] started.`)

const stalker = watchr.open(`${process.cwd()}/config/log4js.json`, changeType => {
  if (changeType === 'update') {
    logger.info('Logging configuration updated.  Re-configuring log4js.')
    log4js.shutdown(err => {
      if (!err)
        log4js.configure('config/log4js.json')
    })
  }
}, () => { })

var express = require('express'),
    path = require('path'),
    appConfig = require('./config'),
    appUtil = require('./lib/server/app-util')

//early initialization
require('node-i18n-util')

process.env.BABEL_ENV = 'server'
require('babel-register')

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    requestLogger = require('./middleware/request-logger'),
    controllers = require('./controllers')

var consolidate = require('consolidate')

require('./lib/shared/dust-helpers')

var app = express()

app.engine('dust', consolidate.dust)
app.set('env', 'production')
app.set('views', __dirname + '/views')
app.set('view engine', 'dust')
app.set('view cache', true)

appUtil.app(app)

const CONTEXT_PATH = appConfig.get('contextPath'),
      STATIC_PATH = path.join(__dirname, 'public')

app.use((req, res, next) => {
  if(!req.path.endsWith('.js') && !req.path.endsWith('.css')) {
    next()
    return
  }
  res.append('Content-Encoding', 'gzip')
  var type = mime.lookup(path.join('public', req.path))
  if (typeof type != 'undefined') {
    var charset = mime && mime.charsets.lookup(type)
    res.append('Content-Type', type + (charset ? '; charset=' + charset : ''))
  }
  req.url = `${req.url}.gz`
  next()
})
app.use(CONTEXT_PATH, express.static(STATIC_PATH, {
  maxAge: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 60 * 24 * 365,
  setHeaders: (res, fp) => {
    if (fp.startsWith(`${STATIC_PATH}/nls`)) {
      res.setHeader('Cache-Control', 'max-age=0')
    } else {
      res.setHeader('Expires', moment().add(12, 'months').toDate())
    }
  }
}))



app.get(`${CONTEXT_PATH}/performance-now.js.map`, (req, res) => res.sendStatus(404))

app.use(cookieParser())
  .use(requestLogger)
  .use(bodyParser.json({ limit: '512kb' }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(controllers)

app.get('/favicon.ico', (req, res) => res.sendStatus(204))

app.locals.config = require('./lib/shared/config')
app.locals.manifest = require('./public/webpack-assets.json')

var http = require('http')
var server = http.createServer(app)

var port = process.env.PORT || appConfig.get('httpPort')

// start server
logger.info('Starting express server.')
server.listen(port, () => {
  logger.info(`HCM UI is now running on http://localhost:${port}${CONTEXT_PATH}`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received.  Shutting down express server.')
  stalker.close()
  server.close(err => {
    if (err) {
      logger.error(err)
      process.exit(1)
    }
    logger.info('Server shutdown successfully.')
    process.exit(0)
  })
})

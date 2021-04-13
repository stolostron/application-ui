/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

var log4js = require('log4js'),
    logger = log4js.getLogger('server'),
    watchr = require('watchr'),
    mime = require('mime-types'),
    fs = require('fs'),
    helmet = require('helmet')

var log4js_config = process.env.LOG4JS_CONFIG
  ? JSON.parse(process.env.LOG4JS_CONFIG)
  : undefined
log4js.configure(log4js_config || 'config/log4js.json')

logger.info(`[pid ${process.pid}] [env ${process.env.NODE_ENV}] started.`)

const stalker = watchr.open(
  `${process.cwd()}/config/log4js.json`,
  changeType => {
    if (changeType === 'update') {
      logger.info('Logging configuration updated.  Re-configuring log4js.')
      log4js.shutdown(err => {
        if (!err) log4js.configure('config/log4js.json')
      })
    }
  },
  () => {}
)

var express = require('express'),
    exphbs = require('express-handlebars'),
    handlebarsHelpers = require('./lib/shared/handlebarsHelpers'),
    path = require('path'),
    appConfig = require('./config'),
    appUtil = require('./lib/server/app-util')

//early initialization
require('node-i18n-util')

process.env.BABEL_ENV = 'server'
require('@babel/register')
// Ignore required CSS in PatternFly components
require('ignore-styles')

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csurf = require('csurf'),
    requestLogger = require('./middleware/request-logger'),
    controllers = require('./controllers')

var app = express()
var morgan = require('morgan')

if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      // in production these headers are set by ingress.open-cluster-management.io
      frameguard: false,
      noSniff: true,
      xssFilter: true
    })
  )

  app.use(
    '*',
    morgan('combined', {
      skip: (req, res) => res.statusCode < 400
    })
  )
} else {
  app.use(helmet())
  app.use('*', morgan('dev'))
}

app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options')
  res.removeHeader('X-Content-Type-Options')
  res.removeHeader('X-Xss-Protection')
  next()
})

const csrfMiddleware = csurf({
  cookie: {
    httpOnly: false,
    secure: true
  }
})

var { createProxyMiddleware } = require('http-proxy-middleware')
app.use(
  `${appConfig.get('contextPath')}/graphql`,
  cookieParser(),
  csrfMiddleware,
  (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    const accessToken = req.cookies['acm-access-token-cookie']
    if (req.headers.authorization)
      req.headers.authorization = `Bearer ${accessToken}`
    else req.headers.Authorization = `Bearer ${accessToken}`
    next()
  },
  createProxyMiddleware({
    target: appConfig.get('hcmUiApiUrl') || 'http://localhost:4000/hcmuiapi',
    changeOrigin: true,
    pathRewrite: {
      [`^${appConfig.get('contextPath')}/graphql`]: '/graphql'
    },
    secure: false
  })
)

app.use(
  `${appConfig.get('contextPath')}/search/graphql`,
  cookieParser(),
  csrfMiddleware,
  (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Pragma', 'no-cache')
    const accessToken = req.cookies['acm-access-token-cookie']
    if (req.headers.authorization)
      req.headers.authorization = `Bearer ${accessToken}`
    else req.headers.Authorization = `Bearer ${accessToken}`
    next()
  },
  createProxyMiddleware({
    target: appConfig.get('searchApiUrl') || 'https://localhost:4010/searchapi',
    changeOrigin: true,
    pathRewrite: {
      [`^${appConfig.get('contextPath')}/search/graphql`]: '/graphql'
    },
    secure: false
  })
)

const hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    properties: handlebarsHelpers,
    json: function(context) {
      return JSON.stringify(context)
    }
  }
})

app.engine('handlebars', hbs.engine)
app.set('env', 'production')
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.set('view cache', true)

appUtil.app(app)

const CONTEXT_PATH = appConfig.get('contextPath'),
      STATIC_PATH = path.join(__dirname, 'public')

app.use(cookieParser(), csrfMiddleware, (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Pragma', 'no-cache')
  if (!req.path.endsWith('.js') && !req.path.endsWith('.css')) {
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
app.use(
  CONTEXT_PATH,
  express.static(STATIC_PATH, {
    maxAge:
      process.env.NODE_ENV === 'development' ? 0 : 1000 * 60 * 60 * 24 * 365,
    setHeaders: (res, fp) => {
      // set cahce control to 30min, expect for nls
      res.setHeader(
        'Cache-Control',
        `max-age=${fp.startsWith(`${STATIC_PATH}/nls`) ? 0 : 60 * 60 * 12}`
      )
      res.setHeader('X-Content-Type-Options', 'nosniff')
    }
  })
)

app.get(`${CONTEXT_PATH}/performance-now.js.map`, (req, res) =>
  res.sendStatus(404)
)

app
  .use(cookieParser())
  .use(requestLogger)
  .use(bodyParser.json({ limit: '512kb' }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(controllers)

app.get('/favicon.ico', (req, res) => res.sendStatus(204))

app.locals.config = require('./lib/shared/config')
app.locals.manifest = require('./public/webpack-assets.json')

let privateKey, certificate, credentials
const http = require('http')
const https = require('https')

if (process.env.NODE_ENV === 'development') {
  try {
    privateKey = fs.readFileSync(
      process.env.serverKey || './sslcert/server.key',
      'utf8'
    )
    certificate = fs.readFileSync(
      process.env.serverCert || './sslcert/server.crt',
      'utf8'
    )
    credentials = { key: privateKey, cert: certificate }
  } catch (err) {
    // in development mode; ignore and fall back to http
  }
} else {
  // NOTE: In production, SSL is provided by the ICP ingress.
  privateKey = fs.readFileSync('/certs/applicationui.key', 'utf8')
  certificate = fs.readFileSync('/certs/applicationui.crt', 'utf8')
  credentials = { key: privateKey, cert: certificate }
}

const server = credentials
  ? https.createServer(credentials, app)
  : http.createServer(app)

var port = process.env.PORT || appConfig.get('httpsPort')
const url = `${
  credentials ? 'https://' : 'http://'
}localhost:${port}${CONTEXT_PATH}`

// start server
logger.info('Starting express server.')
server.listen(port, () => {
  logger.info(`Application Lifecycle is now running on ${url}`)
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

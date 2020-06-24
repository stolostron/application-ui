/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
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
    path = require('path'),
    appConfig = require('./config'),
    appUtil = require('./lib/server/app-util')

//early initialization
require('node-i18n-util')

process.env.BABEL_ENV = 'server'
require('babel-register')

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csurf = require('csurf'),
    requestLogger = require('./middleware/request-logger'),
    controllers = require('./controllers')

var consolidate = require('consolidate')

require('./lib/shared/dust-helpers')

var app = express()
var morgan = require('morgan')

if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      // in production these headers are set by ingress.open-cluster-management.io
      frameguard: false,
      noSniff: false,
      xssFilter: false,
      noCache: true
    })
  )

  app.use(
    '*',
    morgan('combined', {
      skip: (req, res) => res.statusCode < 400
    })
  )
} else {
  app.use(helmet({ noCache: true }))
  app.use('*', morgan('dev'))
}

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
    target: appConfig.get('hcmUiApiUrl') || 'https://localhost:4000/hcmuiapi',
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

app.use(
  appConfig.get('headerContextPath'),
  cookieParser(),
  createProxyMiddleware({
    target: appConfig.get('headerUrl'),
    changeOrigin: true,
    secure: false,
    ws: true,
    saveUninitialized: false
  })
)

if (process.env.NODE_ENV === 'development') {
  app.use(
    appConfig.get('headerContextPath'),
    cookieParser(),
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
      target: appConfig.get('headerUrl'),
      changeOrigin: true,
      secure: false,
      ws: true
    })
  )

  app.use(
    `${appConfig.get('contextPath')}/api/proxy${appConfig.get(
      'headerContextPath'
    )}`,
    cookieParser(),
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
      target: appConfig.get('headerUrl'),
      changeOrigin: true,
      pathRewrite: {
        [`^${appConfig.get('contextPath')}/api/proxy`]: ''
      },
      secure: false
    })
  )
}

app.engine('dust', consolidate.dust)
app.set('env', 'production')
app.set('views', __dirname + '/views')
app.set('view engine', 'dust')
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

var server
if (process.env.NODE_ENV === 'development') {
  var https = require('https')
  var privateKey = fs.readFileSync('./sslcert/server.key', 'utf8')
  var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8')
  var credentials = { key: privateKey, cert: certificate }
  server = https.createServer(credentials, app)
} else {
  // NOTE: In production, SSL is provided by the ICP ingress.
  var http = require('http')
  server = http.createServer(app)
}

var port = process.env.PORT || appConfig.get('httpPort')

// start server
logger.info('Starting express server.')
server.listen(port, () => {
  logger.info(
    `Application Lifecycle is now running on ${
      process.env.NODE_ENV === 'development' ? 'https' : 'http'
    }://localhost:${port}${CONTEXT_PATH}`
  )
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

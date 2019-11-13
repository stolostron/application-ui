/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

const ReactDOMServer = require('react-dom/server'),
      thunkMiddleware = require('redux-thunk').default,
      redux = require('redux'),
      React = require('react'),
      express = require('express'),
      StaticRouter = require('react-router-dom').StaticRouter,
      context = require('../../lib/shared/context'),
      msgs = require('../../nls/platform.properties'),
      config = require('../../config'),
      cookieUtil = require('../../lib/server/cookie-util'),
      appUtil = require('../../lib/server/app-util'),
      serviceDiscovery = require('../../lib/server/service-discovery'),
      Provider = require('react-redux').Provider,
      router = express.Router({ mergeParams: true }),
      lodash = require('lodash'),
      headerClient = require('../../lib/server/header-client')

var log4js = require('log4js'),
    logger = log4js.getLogger('app')

let App, Login, role, reducers, uiConfig //laziy initialize to reduce startup time seen on k8s
router.get('/logout', (req, res) => {
  var LOGOUT_API = '/v1/auth/logout'
  var callbackUrl = req.headers['host']
  cookieUtil.deleteAuthCookies(res)
  logger.debug('headers host:' + callbackUrl)
  var redirectUrl =
    process.env.NODE_ENV !== 'development' && callbackUrl
      ? `https://${callbackUrl}${LOGOUT_API}`
      : `${config.get('cfcRouterUrl')}${LOGOUT_API}`
  logger.debug('Final logout url:' + redirectUrl)
  return res.send({ redirectUrl })
})

router.get('*', (req, res) => {
  reducers =
    reducers === undefined ? require('../../src-web/reducers') : reducers

  const store = redux.createStore(
    redux.combineReducers(reducers),
    redux.applyMiddleware(
      thunkMiddleware // lets us dispatch() functions
    )
  )

  Login = Login === undefined ? require('../../src-web/actions/login') : Login
  store.dispatch(Login.receiveLoginSuccess(req.user))

  App =
    App === undefined ? require('../../src-web/containers/App').default : App
  const context = getContext(req)

  headerClient.getHeader(req, (err, headerRes) => {
    if (err) return res.status(500).send(err)

    const {
      headerHtml: header,
      props: propsH,
      state: stateH,
      files: filesH
    } = headerRes
    uiConfig =
      uiConfig === undefined
        ? require('../../src-web/actions/uiconfig')
        : uiConfig
    store.dispatch(
      uiConfig.uiConfigReceiveSucess(stateH.uiconfig.uiConfiguration)
    )

    role = role === undefined ? require('../../src-web/actions/role') : role
    store.dispatch(role.roleReceiveSuccess(stateH.role.role))

    if (process.env.NODE_ENV === 'development') {
      lodash.forOwn(filesH, value => {
        value.path = `${config.get('contextPath')}/api/proxy${value.path}` //preprend with proxy route
      })
    }

    const isICAMRunning = serviceDiscovery.serviceEnabled(
      'ibmcloudappmgmt-amui'
    )
    const isKibanaRunning = serviceDiscovery.serviceEnabled('kibana')
    //const isCEMRunning = serviceDiscovery.serviceEnabled('cem')
    //const isGrafanaRunning = serviceDiscovery.serviceEnabled(
    //   'monitoring-grafana'
    //)

    logger.info(`is Kibana Running: ${isKibanaRunning}`)
    //logger.info(`is cem Running: ${isCEMRunning}`)
    //logger.info(`is Grafana Running: ${isGrafanaRunning}`)
    logger.info(`is ICAM Running: ${isICAMRunning}`)

    const serverProps = {
      ...context,
      isKibanaRunning: isKibanaRunning,
      //isGrafanaRunning: isGrafanaRunning,
      //isCEMRunning: isCEMRunning,
      isICAMRunning: isICAMRunning
    }
    /*
    if (process.env.NODE_ENV === 'development') {
      serverProps.isKibanaRunning = true;
      serverProps.isGrafanaRunning = true;
      serverProps.isCEMRunning = true;
      serverProps.isICAMRunning = true;
    }
*/
    try {
      res.render(
        'main',
        Object.assign(
          {
            manifest: appUtil.app().locals.manifest,
            content: ReactDOMServer.renderToString(
              <Provider store={store}>
                <StaticRouter location={req.originalUrl} context={context}>
                  <App />
                </StaticRouter>
              </Provider>
            ),
            contextPath: config.get('contextPath'),
            state: store.getState(),
            props: serverProps,
            header: header,
            propsH: propsH,
            stateH: stateH,
            filesH: filesH
          },
          context
        )
      )
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  })
})

function getContext(req) {
  const req_context = context(req)
  return {
    title: msgs.get('common.app.name', req_context.locale),
    context: req_context,
    xsrfToken: req.csrfToken()
  }
}

module.exports = router

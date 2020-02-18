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
  appUtil = require('../../lib/server/app-util'),
  serviceDiscovery = require('../../lib/server/service-discovery'),
  Provider = require('react-redux').Provider,
  router = express.Router({ mergeParams: true }),
  lodash = require('lodash'),
  headerClient = require('../../lib/server/header-client'),
  securityMW = require('security-middleware')

let App, Login, role, reducers, uiConfig //laziy initialize to reduce startup time seen on k8s
router.get('/logout', securityMW.logout)

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

    const isICAMRunning = serviceDiscovery.serviceEnabled('amui')
    const isKibanaRunning = serviceDiscovery.serviceEnabled('kibana')
    const isCEMRunning = serviceDiscovery.serviceEnabled('cem')
    const isGrafanaRunning = serviceDiscovery.serviceEnabled(
      'monitoring-prometheus'
    )

    logger.info(`is Kibana Running: ${isKibanaRunning}`)
    logger.info(`is ICAM Running: ${isICAMRunning}`)
    logger.info(`is CEM Running: ${isCEMRunning}`)
    logger.info(`is Grafana Running: ${isGrafanaRunning}`)

    const serverProps = {
      ...context,
      isKibanaRunning: isKibanaRunning,
      isICAMRunning: isICAMRunning,
      isCEMRunning: isCEMRunning,
      isGrafanaRunning: isGrafanaRunning
    }

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

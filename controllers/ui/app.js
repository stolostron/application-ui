/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
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
      navUtil = require('../../lib/server/nav-util'),
      Provider = require('react-redux').Provider,
      router = express.Router({ mergeParams: true })

var log4js = require('log4js'),
    logger = log4js.getLogger('app')

let App, Login, reducers, nav  //laziy initialize to reduce startup time seen on k8s

router.get('/logout', (req, res) => {
  var LOGOUT_API = '/v1/auth/logout'
  var callbackUrl = req.headers['host']
  cookieUtil.deleteAuthCookies(res)
  logger.debug('headers host:'+callbackUrl)
  var redirectUrl = process.env.NODE_ENV !== 'development' && callbackUrl ? `https://${callbackUrl}${LOGOUT_API}` : `${config.get('cfcRouterUrl')}${LOGOUT_API}`
  logger.debug('Final logout url:'+ redirectUrl)
  return res.send({ redirectUrl })
})

router.get('*', (req, res) => {
  reducers = reducers === undefined ? require('../../src-web/reducers') : reducers

  const store = redux.createStore(redux.combineReducers(reducers), redux.applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
  ))

  Login = Login === undefined ? require('../../src-web/actions/login') : Login
  store.dispatch(Login.receiveLoginSuccess(req.user))

  App = App === undefined ? require('../../src-web/containers/App').default : App
  const context = getContext(req)
  const baseNavRoutes = navUtil.getLeftNavConfig(req, 'hcm-ui', process.env.NODE_ENV === 'development')
  nav = nav === undefined ? require('../../src-web/actions/nav') : nav
  store.dispatch(nav.navReceiveSuccess(baseNavRoutes))

  res.render('main', Object.assign({
    manifest: appUtil.app().locals.manifest,
    content: ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.originalUrl}
          context={context}>
          <App />
        </StaticRouter>
      </Provider>
    ),
    contextPath: config.get('contextPath'),
    state: store.getState(),
    props: context
  }, context))
})

function getContext(req) {
  const req_context = context(req)
  return {
    title: msgs.get('common.app.name', req_context.locale),
    context: req_context
  }
}

module.exports = router

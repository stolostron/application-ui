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
      Provider = require('react-redux').Provider,
      router = express.Router({ mergeParams: true }),
      lodash = require('lodash'),
      request = require('../../lib/server/request'),
      serviceDiscovery = require('../../lib/server/service-discovery'),
      constants = require('../../lib/shared/constants')

var log4js = require('log4js'),
    logger = log4js.getLogger('app')

let App, Login, reducers, role, uiConfig  //laziy initialize to reduce startup time seen on k8s
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
  fetchHeader(req, res, store, context)
})

function fetchHeader(req, res, store, context) {
  var options = {
    url: `${config.get('cfcRouterUrl')}/idmgmt/identity/api/v1/users/${req.user}/getHighestRole`,
    headers: {
      Authorization: `bearer ${cookieUtil.getAccessToken(req)}`
    }
  }
  request(options, null, [200], (err, roleRes) => {
    if (err) {
      return res.status(500).send(err)
    }
    const userRole = roleRes.body && roleRes.body.replace(/['"]+/g, '')
    role = role === undefined ? require('../../src-web/actions/role') : role
    store.dispatch(role.roleReceiveSuccess(userRole))
    try {
      options = {
        method: 'POST',
        url: `${config.get('cfcRouterUrl')}${config.get('platformHeaderContextPath')}/api/v1/header`,
        json: true,
        headers: {
          Cookie: createCookie(req)
        },
        body: {
          logoUrl: config.get('logoUrl') || `${config.get('contextPath')}/graphics/mcm-logo.svg`,
          docUrlMapping: {
            [`${config.get('contextPath')}`]: 'mcm/getting_started/introduction.html'
          },
          about: {
            logoUrl: config.get('logoUrlAbout') || `${config.get('contextPath')}/graphics/MCM-AboutModal-TextLogo.svg`,
            copyright: msgs.get('product.copyright', req)
          },
          navItems: [
            {
              id: 'overview',
              label: msgs.get('routes.overview', req),
              url: `${config.get('contextPath')}/overview`
            },
            {
              id: 'search',
              label: msgs.get('routes.search', req),
              url: `${config.get('contextPath')}/search`,
              disabled: config.get('featureFlags').search !== true
            },
            {
              id: 'clusters',
              label: msgs.get('routes.clusters', req),
              url: `${config.get('contextPath')}/clusters`
            },
            {
              id: 'policies',
              label: msgs.get('routes.policies', req),
              url: `${config.get('contextPath')}/policies`,
              disabled: isLowerThanOperator(userRole)
            },
            {
              id: 'applications',
              label: msgs.get('routes.applications', req),
              url: `${config.get('contextPath')}/applications`
            },
            {
              id: 'releases',
              label: msgs.get('routes.releases', req),
              url: `${config.get('contextPath')}/releases`
            },
            {
              id: 'pods',
              label: msgs.get('routes.pods', req),
              url: `${config.get('contextPath')}/pods`
            },
            {
              id: 'nodes',
              label: msgs.get('routes.nodes', req),
              url: `${config.get('contextPath')}/nodes`,
              disabled: isLowerThanAdmin(userRole)
            },
            {
              id: 'storage',
              label: msgs.get('routes.storage', req),
              url: `${config.get('contextPath')}/storage`,
              disabled: isLowerThanAdmin(userRole)
            },
            {
              id: 'topology',
              label: msgs.get('routes.topology', req),
              url: `${config.get('contextPath')}/topology`,
              disabled: isLowerThanEditor(userRole)
            },
            {
              id: 'events',
              label: msgs.get('routes.events', req),
              url: '/cemui/launch',
              disabled: isLowerThanOperator(userRole) || !serviceDiscovery.serviceEnabled('cem'),
              target: '_cem'
            },
            {
              id: 'security',
              label: msgs.get('routes.identity-access', req),
              url: '/console/manage/identity-access',
              disabled: isNotClusterAdmin(userRole)
            },
            {
              id: 'icp',
              label: msgs.get('routes.icp', req),
              url: '/console/dashboard',
              disabled: isNotClusterAdmin(userRole)
            },
            {
              id: 'welcome',
              label: msgs.get('routes.getting-started', req),
              url: `${config.get('contextPath')}/welcome`
            }
          ]
        }
      }
    } catch(err) {
      logger.error(err)
      return res.status(500).send(err.toString())
    }
    request(options, null, [200], (err, headerRes) => {
      if (err) {
        return res.status(500).send(err)
      }

      const { headerHtml: header, props: propsH, state: stateH, files: filesH } = headerRes.body
      // role = role === undefined ? require('../../src-web/actions/role') : role
      // store.dispatch(role.roleReceiveSuccess(stateH.role.role))

      uiConfig = uiConfig === undefined ? require('../../src-web/actions/uiconfig') : uiConfig
      store.dispatch(uiConfig.uiConfigReceiveSucess(stateH.uiconfig.uiConfiguration))

      if(process.env.NODE_ENV === 'development') {
        lodash.forOwn(filesH, value => {
          value.path = `${config.get('contextPath')}/api/proxy${value.path}` //preprend with proxy route
        })
      }
      try {
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
          props: context,
          header: header,
          propsH: propsH,
          stateH: stateH,
          filesH: filesH
        }, context))
      } catch(e) {
        //eslint-disable-next-line
        console.error(e)
      }
    })
  })
}

function createCookie(req) {
  var cookieNames = cookieUtil.getCookieNames()
  return cookieNames.map(cookieName => {
    return `${cookieName}=${req.cookies[cookieName]}`
  }).join('; ')
}

function getContext(req) {
  const req_context = context(req)
  return {
    title: msgs.get('common.app.name', req_context.locale),
    context: req_context
  }
}

function isLowerThanEditor(role) {
  return role === constants.ROLES.VIEWER
}

function isLowerThanOperator(role) {
  return role === constants.ROLES.VIEWER || role === constants.ROLES.EDITOR
}

function isLowerThanAdmin(role) {
  return role !== constants.ROLES.CLUSTER_ADMIN && role !== constants.ROLES.ADMIN
}

function isNotClusterAdmin(role) {
  return role !== constants.ROLES.CLUSTER_ADMIN
}

module.exports = router

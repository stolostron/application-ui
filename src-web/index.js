/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Router } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import App from './containers/App'
import ScrollToTop from './components/common/ScrollToTop'
import * as reducers from './reducers'
import config from '../lib/shared/config'
import apolloClient from '../lib/client/apollo-client'
import history from 'history'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

window.SHARED_HISTORY = window.SHARED_HISTORY
  ? window.SHARED_HISTORY
  : history.createBrowserHistory()

const loggerMiddleware = createLogger()
// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

const middleware = [thunkMiddleware] // lets us dispatch() functions
if (
  !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  config['featureFlags:reduxLogger']
) {
  middleware.push(loggerMiddleware) // middleware that logs actions
}

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
)

hydrate(
  <ApolloProvider client={apolloClient.getClient()}>
    <Provider store={store}>
      <Router history={window.SHARED_HISTORY}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('page')
)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import lodash from 'lodash'

import config from '../shared/config'
import * as Query from './queries'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${config.contextPath}/graphql`,
    credentials: 'same-origin'
  }),
})

class apolloClient {
  get(resourceType) {
    return client.query({ query: lodash.get(Query, resourceType.list) })
  }
  addHemlRepo(Name, URL) {
    return client.mutate({ mutation: Query.HCMSetRepository, variables: { repo: { Name, URL } } })
  }

  installHelmChart(input) {
    return client.mutate({ mutation: Query.HCMInstallHelmChart, variables: { input } })
  }
}

export default new apolloClient()


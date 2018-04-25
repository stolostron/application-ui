import ApolloClient from 'apollo-boost'
import lodash from 'lodash'

import * as Query from './queries'
import config from '../shared/config'
import http from './http-util'

const client = new ApolloClient({
  uri: config.env === 'development' ? 'http://localhost:4000/hcmuiapi/graphql' : `${http.getHostUrl()}/hcmuiapi/graphql`
})

class apolloClient {
  get(resourceType) {
    return client.query({ query: lodash.get(Query, resourceType.list) })
  }
}

export default new apolloClient()


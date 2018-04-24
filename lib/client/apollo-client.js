import ApolloClient from 'apollo-boost'
import lodash from 'lodash'

import * as Query from './queries'
import config from '../shared/config'

const client = new ApolloClient({
  uri: config.hcmUiApiUrl || 'http://localhost:4000/graphql'
})

class apolloClient {
  get(resourceType) {
    return client.query({ query: lodash.get(Query, resourceType.list) })
  }
}

export default new apolloClient()


import ApolloClient from 'apollo-boost'
import lodash from 'lodash'

import * as Query from './queries'
import config from '../shared/config'

const port = config.httpPort

const client = new ApolloClient({
  uri: `http://localhost:${port}/graphql`
})

class apolloClient {
  get(resourceType) {
    return client.query({ query: lodash.get(Query, resourceType.list) })
  }
}

export default new apolloClient()


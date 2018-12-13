/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import SearchBar from '../search/SearchBar'
import { Icon } from 'carbon-components-react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { GET_SEARCH_INPUT_TEXT } from '../../apollo-client/queries/SearchQueries'
import { UPDATE_SINGLE_QUERY_TAB } from '../../apollo-client/queries/StateQueries'

resources(() => {
  require('../../../scss/search-input.scss')
})

const GET_SEARCH_SCHEMA = gql`
  query searchSchema {
    searchSchema
  }
`
class SearchInput extends React.PureComponent {
  render() {
    const { tabName } = this.props
    return (
      <Query query={GET_SEARCH_SCHEMA}>
        {( { data, client } ) => {
          const searchSchema = data.searchSchema
          return (
            <div className='search--input-area'>
              <Query query={GET_SEARCH_INPUT_TEXT}>
                {( { data } ) => {
                  return (
                    <SearchBar
                      value={_.get(data, 'searchInput.text', '')}
                      availableFilters={searchSchema || []}
                      onChange={(input) => {
                        // TODO searchFeature: use a mutation with a schema.
                        // TODO searchFeature: Need to debunce to limit the backend request.
                        client.writeData({ data: {
                          searchInput: {
                            __typename: 'SearchInput', // TODO searchFeature: define schema
                            text: input
                          }
                        }} )
                        const newData =  {
                          openedTabName: tabName,
                          searchText: input
                        }
                        client.mutate({ mutation: UPDATE_SINGLE_QUERY_TAB, variables: { ...newData } })
                      }}
                    />
                  )
                }}
              </Query>
              {/*for saving query*/}
              <div className='search-input-save-button'>
                <button type="button" className="query-save-button"
                  onClick={this.props.handleSaveButtonClick}>
                  <Icon
                    className='icon--save'
                    name='icon--save'
                    description={msgs.get('button.save.query', this.context.locale)} />
                </button>
              </div>
            </div>
          )}
        }
      </Query>
    )
  }
}

SearchInput.propTypes = {
  handleSaveButtonClick: PropTypes.func,
  tabName: PropTypes.string,
}

export default SearchInput

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
import ApolloClient from '../../../lib/client/apollo-client'
import { Icon } from 'carbon-components-react'
import { Query } from 'react-apollo'
import { GET_SEARCH_SCHEMA, GET_SEARCH_INPUT_TEXT } from '../../apollo-client/queries/SearchQueries'
import { UPDATE_SINGLE_QUERY_TAB } from '../../apollo-client/queries/StateQueries'

resources(() => {
  require('../../../scss/search-input.scss')
})

class SearchInput extends React.PureComponent {
  constructor(props){
    super(props)
    this.client = ApolloClient.getClient()
  }

  componentWillUnmount(){
    this.client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: ''
      }
    }} )
  }

  render() {
    const { clientSideFilters, tabName, tabId, updateBrowserURL } = this.props
    return (
      <Query query={GET_SEARCH_SCHEMA}>
        {( { data, client } ) => {
          const searchSchema = data.searchSchema
          return (
            <div className='search--input-area'>
              <Query query={GET_SEARCH_INPUT_TEXT}>
                {( { data } ) => {
                  const text = _.get(data, 'searchInput.text', '')
                  return (
                    <SearchBar
                      value={text}
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
                          openedTabId: tabId,
                          searchText: input
                        }
                        client.mutate({ mutation: UPDATE_SINGLE_QUERY_TAB, variables: { ...newData } })
                      }}
                      handleInfoButtonClick={() => {
                        return client.writeData({ data: {
                          modal: {
                            __typename: 'modal',
                            type: 'modal.actions.info',
                            open: true
                          }
                        }} )
                      }}
                      clientSideFilters={clientSideFilters}
                      updateBrowserURL={updateBrowserURL}
                    />
                  )
                }}
              </Query>
              {/*for saving query*/}
              <div className='search-input-save-button'>
                <button type="button" aria-label="save-query" className="query-save-button"
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
  clientSideFilters: PropTypes.string,
  handleSaveButtonClick: PropTypes.func,
  tabId: PropTypes.string,
  tabName: PropTypes.string,
  updateBrowserURL: PropTypes.func
}

export default SearchInput

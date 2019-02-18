/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import { Loading } from 'carbon-components-react'
import {
  GET_SAVED_USER_QUERY,
  SEARCH_QUERY,
  SEARCH_QUERY_RELATED,
  GET_SEARCH_INPUT_TEXT,
  GET_SEARCH_TABS
} from '../apollo-client/queries/SearchQueries'
import _ from 'lodash'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import Page from '../components/common/Page'
import SearchInput from '../components/search/SearchInput'
import SearchResult from '../components/search/SearchResult'
import SavedSearchQueries from '../components/search/SavedSearchQueries'
import SuggestQueryTemplates from '../components/search/SuggestedQueryTemplates'
import resources from '../../lib/shared/resources'
import SecondaryHeaderApollo from '../components/SecondaryHeaderApollo'
import pageWithUrlQuery from '../components/common/withUrlQuery'
import { convertStringToQuery } from '../../lib/client/search-helper'


resources(() => {
  require('../../scss/search-input.scss')
})

class SearchPage extends React.Component {
  static propTypes = {
    clientSideFilters: PropTypes.string,
    secondaryHeaderProps: PropTypes.object,
    updateBrowserURL: PropTypes.func,
  }

  componentWillMount() {
    const { secondaryHeaderProps } = this.props
    updateSecondaryHeader(msgs.get(secondaryHeaderProps.title, this.context.locale))
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.clientSideFilters, this.props.clientSideFilters)
  }

  render() {
    return (
      <div>
        <SecondaryHeaderApollo
          title={msgs.get('search.label', this.context.locale)}
          updateBrowserURL={this.props.updateBrowserURL} />
        <Page>
          <Query query={GET_SEARCH_TABS}>
            {( { data, client } ) => {
              if(data && data.searchQueryTabs && data.searchQueryTabs.openedTabName !== '') {
                const tabName = _.get(data, 'searchQueryTabs.openedTabName', '')
                const tabId = _.get(data, 'searchQueryTabs.openedTabId', '')
                return (
                  <SearchInput
                    tabName={tabName}
                    tabId={tabId}
                    clientSideFilters={this.props.clientSideFilters}
                    updateBrowserURL={this.props.updateBrowserURL}
                    handleSaveButtonClick={() => {
                      return client.writeData({ data: {
                        modal: {
                          __typename: 'modal',
                          type: 'modal.actions.save',
                          open: true
                        }
                      }} )
                    }}
                  />
                )} else {
                return null
              }
            }}
          </Query>
          <Query query={GET_SEARCH_INPUT_TEXT}>
            {( { data } ) => {
              let query = {keywords: [], filters: []}
              if (data && data.searchInput && data.searchInput.text !== '') {
                query = convertStringToQuery(data.searchInput.text)
              }
              if (this.props.clientSideFilters !== undefined && (data && data.searchInput && data.searchInput.text === '')) {
                return (
                  <SearchResult loading={true} />
                )
              } else if(data && data.searchInput && data.searchInput.text !== '' && (query.keywords.length > 0 || query.filters.length > 0)) {
                return (
                  <Query query={config['feature_searchRelated'] ? SEARCH_QUERY_RELATED : SEARCH_QUERY} variables={{input: [query]}}>
                    {({ data, loading }) => {
                      return (
                        <SearchResult searchResult={data.searchResult && data.searchResult[0]} keywordPresent={query.keywords.length > 0} loading={loading} />
                      )
                    }}
                  </Query>
                )
              } else {
                return (<Query query={GET_SAVED_USER_QUERY}>
                  {( { data, loading } ) => {
                    if (loading) return <Loading className='content-spinner' />
                    const queries = _.get(data, 'items', [])
                    // each query should contain ---- description, name, results = [], resultHeader
                    const suggestedQueryTemplates = _.get(SuggestQueryTemplates, 'templates', [])
                    //combine the suggested queries and saved queries
                    const input = [...queries.map(query => convertStringToQuery(query.searchText)),
                      ...suggestedQueryTemplates.map(query => convertStringToQuery(query.searchText))]
                    return(
                      <Query query={config['feature_searchRelated'] ? SEARCH_QUERY_RELATED : SEARCH_QUERY} variables={{input: input}}>
                        {({ data, loading }) => {
                          if (data.searchResult) {
                            const queriesResult = data.searchResult.slice(0, queries.length).map((query, index) => {return {...query, ...queries[index]}})
                            const suggestedQueriesResult = data.searchResult.slice(queries.length).map((query, index) => {return {...query, ...suggestedQueryTemplates[index]}})
                            return (
                              <div>
                                {queriesResult.length > 0 && <SavedSearchQueries queries={queriesResult.reverse()} header={'table.header.search.saved.query'} showTotal={true} />}
                                {suggestedQueriesResult.length > 0 && <SavedSearchQueries queries={suggestedQueriesResult} header={'table.header.search.suggested.query'} />}
                              </div>)
                          } else if (loading) {
                            return <Loading withOverlay={false} className='content-spinner' />
                          }
                        }}
                      </Query>
                    )
                  }}
                </Query>)
              }
            }}
          </Query>
        </Page>
      </div>
    )
  }
}

SearchPage.contextTypes = {
  locale: PropTypes.string
}

export default withRouter(pageWithUrlQuery(SearchPage))

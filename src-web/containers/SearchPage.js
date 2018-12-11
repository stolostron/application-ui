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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import { Loading } from 'carbon-components-react'
import {
  GET_SAVED_USER_QUERY,
  SEARCH_QUERY,
  GET_SEARCH_INPUT_TEXT,
  GET_SEARCH_TABS
} from '../apollo-client/queries/SearchQueries'
import _ from 'lodash'
import msgs from '../../nls/platform.properties'
import Page from '../components/common/Page'
import SearchInput from '../components/search/SearchInput'
import SearchResult from '../components/search/SearchResult'
import SavedSearchQueries from '../components/search/SavedSearchQueries'
import SuggestQueryTemplates from '../components/search/SuggestedQueryTemplates'
import resources from '../../lib/shared/resources'
import SecondaryHeaderApollo from '../components/SecondaryHeaderApollo'


resources(() => {
  require('../../scss/search-input.scss')
})

class SearchPage extends React.Component {
  static propTypes = {
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    updateSecondaryHeader(msgs.get(secondaryHeaderProps.title, this.context.locale))
  }

  render() {
    return (
      <div>
        <SecondaryHeaderApollo title={msgs.get('search.label', this.context.locale)} />
        <Page>
          <Query query={GET_SEARCH_TABS}>
            {( { data, client } ) => {
              const tabName = _.get(data, 'searchQueryTabs.openedTabName', '')
              return (
                <SearchInput tabName={tabName} handleSaveButtonClick={() => {
                  return client.writeData({ data: {
                    modal: {
                      __typename: 'modal',
                      type: 'modal.actions.save',
                      open: true
                    }
                  }} )
                }
                } />
              )} }
          </Query>
          <Query query={GET_SEARCH_INPUT_TEXT}>
            {( { data } ) => {
              if(data && data.searchInput && data.searchInput.text !== '') {
                const searchText = data.searchInput.text
                const searchTokens = searchText.split(' ')
                const keywords = searchTokens.filter(token => token !== '' && token.indexOf(':') < 0)
                const filters = searchTokens.filter(token => token.indexOf(':') >= 0)
                  .map(f => {
                    const [ filter, values ] = f.split(':')
                    return { filter, values: values.split(',') }
                  })
                  .filter(f => f.filter !== '' && f.values !== '')
                return (
                  <Query query={SEARCH_QUERY} variables={{input: [{keywords, filters}]}}>
                    {({ data, loading }) => {
                      if (data.searchResult || loading) {
                        return (<SearchResult searchResult={data.searchResult} loading={loading} />)
                      }
                      return (
                        <div>
                          <br></br>
                          <p>{msgs.get('search.noresults', this.context.locale)}</p>
                        </div>
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
                    return (
                      <div>
                        {queries.length > 0 && <SavedSearchQueries queries={queries} header={'table.header.search.saved.query'} />}
                        {suggestedQueryTemplates.length > 0 && <SavedSearchQueries queries={suggestedQueryTemplates} header={'table.header.search.suggested.query'} />}
                      </div>
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


const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SearchPage))

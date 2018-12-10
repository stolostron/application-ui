/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { ApolloConsumer } from 'react-apollo'
import {UPDATE_MODAL, UPDATE_QUERY_TABS} from '../../apollo-client/queries/StateQueries'

resources(() => {
  require('../../../scss/search-input.scss')
})

const cardActions = [
  'modal.actions.edit',
  'modal.actions.share',
  'modal.actions.remove',
]

class SearchQueryCard extends React.Component {

  getResourceAction = (action, client, data) => {
    client.mutate({ mutation: UPDATE_MODAL, variables: { __typename: 'modal', open: true, type: action, data } })
  }

  handleKeyPress = (e, client, searchText) => {
    if ( e.key === 'Enter') {
      this.handleCardClick(client, searchText)
    }
  }

  handleCardClick = (client, searchText, cardData) => {
    const { name, description } = cardData
    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: searchText
      }
    }} )
    const newData =  {
      __typename: 'SearchQueryTabs',
      openedTabName: name,
      data:{
        queryName: name,
        searchText:searchText,
        description:description,
        id: name,
        updated: false,
        __typename: 'QueryTab'
      },
    }
    client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })
  }

  getCardActions = (client, data, resultHeader) => {
    const { locale } = this.context
    if (cardActions && cardActions.length > 0) {
      return (
        <div className={'query-menu-button'}>
          <OverflowMenu floatingMenu flipped iconDescription={msgs.get('svg.description.overflowMenu', locale)}>
            {cardActions.map((action) => {
              if ( !resultHeader || (resultHeader && action !== 'modal.actions.remove' && action !== 'modal.actions.edit')) {
                return (
                  <OverflowMenuItem
                    data-table-action={action}
                    isDelete={action ==='modal.actions.remove'}
                    onClick={this.getResourceAction.bind(null, action, client, data)}
                    key={action}
                    itemText={msgs.get(action, locale)}
                  />
                )
              }
            }
            )}
          </OverflowMenu>
        </div>
      )
    }
    return null
  }

  render() {
    const { locale } = this.context
    const { searchText, description, name, results = [], timeCreated = new Date().toLocaleString(), resultHeader } = this.props
    return (<ApolloConsumer>
      {client => (
        <Module className={'bx--tile search-query-card'} size="single">
          <ModuleBody className={'search-query-card-summary'}>
            <div className="search-query-result"
              tabIndex={0}
              role={'button'}
              onKeyPress={this.handleKeyPress.bind(null, client, searchText)}
              onClick={() => { this.handleCardClick(client, searchText, { searchText, description, name })
              }} >
              <p className={`search-query-result-number${resultHeader ? '__suggested' : ''}`}>{results.length}</p>
              <p className={'search-query-result-string'}>{msgs.get(resultHeader || 'search.tile.results', locale)}</p>
            </div>
            <div className="search-query-content">
              <p className="search-query-name">{name}</p>
              <p className="search-query-time">{`${msgs.get('table.header.updated', locale)} ${timeCreated}`}</p>
              <p className="search-query-description">{description}</p>
            </div>
            {this.getCardActions(client, { __typename: 'ModalData', searchText, description, name }, resultHeader)}
          </ModuleBody>
        </Module>
      )}
    </ApolloConsumer>)
  }
}


SearchQueryCard.propTypes = {
  description: PropTypes.string,
  name: PropTypes.string,
  resultHeader: PropTypes.string,
  results: PropTypes.array,
  searchText: PropTypes.string,
  timeCreated: PropTypes.string,
}

export default SearchQueryCard

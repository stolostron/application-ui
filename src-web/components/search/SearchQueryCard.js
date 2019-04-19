/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import { OverflowMenu, OverflowMenuItem, SkeletonText, Icon } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { ApolloConsumer } from 'react-apollo'
import { GET_SEARCH_TABS } from '../../apollo-client/queries/SearchQueries'
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

  handleKeyPress = (client, searchText, cardData, evt) => {
    if ( evt.key === 'Enter') {
      this.handleCardClick(client, searchText, cardData)
    }
  }

  handleCardClick = (client, searchText, cardData) => {
    const { name, description } = cardData
    const {searchQueryTabs: { tabs, openedTabName }} = client.readQuery({query: GET_SEARCH_TABS})

    const newTab = {
      description: description,
      id: name + '-' + Date.now(),
      queryName: name,
      searchText: searchText,
      updated: false,
      __typename: 'QueryTab'
    }
    tabs[tabs.findIndex(tab => tab.queryName === openedTabName)] = newTab
    const newData =  {
      __typename: 'SearchQueryTabs',
      openedTabName: name,
      openedTabId: newTab.id,
      tabs: tabs,
    }
    client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: searchText
      }
    }} )
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

  loadingComponent = () => {
    return (
      <Module className={'bx--tile search-query-card'} size="single">
        <div className='search-query-card-loading'>
          <SkeletonText />
          <SkeletonText />
        </div>
      </Module>
    )
  }

  render() {
    const { locale } = this.context
    // const { timeCreated = new Date().toLocaleString() } = this.props
    const { loading, searchText, description, name, count, results = [], resultHeader } = this.props
    if (loading)
      return this.loadingComponent()
    return (<ApolloConsumer>
      {client => (
        <Module className={'bx--tile search-query-card'} size="single">
          <ModuleBody className={'search-query-card-summary'}>
            <div className="search-query-result"
              tabIndex={0}
              role={'button'}
              onKeyPress={this.handleKeyPress.bind(null, client, searchText, { searchText, description, name })}
              onClick={() => { this.handleCardClick(client, searchText, { searchText, description, name })
              }} >
              <p className={`search-query-result-number${resultHeader ? '__suggested' : ''}`}>{count || results.length}</p>
              <p className={'search-query-result-string'}>{msgs.get(resultHeader || 'search.tile.results', locale)}</p>
            </div>
            {
              <div className="search-query-content">
                <div className={'search-query-card-inner-container'}>
                  { resultHeader ?
                    <div className={'search-query-orb'}>
                      <Icon
                        className='icon--document'
                        name='icon--document'
                        description={msgs.get('table.show.all.button', this.context.locale)} />
                    </div> : null }
                  <div className={`${resultHeader ? 'search-query-header__orb' : 'search-query-header'}`}>
                    <p className="search-query-name">{name}</p>
                    {/*<p className="search-query-time">{`${msgs.get('table.header.updated', locale)} ${timeCreated}`}</p>*/}
                  </div>
                </div>
                <p className={`search-query-description ${resultHeader && 'search-query-description__orb'}`}>{description}</p>
              </div>
            }
            {this.getCardActions(client, { __typename: 'ModalData', searchText, description, name }, resultHeader)}
          </ModuleBody>
        </Module>
      )}
    </ApolloConsumer>)
  }
}


SearchQueryCard.propTypes = {
  count: PropTypes.number,
  description: PropTypes.string,
  loading: PropTypes.bool,
  name: PropTypes.string,
  resultHeader: PropTypes.string,
  results: PropTypes.array,
  searchText: PropTypes.string,
  // timeCreated: PropTypes.string,
}

export default SearchQueryCard

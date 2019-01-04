/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon } from 'carbon-components-react'
import Tab from './common/Tab'
import { DetailPageHeader } from 'carbon-addons-cloud-react'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { Query } from 'react-apollo'
import { UPDATE_QUERY_TABS, REMOVE_SINGLE_QUERY_TAB } from '../apollo-client/queries/StateQueries'
import { GET_SEARCH_TABS } from '../apollo-client/queries/SearchQueries'
import _ from 'lodash'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeaderSearchPage extends React.Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
    this.state = {
      //eslint-disable-next-line
      isHovering: false,
    }
  }

  handleMouseHover = () => {
    this.setState((preState) => {return { isHovering: !preState.isHovering }})
  }


  render() {
    const { title } = this.props
    const { locale } = this.context
    return (
      <Query query={GET_SEARCH_TABS}>
        {( { data, client } ) => {
          const tabs = _.get(data, 'searchQueryTabs.tabs')
          const unsavedCount = _.get(data, 'searchQueryTabs.unsavedCount')
          const openedTabName = _.get(data, 'searchQueryTabs.openedTabName')
          return (
            <div className='secondary-header-wrapper' role='region' aria-label={title}>
              <div className='secondary-header'>
                {tabs && tabs.length > 0 ? (
                  <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                    <Tabs className='secondary-header-tabs' selected={this.getSelectedTab(tabs, openedTabName) || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
                      {this.renderTabs(client, tabs, unsavedCount)}
                      {this.renderAddNewTab(client, unsavedCount, tabs, locale)}
                    </Tabs>
                  </DetailPageHeader>
                ) : (
                  <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                  </DetailPageHeader>
                )}
              </div>
            </div>
          )
        }}
      </Query>
    )
  }

  renderAddNewTab = (client, unsavedCount, tabs, locale) => {
    return (
      <Tab label={'+' + msgs.get('tabs.add.new', locale)}
        id={'add-new-query'} onClick={this.handleClickNewTab(client, unsavedCount, tabs)} />
    )
  }

  renderTabs(client, tabs, unsavedCount) {
    return tabs.map((tab) => {
      return (
        <Tab label={`${tab.queryName} ${tab.updated ? '*': ''}`}
          key={tab.queryName}
          id={tab.queryName}
          onClick={(evt) => {
            if (evt.target.nodeName === 'A' || evt.target.nodeName === 'LI') this.handleClickTab(client, tabs, tab, unsavedCount)}
          }
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
          subcomponent = { tabs.length > 1 ?
            <Icon
              className='header-icon--close'
              name='icon--close'
              fill={'#5a6872'}
              description={msgs.get('tabs.close.icon', this.context.locale)}
              onClick={this.handleRemoveClick(client, tab)} /> : null
          }
        />
      )
    })
  }

  handleRemoveClick = (client, tab) => async () => {
    const { queryName } = tab
    const newData =  {
      queryName
    }
    await client.mutate({ mutation: REMOVE_SINGLE_QUERY_TAB, variables: { ...newData } })
  }

  handleClickNewTab = (client, unsavedCount, tabs) => async () => {
    const newData =  {
      __typename: 'SearchQueryTabs',
      unsavedCount: unsavedCount + 1,
      openedTabName: `Unsaved-${unsavedCount}`,
      data:{
        queryName: `Unsaved-${unsavedCount}`,
        searchText:'',
        description:'',
        id: `Unsaved-${unsavedCount}`,
        updated: false,
        __typename: 'QueryTab'
      },
      tabs
    }
    await client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: ''
      }
    }} )
  }

  async handleClickTab(client, tabs, tab, unsavedCount) {
    const { queryName, searchText } = tab
    const newData =  {
      __typename: 'SearchQueryTabs',
      unsavedCount: unsavedCount,
      openedTabName: queryName,
      tabs
    }
    await client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: searchText
      }
    }} )
  }

  getSelectedTab(tabs, openedTabName) {
    const index = tabs.findIndex((tab) =>
      tab.queryName === openedTabName
    )
    return index === -1 ? 0 : index
  }

}

SecondaryHeaderSearchPage.contextTypes = {
  locale: PropTypes.string
}

SecondaryHeaderSearchPage.propTypes = {
  title: PropTypes.string
}

export default SecondaryHeaderSearchPage

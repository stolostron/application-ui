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
          const openedTabId = _.get(data, 'searchQueryTabs.openedTabId')
          return (
            <div className='secondary-header-wrapper' role='region' aria-label={title}>
              <div className='secondary-header'>
                {tabs && tabs.length > 0 ? (
                  <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                    <Tabs className='secondary-header-tabs' selected={this.getSelectedTab(tabs, openedTabId, client) || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
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
      <Tab label={msgs.get('tabs.add.new', locale)}
        className={'header-tab-add-new'}
        id={'add-new-query'} onClick={this.handleClickNewTab(client, unsavedCount, tabs, locale)}
        subcomponent = {
          <Icon
            className='header-icon--add__tab'
            name='icon--add'
            description={msgs.get('tabs.add.icon', this.context.locale)}
          />}
      />
    )
  }

  renderTabs(client, tabs, unsavedCount) {
    let index = 0
    const result = tabs.reduce((r, a) => r.concat(a, 0), [])
    return result.map((tab) => {
      if (!tab) {
        index++
        return (
          <Tab label={''}
            key={`tab-spacer-${index}`}
            className={'header-tab-separator-container'}
            id={`separator-${index}`} onClick={()=>{}}
            subcomponent = {
              <div className={'header-tab-separator'}></div>
            }
          />
        )
      }
      return (
        <Tab label={`${tab.queryName} ${tab.updated ? '*': ''}`}
          key={tab.id}
          id={tab.id}
          className={'header-tab-container'}
          onClick={(evt) => {
            if (evt.target.nodeName === 'A' || evt.target.nodeName === 'LI') {
              this.handleClickTab(client, tabs, tab, unsavedCount)
            }
          }}
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
          subcomponent = { tabs.length > 1 ?
            <Icon
              className='header-icon--close'
              name='icon--close'
              description={msgs.get('tabs.close.icon', this.context.locale)}
              onClick={this.handleRemoveClick(client, tabs, tab)} /> : null
          }
        />
      )
    })
  }

  handleRemoveClick = (client, tabs, tab) => async () => {
    const { id } = tab
    const newData =  {
      id
    }
    let deleteIndex = 0
    tabs.forEach((t, idx) => {
      if (t.id === tab.id && idx === tabs.length - 1) {
        deleteIndex = idx - 1
      } else if (t.id === tab.id) {
        deleteIndex = idx
      }
    })
    await client.mutate({ mutation: REMOVE_SINGLE_QUERY_TAB, variables: { ...newData } })

    this.props.updateBrowserURL({ query: tabs[deleteIndex].searchText })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: tabs[deleteIndex].searchText
      },
      relatedResources: {
        __typename: 'RelatedResources',
        visibleKinds: []
      }
    }} )
  }

  handleClickNewTab = (client, unsavedCount, tabs, locale) => async () => {
    const newSearch = msgs.get('tabs.add.new', locale)
    const unsaved = msgs.get('tabs.unsaved', locale)
    const newData =  {
      __typename: 'SearchQueryTabs',
      unsavedCount: unsavedCount + 1,
      openedTabName: `${newSearch} (${unsaved} - ${unsavedCount})`,
      openedTabId: `${newSearch} (${unsaved} - ${unsavedCount})`,
      data:{
        queryName: `${newSearch} (${unsaved} - ${unsavedCount})`,
        searchText:'',
        description:'',
        id: `${newSearch} (${unsaved} - ${unsavedCount})`,
        updated: false,
        __typename: 'QueryTab'
      },
      tabs
    }
    await client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })

    this.props.updateBrowserURL({ query: '' })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: ''
      },
      relatedResources: {
        __typename: 'RelatedResources',
        visibleKinds: []
      }
    }} )
  }

  async handleClickTab(client, tabs, tab, unsavedCount) {
    const { queryName, id, searchText } = tab
    const newData =  {
      __typename: 'SearchQueryTabs',
      unsavedCount: unsavedCount,
      openedTabName: queryName,
      openedTabId: id,
      tabs
    }
    await client.mutate({ mutation: UPDATE_QUERY_TABS, variables: { ...newData } })

    this.props.updateBrowserURL({ query: searchText })

    client.writeData({ data: {
      searchInput: {
        __typename: 'SearchInput',
        text: searchText
      },
      relatedResources: {
        __typename: 'RelatedResources',
        visibleKinds: []
      }
    }} )
  }

  getSelectedTab(tabs, openedTabId, client) {
    const currentTab = tabs.filter(tab => tab.id === openedTabId && !tab.queryName.toLowerCase().includes('unsaved'))
    const result = tabs.reduce((r, a) => r.concat(a, 0), [])
    const index = result.findIndex((tab) =>
      tab.id === openedTabId
    )

    client.writeData({ data: {
      modal: {
        __typename: 'modal',
        data: {
          __typename: 'ModalData',
          name: _.get(currentTab, '[0].queryName', ''),
          searchText:  _.get(currentTab, '[0].searchText', ''),
          description: _.get(currentTab, '[0].description', ''),
        }
      }
    }} )

    return index === -1 ? 0 : index
  }

}

SecondaryHeaderSearchPage.contextTypes = {
  locale: PropTypes.string
}

SecondaryHeaderSearchPage.propTypes = {
  title: PropTypes.string,
  updateBrowserURL: PropTypes.func
}

export default SecondaryHeaderSearchPage

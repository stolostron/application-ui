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
import ResourceTable from './ResourceTable'
import { REQUEST_STATUS } from '../../actions/index'
import NoResource from './NoResource'
import { connect } from 'react-redux'
import { changeTablePage, searchTable, sortTable, fetchResources, updateSecondaryHeader } from '../../actions/common'
import TableHelper from '../../util/table-helper'
import { Loading, Notification } from 'carbon-components-react'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import headerMsgs from '../../../nls/header.properties'
import config from '../../../lib/shared/config'

class ResourceList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false
    }
  }

  componentWillMount() {
    const { updateSecondaryHeader, tabs, title } = this.props
    updateSecondaryHeader(headerMsgs.get(title, this.context.locale), tabs)
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      this.setState({ intervalId: intervalId })
    }
  }

  componentDidMount() {
    const { fetchResources } = this.props
    fetchResources()
  }

  reload() {
    if (this.props.status === REQUEST_STATUS.DONE) {
      this.setState({ xhrPoll: true })
      this.props.fetchResources()
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const {
      items,
      itemIds,
      page,
      pageSize,
      sortDirection,
      totalFilteredItems,
      status,
      sortTable,
      sortColumn,
      changeTablePage,
      searchTable,
      staticResourceData,
      searchValue,
      resourceType,
      statusCode,
      children,
      namespace
    } = this.props
    const { locale } = this.context

    if (status === REQUEST_STATUS.ERROR && !this.state.xhrPoll) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get(`error.${(statusCode === 401 || statusCode === 403) ? 'unauthorized' : 'default'}.description`, locale)}
        kind='error' />
    }

    if (status !== REQUEST_STATUS.DONE && !this.state.xhrPoll)
      return <Loading withOverlay={false} className='content-spinner' />

    const actions = React.Children.map(children, action => {
      if (action.props.disabled)
        return null
      return React.cloneElement(action, { resourceType })
    })

    if (items || searchValue)
      return <ResourceTable
        actions={actions}
        staticResourceData={staticResourceData}
        page={page}
        pageSize={pageSize}
        itemIds={itemIds}
        sortDirection={sortDirection}
        sortColumn={sortColumn}
        status={status}
        items={items}
        totalFilteredItems={totalFilteredItems}
        resourceType={resourceType}
        changeTablePage={changeTablePage}
        handleSort={TableHelper.handleSort.bind(this, sortDirection, sortColumn, sortTable)}
        handleSearch={TableHelper.handleInputValue.bind(this, searchTable)}
        searchValue={searchValue}
        tableActions={staticResourceData.tableActions} />

    const resourceName = msgs.get('no-resource.' + resourceType.name.toLowerCase(), locale)
    return (
      <NoResource
        title={msgs.get('no-resource.title', [resourceName], locale)}
        detail={msgs.get(`no-resource.detail${namespace.split(',').length > 1 ? '' : '-namespace'}`, [resourceName, namespace], locale)}>
        {actions}
      </NoResource>
    )
  }

  handleResourceAddedEvent(event) {
    this.props.addResource(event)
  }

  handleResourceModifiedEvent(event) {
    this.props.modifyResource(event)
  }

  handleResourceDeletedEvent(event) {
    this.props.deleteResource(event)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName } = ownProps.resourceType,
        error = state[typeListName].err,
        visibleResources = ownProps.getVisibleResources(state, {'storeRoot': typeListName})
  return {
    items: visibleResources.normalizedItems,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: state[typeListName].status,
    page: state[typeListName].page,
    pageSize: state[typeListName].itemsPerPage,
    sortDirection: state[typeListName].sortDirection,
    sortColumn: state[typeListName].sortColumn,
    searchValue: state[typeListName].search,
    statusCode: error && error.response && error.response.status,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const resourceType = ownProps.resourceType
  return {
    fetchResources: () => dispatch(fetchResources(resourceType)),
    changeTablePage: page => dispatch(changeTablePage(page, resourceType)),
    searchTable: search => dispatch(searchTable(search, resourceType)),
    sortTable: (sortDirection, sortColumn) => dispatch(sortTable(sortDirection, sortColumn, resourceType)),
    updateSecondaryHeader: (title, tabs) => dispatch(updateSecondaryHeader(title, tabs)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

'use strict'

import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import ResourceTable from './ResourceTable'
import { REQUEST_STATUS } from '../../actions/index'
import NoResource from './NoResource'
import { connect } from 'react-redux'
import {
  changeTablePage,
  searchTable,
  sortTable,
  fetchResources,
  updateSecondaryHeader,
  delResourceSuccessFinished,
  mutateResourceSuccessFinished
} from '../../actions/common'
import { updateResourceFilters, combineFilters } from '../../actions/filters'
import TableHelper from '../../util/table-helper'
import { Notification } from 'carbon-components-react'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import TagInput from './TagInput'
import resources from '../../../lib/shared/resources'
import {
  renderRefreshTime,
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../shared/utils/refetch'
import { refetchIntervalUpdate } from '../../actions/refetch'
import { loadingComponent } from '../common/ResourceOverview/utils'
import { withLocale } from '../../providers/LocaleProvider'

resources(() => {
  require('../../../scss/resource-list.scss')
})

class ResourceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false
    }
  }

  componentDidMount() {
    const {
      updateSecondaryHeaderFn,
      tabs,
      title,
      mainButton,
      locale
    } = this.props
    updateSecondaryHeaderFn(msgs.get(title, locale), tabs, mainButton)

    const { fetchTableResources, selectedFilters = [] } = this.props
    fetchTableResources(selectedFilters)

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.mutateFinished()
  }

  mutateFinished() {
    this.props.mutateSuccessFinished()
    this.props.deleteSuccessFinished()
  }

  onVisibilityChange = () => {
    handleVisibilityChanged(this, clearInterval, setInterval)
  };

  componentDidUpdate(prevProps) {
    handleRefreshPropertiesChanged(prevProps, this, clearInterval, setInterval)
  }

  reload() {
    if (this.props.status === REQUEST_STATUS.DONE) {
      this.setState({ xhrPoll: true })
      const { fetchTableResources, selectedFilters = [] } = this.props
      fetchTableResources(selectedFilters)
    }
  }

  render() {
    const {
      items,
      itemIds,
      locale,
      mutateStatus,
      deleteStatus,
      deleteMsg,
      page,
      pageSize,
      sortDirection,
      totalFilteredItems,
      status,
      sortTableFn,
      sortColumn,
      changeTablePageFn,
      searchTableFn,
      staticResourceData,
      searchValue,
      resourceType,
      err,
      children,
      resourceFilters,
      onSelectedFilterChange,
      selectedFilters,
      updateBrowserURL,
      clientSideFilters,
      fetchTableResources,
      refetchIntervalUpdateDispatch
    } = this.props

    const { isLoaded = true, isReloading = false } = fetchTableResources
    const { timestamp = new Date().toString() } = this.state

    if (status === REQUEST_STATUS.ERROR && !this.state.xhrPoll) {
      //eslint-disable-next-line no-console
      console.error(err)
      return (
        <Notification
          title=""
          className="persistent"
          subtitle={msgs.get('error.default.description', locale)}
          kind="error"
        />
      )
    }

    if (status !== REQUEST_STATUS.DONE && !this.state.xhrPoll) {
      return loadingComponent()
    }

    const actions = React.Children.map(children, action => {
      return React.cloneElement(action, { resourceType })
    })

    let showTable = items
    if (resourceType.name === 'QueryApplications' && R.isEmpty(items)) {
      showTable = false
    }

    if (showTable || searchValue || clientSideFilters) {
      if (
        searchValue !== clientSideFilters &&
        clientSideFilters &&
        !this.state.xhrPoll
      ) {
        searchTableFn(clientSideFilters, false)
      }
      return (
        <div id="resource-list">
          {deleteStatus === REQUEST_STATUS.DONE && (
            <Notification
              title={msgs.get('success.update.resource', locale)}
              subtitle={msgs.get(
                'success.delete.description',
                [deleteMsg],
                locale
              )}
              kind="success"
            />
          )}
          {mutateStatus === REQUEST_STATUS.DONE && (
            <Notification
              title=""
              subtitle={msgs.get('success.create.description', locale)}
              kind="success"
            />
          )}
          {config['featureFlags:filters'] &&
            resourceType.filter && (
              <div className="resource-list-filter">
                <TagInput
                  tags={selectedFilters}
                  availableFilters={resourceFilters}
                  onSelectedFilterChange={onSelectedFilterChange}
                  updateBrowserURL={updateBrowserURL}
                />
              </div>
          )}
          {renderRefreshTime(
            refetchIntervalUpdateDispatch,
            isLoaded,
            isReloading,
            timestamp,
            locale
          )}
          <ResourceTable
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
            changeTablePage={changeTablePageFn}
            handleSort={TableHelper.handleSort.bind(
              this,
              sortDirection,
              sortColumn,
              sortTableFn
            )}
            handleSearch={TableHelper.handleInputValue.bind(
              this,
              searchTableFn
            )}
            searchValue={searchValue}
            defaultSearchValue={clientSideFilters}
            tableActions={staticResourceData.tableActions}
            locale={locale}
          />
        </div>
      )
    }

    return (
      <div>
        {renderRefreshTime(
          refetchIntervalUpdateDispatch,
          isLoaded,
          isReloading,
          timestamp,
          locale
        )}
        <NoResource
          title={msgs.get('no-resource.title', locale)}
          detail={msgs.get('no-resource.description.line1', locale)}
          detail2={[
            msgs.get('no-resource.description.line2.1', locale),
            msgs.get('description.application', locale),
            msgs.get('no-resource.description.line2.2', locale)
          ]}
        >
          {actions}
        </NoResource>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName, name: resourceName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const pendingActions = state[typeListName].pendingActions
  const items = visibleResources.normalizedItems
  if (items && pendingActions) {
    Object.keys(items).forEach(key => {
      if (pendingActions.find(pending => pending.name === items[key].Name)) {
        items[key].hasPendingActions = true
      }
    })
  }

  return {
    items,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: state[typeListName].status,
    page: state[typeListName].page,
    pageSize: state[typeListName].itemsPerPage,
    sortDirection: state[typeListName].sortDirection,
    sortColumn: state[typeListName].sortColumn,
    searchValue: state[typeListName].search,
    err: state[typeListName].err,
    mutateStatus: state[typeListName].mutateStatus,
    mutateErrorMsg: state[typeListName].mutateErrorMsg,
    deleteStatus: state[typeListName].deleteStatus,
    deleteMsg: state[typeListName].deleteMsg,
    forceReload: state[typeListName].forceReload,
    resourceFilters: state[typeListName].filters,
    selectedFilters:
      state['resourceFilters'].selectedFilters &&
      state['resourceFilters'].selectedFilters[resourceName],
    mutateSuccessFinished: state.mutateSuccessFinished,
    refetch: state.refetch
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { updateBrowserURL, resourceType } = ownProps
  return {
    fetchTableResources: selectedFilters => {
      dispatch(fetchResources(resourceType, combineFilters(selectedFilters)))
    },
    changeTablePageFn: page => dispatch(changeTablePage(page, resourceType)),
    searchTableFn: (search, updateURL) => {
      if (updateURL !== false) {
        updateBrowserURL && updateBrowserURL(search)
      }
      dispatch(searchTable(search, resourceType))
    },
    sortTableFn: (sortDirection, sortColumn) =>
      dispatch(sortTable(sortDirection, sortColumn, resourceType)),
    updateSecondaryHeaderFn: (title, tabs, mainButton) =>
      dispatch(
        updateSecondaryHeader(title, tabs, null, null, null, null, mainButton)
      ),
    onSelectedFilterChange: selectedFilters => {
      updateBrowserURL && updateBrowserURL(selectedFilters)
      dispatch(updateResourceFilters(resourceType, selectedFilters))
    },
    mutateSuccessFinished: () =>
      dispatch(mutateResourceSuccessFinished(ownProps.resourceType)),
    deleteSuccessFinished: () =>
      dispatch(delResourceSuccessFinished(ownProps.resourceType)),
    refetchIntervalUpdateDispatch: data => dispatch(refetchIntervalUpdate(data))
  }
}

ResourceList.propTypes = {
  changeTablePageFn: PropTypes.func,
  children: PropTypes.array,
  clientSideFilters: PropTypes.array,
  deleteMsg: PropTypes.string,
  deleteStatus: PropTypes.string,
  deleteSuccessFinished: PropTypes.func,
  err: PropTypes.object,
  fetchTableResources: PropTypes.func,
  itemIds: PropTypes.array,
  items: PropTypes.object,
  locale: PropTypes.string,
  mainButton: PropTypes.object,
  mutateStatus: PropTypes.string,
  mutateSuccessFinished: PropTypes.func,
  onSelectedFilterChange: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  refetchIntervalUpdateDispatch: PropTypes.func,
  resourceFilters: PropTypes.array,
  resourceType: PropTypes.object,
  searchTableFn: PropTypes.func,
  searchValue: PropTypes.string,
  selectedFilters: PropTypes.object,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  sortTableFn: PropTypes.func,
  staticResourceData: PropTypes.object,
  status: PropTypes.string,
  tabs: PropTypes.array,
  title: PropTypes.string,
  totalFilteredItems: PropTypes.number,
  updateBrowserURL: PropTypes.func,
  updateSecondaryHeaderFn: PropTypes.func
}

export default withLocale(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))
)

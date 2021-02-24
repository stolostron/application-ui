/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import ResourceTable from './ResourceTable'
import { REQUEST_STATUS } from '../../actions/index'
import { connect } from 'react-redux'
import {
  changeTablePage,
  searchTable,
  sortTable,
  fetchResources,
  updateSecondaryHeader,
  delResourceSuccessFinished
} from '../../actions/common'
import { updateResourceFilters, combineFilters } from '../../actions/filters'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import {
  renderRefreshTime,
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../shared/utils/refetch'
import { refetchIntervalUpdate } from '../../actions/refetch'
import { withLocale } from '../../providers/LocaleProvider'
import { AcmAlert } from '@open-cluster-management/ui-components'
import { Stack, StackItem } from '@patternfly/react-core'

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

    const { fetchTableResources } = this.props
    fetchTableResources([])

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.mutateFinished()
  }

  mutateFinished() {
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
      const { fetchTableResources } = this.props
      fetchTableResources([])
    }
  }

  render() {
    const {
      items,
      itemIds,
      locale,
      deleteStatus,
      deleteMsg,
      status,
      staticResourceData,
      resourceType,
      err,
      children,
      fetchTableResources,
      refetchIntervalUpdateDispatch,
      page,
      changeTablePageFn,
      searchValue,
      searchTableFn,
      sort,
      sortTableFn
    } = this.props

    const { isLoaded = true, isReloading = false } = fetchTableResources
    const { timestamp = new Date().toString() } = this.state

    if (status === REQUEST_STATUS.ERROR && !this.state.xhrPoll) {
      //eslint-disable-next-line no-console
      console.error(err)
      return (
        <AcmAlert
          title={msgs.get('error.default.description', locale)}
          variant="danger"
          noClose
        />
      )
    }

    const actions = React.Children.map(children, action => {
      return React.cloneElement(action, { resourceType })
    })

    const stackItems = []
    if (deleteStatus === REQUEST_STATUS.DONE) {
      stackItems.push(
        <StackItem key="alert">
          <AcmAlert
            title={msgs.get('success.update.resource', locale)}
            subtitle={msgs.get(
              'success.delete.description',
              [deleteMsg],
              locale
            )}
            variant="success"
          />
        </StackItem>
      )
    }
    stackItems.push(
      <StackItem key="table">
        <ResourceTable
          actions={actions}
          staticResourceData={staticResourceData}
          itemIds={itemIds}
          items={items}
          resourceType={resourceType}
          tableActions={staticResourceData.tableActions}
          page={page}
          setPage={changeTablePageFn}
          search={searchValue}
          setSearch={searchTableFn}
          sort={sort}
          setSort={sortTableFn}
          locale={locale}
        />
      </StackItem>
    )

    return (
      <div id="resource-list">
        {renderRefreshTime(
          refetchIntervalUpdateDispatch,
          isLoaded,
          isReloading,
          timestamp,
          locale
        )}
        <Stack hasGutter>{stackItems}</Stack>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const pendingActions = state[typeListName].pendingActions
  const status = state[typeListName].status
  const items =
    status !== REQUEST_STATUS.DONE && !state.xhrPoll
      ? undefined
      : visibleResources.normalizedItems
  const itemIds =
    status !== REQUEST_STATUS.DONE && !state.xhrPoll
      ? undefined
      : visibleResources.items
  if (items && pendingActions) {
    Object.keys(items).forEach(key => {
      if (pendingActions.find(pending => pending.name === items[key].Name)) {
        items[key].hasPendingActions = true
      }
    })
  }

  return {
    items,
    itemIds,
    status: state[typeListName].status,
    page: state[typeListName].page,
    sort: {
      index: state[typeListName].sortColumn,
      direction: state[typeListName].sortDirection
    },
    searchValue: state[typeListName].search,
    err: state[typeListName].err,
    deleteStatus: state[typeListName].deleteStatus,
    deleteMsg: state[typeListName].deleteMsg,
    forceReload: state[typeListName].forceReload,
    refetch: state.refetch
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { updateBrowserURL, resourceType } = ownProps
  return {
    fetchTableResources: selectedFilters => {
      dispatch(fetchResources(resourceType, combineFilters(selectedFilters)))
    },
    changeTablePageFn: page =>
      dispatch(changeTablePage({ page }, resourceType)),
    searchTableFn: search => {
      dispatch(searchTable(search, resourceType))
    },
    sortTableFn: sort => {
      const { index, direction } = sort || {}
      dispatch(sortTable(direction, index, resourceType))
    },
    updateSecondaryHeaderFn: (title, tabs, mainButton) =>
      dispatch(
        updateSecondaryHeader(title, tabs, null, null, null, null, mainButton)
      ),
    onSelectedFilterChange: selectedFilters => {
      updateBrowserURL && updateBrowserURL(selectedFilters)
      dispatch(updateResourceFilters(resourceType, selectedFilters))
    },
    deleteSuccessFinished: () =>
      dispatch(delResourceSuccessFinished(ownProps.resourceType)),
    refetchIntervalUpdateDispatch: data => dispatch(refetchIntervalUpdate(data))
  }
}

ResourceList.propTypes = {
  changeTablePageFn: PropTypes.func,
  children: PropTypes.array,
  deleteMsg: PropTypes.string,
  deleteStatus: PropTypes.string,
  deleteSuccessFinished: PropTypes.func,
  err: PropTypes.object,
  fetchTableResources: PropTypes.func,
  itemIds: PropTypes.array,
  items: PropTypes.object,
  locale: PropTypes.string,
  mainButton: PropTypes.object,
  page: PropTypes.number,
  refetchIntervalUpdateDispatch: PropTypes.func,
  resourceType: PropTypes.object,
  searchTableFn: PropTypes.func,
  searchValue: PropTypes.string,
  sort: PropTypes.object,
  sortTableFn: PropTypes.func,
  staticResourceData: PropTypes.object,
  status: PropTypes.string,
  tabs: PropTypes.array,
  title: PropTypes.string,
  updateSecondaryHeaderFn: PropTypes.func
}

export default withLocale(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))
)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

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
  delResourceSuccessFinished,
  mutateResourceSuccessFinished
} from '../../actions/common'
import { updateResourceFilters, combineFilters } from '../../actions/filters'
import { Notification } from 'carbon-components-react'
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
      const { fetchTableResources } = this.props
      fetchTableResources([])
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
      status,
      staticResourceData,
      resourceType,
      err,
      children,
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

    const actions = React.Children.map(children, action => {
      return React.cloneElement(action, { resourceType })
    })

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
          itemIds={itemIds}
          items={items}
          resourceType={resourceType}
          tableActions={staticResourceData.tableActions}
          locale={locale}
        />
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
    err: state[typeListName].err,
    mutateStatus: state[typeListName].mutateStatus,
    mutateErrorMsg: state[typeListName].mutateErrorMsg,
    deleteStatus: state[typeListName].deleteStatus,
    deleteMsg: state[typeListName].deleteMsg,
    forceReload: state[typeListName].forceReload,
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
  mutateStatus: PropTypes.string,
  mutateSuccessFinished: PropTypes.func,
  refetchIntervalUpdateDispatch: PropTypes.func,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
  status: PropTypes.string,
  tabs: PropTypes.array,
  title: PropTypes.string,
  updateSecondaryHeaderFn: PropTypes.func
}

export default withLocale(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceList))
)

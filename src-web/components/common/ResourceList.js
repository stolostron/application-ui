/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

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
import { withLocale } from '../../providers/LocaleProvider'
import { AcmAlert } from '@stolostron/ui-components'
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Stack,
  StackItem
} from '@patternfly/react-core'

class ResourceList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false,
      prevDeletedApp: '',
      alerts: []
    }
    this.addAlert = (alerts, appName) => {
      this.setState({ prevDeletedApp: appName })
      if (this.state.alerts.filter(alert => alert.appName !== appName)) {
        this.setState({
          alerts: [...alerts, { appName: appName }]
        })
      }
    }
    this.removeAlert = (alerts, appName) => {
      this.setState({
        alerts: [...alerts.filter(alert => alert.appName !== appName)]
      })
    }
  }

  componentDidMount() {
    const { updateSecondaryHeaderFn, tabs, title, locale } = this.props
    updateSecondaryHeaderFn(msgs.get(title, locale), tabs)

    const { fetchTableResources } = this.props
    fetchTableResources([])
  }

  mutateFinished() {
    this.props.deleteSuccessFinished()
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
      page,
      changeTablePageFn,
      searchValue,
      searchTableFn,
      sort,
      sortTableFn
    } = this.props

    const { alerts } = this.state

    if (status === REQUEST_STATUS.ERROR && !this.state.xhrPoll) {
      //eslint-disable-next-line no-console
      console.error(err)
      return (
        <AcmAlert
          title={msgs.get('error.default.description', locale)}
          variant="danger"
          noClose
          isInline
        />
      )
    }

    const actions = React.Children.map(children, action => {
      return React.cloneElement(action, { resourceType })
    })

    if (
      deleteStatus === REQUEST_STATUS.DONE &&
      deleteMsg !== this.state.prevDeletedApp
    ) {
      this.addAlert(alerts, deleteMsg)
    }

    const stackItems = []
    if (deleteStatus === REQUEST_STATUS.DONE) {
      stackItems.push(
        <StackItem key="alert">
          <AlertGroup isToast>
            {this.state.alerts.map(({ appName }) => (
              <Alert
                variant="success"
                title={msgs.get(
                  'success.delete.description',
                  [appName],
                  locale
                )}
                actionClose={
                  <AlertActionCloseButton
                    title={msgs.get('success.update.resource', locale)}
                    variantLabel="success alert"
                    onClose={() => this.removeAlert(alerts, appName)}
                  />
                }
                key={msgs.get('success.update.resource', locale)}
              />
            ))}
          </AlertGroup>
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
          tableActions={staticResourceData?.tableActions}
          tableActionsResolver={staticResourceData?.tableActionsResolver}
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
    forceReload: state[typeListName].forceReload
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
    updateSecondaryHeaderFn: (title, tabs) =>
      dispatch(updateSecondaryHeader(title, tabs, null, null, null, null)),
    onSelectedFilterChange: selectedFilters => {
      updateBrowserURL && updateBrowserURL(selectedFilters)
      dispatch(updateResourceFilters(resourceType, selectedFilters))
    },
    deleteSuccessFinished: () =>
      dispatch(delResourceSuccessFinished(ownProps.resourceType))
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
  page: PropTypes.number,
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

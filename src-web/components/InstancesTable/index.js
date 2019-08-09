/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { connect } from 'react-redux'
import { withLocale } from '../../providers/LocaleProvider'
import ResourceTable from '../common/ResourceTable'
import TableHelper from '../../util/table-helper'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { updatePendingActions } from './utils'

resources(() => {
  require('./style.scss')
})

const InstancesTable = withLocale(
  ({
    staticResourceData,
    resourceType,
    page,
    pageSize,
    itemIds,
    sortDirection,
    sortColumn,
    items,
    totalFilteredItems,
    changeTablePage,
    searchValue,
    clientSideFilters,
    sortTable,
    searchTable,
    locale
  }) => {
    const tableTitle = msgs.get('table.title.allInstances', locale)
    return (
      <div id="instances-table">
        <ResourceTable
          actions=""
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
          handleSort={TableHelper.handleSort.bind(
            this,
            sortDirection,
            sortColumn,
            sortTable
          )}
          handleSearch={TableHelper.handleInputValue.bind(this, searchTable)}
          searchValue={searchValue}
          defaultSearchValue={clientSideFilters}
          tableActions={staticResourceData.tableActions}
          tableTitle={tableTitle}
          tableName="All instances"
        />
      </div>
    )
  }
)

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName, name: resourceName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const pendingActions =
    (state && state[typeListName] && state[typeListName].pendingActions) || ''
  const items = updatePendingActions(
    visibleResources.normalizedItems,
    pendingActions
  )
  const userRole = state.role.role

  return {
    userRole,
    items,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: (state && state[typeListName] && state[typeListName].status) || '',
    page: (state && state[typeListName] && state[typeListName].page) || '',
    pageSize:
      (state && state[typeListName] && state[typeListName].itemsPerPage) || '',
    sortDirection:
      (state && state[typeListName] && state[typeListName].sortDirection) || '',
    sortColumn:
      (state && state[typeListName] && state[typeListName].sortColumn) || '',
    searchValue:
      (state && state[typeListName] && state[typeListName].search) || '',
    err: (state && state[typeListName] && state[typeListName].err) || '',
    mutateStatus:
      (state && state[typeListName] && state[typeListName].mutateStatus) || '',
    mutateErrorMsg:
      (state && state[typeListName] && state[typeListName].mutateErrorMsg) ||
      '',
    resourceFilters:
      (state && state['resourceFilters'] && state['resourceFilters'].filters) ||
      '',
    selectedFilters:
      (state &&
        state['resourceFilters'] &&
        state['resourceFilters'].selectedFilters &&
        state['resourceFilters'].selectedFilters[resourceName]) ||
      ''
  }
}

export default connect(mapStateToProps)(withLocale(InstancesTable))

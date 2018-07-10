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
import resources from '../../../lib/shared/resources'
import { PAGE_SIZES } from '../../actions/index'
import { Table, TableHead, TableBody, Pagination } from 'carbon-components-react'
import ResourceTableRow from './ResourceTableRow'
import ResourceTableHeader from './ResourceTableHeader'
import ResourceSearch from './ResourceSearch'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/table.scss')
})

class ResourceTable extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  render() {
    const {
      resourceType,
      staticResourceData,
      page,
      pageSize,
      paginationId,
      itemIds,
      sortDirection,
      sortColumn,
      items,
      handleSort,
      totalFilteredItems,
      changeTablePage,
      handleSearch,
      actions,
      searchValue,
      tableActions,
    } = this.props

    return (
      <div className='resource-table-container'>
        <div className='resource-table-container__actions'>
          <ResourceSearch
            renderSmallSearch={true}
            searchValue={searchValue}
            handleSearch={handleSearch} />
          {actions}
        </div>
        {(() => {
          if(itemIds.length > 0) {
            return (
              <div className='resource-table-container__table'>
                <Pagination
                  id={paginationId || 'resource-table-pagination'}
                  onChange={changeTablePage}
                  pageSizes={PAGE_SIZES.VALUES}
                  pageSize={pageSize || PAGE_SIZES.DEFAULT}
                  totalItems={totalFilteredItems}
                  page={page}
                  disabled={pageSize >= totalFilteredItems}
                  isLastPage={pageSize >= totalFilteredItems}
                  itemsPerPageText={msgs.get('pagination.itemsPerPage', this.context.locale)}
                  pageRangeText={(current, total) => msgs.get('pagination.pageRange', [current, total], this.context.locale)}
                  itemRangeText={(min, max, total) => `${msgs.get('pagination.itemRange', [min, max], this.context.locale)} ${msgs.get('pagination.itemRangeDescription', [total], this.context.locale)}`}
                  pageInputDisabled={pageSize >= totalFilteredItems} />
                <Table>
                  <TableHead>
                    <ResourceTableHeader staticResourceData={staticResourceData} sortDirection={sortDirection} sortColumn={sortColumn} handleSort={handleSort} resourceType={resourceType} tableActions={tableActions} />
                  </TableHead>
                  <TableBody>
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    {itemIds.map((id, key) => <ResourceTableRow even={key % 2 === 0} resourceType={resourceType} key={key} resource={items[id]} staticResourceData={staticResourceData} tableActions={tableActions} />)}
                  </TableBody>
                </Table>
              </div>
            )
          } else {
            return (
              <div className='search-no-results'>
                {msgs.get('search.noresults', this.context.locale)}
              </div>
            )
          }
        })()}
      </div>
    )
  }
}

export default ResourceTable

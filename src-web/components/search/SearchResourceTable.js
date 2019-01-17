/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { DataTable, PaginationV2 } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import tableDefinitions from '../../definitions/search-definitions'
import { PAGE_SIZES } from '../../actions/index'

const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} = DataTable

/* ****************************************************
 * NOTE: This duplicates the ResourceTable component.
 *        The long term goal is to migrate all tables
 *        to this simplified ResourceTable.
 * ************************************************** */

/** *****************************************************************************
  * This is a generic data-driven table.
  * Definitions for each resource kind must be added in
  * ./definitions/search-definitions.js with the following format.
  *
  * [kind]:             Add a kind object for each supported resource kind (cluster, pod, node, etc)
  *   columns:          defines the fields that will be displayed for each resource
  *     key:            used for (1) access data from the item (row) object (2) used to get the localized column header string.
  *     msgKey:         (optional) if specified, will use this key to get the localized column header string.
  *     transform:      (optional) function used to render the cell.
  *
  *   actions:          (optional) a string array with the supported actions. Pass a function when each row has different menu options. Action definitions must be added to <<TBD>>
  *   primaryKey:       <<TBD>>
  *   secondaryKey:     <<TBD>>
  * *************************************************************************** */
class SearchResourceTable extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array,
    kind: PropTypes.string,
  }

  state = {
    page: 1,
    pageSize: PAGE_SIZES.VALUES[0],
  }

  getHeaders(){
    if (tableDefinitions[this.props.kind]) {
      return tableDefinitions[this.props.kind].columns.map(col => ({ key: col.key, header: msgs.get(`table.header.${col.msgKey || col.key}`, this.context.locale) }))
    }

    console.log(`Using default resource table for resource kind: ${this.props.kind}`) // eslint-disable-line no-console
    // Remove internal properties
    const columns = Object.keys(this.props.items[0]).filter(prop => prop.charAt(0) !== '_' && ['kind', 'uid', 'selfLink'].indexOf(prop) === -1)
    return columns.map(col => {
      const headerMsg = msgs.get(`table.header.${col}`, this.context.locale)
      // When there isn't a translation for the header, use the property key
      return { key: col, header: headerMsg.indexOf(`table.header.${col}`) > -1 ? col : headerMsg }
    })
  }

  getRows(){
    const { page, pageSize } = this.state
    // TODO searchFeature: need to sort columns before pagination
    const startItem = (page - 1) * pageSize
    const visibleItems = this.props.items.slice(startItem, startItem + pageSize)
    return visibleItems.map(item => {
      const row = { id: item.uid}

      if (tableDefinitions[this.props.kind]) {
        tableDefinitions[this.props.kind].columns.forEach(column => {
          row[column.key] = column.transform ? column.transform(item, this.context.locale) : (item[column.key] || '-')
        })
        return row
      }

      return { id: item.uid, ...item }
    })
  }

  render() {
    const { page, pageSize } = this.state
    const totalItems = this.props.items.length

    return [
      <DataTable
        key={`${this.props.kind}-resource-table`}
        rows={this.getRows()}
        headers={this.getHeaders()}
        render={({ rows, headers }) => {
          return (
            <TableContainer title={`${this.props.kind} (${this.props.items.length})`}>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader key={header.key}> {header.header} </TableHeader>
                    )) }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id} >
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}> {cell.value} </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          )}
        }
      />,
      <PaginationV2
        key={`${this.props.kind}-resource-table-pagination`}
        id={`${this.props.kind}-resource-table-pagination`}
        onChange={(pagination) => this.setState(pagination)}
        pageSize={pageSize}
        pageSizes={PAGE_SIZES.VALUES}
        totalItems={totalItems}
        page={page}
        disabled={pageSize >= totalItems}
        isLastPage={pageSize >= totalItems}
        itemsPerPageText={msgs.get('pagination.itemsPerPage', this.context.locale)}
        pageRangeText={(current, total) => msgs.get('pagination.pageRange', [current, total], this.context.locale)}
        itemRangeText={(min, max, total) => `${msgs.get('pagination.itemRange', [min, max], this.context.locale)} ${msgs.get('pagination.itemRangeDescription', [total], this.context.locale)}`}
        pageInputDisabled={pageSize >= totalItems}
      />
    ]
  }
}

export default SearchResourceTable

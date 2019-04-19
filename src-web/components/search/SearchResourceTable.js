/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import config from '../../../lib/shared/config'
import { PaginationV2, DataTable, OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import tableDefinitions from '../../definitions/search-definitions'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { PAGE_SIZES } from '../../actions/index'
import { canCallAction } from '../../../lib/client/access-helper'
import constants from '../../../lib/shared/constants'

const {
  Table,
  TableHead,
  // TableHeader,
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
    collapseTable: PropTypes.bool,
    expandFullPage: PropTypes.bool,
    items: PropTypes.array,
    kind: PropTypes.string,
    related: PropTypes.bool,
  }

  constructor(props){
    super(props)
    this.state = {
      page: 1,
      pageSize: props.expandFullPage ? PAGE_SIZES.DEFAULT : PAGE_SIZES.VALUES[0],
      sortDirection: 'asc',
      collapse: false,
      canRemove: false
    }
  }

  componentWillMount() {
    canCallAction(this.props.kind, 'delete').then(response => {
      if (response && response.data && response.data.userAccess && response.data.userAccess.allowed) {
        this.setState({
          canRemove: true
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      collapse: nextProps.collapseTable
    })
  }

  toggleCollapseTable = () => {
    this.setState(({collapse}) => {
      return { collapse: !collapse }
    })
  }

  getResourceType = (kind) => {
    const types = Object.values(constants.RESOURCE_TYPES)
    const type = types.filter(type => type.name.toLowerCase().substring(3) === kind)
    return type[0] || { name: 'kubeResource', list: 'kubeResourceList' }
  }

  getHeaders(){
    const { kind } = this.props
    if (tableDefinitions[kind]) {
      const headers = tableDefinitions[kind].columns.map(col => ({
        key: col.key, header: msgs.get(`table.header.${col.msgKey || col.key}`, this.context.locale)
      }))
      headers.push({ key: 'action', header: ''})
      return headers
    }

    console.log(`Using default resource table for resource kind: ${this.props.kind}`) // eslint-disable-line no-console
    // Remove internal properties
    const columns = Object.keys(this.props.items[0]).filter(prop => prop.charAt(0) !== '_' && ['kind', 'selfLink'].indexOf(prop) === -1)
    return columns.map(col => {
      const headerMsg = msgs.get(`table.header.${col}`, this.context.locale)
      // When there isn't a translation for the header, use the property key
      return { key: col, header: headerMsg.indexOf(`table.header.${col}`) > -1 ? col : headerMsg }
    })
  }

  handleActionClick(action, name, namespace, clusterName = '', selfLink = '') {
    const { kind } = this.props
    const resourceType = this.getResourceType(kind)
    const client = apolloClient.getClient()
    client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: true,
        type: action,
        resourceType: {
          __typename: 'resourceType',
          name: resourceType.name,
          list: resourceType.list
        },
        data: {
          __typename:'ModalData',
          name,
          namespace,
          clusterName,
          selfLink
        }
      }
    })
  }

  getRows(){
    const { page, pageSize, selectedKey, sortDirection, canRemove } = this.state
    const { locale } = this.context
    let { items } = this.props
    const { kind } = this.props
    // TODO searchFeature: need to sort columns before pagination
    if (selectedKey) {
      items = lodash.orderBy(items, [selectedKey], [sortDirection])
    }
    const startItem = (page - 1) * pageSize
    const visibleItems = items.slice(startItem, startItem + pageSize)
    return visibleItems.map(item => {
      const { namespace, name, cluster, selfLink } = item
      const row = { id: item._uid }
      if (tableDefinitions[kind]) {
        tableDefinitions[kind].columns.forEach(column => {
          if (column.key === 'name') {
            const link = this.getDetailsLink(item)
            row[column.key] = link.includes('/multicloud')
              ? <a href={link}>{name}</a>
              : <Link to={link}>{name}</Link>

          } else {
            row[column.key] = column.transform ? column.transform(item, this.context.locale) : (item[column.key] || '-')
          }
        })
        if (this.props.kind !== 'cluster') {
          const action ='table.actions.remove'
          row.action = (
            <OverflowMenu floatingMenu flipped iconDescription={msgs.get('svg.description.overflowMenu', locale)} ariaLabel='Overflow-menu'>
              <OverflowMenuItem
                data-table-action={action}
                isDelete={true}
                onClick={() => this.handleActionClick(action, name, namespace, cluster, selfLink)}
                key={action}
                itemText={msgs.get(action, locale)}
                disabled={!canRemove}
              />
            </OverflowMenu>
          )
        }
        return row
      }
      return { id: item._uid, ...item }
    })
  }

  handleSort = (selectedKey) => () => {
    if (selectedKey) {
      this.setState(preState => {
        return {selectedKey: selectedKey, sortDirection: preState.sortDirection === 'asc' ? 'desc' : 'asc' }
      })
    }
  }

  getDetailsLink(item) {
    const { kind } = this.props
    switch (kind){
    case 'cluster':
      return `${config.contextPath}/clusters?filters={"textsearch":["${item.name}"]}`
    case 'application':
      return `${config.contextPath}/applications/${item.namespace}/${item.name}`
    case 'releases':
      return item.cluster === 'local-cluster' // TODO - better method of determining hub-cluster
        ? `/catalog/instancedetails/${item.namespace}/${item.name}`
        : '/catalog/instances'
    case 'policy':
      return `/policy/policies/${item.namespace}/${item.name}/compliancePolicy/${item.namespace}/`
    case 'compliance':
      return `/policy/policies/${item.namespace}/${item.name}`
    default:
      return `${config.contextPath}/details/${item.cluster}${item.selfLink}`
    }
  }

  // need more research on carbon data table
  //<TableHeader key={header.key} onClick={this.handleSort(header.key)} > {header.header} </TableHeader>
  render() {
    const { page, pageSize, sortDirection, selectedKey, collapse } = this.state
    const totalItems = this.props.items.length
    const sortColumn = selectedKey

    return (
      <div >
        <div className={'search--resource-table-header'}>
          {!this.props.related
            ? <div>
              <button
                onClick={this.toggleCollapseTable}
                className={'search--resource-table-header-button'} >
                {`${this.props.kind} (${this.props.items.length})`}
                <Icon
                  className='search--resource-table-header-button-icon'
                  name={collapse ? 'caret--down' : 'caret--up'}
                  description={msgs.get(collapse ? 'table.header.search.expand' : 'table.header.search.collapse', this.context.locale)} />
              </button>
            </div>
            : `${msgs.get('table.header.search.related', [this.props.kind])} (${this.props.items.length})`
          }
        </div>
        {!collapse
          ? <div>
            <DataTable
              key={`${this.props.kind}-resource-table`}
              rows={this.getRows()}
              headers={this.getHeaders()}
              render={({ rows, headers}) => {
                return (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headers.map(header => (
                          <th scope={'col'} key={header.key}>
                            {header.key !== 'action'
                              ? <button
                                title={msgs.get(`svg.description.${!sortColumn || sortDirection === 'desc' ? 'asc' : 'desc'}`, this.context.locale)}
                                onClick={this.handleSort(header.key)}
                                className={`bx--table-sort-v2${sortDirection === 'asc' ? ' bx--table-sort-v2--ascending' : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`}
                                data-key={header.key} >
                                <span className='bx--table-header-label'>{header.header}</span>
                                <Icon
                                  className='bx--table-sort-v2__icon'
                                  name='caret--down'
                                  description={msgs.get(`svg.description.${!sortColumn || sortDirection === 'desc' ? 'asc' : 'desc'}`, this.context.locale)} />
                              </button>
                              : null
                            }
                          </th>
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
                )}
              }
            />
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
          </div>
          : null}
      </div>
    )
  }
}

SearchResourceTable.contextTypes = {
  locale: PropTypes.string
}

export default SearchResourceTable

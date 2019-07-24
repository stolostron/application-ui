/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* NOTE: These eslint exceptions are added to help keep this file consistent with platform-ui. */
/* eslint-disable react/prop-types, react/jsx-no-bind */

import _ from 'lodash'
import React from 'react'
import resources from '../../../lib/shared/resources'
import { PAGE_SIZES } from '../../actions/index'
import {
  PaginationV2,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Icon,
  Checkbox
} from 'carbon-components-react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import { transform } from '../../../lib/client/resource-helper'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import { connect } from 'react-redux'
import { getLink, getPrimaryKey, getSecondaryKey } from '../../definitions'
import { Link, withRouter } from 'react-router-dom'
import ResourceTableRowExpandableContent from './ResourceTableRowExpandableContent'
import constants from '../../../lib/shared/constants'
import { filterTableAction } from '../../../lib/client/access-helper'
import apolloClient from '../../../lib/client/apollo-client'
//import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
//import clustersDef from '../../definitions/hcm-clusters'
import { SEARCH_QUERY } from '../../apollo-client/queries/SearchQueries'
import { convertStringToQuery } from '../../../lib/client/search-helper'

resources(() => {
  require('../../../scss/table.scss')
})

const translateWithId = (locale, id) => msgs.get(id, locale)

const {
  TableContainer,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow
} = DataTable

class ResourceTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clustersServicesMap: {}
    }
    this.serviceList = [
      constants.MCM_CLUSTERS_SERVICES_ACTIONS.MONITORING,
      constants.MCM_CLUSTERS_SERVICES_ACTIONS.LOGGING,
      constants.MCM_CLUSTERS_SERVICES_ACTIONS.CEM
    ]
  }

  render() {
    const {
      staticResourceData,
      page,
      pageSize,
      sortColumn,
      sortDirection,
      handleSort,
      totalFilteredItems,
      changeTablePage,
      handleSearch,
      searchValue,
      darkSearchBox,
      defaultSearchValue,
      actions,
      items,
      itemIds,
      expandableTable,
      selectableTable,
      onSelect,
      onSelectAll,
      onSelectSubItem,
      tableTitle,
      tableName
    } = this.props
    return [
      <DataTable
        key="data-table"
        rows={this.getRows()}
        headers={this.getHeaders()}
        translateWithId={translateWithId.bind(null, this.context.locale)}
        render={({ rows, headers, getRowProps }) => (
          <TableContainer
            id={`${staticResourceData.resourceKey &&
              staticResourceData.resourceKey}-table-container`}
          >
            {tableTitle && (
              <div className="table-title">
                {tableTitle}
                {tableName === 'All applications' &&
                  Array.isArray(rows) && <span>&nbsp;({rows.length})</span>}
              </div>
            )}
            <TableToolbar
              aria-label={`${staticResourceData.resourceKey &&
                staticResourceData.resourceKey}-search`}
              role="region"
            >
              <TableToolbarSearch
                onChange={handleSearch}
                defaultValue={defaultSearchValue}
                value={searchValue}
                aria-label={`${staticResourceData.resourceKey &&
                  staticResourceData.resourceKey}-search`}
                id={`${staticResourceData.resourceKey &&
                  staticResourceData.resourceKey}-search`}
                light={!darkSearchBox}
              />
              <TableToolbarContent>{actions}</TableToolbarContent>
            </TableToolbar>
            <Table className="resource-table">
              <TableHead>
                <TableRow>
                  {expandableTable && <TableExpandHeader />}
                  {selectableTable && (
                    <th scope="col">
                      <Checkbox
                        checked={
                          itemIds &&
                          itemIds.filter(
                            item => items[item] && items[item].selected
                          ).length === itemIds.length
                        }
                        indeterminate={this.getIndeterminateStatus()}
                        id={'select-all'}
                        name={'select-all'}
                        onChange={onSelectAll}
                        data-selected={
                          itemIds &&
                          itemIds.filter(
                            item => items[item] && items[item].selected
                          ).length === itemIds.length
                        }
                        labelText={''}
                        aria-label={msgs.get(
                          itemIds.filter(
                            item => items[item] && items[item].selected
                          ).length === itemIds.length
                            ? 'unselect'
                            : 'select',
                          this.context.locale
                        )}
                      />
                    </th>
                  )}
                  {headers.map(header => {
                    if (header && header.header !== '') {
                      return (
                        <th scope={'col'} key={header.key}>
                          <button
                            title={msgs.get(
                              `svg.description.${
                                !sortColumn || sortDirection === 'desc'
                                  ? 'asc'
                                  : 'desc'
                              }`,
                              this.context.locale
                            )}
                            onClick={handleSort}
                            className={`bx--table-sort-v2${
                              sortDirection === 'asc'
                                ? ' bx--table-sort-v2--ascending'
                                : ''
                            }${
                              sortColumn === header.key
                                ? ' bx--table-sort-v2--active'
                                : ''
                            }`}
                            data-key={header.key}
                            data-default-key={
                              staticResourceData.defaultSortField
                            }
                          >
                            <span className="bx--table-header-label">
                              {header.header}
                            </span>
                            <Icon
                              className="bx--table-sort-v2__icon"
                              name="caret--down"
                              description={msgs.get(
                                `svg.description.${
                                  !sortColumn || sortDirection === 'desc'
                                    ? 'asc'
                                    : 'desc'
                                }`,
                                this.context.locale
                              )}
                            />
                          </button>
                        </th>
                      )
                    } else {
                      return <th scope={'col'} key={header.key} />
                    }
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  return rows.map(row => {
                    if (expandableTable) {
                      return (
                        <React.Fragment key={row.id}>
                          <TableExpandRow
                            {...getRowProps({
                              row,
                              'data-row-name': _.get(
                                items[row.id],
                                _.get(
                                  staticResourceData,
                                  'tableKeys[0].resourceKey'
                                )
                              ),
                              'aria-hidden':
                                expandableTable &&
                                ((items[row.id] && !items[row.id].subItems) ||
                                  (items[row.id] &&
                                    items[row.id].subItems.length === 0)),
                              className:
                                expandableTable &&
                                ((items[row.id] && !items[row.id].subItems) ||
                                  (items[row.id] &&
                                    items[row.id].subItems.length === 0))
                                  ? 'row-not-expanded'
                                  : ''
                            })}
                          >
                            {selectableTable && (
                              <TableCell key={`select-checkbox-${row.id}`}>
                                <Checkbox
                                  checked={
                                    items[row.id] && !!items[row.id].selected
                                  }
                                  indeterminate={
                                    items[row.id] &&
                                    items[row.id].subItems &&
                                    items[row.id].subItems.length > 1 &&
                                    items[row.id].subItems.filter(
                                      subItem => subItem.selected
                                    ).length < items[row.id].subItems.length &&
                                    items[row.id].subItems.filter(
                                      subItem => subItem.selected
                                    ).length !== 0
                                  }
                                  id={row.id}
                                  name={`select-checkbox-row-${row.id}`}
                                  onChange={onSelect}
                                  labelText={''}
                                  aria-label={msgs.get(
                                    items[row.id] && items[row.id].selected
                                      ? 'unselect'
                                      : 'select',
                                    this.context.locale
                                  )}
                                />
                              </TableCell>
                            )}
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableExpandRow>
                          {row.isExpanded && (
                            <TableExpandedRow>
                              <TableCell colSpan={selectableTable ? 2 : 1} />
                              <TableCell colSpan={1}>
                                <ResourceTableRowExpandableContent
                                  items={items[row.id].subItems}
                                  type="name"
                                  selectableTable={selectableTable}
                                  onSelectSubItem={onSelectSubItem}
                                />
                              </TableCell>
                              <TableCell colSpan={2}>
                                <ResourceTableRowExpandableContent
                                  type="type"
                                  selectableTable={selectableTable}
                                  items={items[row.id].subItems}
                                />
                              </TableCell>
                            </TableExpandedRow>
                          )}
                        </React.Fragment>
                      )
                    } else {
                      return (
                        <TableRow
                          key={row.id}
                          data-row-name={_.get(
                            items[row.id],
                            _.get(
                              staticResourceData,
                              'tableKeys[0].resourceKey'
                            )
                          )}
                        >
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      )
                    }
                  })
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />,
      <PaginationV2
        key="pagination"
        id={
          staticResourceData.resourceKey
            ? `${staticResourceData.resourceKey}-resource-table-pagination`
            : 'resource-table-pagination'
        }
        onChange={changeTablePage}
        pageSize={pageSize || PAGE_SIZES.DEFAULT}
        pageSizes={PAGE_SIZES.VALUES}
        totalItems={totalFilteredItems}
        page={page}
        disabled={pageSize >= totalFilteredItems}
        isLastPage={pageSize >= totalFilteredItems}
        itemsPerPageText={msgs.get(
          'pagination.itemsPerPage',
          this.context.locale
        )}
        pageRangeText={(current, total) =>
          msgs.get(
            'pagination.pageRange',
            [current, total],
            this.context.locale
          )
        }
        itemRangeText={(min, max, total) =>
          `${msgs.get(
            'pagination.itemRange',
            [min, max],
            this.context.locale
          )} ${msgs.get(
            'pagination.itemRangeDescription',
            [total],
            this.context.locale
          )}`
        }
        pageInputDisabled={pageSize >= totalFilteredItems}
      />
    ]
  }

  getHeaders() {
    const { locale } = this.context
    const { staticResourceData, tableActions, items, itemIds } = this.props
    let headers = staticResourceData.tableKeys.filter(tableKey => {
      return tableKey.disabled
        ? typeof tableKey.disabled === 'function'
          ? tableKey.disabled(itemIds && itemIds.map(id => items[id]))
          : !tableKey.disabled
        : tableKey
    })
    headers = headers.map(tableKey => ({
      key: tableKey.resourceKey,
      header: tableKey.dropdown ? '' : msgs.get(tableKey.msgKey, locale)
    }))
    tableActions &&
      !_.isEmpty(tableActions) &&
      headers.push({ key: 'action', header: '' })
    return headers
  }

  showTableToobar() {
    const { userRole } = this.props
    return userRole !== constants.ROLES.VIEWER
  }

  handleActionClick() {
    // const resourceActionsList = clustersDef.tableActions.filter(a => a !== 'table.actions.cluster.edit.labels')
    // if (resourceActionsList.includes(action) || action === 'table.actions.application.edit') {
    //   this.props.getResourceAction(action, item, null, history, this.props.locale)
    // } else {
    //   const client = apolloClient.getClient()
    //   const name = _.get(item, 'metadata.name', '')
    //   const namespace = _.get(item, 'metadata.namespace', '')
    //   client.mutate({
    //     mutation: UPDATE_ACTION_MODAL,
    //     variables: {
    //       __typename: 'actionModal',
    //       open: true,
    //       type: action,
    //       resourceType: {
    //         __typename: 'resourceType',
    //         name: resourceType.name,
    //         list: resourceType.list
    //       },
    //       data: {
    //         __typename:'ModalData',
    //         name,
    //         namespace,
    //         clusterName: _.get(item, 'cluster.metadata.name', ''),
    //         selfLink: _.get(item, 'metadata.selfLink', ''),
    //         kind: ''
    //       }
    //     }
    //   })
    // }
  }

  getRows() {
    const {
      history,
      tableActions,
      resourceType,
      staticResourceData,
      match,
      userRole
    } = this.props
    const { locale } = this.context
    const { normalizedKey } = staticResourceData
    const resources = this.getResources()
    if (resources && resources.length > 0) {
      return resources.map((item, index) => {
        const row = {}

        if (normalizedKey) {
          row.id = `${_.get(item, normalizedKey)}${_.get(item, 'cluster', '')}`
        } else {
          row.id = getSecondaryKey(resourceType)
            ? `${_.get(item, getPrimaryKey(resourceType))}-${_.get(
              item,
              getSecondaryKey(resourceType)
            )}`
            : _.get(item, getPrimaryKey(resourceType)) || `table-row-${index}`
        }

        const menuActions =
          (item.metadata &&
            tableActions &&
            tableActions[item.metadata.namespace]) ||
          tableActions
        const filteredActions = menuActions
          ? filterTableAction(menuActions, userRole)
          : null
        const availableActions =
          filteredActions && this.getAvaiableActions(filteredActions, item)

        if (
          filteredActions &&
          filteredActions.length > 0 &&
          this.showTableToobar()
        ) {
          row.action = (
            <OverflowMenu
              floatingMenu
              flipped
              iconDescription={msgs.get('svg.description.overflowMenu', locale)}
              ariaLabel="Overflow-menu"
            >
              {filteredActions.map(action => (
                <OverflowMenuItem
                  disabled={!availableActions.includes(action)}
                  data-table-action={action}
                  isDelete={
                    action === 'table.actions.remove' ||
                    action === 'table.actions.policy.remove' ||
                    action === 'table.actions.applications.remove' ||
                    action === 'table.actions.compliance.remove'
                  }
                  onClick={() =>
                    this.handleActionClick(action, resourceType, item, history)
                  }
                  key={action}
                  itemText={msgs.get(action, locale)}
                />
              ))}
            </OverflowMenu>
          )
        }
        staticResourceData.tableKeys.forEach(key => {
          row[key.resourceKey] = key.link ? (
            <Link to={`${match.url}${getLink(key.link, item)}`}>
              {transform(item, key, locale)}
            </Link>
          ) : (
            transform(item, key, locale)
          )
        })
        return row
      })
    }
    return []
  }

  getIndeterminateStatus() {
    const { itemIds, items } = this.props
    const selectedItems = itemIds.filter(
      item => items[item] && items[item].selected
    )
    let indeterminateStatus =
      itemIds &&
      selectedItems.length !== itemIds.length &&
      selectedItems.length > 0
    selectedItems.forEach(selectedItem => {
      if (
        items[selectedItem].subItems &&
        items[selectedItem].subItems.length > 0
      ) {
        const selectedSubItems = items[selectedItem].subItems.filter(
          subItem => subItem.selected
        )
        if (selectedSubItems.length < items[selectedItem].subItems.length) {
          indeterminateStatus = true
          return indeterminateStatus
        }
      }
    })
    return indeterminateStatus
  }

  componentDidMount() {
    const resources = this.getResources()
    if (resources && resources.length > 0) {
      resources.map(item => {
        this.setState(prevState => ({
          clustersServicesMap: {
            ...prevState.clustersServicesMap,
            [item.metadata.name]: this.getClusterServices(item)
          }
        }))
      })
    }
  }

  getClusterServices(item) {
    const serviceMap = {}
    this.serviceList.map(service => (serviceMap[service.name] = false))
    _.keys(serviceMap).map(serviceName => {
      const query = convertStringToQuery(
        `kind:service cluster:${item.metadata.name} name:${serviceName}`
      )
      apolloClient
        .search(SEARCH_QUERY, { input: [query] })
        .then(response => {
          if (response.errors) {
            return serviceMap
          }
          const s = response.data.searchResult && response.data.searchResult[0]
          if (s.items.length && s.items.length !== 0) {
            serviceMap[serviceName] = true
          }
        })
        .catch(err => (err, serviceMap))
    })
    return serviceMap
  }

  getResources() {
    const { items, itemIds, staticResourceData } = this.props
    const { normalizedKey } = staticResourceData
    return (
      itemIds &&
      itemIds.map(
        id =>
          items[id] ||
          (Array.isArray(items) &&
            items.find(
              target =>
                (normalizedKey && _.get(target, normalizedKey) === id) ||
                target.name === id
            ))
      )
    )
  }

  getAvaiableActions(actions, item) {
    actions = item.consoleURL
      ? actions
      : actions.filter(a => a !== 'table.actions.cluster.launch')
    const serviceMap = this.state.clustersServicesMap[item.metadata.name] || {}
    this.serviceList.map(
      service =>
        (actions = serviceMap[service.name]
          ? actions
          : actions.filter(a => a !== service.action))
    )
    return actions
  }
}

ResourceTable.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  const navRoutes = state.nav && state.nav.navItems
  const userRole = state.role.role

  return { navRoutes, userRole }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const resourceType = ownProps.subResourceType || ownProps.resourceType
  return {
    getResourceAction: (action, resource, hasService, history, locale) =>
      resourceActions(
        action,
        dispatch,
        resourceType,
        resource,
        hasService,
        history,
        locale
      )
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResourceTable)
)

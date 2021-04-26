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

/* NOTE: These eslint exceptions are added to help keep this file consistent with platform-ui. */
/* eslint-disable react/prop-types, react/jsx-no-bind */

import _ from 'lodash'
import React from 'react'
import {
  AcmEmptyState,
  AcmTable
} from '@open-cluster-management/ui-components'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { withRouter } from 'react-router-dom'
import TableRowActionMenu, { handleActionClick } from './TableRowActionMenu'
import { fitContent } from '@patternfly/react-table'

resources(() => {
  require('../../../scss/table.scss')
})

class ResourceTable extends React.Component {
  render() {
    const {
      actions,
      page,
      setPage,
      search,
      setSearch,
      sort,
      setSort,
      staticResourceData,
      locale
    } = this.props
    return [
      <AcmTable
        key="data-table"
        plural={msgs.get(staticResourceData.pluralKey, locale)}
        items={this.getResources()}
        columns={this.getColumns()}
        keyFn={
          staticResourceData?.keyFn ||
          (item => `${item.namespace}/${item.name}`)
        }
        rowActions={this.getRowActions()}
        emptyState={
          <AcmEmptyState
            title={staticResourceData.emptyTitle(locale)}
            message={staticResourceData.emptyMessage(locale)}
          />
        }
        extraToolbarControls={
          actions && actions.length > 0 ? actions : undefined
        }
        groupFn={staticResourceData.groupFn}
        groupSummaryFn={
          staticResourceData.groupSummaryFn
            ? items => staticResourceData.groupSummaryFn(items, locale)
            : undefined
        }
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        gridBreakPoint=""
      />
    ]
  }

  getColumns() {
    const {
      staticResourceData,
      items,
      itemIds,
      locale,
      tableActionsResolver,
      resourceType
    } = this.props
    const enabledColumns = staticResourceData.tableKeys.filter(tableKey => {
      const disabled =
        typeof tableKey.disabled === 'function'
          ? tableKey.disabled(itemIds && itemIds.map(id => items[id]))
          : !tableKey.disabled
      return tableKey.disabled ? disabled : tableKey
    })
    const columns = enabledColumns.map(tableKey => ({
      header: msgs.get(tableKey.msgKey, locale),
      cell:
        tableKey.transformFunction &&
        typeof tableKey.transformFunction === 'function'
          ? item => tableKey.transformFunction(item, locale)
          : tableKey.resourceKey,
      sort:
        tableKey.textFunction && typeof tableKey.textFunction === 'function'
          ? `transformed.${tableKey.resourceKey}.text`
          : tableKey.resourceKey,
      search:
        tableKey.textFunction && typeof tableKey.textFunction === 'function'
          ? `transformed.${tableKey.resourceKey}.text`
          : tableKey.resourceKey,
      transforms: tableKey.transforms,
      tooltip: tableKey.tooltipKey
        ? msgs.get(tableKey.tooltipKey, locale)
        : undefined
    }))
    if (tableActionsResolver) {
      columns.push({
        header: '',
        cell: item => {
          const actions = tableActionsResolver(item)
          return (
            <TableRowActionMenu
              actions={actions}
              item={item}
              resourceType={resourceType}
            />
          )
        },
        cellTransforms: [fitContent]
      })
    }
    return columns
  }

  getRowActions() {
    const { tableActions, resourceType, locale, history } = this.props

    return tableActions
      ? tableActions.map(action => ({
        id: action.key,
        title: msgs.get(action.key, locale),
        click: item => {
          handleActionClick(action, resourceType, item, history)
        }
      }))
      : undefined
  }

  getResources() {
    const { items, itemIds, staticResourceData } = this.props
    const { normalizedKey } = staticResourceData
    return itemIds
      ? itemIds.map(
        id =>
          items[id] ||
            (Array.isArray(items) &&
              items.find(
                target =>
                  (normalizedKey && _.get(target, normalizedKey) === id) ||
                  target.name === id
              ))
      )
      : undefined
  }
}

export default withRouter(ResourceTable)

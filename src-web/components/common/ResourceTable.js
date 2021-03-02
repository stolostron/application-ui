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
  AcmTable,
  AcmPageCard
} from '@open-cluster-management/ui-components'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { withRouter } from 'react-router-dom'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import config from '../../../lib/shared/config'

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
      <AcmPageCard key="data-table">
        <AcmTable
          plural={msgs.get(staticResourceData.pluralKey, locale)}
          items={this.getResources()}
          columns={this.getColumns()}
          keyFn={item => `${item.namespace}/${item.name}`}
          tableActions={[]}
          rowActions={this.getRowActions()}
          emptyState={
            <AcmEmptyState
              title={staticResourceData.emptyTitle(locale)}
              message={staticResourceData.emptyMessage(locale)}
            />
          }
          extraToolbarControls={actions}
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />
      </AcmPageCard>
    ]
  }

  getColumns() {
    const { staticResourceData, items, itemIds, locale } = this.props
    const enabledColumns = staticResourceData.tableKeys.filter(tableKey => {
      const disabled =
        typeof tableKey.disabled === 'function'
          ? tableKey.disabled(itemIds && itemIds.map(id => items[id]))
          : !tableKey.disabled
      return tableKey.disabled ? disabled : tableKey
    })
    return enabledColumns.map(tableKey => ({
      header: msgs.get(tableKey.msgKey, locale),
      cell:
        tableKey.transformFunction &&
        typeof tableKey.transformFunction === 'function'
          ? item => tableKey.transformFunction(item, locale)
          : tableKey.resourceKey,
      sort:
        tableKey.textFunction && typeof tableKey.textFunction === 'function'
          ? `transformed.${tableKey.resourceKey}.text`
          : // ? (a, b) => {
        //   const aText = tableKey.textFunction(a, locale)
        //   const bText = tableKey.textFunction(b, locale)
        //   return aText.localeCompare(bText)
        // }
          tableKey.resourceKey,
      search:
        tableKey.textFunction && typeof tableKey.textFunction === 'function'
          ? `transformed.${tableKey.resourceKey}.text`
          : // ? item => {
        //   return tableKey.textFunction(item, locale)
        // }
          tableKey.resourceKey,
      transforms: tableKey.transforms,
      tooltip: tableKey.tooltipKey
        ? msgs.get(tableKey.tooltipKey, locale)
        : undefined
    }))
  }

  handleActionClick(action, resourceType, item, history) {
    const client = apolloClient.getClient()
    const name = _.get(item, 'name', '')
    const namespace = _.get(item, 'namespace', '')
    if (action.link) {
      const url = action.link.url(item)
      if (url && !url.startsWith(config.contextPath)) {
        // external to this SPA
        window.location = url
      } else {
        history.push(url, action.link.state)
      }
    } else if (action.modal) {
      client.mutate({
        mutation: UPDATE_ACTION_MODAL,
        variables: {
          __typename: 'actionModal',
          open: true,
          type: action.key,
          resourceType: {
            __typename: 'resourceType',
            name: resourceType.name,
            list: resourceType.list
          },
          data: {
            __typename: 'ModalData',
            name,
            namespace,
            clusterName: _.get(item, 'cluster', ''),
            selfLink: _.get(item, 'selfLink', ''),
            _uid: _.get(item, '_uid', ''),
            kind: _.get(resourceType, 'kind', ''),
            apiVersion: _.get(resourceType, 'apiVersion', '')
          }
        }
      })
    }
  }

  getRowActions() {
    const { tableActions, resourceType, locale, history } = this.props

    return tableActions.map(action => ({
      id: action.key,
      title: msgs.get(action.key, locale),
      click: item => {
        this.handleActionClick(action, resourceType, item, history)
      }
    }))
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

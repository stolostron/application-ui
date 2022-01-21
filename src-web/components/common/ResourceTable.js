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
  AcmDropdown
} from '@stolostron/ui-components'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { withRouter } from 'react-router-dom'
import { handleActionClick } from './TableRowActionMenu'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import apolloClient from '../../../lib/client/apollo-client'
import { TooltipPosition, DropdownPosition } from '@patternfly/react-core'

resources(() => {
  require('../../../scss/table.scss')
})

class ResourceTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isACMAppCreateDisabled: true,
      isArgoAppsetCreateDisabled: true,
      isArgoInstallDisabled: true
    }
  }

  componentDidMount() {
    const { staticResourceData } = this.props
    const { tableDropdown } = staticResourceData

    if (tableDropdown) {
      // Don't call for AdvancedConfigurationPage
      canCreateActionAllNamespaces('applications', 'create', 'app.k8s.io').then(
        response => {
          const disabled = _.get(response, 'data.userAccessAnyNamespaces')
          this.setState({ isACMAppCreateDisabled: !disabled })
        }
      )

      apolloClient.getArgoServerNS().then(result => {
        const argoServerNS = _.get(result, 'data.argoServers.argoServerNS', [])
        const containName = _.chain(argoServerNS)
          .findKey('name')
          .isString()
          .value()
        if (!argoServerNS.length && !containName) {
          this.setState({ isArgoInstallDisabled: true })
        } else {
          this.setState({ isArgoInstallDisabled: false })
        }
        const { isArgoInstallDisabled } = this.state
        if (!isArgoInstallDisabled) {
          canCreateActionAllNamespaces(
            'applicationsets',
            'create',
            'argoproj.io'
          ).then(response => {
            const disabled = _.get(response, 'data.userAccessAnyNamespaces')
            this.setState({ isArgoAppsetCreateDisabled: !disabled })
          })
        }
      })
    }
  }

  renderCreateButton() {
    const tableDropdown = this.getDropdownActions()

    if (!tableDropdown) {
      return undefined
    }

    return (
      <AcmDropdown
        isDisabled={tableDropdown.isDisabled}
        tooltip={tableDropdown.disableText}
        id={tableDropdown.id}
        onSelect={tableDropdown.handleSelect}
        text={tableDropdown.toggleText}
        dropdownItems={tableDropdown.actions}
        isKebab={false}
        isPlain={true}
        isPrimary={true}
        tooltipPosition={tableDropdown.tooltipPosition}
        dropdownPosition={DropdownPosition.left}
      />
    )
  }

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
    const toolbarControls = actions && actions.length > 0 ? actions : undefined

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
        rowActionResolver={this.getRowActionResolver()}
        emptyState={
          <AcmEmptyState
            title={staticResourceData.emptyTitle(locale)}
            message={staticResourceData.emptyMessage(locale)}
            isEmptyTableState={toolbarControls ? true : false}
            action={this.renderCreateButton()}
          />
        }
        extraToolbarControls={toolbarControls}
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
        customTableAction={this.renderCreateButton()}
        filters={this.getTableFilters()}
      />
    ]
  }

  getColumns() {
    const { staticResourceData, items, itemIds, locale } = this.props
    const enabledColumns = staticResourceData.tableKeys.filter(tableKey => {
      const disabled =
        typeof tableKey.disabled === 'function'
          ? tableKey.disabled(itemIds && itemIds.map(id => items[id]))
          : tableKey.disabled
      return tableKey.disabled ? !disabled : true
    })
    const allColumnsEnabled =
      enabledColumns.length === staticResourceData.tableKeys.length
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
      transforms: allColumnsEnabled ? tableKey.transforms : undefined, // column widths no longer correct
      tooltip: tableKey.tooltipKey
        ? msgs.get(tableKey.tooltipKey, locale)
        : undefined
    }))
    return columns
  }

  getActionMapper() {
    const { resourceType, locale, history } = this.props

    return action => ({
      id: action.key,
      title: msgs.get(action.key, locale),
      click: item => {
        handleActionClick(action, resourceType, item, history)
      }
    })
  }

  getRowActionResolver() {
    const { tableActionsResolver } = this.props

    return tableActionsResolver
      ? item => {
        return tableActionsResolver(item).map(this.getActionMapper())
      }
      : undefined
  }

  getRowActions() {
    const { tableActions } = this.props

    return tableActions ? tableActions.map(this.getActionMapper()) : undefined
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

  disableClick(e) {
    e.preventDefault()
  }

  handleDropdownSelection(path) {
    this.props.history.push(path, { cancelBack: true })
  }

  getDropdownActions() {
    const { staticResourceData, locale } = this.props
    const { tableDropdown } = staticResourceData

    if (!tableDropdown) {
      return undefined
    }

    const { actions = [] } = tableDropdown
    const {
      isACMAppCreateDisabled,
      isArgoAppsetCreateDisabled,
      isArgoInstallDisabled
    } = this.state

    const dropdownActions = []

    // psuedo dropdown item to simulate a dropdown group
    dropdownActions.push({
      id: 'psuedo.group.label',
      isDisabled: true,
      text: <span style={{ 'font-size': '14px' }}>Choose a type</span>
    })
    actions.forEach(action => {
      const isDisabled =
        action.msgKey === 'application.type.acm'
          ? isACMAppCreateDisabled
          : isArgoInstallDisabled
            ? isArgoInstallDisabled
            : isArgoAppsetCreateDisabled

      const tooltip = isDisabled
        ? isArgoInstallDisabled
          ? msgs.get('argo.server.exception', locale)
          : msgs.get(tableDropdown.disableMsgKey, locale)
        : undefined

      const label = action.label ? msgs.get(action.label) : undefined
      const labelColor = action.labelColor
        ? msgs.get(action.labelColor)
        : undefined

      dropdownActions.push({
        id: action.msgKey,
        isDisabled: isDisabled,
        text: msgs.get(action.msgKey, locale),
        href: action.path,
        tooltip: tooltip,
        tooltipPosition: TooltipPosition.right,
        label: label,
        labelColor: labelColor
      })
    })

    return {
      id: tableDropdown.msgKey,
      isDisabled: isACMAppCreateDisabled && isArgoAppsetCreateDisabled,
      disableText: msgs.get(tableDropdown.disableMsgKey, locale),
      toggleText: msgs.get(tableDropdown.msgKey, locale),
      actions: dropdownActions,
      handleSelect: () => this.handleDropdownSelection(),
      tooltipPosition: TooltipPosition.right
    }
  }

  getTableFilters() {
    const { staticResourceData, locale } = this.props
    const { tableFilter } = staticResourceData

    if (!tableFilter) {
      return undefined
    }

    const { options = [] } = tableFilter
    const filterOptions = []

    options.forEach(option => {
      filterOptions.push({
        label: msgs.get(option.labelKey, locale),
        value: msgs.get(option.valueKey, locale)
      })
    })

    return [
      {
        label: msgs.get(tableFilter.labelKey, locale),
        id: tableFilter.labelKey,
        options: filterOptions,
        tableFilterFn: tableFilter.tableFilterFn
      }
    ]
  }
}

export default withRouter(ResourceTable)

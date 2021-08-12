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
  AcmButton
} from '@open-cluster-management/ui-components'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import { handleActionClick } from './TableRowActionMenu'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import { CaretDownIcon } from '@patternfly/react-icons'
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Tooltip
} from '@patternfly/react-core'

resources(() => {
  require('../../../scss/table.scss')
})

class ResourceTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isACMAppCreateDisabled: true,
      isArgoAppsetCreateDisabled: true,
      isEmptyTableDropdownOpen: false
    }

    this.onToggleEmptyTableDropdown = isEmptyTableDropdownOpen => {
      this.setState({
        isEmptyTableDropdownOpen: !isEmptyTableDropdownOpen
      })
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
      canCreateActionAllNamespaces(
        'applicationsets',
        'create',
        'argoproj.io'
      ).then(response => {
        const disabled = _.get(response, 'data.userAccessAnyNamespaces')
        this.setState({ isArgoAppsetCreateDisabled: !disabled })
      })
    }
  }

  renderDropdownItem(action, disableMap, locale) {
    const isDisabled = disableMap[action.msgKey]

    return (
      <DropdownItem
        key={action.msgKey}
        isDisabled={isDisabled}
        component={action.component}
        styleChildren={false}
      >
        <Link
          to={{
            pathname: action.path,
            state: { cancelBack: true }
          }}
          key={action.msgKey}
          onClick={isDisabled ? () => this.disableClick() : undefined}
        >
          <AcmButton
            id={action.msgKey}
            variant="plain"
            isSmall
            isDisabled={isDisabled}
            data-test-create-application={action.msgKey}
          >
            {msgs.get(action.msgKey, locale)}
          </AcmButton>
        </Link>
      </DropdownItem>
    )
  }

  renderEmptyStateCreateButton() {
    const { staticResourceData, locale } = this.props
    const { tableDropdown } = staticResourceData

    if (!tableDropdown) {
      return undefined
    }

    const { actions = [] } = tableDropdown
    const {
      isACMAppCreateDisabled,
      isArgoAppsetCreateDisabled,
      isEmptyTableDropdownOpen
    } = this.state
    const isButtonDisabled = isACMAppCreateDisabled && isArgoAppsetCreateDisabled
    const disableMap = {
      'application.type.acm': isACMAppCreateDisabled,
      'application.type.argo': isArgoAppsetCreateDisabled
    }

    const dropdownItems = []

    if (!isButtonDisabled) {
      actions.forEach(action => {
        if (disableMap[action.msgKey]) {
          dropdownItems.push(
            <Tooltip key="action.msgKey" content={tableDropdown.disableText} position="right">
              {this.renderDropdownItem(action, disableMap, locale)}
            </Tooltip>
          )
        } else {
          dropdownItems.push(this.renderDropdownItem(action, disableMap, locale))
        }
      })
    }

    const dropdownElement = (
      <Dropdown
        toggle={
          <DropdownToggle
            isPrimary={!isButtonDisabled}
            id={tableDropdown.msgKey}
            onToggle={
                   !isButtonDisabled
                     ? () => this.onToggleEmptyTableDropdown(isEmptyTableDropdownOpen)
                     : undefined
            }
            toggleIndicator={CaretDownIcon}
            isDisabled={isButtonDisabled}
          >
            {msgs.get(tableDropdown.msgKey, locale)}
          </DropdownToggle>
          }
        isOpen={isEmptyTableDropdownOpen}
        dropdownItems={dropdownItems}
      />
    )

    if (isButtonDisabled) {
      return (
        <Tooltip content={msgs.get(tableDropdown.disableMsgKey, locale)} position="right">
          {dropdownElement}
        </Tooltip>
      )
    }

    return dropdownElement
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
            action={this.renderEmptyStateCreateButton()}
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
        tableDropdown={this.getDropdownActions()}
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

  getDropdownActions() {
    const { staticResourceData, locale } = this.props
    const { tableDropdown } = staticResourceData

    if (!tableDropdown) {
      return undefined
    }

    const { actions = [] } = tableDropdown
    const { isACMAppCreateDisabled, isArgoAppsetCreateDisabled } = this.state

    const dropdownActions = []
    actions.forEach(action => {
      const children = []
      const isDisabled =
        action.msgKey === 'application.type.acm'
          ? isACMAppCreateDisabled
          : isArgoAppsetCreateDisabled
      children.push(
        <Link
          to={{
            pathname: action.path,
            state: { cancelBack: true }
          }}
          key={action.msgKey}
          onClick={isDisabled ? this.disableClick : undefined}
        >
          <AcmButton
            id={action.msgKey}
            variant="plain"
            isSmall
            isDisabled={isDisabled}
            data-test-create-application={action.msgKey}
          >
            {msgs.get(action.msgKey, locale)}
          </AcmButton>
        </Link>
      )
      dropdownActions.push({
        id: action.msgKey,
        isDisabled: isDisabled,
        component: action.component,
        children: children
      })
    })

    return {
      id: tableDropdown.msgKey,
      isDisabled: isACMAppCreateDisabled && isArgoAppsetCreateDisabled,
      disableText: msgs.get(tableDropdown.disableMsgKey, locale),
      toggleText: msgs.get(tableDropdown.msgKey, locale),
      actions: dropdownActions
    }
  }
}

export default withRouter(ResourceTable)

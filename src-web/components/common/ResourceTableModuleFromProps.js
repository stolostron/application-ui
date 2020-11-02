/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import lodash from 'lodash'
import ResourceTable from '../../components/common/ResourceTable'
import TableHelper from '../../util/table-helper'
import { PAGE_SIZES } from '../../actions/index'

class ResourceTableModule extends React.Component {
  static propTypes = {
    definitionsKey: PropTypes.string,
    normalizedKey: PropTypes.string,
    resourceType: PropTypes.object,
    staticResourceData: PropTypes.object,
    subResourceType: PropTypes.object,
    tableResources: PropTypes.array
  };

  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.formatResourceData = this.formatResourceData.bind(this)
    this.handleSearch = TableHelper.handleInputValue.bind(
      this,
      this.handleSearch
    )
    this.changeTablePage = this.changeTablePage.bind(this)
    this.state = {
      page: 1,
      pageSize: PAGE_SIZES.DEFAULT,
      resourceItems: {},
      resourceIds: [],
      sortDirection: 'asc',
      searchValue: ''
    }
  }

  UNSAFE_componentWillMount() {
    this.formatResourceData()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { tableResources } = this.props
    if (nextProps.tableResources !== tableResources) {
      this.formatResourceData(nextProps.tableResources)
    }
  }

  render() {
    const {
      staticResourceData,
      definitionsKey,
      resourceType,
      subResourceType
    } = this.props
    const keys = staticResourceData[definitionsKey]
    const {
      resourceItems,
      resourceIds,
      searchValue,
      sortDirection
    } = this.state
    const {
      resourceItemsOnCurrentPage,
      resourceIdsOnCurrentPage
    } = this.getCurrentPage(resourceItems, resourceIds)
    return (resourceItems && Object.keys(resourceItems).length > 0) ||
      searchValue ? (
        <Module id={`${definitionsKey}-module-id`}>
          <ModuleBody>
            <ResourceTable
              items={resourceItemsOnCurrentPage || []}
              itemIds={resourceIdsOnCurrentPage || []}
              staticResourceData={keys}
              resourceType={resourceType}
              subResourceType={subResourceType}
              totalFilteredItems={resourceIds && resourceIds.length}
              handleSort={this.handleSort}
              handleSearch={this.handleSearch}
              searchValue={searchValue}
              darkSearchBox={true}
              sortDirection={sortDirection}
              tableActions={keys.tableActions}
              changeTablePage={this.changeTablePage}
          />
          </ModuleBody>
        </Module>
      ) : null
  }

  changeTablePage({ page, pageSize }) {
    this.setState({ page, pageSize })
  }

  getCurrentPage(resourceItems, resourceIds) {
    const page = this.state.page
    const pageSize = this.state.pageSize
    const offset = (page - 1) * pageSize
    let lastIndex = offset + pageSize
    lastIndex =
      lastIndex <= resourceIds.length ? lastIndex : resourceIds.length
    const resourceIdsOnCurrentPage = resourceIds.slice(offset, lastIndex)
    const resourceItemsOnCurrentPage = lodash.pick(
      resourceItems,
      resourceIdsOnCurrentPage
    )
    return { resourceItemsOnCurrentPage, resourceIdsOnCurrentPage }
  }

  createNormalizedItems(input, normalizedKey) {
    if (input) {
      return lodash.keyBy(
        input,
        repo =>
          normalizedKey
            ? `${lodash.get(repo, normalizedKey)}${lodash.get(
              repo,
              'cluster',
              ''
            )}`
            : lodash.get(repo, 'name', '')
      )
    }
    return []
  }

  formatResourceData(inputData) {
    let { tableResources } = this.props
    const { normalizedKey } = this.props
    if (inputData) {
      tableResources = inputData
    }
    const { searchValue } = this.state
    let normalizedItems = this.createNormalizedItems(
      tableResources,
      normalizedKey
    )
    let itemIds = Object.keys(normalizedItems)
    if (searchValue) {
      itemIds = itemIds.filter(repo => repo.includes(searchValue))
      normalizedItems = lodash.pick(normalizedItems, itemIds)
    }
    this.setState({ resourceItems: normalizedItems, resourceIds: itemIds })
  }

  // handleSearch will only search for a specific id column
  handleSearch(searchValue) {
    if (!searchValue) {
      return this.setState({ searchValue: '' }, this.formatResourceData)
    }
    return this.setState(prevState => {
      let resItems = prevState.resourceItems
      let resIds = prevState.resourceIds
      resIds = resIds.filter(repo => repo.includes(searchValue))
      resItems = lodash.pick(resItems, resIds)
      return { resourceItems: resItems, resourceIds: resIds, searchValue }
    })
  }
  handleSort(key) {
    const target = key.currentTarget
    const selectedKey = target && target.getAttribute('data-key')
    if (selectedKey) {
      const { staticResourceData, definitionsKey } = this.props
      const resourceKeys = staticResourceData[definitionsKey]
      const { resourceItems, sortDirection } = this.state
      const sortKey = resourceKeys.tableKeys.find(
        tableKey => tableKey.resourceKey === selectedKey
      ).resourceKey
      const sortedRes = lodash.orderBy(
        resourceItems,
        [sortKey],
        [sortDirection]
      )

      const { normalizedKey } = resourceKeys
      const normalizedItems = this.createNormalizedItems(
        sortedRes,
        normalizedKey
      )
      const itemIds = Object.keys(normalizedItems)
      this.setState({
        resourceIds: itemIds,
        resourceItems: normalizedItems,
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      })
    }
  }
}

ResourceTableModule.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  const { staticResourceData, definitionsKey, resourceData } = ownProps
  const resourceKey = staticResourceData[definitionsKey].resourceKey
  const normalizedKey = staticResourceData[definitionsKey].normalizedKey
  const tableResources = resourceData[resourceKey]
  return {
    normalizedKey,
    tableResources
  }
}

export default withRouter(connect(mapStateToProps)(ResourceTableModule))

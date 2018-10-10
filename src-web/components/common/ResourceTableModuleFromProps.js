/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Module, ModuleHeader, ModuleBody } from 'carbon-addons-cloud-react'
import lodash from 'lodash'
import msgs from '../../../nls/platform.properties'
import ResourceTable from '../../components/common/ResourceTable'
import TableHelper from '../../util/table-helper'

class ResourceTableModule extends React.Component {
  static propTypes = {
    definitionsKey: PropTypes.string,
    normalizedKey: PropTypes.string,
    resourceType: PropTypes.object,
    staticResourceData: PropTypes.object,
    tableResources: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.formatResourceData = this.formatResourceData.bind(this)
    this.handleSearch=TableHelper.handleInputValue.bind(this, this.handleSearch)
    this.state = {
      resourceItems: {},
      resourceIds: [],
      sortDirection: 'asc',
      searchValue: ''
    }
  }

  componentWillMount() {
    this.formatResourceData()
  }

  componentWillReceiveProps(nextProps) {
    const { tableResources } = this.props
    if (nextProps.tableResources !== tableResources) {
      this.formatResourceData(nextProps.tableResources)
    }
  }

  render() {
    const { staticResourceData, definitionsKey, resourceType } = this.props
    const keys = staticResourceData[definitionsKey]
    const { resourceItems, resourceIds, searchValue, sortDirection } = this.state
    return (
      resourceItems && Object.keys(resourceItems).length > 0 ? <Module id={`${definitionsKey}-module-id`}>
        <ModuleHeader>{msgs.get(keys.title, this.context.locale)}</ModuleHeader>
        <ModuleBody>
          <ResourceTable
            items={resourceItems || []}
            itemIds={resourceIds || []}
            staticResourceData={keys}
            resourceType={resourceType}
            totalFilteredItems={resourceIds && resourceIds.length}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            searchValue={searchValue}
            darkSearchBox={true}
            sortDirection={sortDirection}
          />
        </ModuleBody>
      </Module> : null
    )
  }

  formatResourceData(inputData) {
    let { tableResources } = this.props
    const { normalizedKey } = this.props
    if (inputData) tableResources = inputData
    const { searchValue } = this.state
    let normalizedItems = tableResources && lodash.keyBy(tableResources, repo => normalizedKey? `${lodash.get(repo, normalizedKey)}${lodash.get(repo, 'cluster', '')}`: lodash.get(repo, 'name', ''))
    let itemIds = normalizedItems && Object.keys(normalizedItems)
    if (searchValue) {
      itemIds = itemIds.filter(repo => repo.includes(searchValue))
      normalizedItems = lodash.pick(normalizedItems, itemIds)
    }
    this.setState({ resourceItems: normalizedItems, resourceIds: itemIds })
  }

  handleSearch(searchValue) {
    if (!searchValue) {
      return this.setState({ searchValue: '' }, this.formatResourceData)
    }
    this.setState((prevState) => {
      let resItems = prevState.resourceItems
      let resIds = prevState.resourceIds
      resIds = resIds.filter(repo => repo.includes(searchValue))
      resItems = lodash.pick(resItems, resIds)
      return { resourceItems: resItems, resourceIds: resIds, searchValue }
    })
  }

  handleSort(key) {
    if (key.target && key.target.dataset && key.target.dataset.key) {
      const { staticResourceData, definitionsKey } = this.props
      const resourceKeys = staticResourceData[definitionsKey]
      const { resourceItems, sortDirection } = this.state
      const selectedKey = lodash.get(key, 'target.dataset.key')
      const sortKey = resourceKeys.tableKeys.find(tableKey => tableKey.resourceKey === selectedKey).resourceKey
      const sortedRes = lodash.orderBy(resourceItems, [sortKey], [sortDirection])
      const sortedIds = sortedRes.map(resourceObject => resourceObject.name)
      this.setState({ resourceIds: sortedIds, resourceItems: sortedRes, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' })
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

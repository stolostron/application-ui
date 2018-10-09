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
import { fetchResource } from '../../actions/common'
import msgs from '../../../nls/platform.properties'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import ResourceTable from '../../components/common/ResourceTable'
import TableHelper from '../../util/table-helper'

class ResourceTableModule extends React.Component {
  static propTypes = {
    definitionsKey: PropTypes.string,
    fetchResources: PropTypes.func,
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

  componentDidMount() {
    this.props.fetchResources()
  }

  componentWillReceiveProps(nextProps) {
    const { tableResources } = this.props
    if (nextProps.tableResources !== tableResources) {
      this.formatResourceData()
    }
  }

  render() {
    const { staticResourceData, definitionsKey, resourceType } = this.props
    const keys = staticResourceData[definitionsKey]
    const { resourceItems, resourceIds, searchValue, sortDirection } = this.state
    return (
      <Module id={`${definitionsKey}-module-id`}>
        <ModuleHeader>{msgs.get(keys.title, this.context.locale)}</ModuleHeader>
        <ModuleBody>
          <ResourceTable
            items={resourceItems}
            itemIds={resourceIds}
            staticResourceData={keys}
            resourceType={resourceType}
            totalFilteredItems={resourceIds.length}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            searchValue={searchValue}
            sortDirection={sortDirection}
          />
        </ModuleBody>
      </Module>
    )
  }

  formatResourceData(inputData) {
    let { tableResources } = this.props
    const { normalizedKey } = this.props
    if (inputData) tableResources = inputData
    const { searchValue } = this.state
    let normalizedItems = tableResources && lodash.keyBy(tableResources, repo => normalizedKey? lodash.get(repo, normalizedKey) + (repo.cluster ? repo.cluster : '') : repo.name)
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
      const { resources, sortDirection } = this.state
      const selectedKey = lodash.get(key, 'target.dataset.key')
      const sortKey = resourceKeys.tableKeys.find(tableKey => tableKey.resourceKey === selectedKey).resourceKey
      const sortedRes = lodash.orderBy(resources, [sortKey], [sortDirection])
      this.setState({ resources: sortedRes, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' })
    }
  }
}

ResourceTableModule.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params: {name, namespace}, staticResourceData, definitionsKey } = ownProps
  const resourceItem = getSingleResourceItem(state, { storeRoot: resourceType.list, name, resourceType, predicate: resourceItemByName, namespace })
  const resourceKey = staticResourceData[definitionsKey].resourceKey
  const normalizedKey = staticResourceData[definitionsKey].normalizedKey
  const tableResources = resourceItem[resourceKey]
  return {
    normalizedKey,
    tableResources
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, params: {name, namespace} } = ownProps
  return {
    fetchResources: () => dispatch(fetchResource(resourceType, namespace, name ))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTableModule))

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
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react'
import lodash from 'lodash'
import { fetchResource } from '../../actions/common'
import msgs from '../../../nls/platform.properties'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import ResourceTable from '../../components/common/ResourceTable'
import TableHelper from '../../util/table-helper'

class PlacementPolicies extends React.Component {
  static propTypes = {
    fetchPolicies: PropTypes.func,
    name: PropTypes.string,
    namespace: PropTypes.string,
    placementPolicies: PropTypes.array,
    resourceType: PropTypes.string,
    staticResourceData: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.formatPolicyData = this.formatPolicyData.bind(this)
    this.handleSearch=TableHelper.handleInputValue.bind(this, this.handleSearch)
    this.state = {
      policyItems: {},
      policyIds: [],
      sortDirection: 'asc',
      searchValue: ''
    }
  }

  componentDidMount() {
    const {name, namespace} = this.props
    this.props.fetchPolicies(RESOURCE_TYPES.HCM_APPLICATIONS, name, namespace)
  }

  componentWillReceiveProps(nextProps) {
    const { placementPolicies } = this.props
    if (nextProps.placementPolicies !== placementPolicies) {
      this.formatPolicyData()
    }
  }

  render() {
    const { staticResourceData: { placementPolicyKeys }, resourceType } = this.props
    const { policyItems, policyIds, searchValue, sortDirection } = this.state
    return (
      <Module id='placement-policies-module'>
        <ModuleHeader>{msgs.get(placementPolicyKeys.title, this.context.locale)}</ModuleHeader>
        <ModuleBody>
          <ResourceTable
            items={policyItems}
            itemIds={policyIds}
            staticResourceData={placementPolicyKeys}
            resourceType={resourceType}
            totalFilteredItems={policyIds.length}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            searchValue={searchValue}
            sortDirection={sortDirection}
          />
        </ModuleBody>
      </Module>
    )
  }

  formatPolicyData() {
    const { placementPolicies } = this.props
    const { searchValue } = this.state
    let normalizedItems = placementPolicies && lodash.keyBy(placementPolicies, repo => repo.name)
    let itemIds = normalizedItems && Object.keys(normalizedItems)
    if (searchValue) {
      itemIds = itemIds.filter(repo => repo.includes(searchValue))
      normalizedItems = lodash.pick(normalizedItems, itemIds)
    }
    this.setState({ policyItems: normalizedItems, policyIds: itemIds })
  }

  handleSearch(searchValue) {
    if (!searchValue) {
      return this.setState({ searchValue: '' }, this.formatPolicyData)
    }
    this.setState((prevState) => {
      let repoItems = prevState.policyItems
      let repoIds = prevState.policyIds
      repoIds = repoIds.filter(repo => repo.includes(searchValue))
      repoItems = lodash.pick(repoItems, repoIds)
      return { policyItems: repoItems, policyIds: repoIds, searchValue }
    })
  }

  handleSort(key) {
    if (key.target && key.target.dataset && key.target.dataset.key) {
      const { staticResourceData: { placementPolicyKeys } } = this.props
      const { policies, sortDirection } = this.state
      const selectedKey = lodash.get(key, 'target.dataset.key')
      const sortKey = placementPolicyKeys.tableKeys.find(tableKey => tableKey.resourceKey === selectedKey).resourceKey
      const sortedRepos = lodash.orderBy(policies, [sortKey], [sortDirection])
      this.setState({ policies: sortedRepos, sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' })
    }
  }
}

PlacementPolicies.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, match } = ownProps
  const segments = match.path.split('/')
  const name = decodeURIComponent(segments[segments.length - 1])
  const namespace = null//TODO  segments[segments.length - 3]
  const {placementPolicies=[]} = getSingleResourceItem(state, { storeRoot: resourceType.list, name, resourceType, predicate: resourceItemByName, namespace })
  return {
    name,
    namespace,
    placementPolicies
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchPolicies: (resourceType, name, namespace) => dispatch(fetchResource(resourceType, name, namespace))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlacementPolicies))

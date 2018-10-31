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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Search } from 'carbon-components-react'
import FilterableMultiSelect from './FilterableMultiSelect'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { fetchTopologyFilters, updateTopologyFilters } from '../../actions/topology'
import * as Actions from '../../actions'

resources(() => {
  require('../../../scss/topology-diagram.scss')
})


const filterItemShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
})

class ResourceTopologyFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(filterItemShape),
      labels: PropTypes.arrayOf(filterItemShape),
      namespaces: PropTypes.arrayOf(filterItemShape),
      types: PropTypes.arrayOf(filterItemShape),
    }),
    availableFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(filterItemShape),
      labels: PropTypes.arrayOf(filterItemShape),
      namespaces: PropTypes.arrayOf(filterItemShape),
      types: PropTypes.arrayOf(filterItemShape),
    }),
    failure: PropTypes.bool,
    fetchFilters: PropTypes.func,
    fetching: PropTypes.bool,
    onNameSearch: PropTypes.func,
    onSelectedFilterChange: PropTypes.func,
  }

  componentWillMount() {
    this.props.fetchFilters()
  }

  handleSearch = ({target}) => {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }
    if ((target.value||'').length===0) {
      this.props.onNameSearch(target.value)
    } else {
      this.typingTimeout = setTimeout(() => {
        this.props.onNameSearch(target.value)
      }, 500)
    }
  }

  render() {
    const { activeFilters, availableFilters, fetching, failure, onSelectedFilterChange } = this.props

    const filters = [
      {
        type: 'cluster',
        titleKey: 'resource.clusters',
        availableKey: 'clusters',
        activeKey: 'cluster'
      },
      {
        type: 'namespace',
        titleKey: 'resource.namespaces',
        availableKey: 'namespaces',
        activeKey: 'namespace'
      },
      {
        type: 'type',
        titleKey: 'resource.types',
        availableKey: 'types',
        activeKey: 'type'
      },
      {
        type: 'label',
        titleKey: 'resource.labels',
        availableKey: 'labels',
        activeKey: 'label'
      },
    ]

    // make sure it has internet type
    if (availableFilters.types.findIndex(f=>f.label==='internet')===-1) {
      availableFilters.types.push({label:'internet'})
    }

    const searchTitle = msgs.get('name.label', this.context.locale)
    return (
      <div className='topologyFilters'>
        {/*dropdown filters*/}
        {filters.map((filter) =>
          <FilterableMultiSelect
            key={Math.random()}
            filterType={filter.type}
            title={msgs.get(filter.titleKey, this.context.locale)}
            availableFilters={availableFilters[filter.availableKey]}
            activeFilters={activeFilters[filter.activeKey]}
            onChange={onSelectedFilterChange}
            fetching={fetching}
            failure={failure}
          />
        )}

        {/*name search*/}
        <div className='multi-select-filter' role='region' aria-label={searchTitle} id={searchTitle}>
          <div className='multi-select-filter-title'>
            {searchTitle}
          </div>
          <Search id='search-name' labelText='' placeHolderText={msgs.get('search.label', this.context.locale)}
            onChange={this.handleSearch}
          />
        </div>
      </div>
    )
  }
}

ResourceTopologyFilters.contextTypes = {
  locale: PropTypes.string
}


const mapStateToProps = (state) =>{
  const { activeFilters = {}, availableFilters = {}, filtersStatus } = state.topology
  return {
    activeFilters,
    availableFilters,
    fetching: filtersStatus !== Actions.REQUEST_STATUS.DONE,
    failure: filtersStatus === Actions.REQUEST_STATUS.ERROR
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchFilters: () => dispatch(fetchTopologyFilters()),
    onNameSearch: (searchName) => {
      dispatch({type: Actions.TOPOLOGY_NAME_SEARCH, searchName})
    },
    onSelectedFilterChange: (filterType, filter) => {
      const { params: {name='', namespace=''}} = ownProps
      dispatch(updateTopologyFilters(filterType, filter, namespace, name))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTopologyFilters))

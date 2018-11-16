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
import FilterBar from './FilterBar'
import { getSearchNames } from '../diagrams/filterHelper'
import FilterableMultiSelect from './FilterableMultiSelect'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { defaultTypeFilters } from '../../reducers/topology'
import { fetchTopologyFilters, updateTopologyFilters } from '../../actions/topology'
import * as Actions from '../../actions'
import _ from 'lodash'

resources(() => {
  require('../../../scss/topology-diagram.scss')
})


class ResourceTopologyFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    availableFilters: PropTypes.object,
    failure: PropTypes.bool,
    fetchFilters: PropTypes.func,
    fetching: PropTypes.bool,
    onNameSearch: PropTypes.func,
    onSelectedFilterChange: PropTypes.func,
    otherTypeFilters: PropTypes.array,
    staticResourceData:  PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.nameSearchMode = false
  }

  componentWillMount() {
    this.props.fetchFilters()
  }

  componentDidMount () {
    this.closeBtn = this.nameSearchRef.getElementsByClassName('bx--search-close')[0]
    this.closeBtn.addEventListener('click', ()=>{
      this.closeBtnClicked = true
    })
  }

  handleSearch = ({target}) => {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    // if user clicks close button, stop search immediately
    if (this.closeBtnClicked) {
      this.props.onNameSearch(target.value)
      delete this.closeBtnClicked
    } else {
      const searchName = (target.value||'')
      if (searchName.length>0 || this.nameSearchMode) {
        // if not in search mode yet, wait for an input > 2 chars
        // if in search mode, keep in mode until no chars left
        const {searchNames} = getSearchNames(searchName)
        const refreshSearch = searchNames.filter(s=>s.length>1).length>0
        if (refreshSearch || searchName.length===0) {
          this.typingTimeout = setTimeout(() => {
            this.props.onNameSearch(searchName)
          }, searchName.length>0 ? 500 : 1500)
          this.nameSearchMode = searchName.length>0
        }
      }
    }
  }

  setNameSearchRef = ref => {this.nameSearchRef = ref}

  shouldComponentUpdate(nextProps){
    return !_.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
    !_.isEqual(this.props.availableFilters, nextProps.availableFilters) ||
    !_.isEqual(this.props.otherTypeFilters, nextProps.otherTypeFilters)
  }

  render() {
    const { activeFilters, availableFilters, fetching, failure,
      otherTypeFilters, staticResourceData, onSelectedFilterChange } = this.props

    // cluster, namespace, label filters
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
        type: 'label',
        titleKey: 'resource.labels',
        availableKey: 'labels',
        activeKey: 'label'
      },
    ]

    // set up type filter
    const availableTypeFilters = [...defaultTypeFilters].map(label=>{
      return {label}
    })
    availableTypeFilters.push({label:'other'})
    // put container at end
    availableTypeFilters.sort(({label:a}, {label:b})=>{
      if (a!=='container' && b==='container') {
        return -1
      } else if (a==='container' && b!=='container') {
        return 1
      }
      return 0
    })
    const filterBarTooltipMap = {
      other: otherTypeFilters.join('\n')
    }

    const searchTitle = msgs.get('name.label', this.context.locale)
    const typeFilterTitle = msgs.get('type', this.context.locale)
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

        {/*type filter bar*/}
        <div className='topology-type-filter-bar' role='region' aria-label={typeFilterTitle} id={typeFilterTitle}>
          <FilterBar
            availableFilters={availableTypeFilters}
            activeFilters={activeFilters['type']}
            typeToShapeMap={staticResourceData.typeToShapeMap}
            tooltipMap={filterBarTooltipMap}
            onChange={onSelectedFilterChange}
            fetching={fetching}
            failure={failure}
          />
        </div>

        {/*name search*/}
        <div className='multi-select-filter' role='region' ref={this.setNameSearchRef}
          aria-label={searchTitle} id={searchTitle}>
          <div className='multi-select-filter-title'>
            {searchTitle}
          </div>
          <Search id='search-name' labelText=''
            placeHolderText={msgs.get('search.label.links', this.context.locale)}
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

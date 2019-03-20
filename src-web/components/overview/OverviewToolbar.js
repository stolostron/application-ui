/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import '../../../graphics/diagramIcons.svg'
import AutoRefreshSelect from '../common/AutoRefreshSelect'
import RefreshTime from '../common/RefreshTime'
import { OVERVIEW_REFRESH_INTERVAL_COOKIE, REFRESH_TIMES } from '../../../lib/shared/constants'
import FilterView from './modals/FilterView'
import { Icon, Tag } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { CSSTransition } from 'react-transition-group'

resources(() => {
  require('../../../scss/overview-toolbar.scss')
})

export const FilterBar = ({ boundFilters, locale }) => {
  return (
    <div className='overview-filter-bar'>
      {boundFilters.map(({name, onClick}) => {
        return <Tag key={name} type='custom'>
          {name}
          <Icon
            className='closeIcon'
            description={msgs.get('filter.remove.tag', locale)}
            name="icon--close"
            onClick={onClick}
          />
        </Tag>
      })}
    </div>
  )
}
FilterBar.propTypes = {
  boundFilters: PropTypes.array,
  locale: PropTypes.string,
}

export default class OverviewToolbar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      filterViewOpen: false,
    }
    this.handleFilterClose = this.handleFilterClose.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.toggleFilterModel = this.toggleFilterModel.bind(this)
    this.toggleFilterModelPress = this.toggleFilterModelPress.bind(this)
  }

  render() {
    const { boundFilters, locale} = this.props
    const { allProviders, view, startPolling, stopPolling, pollInterval, refetch, timestamp, reloading} = this.props
    const { filterViewOpen } = this.state

    return (
      <div className='overview-toolbar'>
        <div className='overview-toolbar-container' >
          <div className='overview-toolbar-buttons' >
            {/* refresh time button */}
            <AutoRefreshSelect
              startPolling={startPolling}
              stopPolling={stopPolling}
              pollInterval={pollInterval}
              refetch={refetch}
              refreshValues = {REFRESH_TIMES}
              refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE}
            />
            {/* filter results button */}
            <div tabIndex='0' role={'button'}
              onClick={this.toggleFilterModel} onKeyPress={this.toggleFilterModelPress}>
              <div>
                <svg className='button-icon'>
                  <use href={'#diagramIcons_filter'} ></use>
                </svg>
              </div>
              <div className='button-label'>
                {msgs.get('overview.filter.results', locale)}
              </div>
            </div>
          </div>
          <FilterBar boundFilters={boundFilters} locale={locale} />
          <RefreshTime refetch={refetch} timestamp={timestamp} reloading={reloading} />
        </div>
        <CSSTransition
          in={filterViewOpen}
          timeout={300}
          classNames="transition"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <FilterView
            context={this.context}
            updateFilters={this.updateFilters}
            onClose={this.handleFilterClose}
            allProviders={allProviders}
            view={view}
          />
        </CSSTransition>
      </div>)
  }

  toggleFilterModel() {
    this.setState(({filterViewOpen})=>{
      return { filterViewOpen: !filterViewOpen }
    })
  }

  toggleFilterModelPress(e) {
    if ( e.key === 'Enter') {
      this.toggleFilterModel()
    }
  }

  handleFilterClose = () => {
    this.setState({ filterViewOpen: false })
  }

  updateFilters = (activeFilters, conditionFilters) => {
    const { view: {updateFilters} } = this.props
    updateFilters(activeFilters, conditionFilters)
  }
}

OverviewToolbar.propTypes = {
  allProviders: PropTypes.array,
  boundFilters: PropTypes.array,
  locale: PropTypes.string,
  pollInterval: PropTypes.number,
  refetch: PropTypes.func,
  reloading: PropTypes.bool,
  startPolling: PropTypes.func,
  stopPolling: PropTypes.func,
  timestamp: PropTypes.string.isRequired,
  view: PropTypes.object,
}

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
import SearchQueryCard from './SearchQueryCard'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import { Icon } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/search-input.scss')
})

class SavedSearchQueries extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAll: false
    }
  }

  handleShowAllButtonClick = () => {
    this.setState(preState => {
      return {
        showAll: !preState.showAll
      }
    })
  }

  render() {
    const { queries = [] } = this.props
    const { locale } = this.context
    const timeUpdated = new Date().toLocaleTimeString(locale)
    return (
      <div className={'saved-search-queries'}>
        <p className={'saved-search-query-header'}>{`${msgs.get(this.props.header, this.context.locale)}`}</p>
        { this.props.showTotal && <p className={'saved-search-query-header-count'}>{`(${queries.length} ${msgs.get('table.header.total', this.context.locale)})`}</p> }
        <p className="search-query-updated-time">{`${msgs.get('table.header.updated', locale)}  ${timeUpdated}`}</p>
        <div className={'query-cards-container'}>
          {this.state.showAll ? queries.map(query => {
            return (<SearchQueryCard  key={query.name} {...query} />)
          }) : queries.map((query, index) => {
            if (index < 3) return (<SearchQueryCard  key={query.name} {...query} />)
          })}
        </div>
        {!this.state.showAll ? (queries.length > 3) &&
          (<div className='saved-search-query-show-button'>
            <button type="button" onClick={this.handleShowAllButtonClick}>
              <p>{msgs.get('table.show.all.button', this.context.locale)}</p>
              <Icon
                className='icon--chevron--down'
                name='icon--chevron--down'
                description={msgs.get('table.hide.button', this.context.locale)} />
            </button>
          </div>) :
          (<div className='saved-search-query-show-button'>
            <button type="button" onClick={this.handleShowAllButtonClick}>
              <p>{msgs.get('table.hide.button', this.context.locale)}</p>
              <Icon
                className='icon--chevron--up'
                name='icon--chevron--up'
                description={msgs.get('table.show.all.button', this.context.locale)} />
            </button>
          </div>)
        }
      </div>
    )
  }
}


SavedSearchQueries.propTypes = {
  header: PropTypes.string,
  queries: PropTypes.array,
  showTotal: PropTypes.bool,
}


export default SavedSearchQueries

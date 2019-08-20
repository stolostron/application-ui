/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import resources from '../../../lib/shared/resources'
import { Icon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'

resources(() => {
  require('./style.scss')
})
/* eslint-disable react/prop-types */

class ChannelsCardCarousel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data, carouselIterator, actions } = this.props
    const { locale } = this.context
    const dataToDisplay = data.slice(
      0 + carouselIterator * 3,
      3 + carouselIterator * 3
    )
    return (
      <div id="ChannelsCardCarousel">
        <div className="deployment-channels-title">
          {msgs.get('application.deployments.channels', locale)}{' '}
          {Array.isArray(data) && <span>({data.length})</span>}
        </div>
        <PaginationIterator
          currentPage={carouselIterator}
          channelLength={data.length}
          setIterator={actions.setCarouselIterator}
          locale={locale}
        />
        <div className="card-container-container">
          {dataToDisplay.map(elem => {
            return <ChannelsCard key={elem.name} data={elem} locale={locale} />
          })}
        </div>
      </div>
    )
  }
}

// This method is what is responsible for displaying the progress dot indicators
// to alert the user of where they currently are in the carousel
const PaginationIterator = ({
  currentPage,
  channelLength,
  setIterator,
  locale
}) => {
  // this const is used just have something to iterate through
  const totalPages = Math.ceil(channelLength / 3.0)
  return (
    <div className="paginationContainer">
      <div className="pageCounter">
        {msgs.get('pagination.of', [currentPage + 1, totalPages], locale)}
      </div>
      <div className="arrowsContainer">
        <div className="leftArrow">
          <Icon
            className="closeIcon"
            description={msgs.get('actions.scroll.left', locale)}
            name="chevron--left"
            onClick={() => {
              setIterator(currentPage - 1)
            }}
          />
        </div>
        <div className="rightArrow">
          <Icon
            className="closeIcon"
            description={msgs.get('actions.scroll.right', locale)}
            name="chevron--right"
            onClick={() => {
              currentPage + 2 <= totalPages && setIterator(currentPage + 1)
            }}
          />
        </div>
      </div>
    </div>
  )
}

// functional card component
const ChannelsCard = ({ data, locale }) => {
  const { counts, name } = data
  const countData = Object.keys(counts).map(status => {
    const statusText = msgs.get('dashboard.card.deployment.' + status, locale)
    return {
      ...counts[status],
      status,
      statusText
    }
  })
  return (
    <div className="individualCard" key={name}>
      <div className="card-container">
        <div className="card-content">
          <div className="card-name">
            {msgs.get('dashboard.card.deployment.channel', locale)}: {name}
          </div>
          <div className="card-count-content">
            {countData.map(({ total, status, statusText }) => {
              const containerClasses = classNames({
                'card-count-container': true
              })
              return (
                <div
                  key={status}
                  className={containerClasses}
                  role={'button'}
                  tabIndex="0"
                >
                  <div className="card-count">
                    <div className="card-count-total">{total}</div>
                  </div>
                  <div className="card-status">{statusText.toUpperCase()}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

ChannelsCard.propTypes = {
  data: PropTypes.object
}

ChannelsCardCarousel.propTypes = {}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  const { AppOverview } = state
  return {
    carouselIterator: AppOverview.carouselIterator
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ChannelsCardCarousel
)

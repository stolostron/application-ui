/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import resources from '../../../lib/shared/resources'
// import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('./style.scss')
})

export default class ChannelsCardsModule extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data } = this.props
    const { locale } = this.context
    return (
      <div id='ChannelsCardModule'>
        <div className='card-container-container'>
          {data.map((elem) => {
            return <ChannelsCard key={elem.name} data={elem} locale={locale} />
          })}
        </div>
      </div>
    )
  }
}

// functional card component
const ChannelsCard = ({ data, locale }) => {
  const { counts, name } = data
  const countData = Object.keys(counts).map(channel => {
    return {
      ...counts[channel],
      channel,
    }
  })
  return (
    <div key={name}>
      <div className='card-container'>
        <div className='card-content'>
          <div className='card-name'>
            Channel: {name}
          </div>
          <div className='card-count-content'>
            {countData.map(({ total, channel }) => {
              const containerClasses = classNames({
                'card-count-container': true,
              })
              return (
                <div key={channel} className={containerClasses} role={'button'}
                  tabIndex='0'>
                  <div className='card-count'>
                    <div className='card-count-total'>
                      {total}
                    </div>
                  </div>
                  <div className='card-status'>
                    {channel.toUpperCase()}
                  </div>
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
  data: PropTypes.object,
  locale: PropTypes.string
}

ChannelsCardsModule.propTypes = {}

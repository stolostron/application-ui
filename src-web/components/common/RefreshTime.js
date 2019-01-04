/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import '../../../graphics/diagramIcons.svg'
import { Loading } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'


class RefreshTime extends React.PureComponent {
  static propTypes = {
    refetch: PropTypes.func.isRequired,
    reloading: PropTypes.bool,
    timestamp: PropTypes.string.isRequired,
  }

  handleClick = () => {
    this.props.refetch()
  }

  render() {
    const { reloading, timestamp } = this.props
    const time = moment(new Date(timestamp)).format('h:mm:ss A')
    const refresh = msgs.get('refresh', this.context.locale)
    return (
      <div className='refresh-time-container'>
        {reloading ?
          <Loading withOverlay={false} small /> :
          <div className='refresh-button' tabIndex='0' role={'button'}
            title={refresh} aria-label={refresh}
            onClick={this.handleClick} onKeyPress={this.handleKeyPress} >
            <svg width="12px" height="12px">
              <use href={'#diagramIcons_refresh'}></use>
            </svg>
          </div>
        }
        <div>{time}</div>
      </div>
    )
  }
}

export default RefreshTime

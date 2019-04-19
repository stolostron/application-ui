/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
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
    return (
      <div className='refresh-time-container'>
        {reloading ?<Loading withOverlay={false} small /> : null }
        <div>{time}</div>
      </div>
    )
  }
}

export default RefreshTime

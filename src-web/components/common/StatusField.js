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
import { Icon } from 'carbon-components-react'

class StatusField extends React.PureComponent {
  static propTypes = {
    status: PropTypes.oneOf(['ok', 'warning', 'failed', 'critical', 'offline', 'unknown']),
    text: PropTypes.string
  }

  render() {
    let iconName
    let className
    switch (this.props.status) {
    case 'ok':
      iconName = 'icon--checkmark--glyph'
      className = 'healthy'
      break
    case 'warning':
      iconName = 'icon--warning--glyph'
      className = 'warning'
      break
    case 'failed':
    case 'critical':
    case 'offline':
      iconName = 'icon--error--glyph'
      className = 'critical'
      break
    case 'unknown':
    default :
      className = 'unknown'
      break
    }
    return (
      <div className='table-status-row'>
        <div className='table-status-icon'>
          {iconName && <Icon className={`table-status-icon__${className}`} name={iconName} description='Status Icon' /> }
        </div>
        <p>{this.props.text}</p>
      </div>
    )
  }
}

export default StatusField

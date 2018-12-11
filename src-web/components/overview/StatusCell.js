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
import { Tag } from 'carbon-components-react'

const StatusCell = ({
  header,
  children,
  tagValue
}) =>
  <div className='status-cell'>
    <div className='title'>
      {header}
      {tagValue && <Tag type='beta'>{tagValue}</Tag>}
    </div>
    <div className='body'>
      {children}
    </div>
  </div>

StatusCell.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string,
  tagValue: PropTypes.string,
}

export default StatusCell


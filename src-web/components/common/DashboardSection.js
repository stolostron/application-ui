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

const DashboardSection = ({
  name,
  children
}) =>
  <div>
    <div className='dashboard-section-title'>
      <h2>{name}</h2>
    </div>
    <div className='dashboard-section-modules'>
      {children}
    </div>
  </div>

DashboardSection.propTypes = {
  children: PropTypes.element,
  name: PropTypes.string
}

export default DashboardSection

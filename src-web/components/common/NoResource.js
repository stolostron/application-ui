/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types */

const NoResource = ({
  title,
  detail,
  children
}, context) =>
  <div className='no-resource'>
    <img className='no-resource-icon' src={`${config.contextPath}/graphics/bee.svg`} alt={msgs.get('svg.description.resource', context.locale)} />
    <div className='no-resource-title'>{title}</div>
    {detail && <div className='no-resource-detail'>{detail}</div>}
    {children}
  </div>

NoResource.contextTypes = {
  locale: PropTypes.string
}

export default NoResource

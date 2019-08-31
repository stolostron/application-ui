/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

const NoResource = ({ title, detail, children }, context) => (
  <div className="no-resource">
    <img
      className="no-resource-icon"
      src={`${config.contextPath}/graphics/planets.png`}
      alt={msgs.get('svg.description.resource', context.locale)}
    />
    <div className="no-resource-title">{title}</div>
    {detail && <div className="no-resource-detail">{detail}</div>}
    {children}
  </div>
)

NoResource.contextTypes = {
  locale: PropTypes.string
}

NoResource.propTypes = {
  children: PropTypes.node.isRequired,
  detail: PropTypes.string,
  title: PropTypes.string
}

export default NoResource

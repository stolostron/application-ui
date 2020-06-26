/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

const NoResource = ({ title, detail, detail2, children }, context) => (
  <div className="no-resource">
    <img
      className="no-resource-icon"
      src={`${config.contextPath}/graphics/no-resources-full-page.png`}
      alt={msgs.get('svg.description.resource', context.locale)}
    />
    <div className="no-resource-title">{title}</div>
    {detail && detail2 ? (
      <div className="no-resource-detail">
        {detail} <br /> {detail2[0]}{' '}
        <span id="text-highlight">{detail2[1]}</span> {detail2[2]}
      </div>
    ) : detail ? (
      <div className="no-resource-detail">{detail}</div>
    ) : (
      ''
    )}
    {children}
  </div>
)

NoResource.contextTypes = {
  locale: PropTypes.string
}

NoResource.propTypes = {
  children: PropTypes.node,
  detail: PropTypes.string,
  detail2: PropTypes.array,
  title: PropTypes.string
}

export default NoResource

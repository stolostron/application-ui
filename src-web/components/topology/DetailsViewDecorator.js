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

const DetailsViewDecorator = ({ resourceType }) => (
  <svg width="48px" height="48px" viewBox="0 0 48 48">
    {resourceType === 'cluster' || resourceType === 'service' ?
      <polygon className={`${resourceType} detailsIcon`} points="24 1.5 4 12 4 36 24 46.5 44 36 44 12"></polygon>
      :
      <circle className={`${resourceType} detailsIcon`} cx="24" cy="24" r="20" />
    }
    <circle className={resourceType} cx="24" cy="24" r="4"></circle>
  </svg>
)

DetailsViewDecorator.propTypes = {
  resourceType: PropTypes.string,
}

export { DetailsViewDecorator }

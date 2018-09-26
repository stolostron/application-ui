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
import '../../../graphics/topologySprite.svg'

const DetailsViewDecorator = ({shape, className, showDot}) => {
  return (
    <svg width="48px" height="48px" viewBox="0 0 48 48">
      <use href={`#topologySprite_${shape}`} className={`${className} detailsIcon`}></use>
      {showDot && <circle className={className} cx="24" cy="24" r="4"></circle>}
    </svg>
  )
}

DetailsViewDecorator.propTypes = {
  className: PropTypes.string,
  shape: PropTypes.string,
  showDot: PropTypes.bool,
}

export { DetailsViewDecorator }

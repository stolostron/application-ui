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
import '../../../../graphics/diagramShapes.svg'

const DetailsViewDecorator = ({shape, className}) => {
  return (
    <svg width="48px" height="48px" viewBox="0 0 48 48">
      <use href={`#diagramShapes_${shape}`} className={`${className} detailsIcon`}></use>
    </svg>
  )
}

DetailsViewDecorator.propTypes = {
  className: PropTypes.string,
  shape: PropTypes.string,
}

export { DetailsViewDecorator }

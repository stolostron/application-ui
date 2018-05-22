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

const DetailsView = ({ /* context, */ details = [], title = '', /* status */ }) => (
  <div className='topologyDetails'>
    <h3>{title}</h3>
    <hr />
    {details.map((d) =>
      <div key={d}> {d} </div>
    )}
  </div>
)

DetailsView.propTypes = {
  details: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
}

export { DetailsView }

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
import msgs from '../../../nls/platform.properties'

const DetailsView = ({ context, details = [], title = '', resourceType = 'default' , /* status */ }) => (
  <section className={`topologyDetails ${resourceType}`}>
    <h3>{title}</h3>
    <hr />
    {details.map((d) =>
      <div className='sectionContent' key={d.labelKey}>
        <span className='label'>{msgs.get(d.labelKey, context.locale)}: </span>
        <span className='value'>{d.value}</span>
      </div>
    )}
  </section>
)

DetailsView.propTypes = {
  context: PropTypes.object,
  details: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['label']).isRequired,
    labelKey: PropTypes.string,
    value: PropTypes.string,
  })),
  resourceType: PropTypes.string,
  title: PropTypes.string
}

export { DetailsView }

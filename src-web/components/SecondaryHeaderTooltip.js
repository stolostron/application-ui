/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.

 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'carbon-components-react'

function SecondaryHeaderTooltip({ text, link, linkText }) {
  return (
    <Tooltip
      className="secondary-header-tooltip"
      triggerClassName="secondary-header-tooltip-icon"
      showIcon={true}
      iconName="icon--info--outline"
      triggerText={null}
    >
      <p className="secondary-header-tooltip-content">{text}</p>
      {link && (
        <a
          className="secondary-header-tooltip-link"
          target="_blank"
          href={link}
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      )}
    </Tooltip>
  )
}

SecondaryHeaderTooltip.propTypes = {
  link: PropTypes.string,
  linkText: PropTypes.string,
  text: PropTypes.string
}

export default SecondaryHeaderTooltip

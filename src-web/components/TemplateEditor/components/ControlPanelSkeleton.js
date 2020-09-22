/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { SkeletonText } from 'carbon-components-react'

class ControlPanelSkeleton extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    controlId: PropTypes.string
  };

  constructor(props) {
    super(props)
  }

  render() {
    const { controlId, control } = this.props
    const { name } = control

    return (
      <React.Fragment>
        <div
          className="creation-view-controls-skeleton"
        >
          <label
            className="creation-view-controls-textbox-title"
            htmlFor={controlId}
          >
            {name}
          </label>
          <SkeletonText
            id={controlId}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default ControlPanelSkeleton

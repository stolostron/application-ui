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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import { Button } from '@patternfly/react-core'
import { Link } from 'react-router-dom'

class EditApplicationButton extends Component {
  static propTypes = {
    path: PropTypes.string
  };

  render() {
    const { path } = this.props
    const { locale } = this.context
    return (
      <Link
        to={{
          pathname: path,
          state: { tabChange: true }
        }}
        key="edit-application"
      >
        <Button variant="primary" isSmall>
          {msgs.get('actions.edit.application', locale)}
        </Button>
      </Link>
    )
  }
}

export default EditApplicationButton

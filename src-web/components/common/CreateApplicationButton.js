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
import msgs from '../../../nls/platform.properties'
import { Button } from 'carbon-components-react'
import { Link } from 'react-router-dom'
import config from '../../../lib/shared/config'

const path = `${config.contextPath}/create`

class CreateApplicationButton extends Component {

  render() {
    const { locale } = this.context
    return (
      <Link to={path} key='create-application'>
        <Button small icon={'add--glyph'} iconDescription='Add icon' kind="secondary">
          {msgs.get('actions.create.application', locale)}
        </Button>
      </Link>
    )
  }
}

export default CreateApplicationButton

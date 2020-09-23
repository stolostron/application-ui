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
import { Button } from '@patternfly/react-core'
import TooltipContainer from '../TemplateEditor/components/TooltipContainer'
import { Link } from 'react-router-dom'
import config from '../../../lib/shared/config'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import _ from 'lodash'

const path = `${config.contextPath}/create`

class CreateApplicationButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canDisable: true
    }
  }

  componentDidMount() {
    canCreateActionAllNamespaces('applications', 'create', 'app.k8s.io').then(
      response => {
        const disabled = _.get(response, 'data.userAccessAnyNamespaces')
        this.setState({ canDisable: !disabled })
      }
    )
  }

  render() {
    const { locale } = this.context
    const { canDisable } = this.state
    const titleText = canDisable
      ? msgs.get('actions.create.application.access.denied', locale)
      : undefined
    return (
      <TooltipContainer tooltip={titleText} isDisabled={canDisable}>
        <Link to={path} key="create-application">
          <Button variant="primary" isSmall isDisabled={canDisable}>
            {msgs.get('actions.create.application', locale)}
          </Button>
        </Link>
      </TooltipContainer>
    )
  }
}

export default CreateApplicationButton

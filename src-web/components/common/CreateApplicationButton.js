/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.

 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React, { Component } from 'react'
import msgs from '../../../nls/platform.properties'
import { AcmButton } from '@open-cluster-management/ui-components'
import { Tooltip } from '@patternfly/react-core'
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

  disableClick(e) {
    e.preventDefault()
  }

  render() {
    const { locale } = this.context
    const { canDisable } = this.state
    if (canDisable) {
      return (
        <Tooltip
          content={msgs.get('actions.create.application.access.denied', locale)}
          isContentLeftAligned
          position="bottom"
        >
          {this.renderButton(locale, canDisable)}
        </Tooltip>
      )
    } else {
      return this.renderButton(locale, canDisable)
    }
  }

  renderButton = (locale, canDisable) => {
    return (
      <Link
        to={{
          pathname: path,
          state: { cancelBack: true }
        }}
        key="create-application"
        onClick={canDisable ? this.disableClick : undefined}
      >
        <AcmButton
          id="CreateAppButton"
          variant="primary"
          isSmall
          isDisabled={canDisable}
          data-test-create-application={!canDisable}
        >
          {msgs.get('actions.create.application', locale)}
        </AcmButton>
      </Link>
    )
  };
}

export default CreateApplicationButton

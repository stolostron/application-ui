/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import jsYaml from 'js-yaml'
import msgs from '../../../nls/platform.properties'
import YamlEditor from '../common/YamlEditor'
import { saveLoad } from '../../../lib/client/design-helper'
import { Button, Loading, Modal, Notification } from 'carbon-components-react'
import apolloClient from '../../../lib/client/apollo-client'
import { canCallAction } from '../../../lib/client/access-helper'

class YAMLTab extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      readOnly: true, // TODO - check RBAC for editing
      open: false,
      loading: false,
    }
  }

  formatData(data) {
    this.setState({
      resourceJson: jsYaml.safeDump(data)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resourceJson !== this.props.resourceJson) {
      this.formatData(this.props.resourceJson)
      canCallAction(this.props.kind, 'update').then(response => {
        if (_.get(response, 'data.userAccess.allowed')) {
          this.setState({
            readOnly: false
          })
        }
      })
    }
  }

  handleEditorChange = value => {
    this.setState({ resourceJson: value })
  }

  toggleModal() {
    this.setState((prevState) => ({ open: !prevState.open }))
  }

  handleSubmit() {
    const { selfLink, namespace, kind, name, cluster } = this.props
    const { resourceJson } = this.state
    const body = saveLoad(resourceJson)
    this.setState({
      loading: true
    })
    apolloClient.genericUpdate({ selfLink, namespace, kind, name, body: body[0], cluster }).then((res) => {
      this.setState({
        errors: res.errors ? res.errors[0].message : null,
        loading: false
      })
      this.toggleModal()
    })
  }

  renderConfirmationModal() {
    const { open } = this.state
    const { locale } = this.context
    const { name } = this.props
    return (
      <Modal
        danger
        id='update-resource-modal'
        open={open}
        primaryButtonText={msgs.get('actions.save', locale)}
        secondaryButtonText={msgs.get('modal.button.cancel', locale)}
        modalLabel={name}
        modalHeading={msgs.get('modal.edit.resource.header', locale)}
        onRequestClose={this.toggleModal.bind(this)}
        onRequestSubmit={this.handleSubmit.bind(this)}
        role='region'
        aria-label={msgs.get('modal.edit.resource.header', locale)}>
        {msgs.get('modal.edit.resource.confirmation', locale)}
      </Modal>
    )
  }

  render() {
    const { resourceLoading } = this.props
    const { readOnly, resourceJson, errors, loading } = this.state

    if (resourceLoading || loading)
      return <Loading className='content-spinner' />

    if (resourceJson && _.get(resourceJson, '[0].message'))
      return <Notification kind='error' title='' subtitle={resourceJson[0].message} />

    if (resourceJson) {
      return (
        <div >
          {errors ? <Notification kind='error' title='' subtitle={errors} /> : null}
          <div className={'details-yaml-editButton'}>
            <Button onClick={this.toggleModal.bind(this)}>{msgs.get('actions.save', this.context.locale)}</Button>
          </div>
          <div className='details-yaml'>
            <YamlEditor
              width='100%'
              height='65vh'
              readOnly={readOnly}
              onYamlChange={this.handleEditorChange}
              yaml={resourceJson} />
          </div>
          {this.renderConfirmationModal()}
        </div>
      )
    }

    return null
  }
}

YAMLTab.contextTypes = {
  locale: PropTypes.string
}

YAMLTab.propTypes = {
  cluster: PropTypes.string,
  kind: PropTypes.string,
  name: PropTypes.string,
  namespace: PropTypes.string,
  resourceJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  resourceLoading: PropTypes.bool,
  selfLink: PropTypes.string,
}

export default YAMLTab

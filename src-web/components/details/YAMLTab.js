/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import jsYaml from 'js-yaml'
import msgs from '../../../nls/platform.properties'
import YamlEditor from '../common/YamlEditor'
import { saveLoad } from '../../../lib/client/design-helper'
import {
  Button,
  Icon,
  Loading,
  Modal,
  Notification
} from 'carbon-components-react'
import apolloClient from '../../../lib/client/apollo-client'
import { canCallAction } from '../../../lib/client/access-helper'

class YAMLTab extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      editMode: false,
      loading: false,
      open: false,
      readOnly: true,
      resourceJson: undefined
    }
  }

  formatData(data) {
    this.setState({
      resourceJson: jsYaml.safeDump(data)
    })
  }

  componentDidUpdate(prevProps) {
    if (
      (this.state.resourceJson === undefined && this.props.resourceJson) ||
      prevProps.resourceJson !== this.props.resourceJson
    ) {
      const apiData = this.props.api.split('/')
      const apiGroup = apiData[1] === 'apis' ? apiData[2] : ''
      this.formatData(this.props.resourceJson)
      canCallAction(
        this.props.kind,
        'update',
        this.props.namespace,
        apiGroup
      ).then(response => {
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
  };

  toggleEditMode() {
    this.setState(prevState => ({ editMode: !prevState.editMode }))
  }

  toggleModal() {
    this.setState(prevState => ({ open: !prevState.open }))
  }

  handleSubmit() {
    const { selfLink, namespace, kind, name, cluster } = this.props
    const { resourceJson } = this.state
    const body = saveLoad(resourceJson)
    this.setState({
      loading: true
    })
    apolloClient
      .genericUpdate({
        selfLink,
        namespace,
        kind,
        name,
        body: body[0],
        cluster
      })
      .then(res => {
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
        id="update-resource-modal"
        open={open}
        primaryButtonText={msgs.get('actions.save', locale)}
        secondaryButtonText={msgs.get('modal.button.cancel', locale)}
        modalLabel={name}
        modalHeading={msgs.get('modal.edit.resource.header', locale)}
        onRequestClose={this.toggleModal.bind(this)}
        onRequestSubmit={this.handleSubmit.bind(this)}
        role="region"
        aria-label={msgs.get('modal.edit.resource.header', locale)}
      >
        {msgs.get('modal.edit.resource.confirmation', locale)}
      </Modal>
    )
  }

  render() {
    const { resourceLoading } = this.props
    const { editMode, readOnly, resourceJson, errors, loading } = this.state

    if (this.props.resourceJson && resourceJson === undefined) {
      this.setState({
        resourceJson: this.formatData(this.props.resourceJson)
      })
    }

    if (resourceJson === undefined || resourceLoading || loading)
      return <Loading className="content-spinner" />

    if (resourceJson && _.get(resourceJson, '[0].message'))
      return (
        <Notification
          kind="error"
          title=""
          subtitle={resourceJson[0].message}
        />
      )

    if (resourceJson) {
      return (
        <div>
          {errors ? (
            <Notification kind="error" title="" subtitle={errors} />
          ) : null}
          <div className={'details-yaml-editButton'}>
            {editMode ? (
              <Button onClick={this.toggleModal.bind(this)} disabled={readOnly}>
                {msgs.get('actions.save', this.context.locale)}
              </Button>
            ) : (
              <Button
                onClick={this.toggleEditMode.bind(this)}
                disabled={readOnly}
              >
                {msgs.get('actions.edit', this.context.locale)}
                <Icon
                  className="details-yaml-editIcon"
                  name="icon--edit"
                  description={msgs.get('actions.edit', this.context.locale)}
                />
              </Button>
            )}
          </div>
          <div className="details-yaml">
            <YamlEditor
              width="100%"
              height="65vh"
              readOnly={!editMode || readOnly}
              onYamlChange={this.handleEditorChange}
              yaml={resourceJson}
            />
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
  api: PropTypes.string,
  cluster: PropTypes.string,
  kind: PropTypes.string,
  name: PropTypes.string,
  namespace: PropTypes.string,
  resourceJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  resourceLoading: PropTypes.bool,
  selfLink: PropTypes.string
}

export default YAMLTab

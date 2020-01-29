/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable react/prop-types, react/jsx-no-bind */

import React from 'react'
import lodash from 'lodash'
import {
  Modal,
  Loading,
  InlineNotification,
  Icon
} from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import msgs from '../../../nls/platform.properties'
import { toString, saveLoad } from '../../../lib/client/design-helper'
import YamlEditor from '../common/YamlEditor'

resources(() => {
  require('../../../scss/modal.scss')
})

class ResourceModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      loading: true,
      errors: ''
    }
  }

  putResource(resourceType, namespace, name, data, selfLink) {
    apolloClient
      .updateResource(resourceType.name, namespace, name, data, selfLink)
      .then(res => {
        if (res.errors) {
          this.setState({
            loading: false,
            errors: res.errors[0].message
          })
        } else {
          this.handleClose()
        }
      })
  }

  handleSubmit = () => {
    this.setState({ loading: true }, () => {
      const resourceType = this.props.resourceType
      let namespace, name, resources
      let selfLink = this.props.data.selfLink
      try {
        resources = lodash.compact(saveLoad(this.state.data))
        resources.forEach(resource => {
          if (resource.metadata && resource.metadata.namespace) {
            namespace = resource.metadata.namespace
          }
          if (resource.metadata && resource.metadata.name) {
            name = resource.metadata.name
          }
          if (resource.metadata && resource.metadata.selfLink) {
            selfLink = resource.metadata.selfLink
          }
          this.putResource(resourceType, namespace, name, resource, selfLink)
        })
      } catch (e) {
        this.setState(preState => {
          return { reqErrorMsg: [...preState.reqErrorMsg, e.message] }
        })
      }
    })
  };

  handleClose = () => {
    const { type } = this.props
    this.client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: false,
        type: type,
        resourceType: {
          __typename: 'resourceType',
          name: '',
          list: ''
        },
        data: {
          __typename: 'ModalData',
          name: '',
          namespace: '',
          clusterName: '',
          selfLink: '',
          _uid: '',
          kind: ''
        }
      }
    })
  };

  escapeEditor = e => {
    e.persist()
    const button = document.querySelector('.bx--btn--secondary')
    e.shiftKey && e.ctrlKey && e.which === 81 && button.focus()
  };

  onChange = value => {
    this.setState({ data: value })
  };

  componentWillMount() {
    const { resourceType, data: { namespace, name, clusterName } } = this.props
    apolloClient
      .getResource(resourceType, { namespace, name, clusterName })
      .then(response => {
        this.setState({
          data: toString(response.data.items[0]),
          loading: false
        })
      })
  }

  componentDidMount() {
    this.resourceModal.focus()
  }

  render() {
    const { open, label, locale, resourceType } = this.props
    const { data, errors, loading } = this.state

    let helpLink = ''
    if (
      resourceType &&
      resourceType.name &&
      resourceType.name == 'HCMApplication'
    )
      helpLink =
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_apps.html'

    return (
      <div
        id="resource-modal-container"
        ref={div => (this.resourceModal = div)}
        tabIndex="-1"
        role="region"
        onKeyDown={this.escapeEditor}
        aria-label={msgs.get('a11y.editor.escape', locale)}
      >
        {' '}
        {/* eslint-disable-line jsx-a11y/no-noninteractive-element-interactions */}
        {loading && <Loading />}
        <Modal
          id={`resource-modal-${resourceType}`}
          className="modal-with-editor"
          open={open}
          primaryButtonText={msgs.get('modal.button.save', locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalHeading={msgs.get(label.heading, locale)}
          onRequestClose={this.handleClose}
          onRequestSubmit={this.handleSubmit}
          role="region"
          aria-label={msgs.get(label.heading, locale)}
        >
          {helpLink && (
            <div className="help-link-edit">
              <a href={helpLink} target="_blank">
                {msgs.get('link.help.writing', this.context.locale)}
              </a>

              <a href={helpLink} target="_blank">
                <Icon
                  name="icon--launch"
                  fill="#6089bf"
                  description=""
                  className="helpLinkIcon"
                />
              </a>
            </div>
          )}

          <div>
            {errors !== '' ? (
              <InlineNotification
                key={`inline-notification-${errors}`}
                kind="error"
                title=""
                subtitle={errors}
                iconDescription={msgs.get('svg.description.error', locale)}
              />
            ) : null}
            <YamlEditor
              readOnly={false}
              onYamlChange={this.onChange}
              yaml={data}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default ResourceModal

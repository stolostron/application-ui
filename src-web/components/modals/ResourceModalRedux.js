/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable react/prop-types, react/jsx-no-bind */

import React from 'react'
import lodash from 'lodash'
import {
  Icon,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Loading,
  InlineNotification
} from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import {
  clearRequestStatus,
  editResource,
  updateModal
} from '../../actions/common'
import { connect } from 'react-redux'
import { REQUEST_STATUS } from '../../actions/index'
import msgs from '../../../nls/platform.properties'
import { toString, saveLoad } from '../../../lib/client/design-helper'
import { YamlEditor } from '@open-cluster-management/temptifly'

resources(() => {
  require('../../../scss/modal.scss')
})

class ResourceModal extends React.PureComponent {
  state = {
    reqErrorMsg: []
  };

  constructor(props) {
    super(props)
    this.state = {
      data: toString(props.data),
      dirty: false
    }
  }

  handleSubmit = () => {
    this.props.clearRequestStatus()
    this.setState({ reqErrorMsg: [] }, () => {
      const resourceType = this.props.resourceType
      let namespace = this.props.namespace
      let name = this.props.name
      let selfLink = this.props.data.metadata.selfLink
      let resourcesTemp
      try {
        resourcesTemp = lodash.compact(saveLoad(this.state.data))
        resourcesTemp.forEach(resource => {
          if (resource.metadata && resource.metadata.namespace) {
            namespace = resource.metadata.namespace
          }
          if (resource.metadata && resource.metadata.name) {
            name = resource.metadata.name
          }
          if (resource.metadata && resource.metadata.selfLink) {
            selfLink = resource.metadata.selfLink
          }
          this.props.putResource(
            resourceType,
            namespace,
            name,
            resource,
            selfLink
          )
        })
      } catch (e) {
        this.setState(preState => {
          return { reqErrorMsg: [...preState.reqErrorMsg, e.message] }
        })
      }
    })
  };

  handleClose = () => {
    this.setState({ reqErrorMsg: [] })
    this.props.handleClose()
  };

  escapeEditor = e => {
    e.persist()
    const button = document.querySelector('.bx--btn--secondary')
    e.shiftKey && e.ctrlKey && e.which === 81 && button.focus()
  };

  onChange = value => {
    this.setState({ data: value, dirty: true })
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      this.setState({ data: toString(this.props.data) })
    }
    if (nextProps.reqStatus && nextProps.reqStatus === REQUEST_STATUS.ERROR) {
      this.setState(preState => {
        return {
          reqErrorMsg: [...preState.reqErrorMsg, nextProps.reqErrorMsg]
        }
      })
    }
    if (nextProps.reqCount === 0 && !nextProps.reqErrCount) {
      this.handleClose()
    }
  }

  onUnload = e => {
    if (this.state.dirty) {
      e.preventDefault()
      e.returnValue = ''
    }
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload)
    window.addEventListener('resize', this.layoutEditors.bind(this))
    this.resourceModal.focus()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  setContainerRef = container => {
    this.containerRef = container
    this.layoutEditors()
  };

  setEditor = editor => {
    this.editor = editor
    this.layoutEditors()
  };

  layoutEditors() {
    if (this.containerRef && this.editor) {
      const rect = this.containerRef.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      this.editor.layout({ width, height })
    }
  }

  render() {
    const {
      reqCount,
      open,
      label,
      locale,
      resourceType,
      helpLink,
      resourceDescriptionKey
    } = this.props
    return (
      <div
        id="resource-modal-container"
        ref={div => (this.resourceModal = div)}
        tabIndex="-1"
        role="region"
        aria-label={msgs.get('a11y.editor.escape', locale)}
      >
        {' '}
        {/* eslint-disable-line jsx-a11y/no-noninteractive-element-interactions */}
        {reqCount && reqCount > 0 && <Loading />}
        <ComposedModal
          id={`resource-modal-${resourceType}`}
          className="modal-with-editor"
          aria-label={msgs.get(label.heading, locale)}
          open={open}
          role="region"
          onClose={() => false}
        >
          <ModalHeader
            title={msgs.get(label.heading, locale)}
            buttonOnClick={this.handleClose}
          />
          <ModalBody>
            {resourceDescriptionKey && (
              <div className="yaml-instructions-edit">
                {msgs.get(resourceDescriptionKey, this.context.locale)}
              </div>
            )}

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

            {this.state.reqErrorMsg &&
              this.state.reqErrorMsg.length > 0 &&
              this.state.reqErrorMsg.map(err => (
                <InlineNotification
                  key={`inline-notification-${err}`}
                  kind="error"
                  title=""
                  subtitle={err}
                  iconDescription={msgs.get('svg.description.error', locale)}
                />
              ))}
            <div
              className="yamlEditorContainerContainer"
              ref={this.setContainerRef}
            >
              <YamlEditor
                setEditor={this.setEditor}
                onYamlChange={this.onChange}
                yaml={this.state && this.state.data}
              />
            </div>
          </ModalBody>
          <ModalFooter
            primaryButtonText={msgs.get('modal.button.save', locale)}
            secondaryButtonText={msgs.get('modal.button.cancel', locale)}
            onRequestClose={this.handleClose}
            onRequestSubmit={this.handleSubmit}
          />
        </ComposedModal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.modal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    putResource: (resourceType, namespace, name, data, selfLink) => {
      dispatch(editResource(resourceType, namespace, name, data, selfLink))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({ open: false, type: 'resource' }))
    },
    clearRequestStatus: () => dispatch(clearRequestStatus())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceModal)

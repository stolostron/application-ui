/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import jsYaml from 'js-yaml'
import {
  Button,
  InlineNotification,
  Loading,
  Modal
} from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import getResourceDefinitions from '../../definitions'
import YamlEditor from '../common/YamlEditor'

resources(() => {
  require('../../../scss/modal.scss')
})

const initialState = {
  modalOpen: false,
  processing: false,
  yaml: '',
  yamlParsingError: null,
  createError: null
}

// A hacky way to delay making the fetch call
const waitTime = ms => {
  const start = new Date().getTime()
  let end = start
  while (end < start + ms) {
    end = new Date().getTime()
  }
}

class CreateResourceModal extends React.PureComponent {
  static propTypes = {
    headingTextKey: PropTypes.string,
    helpLink: PropTypes.string,
    onCreateResource: PropTypes.func,
    onSubmitFunction: PropTypes.func,
    resourceDescriptionKey: PropTypes.string,
    resourceType: PropTypes.object,
    submitBtnTextKey: PropTypes.string
  };

  state = initialState;

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  };
  handleModalCancel = () => {
    this.setState(initialState)
  };
  handleModalSubmit = () => {
    let resources
    try {
      // the next line code will split the yaml content into multi-parts
      // if '---' found in the content
      resources = jsYaml.safeLoadAll(this.state.yaml)
    } catch (e) {
      this.setState({ yamlParsingError: e })
      return
    }
    this.setState({ yamlParsingError: null, processing: true })

    this.props.onCreateResource(resources).then(result => {
      const errors = R.pathOr(
        [],
        ['data', 'createResources', 'errors'],
        result
      )
      if (errors.length > 0) {
        this.setState({
          createError: {
            message: errors[0].message
          },
          processing: false
        })
      } else {
        this.setState(initialState)
        // If there is a on Submit function passed in we want to execute it
        if (this.props.onSubmitFunction) {
          waitTime(3000)
          this.props.onSubmitFunction()
        }
      }
    })
  };

  handleEditorChange = yaml => this.setState({ yaml });

  handleParsingError = yamlParsingError => this.setState({ yamlParsingError });

  handleNotificationClosed = () => this.setState({ yamlParsingError: null });

  isSubmitDisabled = () => this.state.processing === true;

  render() {
    const { resourceType } = this.props
    const { validator } = getResourceDefinitions(resourceType)
    return (
      <div>
        <Button
          icon="add--glyph"
          small
          id={msgs.get(this.props.submitBtnTextKey, this.context.locale)}
          key="create-resource"
          onClick={this.handleModalOpen}
        >
          {msgs.get(this.props.submitBtnTextKey, this.context.locale)}
        </Button>
        {this.state.modalOpen && (
          <Modal
            className="modal-with-editor"
            open={this.state.modalOpen}
            modalHeading={msgs.get(
              this.props.headingTextKey,
              this.context.locale
            )}
            primaryButtonText={msgs.get(
              this.props.submitBtnTextKey,
              this.context.locale
            )}
            primaryButtonDisabled={this.isSubmitDisabled()}
            secondaryButtonText={msgs.get(
              'actions.cancel',
              this.context.locale
            )}
            onRequestSubmit={this.handleModalSubmit}
            onRequestClose={this.handleModalCancel}
          >
            <div className="bx--modal-content-desc">
              {msgs.get(this.props.resourceDescriptionKey, this.context.locale)}
              <br />

              {this.props.helpLink && (
                <span className="help-link">
                  <a href={this.props.helpLink} target="_blank">
                    {msgs.get('link.help.writing', this.context.locale)}
                  </a>
                </span>
              )}
            </div>
            {this.state.yamlParsingError && (
              <InlineNotification
                kind="error"
                title={msgs.get('error.parse', this.context.locale)}
                iconDescription=""
                subtitle={this.state.yamlParsingError.reason}
                onCloseButtonClick={this.handleNotificationClosed}
              />
            )}
            {this.state.createError && (
              <InlineNotification
                kind="error"
                title={msgs.get('error.create', this.context.locale)}
                iconDescription=""
                subtitle={this.state.createError.message}
                onCloseButtonClick={this.handleNotificationClosed}
              />
            )}
            <YamlEditor
              validator={validator}
              onYamlChange={this.handleEditorChange}
              handleParsingError={this.handleParsingError}
              yaml={this.state.yaml}
            />
            {this.state.processing && <Loading />}
          </Modal>
        )}
      </div>
    )
  }
}

CreateResourceModal.contextType = {
  locale: PropTypes.locale
}

const mapDispatchToProps = (dispatch, { onCreateResource }) => {
  return {
    onCreateResource: yaml => onCreateResource(dispatch, yaml)
  }
}

export default connect(() => ({}), mapDispatchToProps)(CreateResourceModal)

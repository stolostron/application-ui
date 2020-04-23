/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
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
  Icon,
  InlineNotification,
  Loading,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab
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
  createError: null,
  dirty: false,
  sample: null
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
    iconDescription: PropTypes.string,
    onCreateResource: PropTypes.func,
    onSubmitFunction: PropTypes.func,
    resourceDescriptionKey: PropTypes.string,
    resourceType: PropTypes.object,
    resourceTypeName: PropTypes.string,
    sampleContent: PropTypes.array,
    sampleTabs: PropTypes.object
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
      // errors can be in createApplication and createResources depending on type of resource
      const errors = R.concat(
        R.pathOr([], ['data', 'createApplication', 'errors'], result),
        R.pathOr([], ['data', 'createResources', 'errors'], result)
      )

      if (errors && errors.length > 0) {
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
          waitTime(7000)
          this.props.onSubmitFunction()
        }
      }
    })
  };

  handleEditorChange = yaml => {
    this.setState({ yaml, dirty: true })
  };

  handleParsingError = yamlParsingError => this.setState({ yamlParsingError });

  handleNotificationClosed = () => this.setState({ yamlParsingError: null });

  isSubmitDisabled = () => this.state.processing === true;

  render() {
    const { resourceType } = this.props
    const { validator } = getResourceDefinitions(resourceType)
    const tabs = this.props.sampleTabs
    const tabsSampleContent = this.props.sampleContent
    const tabsHandleEditorChange = this.handleEditorChange
    const tabsHandleParsingError = this.handleParsingError
    const tabsYaml = this.state.yaml
    const errorMsg = this.state.createError && this.state.createError.message
    return (
      <div>
        <Button
          icon="add--glyph"
          small
          id={msgs.get(this.props.resourceTypeName, this.context.locale)}
          iconDescription={this.props.iconDescription}
          key="create-resource"
          onClick={this.handleModalOpen}
        >
          {msgs.get(this.props.resourceTypeName, this.context.locale)}
        </Button>
        {this.state.modalOpen && (
          <ComposedModal
            className="modal-with-editor"
            open={this.state.modalOpen}
            role="region"
            onClose={() => false}
          >
            <ModalHeader
              title={msgs.get(this.props.headingTextKey, this.context.locale)}
              buttonOnClick={this.handleModalCancel}
            />
            <ModalBody>
              <div className="bx--modal-content-desc">
                <div className="yaml-instructions">
                  {msgs.get(
                    this.props.resourceDescriptionKey,
                    this.context.locale
                  )}
                </div>

                {this.props.helpLink && (
                  <div className="help-link">
                    <a href={this.props.helpLink} target="_blank">
                      {msgs.get('link.help.writing', this.context.locale)}
                    </a>

                    <a href={this.props.helpLink} target="_blank">
                      <Icon
                        name="icon--launch"
                        fill="#6089bf"
                        description=""
                        className="helpLinkIcon"
                      />
                    </a>
                  </div>
                )}
              </div>
              {this.state.dirty &&
                this.state.yamlParsingError && (
                  <InlineNotification
                    kind="error"
                    title={msgs.get('error.parse', this.context.locale)}
                    iconDescription=""
                    subtitle={msgs.get(
                      'error.parse.reason',
                      this.context.locale
                    )}
                    onCloseButtonClick={this.handleNotificationClosed}
                  />
              )}
              {(this.state.createError || errorMsg) && (
                <InlineNotification
                  kind="error"
                  title={msgs.get('error.create', this.context.locale)}
                  iconDescription=""
                  // show default msg if errorMsg is not set
                  subtitle={
                    errorMsg ||
                    msgs.get('error.create.reason', this.context.locale)
                  }
                  onCloseButtonClick={this.handleNotificationClosed}
                />
              )}
              {this.props.sampleTabs ? (
                <div className="yamlSampleTabsContainer">
                  <Tabs
                    className={
                      !this.state.dirty
                        ? 'yamlSampleTabs'
                        : 'yamlSampleTabs hidden'
                    }
                  >
                    {Object.keys(tabs).map((key, i) => {
                      return (
                        <Tab
                          onClick={() => {
                            this.setState({ sample: tabsSampleContent[i] })
                          }}
                          onKeyDown={() => {
                            // noop function for optional property
                          }}
                          key={tabs[key]}
                          label={tabs[key]}
                        />
                      )
                    })}
                  </Tabs>
                  <YamlEditor
                    validator={validator}
                    onYamlChange={tabsHandleEditorChange}
                    handleParsingError={tabsHandleParsingError}
                    yaml={
                      this.state.dirty
                        ? tabsYaml
                        : this.state.sample
                          ? this.state.sample
                          : tabsSampleContent[0]
                    }
                  />
                </div>
              ) : (
                <YamlEditor
                  validator={validator}
                  onYamlChange={tabsHandleEditorChange}
                  handleParsingError={this.handleParsingError}
                  yaml={
                    this.state.dirty ? this.state.yaml : tabsSampleContent[0]
                  }
                />
              )}
              {this.state.processing && <Loading />}
            </ModalBody>
            <ModalFooter>
              <div id="modalFotterBtnDiv">
                <Button
                  className="bx--btn--secondary"
                  type="button"
                  onClick={this.handleModalCancel}
                >
                  {msgs.get('actions.cancel', this.context.locale)}
                </Button>
                <Button
                  type="button"
                  disabled={this.isSubmitDisabled()}
                  onClick={this.handleModalSubmit}
                >
                  {msgs.get('modal.button.save', this.context.locale)}
                </Button>
              </div>
            </ModalFooter>
          </ComposedModal>
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

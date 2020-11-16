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
import { YamlEditor } from '@open-cluster-management/temptifly'
import {
  delResourceSuccessFinished,
  mutateResourceSuccessFinished
} from '../../actions/common'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { withLocale } from '../../providers/LocaleProvider'

resources(() => {
  require('../../../scss/modal.scss')
})

const initialState = {
  modalOpen: false,
  processing: false,
  yaml: '',
  yamlParsingError: null,
  createError: null,
  createSuccess: null,
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
    deleteSuccessFinished: PropTypes.func,
    headingTextKey: PropTypes.string,
    helpLink: PropTypes.string,
    iconDescription: PropTypes.string,
    locale: PropTypes.string,
    mutateSuccessFinished: PropTypes.func,
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
    // Remove previous success message if any
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
    let resourcesTemp
    try {
      // the next line code will split the yaml content into multi-parts
      // if '---' found in the content
      resourcesTemp = jsYaml.safeLoadAll(this.state.yaml)
    } catch (e) {
      this.setState({ yamlParsingError: e })
      return
    }
    this.setState({ yamlParsingError: null, processing: true })

    this.props.onCreateResource(resourcesTemp).then(result => {
      const results = R.pathOr(
        [],
        ['data', 'createResources', 'result'],
        result
      )
      const errors = R.pathOr(
        [],
        ['data', 'createResources', 'errors'],
        result
      )

      if (results && results.length > 0) {
        const failure = results.filter(
          r => r.kind === 'Status' && r.status === 'Failure'
        )
        const success = results.filter(r => r.kind !== 'Status')
        if (failure && failure.length > 0) {
          this.setState({
            createError: failure,
            createSuccess: success && success.length > 0 ? success : null,
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
      } else if (errors && errors.length > 0) {
        this.setState({
          createError: errors,
          processing: false
        })
      }
    })
  };

  onUnload = e => {
    if (this.state.dirty) {
      e.preventDefault()
      e.returnValue = ''
    }
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload)
    window.addEventListener('resize', this.layoutEditors.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload)
  }

  handleEditorChange = yaml => {
    this.setState({ yaml, dirty: true })
  };

  handleParsingError = yamlParsingError => this.setState({ yamlParsingError });

  handleNotificationClosed = () => this.setState({ yamlParsingError: null });

  isSubmitDisabled = () => this.state.processing === true;

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
    const { resourceType, locale } = this.props
    const { validator } = getResourceDefinitions(resourceType)
    const tabs = this.props.sampleTabs
    const tabsSampleContent = this.props.sampleContent
    const tabsHandleEditorChange = this.handleEditorChange
    const tabsHandleParsingError = this.handleParsingError
    const tabsYaml = this.state.yaml
    const buttonName = msgs.get(this.props.resourceTypeName, locale)
    const buttonID = buttonName.replace(/ /g, '-').toLowerCase()
    return (
      <div>
        <Button
          icon="add--glyph"
          small
          id={buttonID}
          iconDescription={this.props.iconDescription}
          key="create-resource"
          onClick={this.handleModalOpen}
        >
          {buttonName}
        </Button>
        {this.state.modalOpen && (
          <ComposedModal
            className="modal-with-editor"
            open={this.state.modalOpen}
            role="region"
            onClose={() => false}
          >
            <ModalHeader
              title={msgs.get(this.props.headingTextKey, locale)}
              buttonOnClick={this.handleModalCancel}
            />
            <ModalBody>
              <div className="bx--modal-content-desc">
                <div className="yaml-instructions">
                  {msgs.get(this.props.resourceDescriptionKey, locale)}
                </div>

                {this.props.helpLink && (
                  <div className="help-link">
                    <a
                      href={this.props.helpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {msgs.get('link.help.writing', locale)}
                    </a>

                    <a
                      href={this.props.helpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                    title={msgs.get('error.parse', locale)}
                    iconDescription=""
                    subtitle={msgs.get('error.parse.reason', locale)}
                    onCloseButtonClick={this.handleNotificationClosed}
                  />
              )}
              {this.state.createError && (
                <div>
                  {this.state.createError.map(error => {
                    return (
                      <InlineNotification
                        key={Math.random()}
                        kind="error"
                        title={msgs.get('error.create', locale)}
                        iconDescription=""
                        // show default msg if errorMsg is not set
                        subtitle={
                          error.message ||
                          msgs.get('error.create.reason', locale)
                        }
                        onCloseButtonClick={this.handleNotificationClosed}
                      />
                    )
                  })}
                  {this.state.createSuccess &&
                    this.state.createSuccess.map(success => {
                      return (
                        <InlineNotification
                          key={Math.random()}
                          kind="success"
                          title={msgs.get('success.update.resource', locale)}
                          iconDescription=""
                          subtitle={
                            success.kind &&
                            success.metadata &&
                            success.metadata.name
                              ? msgs.get(
                                'success.create.details',
                                [success.kind, success.metadata.name],
                                locale
                              )
                              : msgs.get('success.create.description', locale)
                          }
                          onCloseButtonClick={this.handleNotificationClosed}
                        />
                      )
                    })}
                </div>
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
                  <div
                    className="yamlEditorContainerContainer"
                    ref={this.setContainerRef}
                  >
                    <YamlEditor
                      validator={validator}
                      setEditor={this.setEditor}
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
                </div>
              ) : (
                <div
                  className="yamlEditorContainerContainer"
                  ref={this.setContainerRef}
                >
                  <YamlEditor
                    validator={validator}
                    setEditor={this.setEditor}
                    onYamlChange={tabsHandleEditorChange}
                    handleParsingError={this.handleParsingError}
                    yaml={
                      this.state.dirty ? this.state.yaml : tabsSampleContent[0]
                    }
                  />
                </div>
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
                  {msgs.get('actions.cancel', locale)}
                </Button>
                <Button
                  type="button"
                  disabled={this.isSubmitDisabled()}
                  onClick={this.handleModalSubmit}
                >
                  {msgs.get('modal.button.save', locale)}
                </Button>
              </div>
            </ModalFooter>
          </ComposedModal>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, { onCreateResource }) => {
  return {
    onCreateResource: yaml => onCreateResource(dispatch, yaml),
    mutateSuccessFinished: resourceType =>
      dispatch(mutateResourceSuccessFinished(resourceType)),
    deleteSuccessFinished: resourceType =>
      dispatch(delResourceSuccessFinished(resourceType))
  }
}

export default connect(() => ({}), mapDispatchToProps)(
  withLocale(CreateResourceModal)
)

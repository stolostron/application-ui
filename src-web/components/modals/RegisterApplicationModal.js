/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import jsYaml from 'js-yaml'
import { Button, InlineNotification, Loading, Modal } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { registerApplication } from '../../actions/applications'
import YamlEditor from '../common/YamlEditor'

resources(() => {
  require('../../../scss/modal.scss')
})

const initialState = {
  modalOpen: false,
  processing: false,
  yaml: '',
  yamlParsingError: null,
}

class RegisterApplicationModal extends React.PureComponent {
  static propTypes = {
    onRegisterApplication: PropTypes.func
  }

  state = initialState

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }
  handleModalCancel = () => {
    this.setState(initialState)
  }
  handleModalSubmit = () => {
    try {
      jsYaml.safeLoadAll(this.state.yaml)
    } catch (e) {
      this.setState({ yamlParsingError: e })
      return
    }
    this.setState({ yamlParsingError: null, processing: true })
    this.props.onRegisterApplication(this.state.yaml)
      .then(()=> this.setState(initialState))
  }

  handleEditorChange = (yaml) => this.setState({ yaml })

  isSubmitDisabled = () => this.state.processing === true


  render(){
    return (
      <div>
        <Button icon="add--glyph" small id='register-application' key='register-application' onClick={this.handleModalOpen}>
          { msgs.get('actions.register.application', this.context.locale) }
        </Button>
        <Modal
          className='modal-with-editor'
          open={this.state.modalOpen}
          modalHeading={ msgs.get('actions.register.application', this.context.locale) }
          primaryButtonText={ msgs.get('actions.register.application', this.context.locale) }
          primaryButtonDisabled={this.isSubmitDisabled()}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={this.handleModalSubmit}
          onRequestClose={this.handleModalCancel}
        >
          {this.state.yamlParsingError &&
            <InlineNotification
              kind='error'
              title={msgs.get('error.parse', this.context.locale)}
              iconDescription=''
              subtitle={this.state.yamlParsingError.reason}
            />
          }
          <YamlEditor onYamlChange={this.handleEditorChange} yaml={this.state.yaml} />
          {this.state.processing && <Loading />}
        </Modal>
      </div>
    )
  }
}

RegisterApplicationModal.contextType = {
  locale: PropTypes.locale
}

const mapDispatchToProps = dispatch => {
  return {
    onRegisterApplication: (yaml) => dispatch(registerApplication(yaml))
  }
}

export default connect(() => ({}), mapDispatchToProps)(RegisterApplicationModal)


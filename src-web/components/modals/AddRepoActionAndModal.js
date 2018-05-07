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
import { connect } from 'react-redux'
import { Button, Modal, TextInput } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { createResource } from '../../actions/common'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'


class AddRepoActionAndModal extends React.PureComponent {

  state = { modalOpen: false, nameInput: '', urlInput: '' }

  handleModalOpen = () => {
    this.setState({ modalOpen: true, nameInput: '', urlInput: '', urlInputValidationMsg: undefined })
  }
  handleModalCancel = () => {
    this.setState({ modalOpen: false })
  }
  handleModalSubmit = () => {
    if (this.validateUrlInput()) {
      this.props.onAddRepo(this.state.nameInput, this.state.urlInput)
        .then(() => {
          this.setState({ modalOpen: false, nameInput: '', urlInput: '', urlInputValidationMsg: undefined })
        })
    }
  }

  handleNameInputChange = (evt) => {
    this.setState({ nameInput: evt.target.value })
  }

  handleUrlInputChange = (evt) => {
    // Remove validation errors after any input change.
    this.setState({ urlInput: evt.target.value, urlInputValidationMsg: undefined })
  }

  isSubmitDisabled = () => this.state.nameInput === '' || this.state.urlInput === ''

  validateUrlInput = () => {
    const urlPattern = /(http(s)?:\/\/)/gi
    this.state.urlInput
    if (this.state.urlInput && this.state.urlInput.match(urlPattern) == null) {
      this.setState({ urlInputValidationMsg: `${msgs.get('helmRepo.urlformat', this.context)}` })
      return false
    }

    this.setState({ urlInputValidationMsg: undefined })
    return true
  }

  render(){
    return (
      <div>
        <Button icon="add--glyph" small key='myButton' onClick={this.handleModalOpen}>
          { msgs.get('helmRepo.addRepo', this.context.locale) }
        </Button>
        <Modal
          open={this.state.modalOpen}
          modalHeading={ msgs.get('helmRepo.addRepo', this.context.locale) }
          primaryButtonText={ msgs.get('actions.add', this.context.locale) }
          primaryButtonDisabled={this.isSubmitDisabled()}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={this.handleModalSubmit}
          onRequestClose={this.handleModalCancel}
        >
          <TextInput
            id='helm-repo-name'
            labelText={ msgs.get('helmRepo.name', this.context.locale) }
            placeholder={ msgs.get('helmRepo.namePlaceholder', this.context.locale) }
            value={this.state.nameInput}
            onChange={this.handleNameInputChange}
          />
          <TextInput
            id='helm-repo-url'
            labelText={ msgs.get('helmRepo.url', this.context.locale) }
            placeholder={ msgs.get('helmRepo.urlPlaceholder', this.context.locale) }
            value={this.state.urlInput}
            onChange={this.handleUrlInputChange}
            onBlur={this.validateUrlInput}
            invalid={!!this.state.urlInputValidationMsg}
            invalidText={this.state.urlInputValidationMsg}
          />
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddRepo: (Name, URL) => dispatch(createResource(RESOURCE_TYPES.HCM_REPOSITORIES, { Name, URL }))
  }
}

export default connect(() => ({}), mapDispatchToProps)(AddRepoActionAndModal)


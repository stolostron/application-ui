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
import { Button, Modal, TextInput } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'


class AddRepoActionAndModal extends React.PureComponent {

  state = { modalOpen: false, nameInput: '', urlInput: '' }

  handleOpenModal = () => {
    this.setState({ modalOpen: true, nameInput: '', urlInput: '', urlInputValidationMsg: undefined })
  }
  handleModalCancel = () => {
    this.setState({ modalOpen: false })
  }
  handleModalSubmit = () => {
    if (this.validateUrlInput()) {
      apolloClient.addHemlRepo(this.state.nameInput, this.state.urlInput).then(() => {
        // TODO: added repo, now need to refresh repo list.

        this.setState({ modalOpen: false, nameInput: '', urlInput: '', urlInputValidationMsg: undefined })
      })
      // TODO: handle any error from the HCM api call.
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
        <Button icon="add--glyph" small key='myButton' onClick={this.handleOpenModal}>
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

export default AddRepoActionAndModal


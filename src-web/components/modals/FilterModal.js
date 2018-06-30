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
import { Button, Loading, Modal } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/modal.scss')
})


class FilterModal extends React.PureComponent {

  render(){
    //eslint-disable-next-line
    const { tags=[], suggestions=[], handleModalClose, handleModalOpen, modalOpen } = this.props
    return (
      <div>
        <Button icon="add--glyph" small key='registerApplication' onClick={this.handleModalOpen}>
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
          {this.state.processing && <Loading small withOverlay={false} />}
        </Modal>
      </div>
    )
  }
}

FilterModal.propTypes = {
  handleModalClose: PropTypes.func,
  handleModalOpen: PropTypes.func,
  modalOpen: PropTypes.bool,
  suggestions: PropTypes.array,
  tags: PropTypes.array,
}


export default FilterModal

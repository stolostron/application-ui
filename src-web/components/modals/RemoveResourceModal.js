/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Loading, Notification } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { withRouter } from 'react-router-dom'
import { REQUEST_STATUS } from '../../actions/index'
import { removeResource, clearRequestStatus, receiveDelError, updateModal } from '../../actions/common'

const RemoveResourceModal = ({ data: { name, Name }, handleClose, handleSubmit, label, locale, open, reqErrorMsg, reqStatus }) =>
  <div>
    {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Loading />}
    <Modal
      danger
      id='remove-resource-modal'
      open={open}
      primaryButtonText={msgs.get(label.primaryBtn, locale)}
      secondaryButtonText={msgs.get('modal.button.cancel', locale)}
      modalLabel={msgs.get(label.label, locale)}
      modalHeading={msgs.get(label.heading, locale)}
      onRequestClose={handleClose}
      onRequestSubmit={handleSubmit}
      role='region'
      aria-label={msgs.get(label.heading, locale)}>
      <div>
        {reqStatus === REQUEST_STATUS.ERROR &&
          <Notification
            kind='error'
            title=''
            subtitle={reqErrorMsg || msgs.get('error.default.description', locale)} />}
      </div>
      <p>
        {msgs.get('modal.remove.confirm', [name || Name], locale)}
      </p>
    </Modal>
  </div>

RemoveResourceModal.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string
  }),
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
  }),
  locale: PropTypes.string,
  open:  PropTypes.bool,
  reqErrorMsg:  PropTypes.string,
  reqStatus:  PropTypes.string,
}

const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSubmit: () => {
      dispatch(removeResource(ownProps.resourceType, ownProps.data))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: 'resource-remove'}))
    },
    receiveDelError: (resourceType, err) => {
      dispatch(receiveDelError(err, resourceType))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveResourceModal))

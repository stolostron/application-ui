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
import { Modal, Loading, Notification } from 'carbon-components-react'
import { Labels } from '../common/ModalFormItems'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { clearRequestStatus, updateModal, updateResourceLabels } from '../../actions/common'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {REQUEST_STATUS} from '../../actions'

resources(() => {
  require('../../../scss/label-editing-modal.scss')
})


class LabelEditingModal extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.state = {
      labels: [],
      newLabel: {},
      searchValue:''
    }
  }

  componentWillMount() {
    const { labels } = this.props.data.metadata
    if (labels) {
      const labelArray = this.convertObjectToArray(labels)
      this.setState({labels: labelArray})
    }
  }

  convertObjectToArray(input) {
    const resultArray = []
    Object.entries(input).forEach(([key, value]) => resultArray.push({key, value, formServer: true}))
    return resultArray
  }

  convertArrayToObject(input) {
    const resultObject = {}
    input.forEach(item => resultObject[item.key] = item.value)
    return resultObject
  }

  handleSubmitClick() {
    const { handleSubmit, data: {metadata: { name = '', namespace = ''}} } = this.props
    const labelObject = this.convertArrayToObject(this.state.labels)
    handleSubmit(labelObject, name, namespace)
  }

  onRemove(key) {
    this.setState(preState => {
      const existingLabels = [...preState.labels]
      const result = existingLabels.filter(label => label.key !== key)
      return { labels: result }
    })
  }

  onAdd = () => {
    if (this.state.newLabel) {
      this.setState(preState => {
        const existingLabels = [...preState.labels]
        if (preState.newLabel.key && preState.newLabel.value) {
          // check if target already exists in the state
          const labelIndex = existingLabels.findIndex(item => item.key === preState.newLabel.key)
          // label exists then update existing one
          if (labelIndex > -1) {
            if (existingLabels[labelIndex].formServer) {
              existingLabels[labelIndex] = {...existingLabels[labelIndex],
                updated: true,
                value: preState.newLabel.value
              }
            } else {
              existingLabels[labelIndex] = {...existingLabels[labelIndex],
                value: preState.newLabel.value
              }
            }
          } else {
            existingLabels.push({key: preState.newLabel.key, value: preState.newLabel.value})
          }
          return { labels: existingLabels, newLabel: {} }
        }
      })
    }
  }

  handleSearch = e => {
    if (e) {
      const searchValue = e.target.value
      this.setState({ searchValue })
    }
  }

  onTextInputChange = type => e => {
    if (e) {
      const nextValue = e.target.value
      this.setState(preState => {
        const newState= {...preState}
        newState.newLabel[type] = nextValue
        return newState
      })
    }
  }

  itemFilter(input, searchKey) {
    if (searchKey && searchKey.length > 0) {
      return input.filter(item => item && ((item.key && item.key.includes(searchKey)) || (item.value && item.value.includes(searchKey))))
    }
    return input
  }

  render(){
    const { handleClose, open, reqErrorMsg, reqStatus } = this.props
    return (
      <div>
        {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Loading />}
        <Modal
          id='label-editing-modal'
          className='modal-with-editor-and-list'
          open={open}
          modalHeading={ msgs.get('modal.label-editing.label', this.context.locale) }
          primaryButtonText={ msgs.get('actions.save', this.context.locale) }
          primaryButtonDisabled={false}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={ this.handleSubmitClick }
          onRequestClose={ handleClose }
        >
          {reqStatus === REQUEST_STATUS.ERROR &&
          <Notification
            kind='error'
            title=''
            subtitle={reqErrorMsg || msgs.get('error.default.description', this.context.locale)} />}
          <Labels
            type='labels'
            items={this.itemFilter(this.state.labels, this.state.searchValue)}
            newLabel={this.state.newLabel}
            addLabel={msgs.get('modal.form.action.editLabel', this.context.locale)}
            onRemove={this.onRemove}
            onAdd={this.onAdd}
            onTextInputChange={this.onTextInputChange}
            handleSearch={this.handleSearch}
            searchValue={this.state.searchValue}
          />
        </Modal>
      </div>
    )
  }
}

LabelEditingModal.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  open: PropTypes.bool,
  reqErrorMsg:  PropTypes.string,
  reqStatus:  PropTypes.string,
}


const mapStateToProps = state =>  {
  return state.modal
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType } = ownProps
  return {
    handleSubmit: (labels, name, namespace) => {
      dispatch(updateResourceLabels(resourceType, name, namespace, labels))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: 'label-editing'}))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LabelEditingModal))

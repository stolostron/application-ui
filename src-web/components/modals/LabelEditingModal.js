/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { Modal, Loading, Notification } from 'carbon-components-react'
import { Labels } from '../common/ModalFormItems'

resources(() => {
  require('../../../scss/label-editing-modal.scss')
})


class LabelEditingModal extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      errors: '',
      labels: [],
      loading: true,
      newLabel: {},
      onEdit: false,
      onEditValue: {},
      searchValue:'',
    }
  }

  componentWillMount() {
    const {resourceType, data: { namespace, name, clusterName } } = this.props
    apolloClient.getResource(resourceType, {namespace, name, clusterName})
      .then(response => {
        const { labels, name, namespace, selfLink } = response.data.items[0].metadata
        const labelArray = this.convertObjectToArray(labels)
        this.setState({
          loading: false,
          labels: labelArray,
          name,
          namespace,
          selfLink
        })
      })
  }

  convertObjectToArray(input) {
    const resultArray = []
    Object.entries(input).forEach(([key, value]) => resultArray.push({key, value, fromServer: true}))
    return resultArray
  }

  convertArrayToObject(input) {
    const resultObject = {}
    input.forEach(item => {
      if (!item.deleted){
        resultObject[item.key] = item.value
      }
    })
    return resultObject
  }

  handleClose() {
    const { type } = this.props
    this.client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: false,
        type: type,
        resourceType: {
          __typename: 'resourceType',
          name: '',
          list: ''
        },
        data: {
          __typename:'ModalData',
          name: '',
          namespace: '',
          clusterName: '',
          selfLink: ''
        }
      }
    })
  }

  handleSubmit() {
    const { resourceType } = this.props
    const { labels, name = '', namespace = '', selfLink = '' } = this.state
    const labelObject = this.convertArrayToObject(labels)
    this.setState({
      loading: true
    })
    return apolloClient.updateResourceLabels(resourceType.name, namespace, name, labelObject, selfLink, '/metadata/labels')
      .then(response => {
        if (response.errors) {
          this.setState({
            loading: false,
            errors: response.errors[0].message
          })
        } else {
          this.handleClose()
        }
      })
  }

  onRemove(key) {
    this.setState(preState => {
      const existingLabels = [...preState.labels]
      const labelIndex = existingLabels.findIndex(item => item.key === key)
      if (existingLabels[labelIndex].fromServer) {
        existingLabels[labelIndex] = {...existingLabels[labelIndex],
          deleted: true
        }
      }
      return { labels: existingLabels}
    })
  }

  onUndo = key => {
    this.setState(preState => {
      const existingLabels = [...preState.labels]
      const labelIndex = existingLabels.findIndex(item => item.key === key)
      if (existingLabels[labelIndex].fromServer) {
        existingLabels[labelIndex] = {...existingLabels[labelIndex],
          deleted: false
        }
      }
      return { labels: existingLabels}
    })
  }

  onAdd = update => () => {
    if (update) {
      if (this.state.onEditValue) {
        this.setState(preState => {
          const existingLabels = [...preState.labels]
          if (preState.onEditValue.key && preState.onEditValue.value) {
            const labelIndex = existingLabels.findIndex(item => item.key === preState.onEditValue.key)
            if (labelIndex > -1) {
              if (existingLabels[labelIndex].fromServer) {
                existingLabels[labelIndex] = {...existingLabels[labelIndex],
                  updated: true,
                  editable: false,
                  value: preState.onEditValue.value
                }
              } else {
                existingLabels[labelIndex] = {...existingLabels[labelIndex],
                  value: preState.onEditValue.value,
                  editable: false
                }
              }
            }
            return { labels: existingLabels, onEdit: false, onEditValue: {}}
          }
        })
      }
    } else {
      if (this.state.newLabel) {
        this.setState(preState => {
          const existingLabels = [...preState.labels]
          if (preState.newLabel.key && preState.newLabel.value) {
            // check if target already exists in the state
            const labelIndex = existingLabels.findIndex(item => item.key === preState.newLabel.key)
            // label exists then update existing one
            if (labelIndex > -1) {
              if (existingLabels[labelIndex].fromServer) {
                existingLabels[labelIndex] = {...existingLabels[labelIndex],
                  updated: true,
                  value: preState.newLabel.value
                }
              } else {
                existingLabels[labelIndex] = {...existingLabels[labelIndex],
                  value: preState.newLabel.value,
                }
              }
            } else {
              existingLabels.push({key: preState.newLabel.key, value: preState.newLabel.value})
            }
            return { labels: existingLabels, newLabel: {}}
          }
        })
      }
    }
  }

  handleSearch = e => {
    if (e) {
      const searchValue = e.target.value
      this.setState({ searchValue })
    }
  }

  onClickRow = key => {
    if (key && this.state.onEdit === false) {
      this.setState(preState => {
        const existingLabels = [...preState.labels]
        const labelIndex = existingLabels.findIndex(item => item.key === key)
        // label exists then update existing one
        if (labelIndex > -1) {
          if (existingLabels[labelIndex] && !existingLabels[labelIndex].deleted) {
            existingLabels[labelIndex] = {...existingLabels[labelIndex],
              editable: true,
            }
          }
          return { labels: existingLabels, onEdit: true, onEditValue: existingLabels[labelIndex] }
        }
      })
    }
  }

  onTextInputChange = (type, onEdit) => e => {
    if (e) {
      const nextValue = e.target.value
      this.setState(preState => {
        const newState= {...preState}
        if (onEdit) {
          newState.onEditValue[type] = nextValue
        } else {
          newState.newLabel[type] = nextValue
        }
        return newState
      })
    }
  }

  onTextInputSelect = (type) => value => {
    if (value) {
      this.setState(preState => {
        const newState= {...preState}
        newState.newLabel[type] = value
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
    const { open } = this.props
    const { errors, loading } = this.state
    return (
      <div>
        {loading && <Loading />}
        <Modal
          id='label-editing-modal'
          className='modal-with-editor-and-list'
          open={open}
          modalHeading={ msgs.get('modal.label-editing.label', this.context.locale) }
          primaryButtonText={ msgs.get('actions.save', this.context.locale) }
          primaryButtonDisabled={false}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={ this.handleSubmit.bind(this) }
          onRequestClose={ this.handleClose.bind(this) }
        >
          {errors !== ''
            ? <Notification
              kind='error'
              title=''
              subtitle={errors} />
            : null}
          <Labels
            type='labels'
            items={this.itemFilter(this.state.labels, this.state.searchValue)}
            newLabel={this.state.newLabel}
            addLabel={msgs.get('modal.form.action.editLabel', this.context.locale)}
            onRemove={this.onRemove.bind(this)}
            onUndo={this.onUndo.bind(this)}
            onAdd={this.onAdd.bind(this)}
            onTextInputChange={this.onTextInputChange.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
            searchValue={this.state.searchValue}
            onEditValue={this.state.onEditValue}
            onTextInputSelect={this.onTextInputSelect.bind(this)}
            onClickRow={this.onClickRow.bind(this)}
          />
        </Modal>
      </div>
    )
  }
}

LabelEditingModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  type: PropTypes.string
}

export default LabelEditingModal

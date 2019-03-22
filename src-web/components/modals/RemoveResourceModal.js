/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { Checkbox, Modal, Loading, Notification } from 'carbon-components-react'

class RemoveResourceModal extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      data: '',
      loading: true,
      selected: [],
    }
  }

  componentWillMount() {
    if (this.props.data.item !== '') {
      const { data } = this.props
      this.getChildResources(data)
      this.setState({
        data,
        loading: false,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== '' && nextProps.data !== this.props.data) {
      this.getChildResources(nextProps.data)
      this.setState({
        data: nextProps.data,
        loading: false
      })
    }
  }

  getChildResources(data) {
    const children = []
    // Create object specifying Application resources that can be deleted
    _.map(data.deployables, (curr, idx) => {
      children.push({
        id: idx + '-deployable-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [Deployable]',
        selected: true
      })
    })
    _.map(data.placementBindings, (curr, idx) => {
      children.push({
        id: idx + '-placementBinding-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [PlacementBinding]',
        selected: true
      })
    })
    _.map(data.placementPolicies, (curr, idx) => {
      children.push({
        id: idx + '-placementPolicy-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [PlacementPolicy]',
        selected: true
      })
    })
    _.map(data.applicationRelationships, (curr, idx) => {
      children.push({
        id: idx + '-appRelationship-' + curr.metadata.name,
        selfLink: curr.metadata.selfLink,
        label: curr.metadata.name + ' [ApplicationRelationship]',
        selected: true
      })
    })
    if (children.length > 0 && this.state.selected.length < 1) {
      this.setState({selected: children})
    }
  }

  toggleSelected = (i, target) => {
    this.setState((prevState) => {
      const currState = prevState.selected
      const index = currState.findIndex(item => item.id === target)
      currState[index].selected = !currState[index].selected
      return currState
    })
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
          item: ''
        }
      }
    })
  }

  handleSubmit() {
    const { resourceType } = this.props
    const { data } = this.state
    data.selected = this.state.selected
    this.setState({
      loading: true
    })
    apolloClient.remove(resourceType, data).then(res => {
      if (res.errors) {
        this.setState({
          loading: false,
          submitErrors: res.errors[0].message
        })
      } else {
        this.handleClose()
      }
    })
  }

  modalBody = (data, label, locale) => {
    const name = data !== '' ? data.name || data.Name || data.metadata.name : ''
    switch (label.label) {
    case 'modal.remove-hcmapplication.label':
    case 'modal.remove-hcmcompliance.label':
      return this.state.selected.length > 0
        ? <div className='remove-app-modal-content' >
          <div className='remove-app-modal-content-text' >
            {msgs.get('modal.remove.application.confirm', [name], locale)}
          </div>
          <div>
            {this.state.selected.map((child) => {
              return (
                <div className='remove-app-modal-content-data' key={child.id} >
                  <Checkbox
                    id={child.id}
                    checked={this.state.selected.some((i) => {return (i.id === child.id && child.selected === true)})}
                    onChange={this.toggleSelected}
                    labelText={child.label}
                    aria-label={child.id} />
                </div>
              )}
            )}
          </div>
        </div>
        : <p>
          {msgs.get('modal.remove.confirm', [name], locale)}
        </p>
    default:
      return (
        <p>
          {msgs.get('modal.remove.confirm', [name], locale)}
        </p>
      )}
  }

  render() {
    const { label, locale, open } = this.props
    const { data, loading, submitErrors } = this.state
    return (
      <div>
        {loading && <Loading />}
        <Modal
          danger
          id='remove-resource-modal'
          open={open}
          primaryButtonText={msgs.get(label.primaryBtn, locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalLabel={msgs.get(label.label, locale)}
          modalHeading={msgs.get(label.heading, locale)}
          onRequestClose={this.handleClose.bind(this)}
          onRequestSubmit={this.handleSubmit.bind(this)}
          role='region'
          aria-label={msgs.get(label.heading, locale)}>
          <div>
            {submitErrors &&
              <Notification
                kind='error'
                title=''
                subtitle={submitErrors || msgs.get('error.default.description', locale)} />}
          </div>
          {this.modalBody(data, label, locale)}
        </Modal>
      </div>
    )
  }
}

RemoveResourceModal.propTypes = {
  data: PropTypes.object,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
  }),
  locale: PropTypes.string,
  open:  PropTypes.bool,
  resourceType: PropTypes.object,
  type: PropTypes.string
}

export default RemoveResourceModal

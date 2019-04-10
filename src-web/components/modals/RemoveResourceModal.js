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
      name: '',
      namespace: '',
      cluster: '',
      selfLink: '',
      errors: '',
      loading: true,
      selected: [],
    }
  }

  componentWillMount() {
    if (this.props.data) {
      const { data } = this.props
      this.getChildResources(data.name, data.namespace, data.clusterName)
      this.setState({
        name: data.name,
        namespace: data.namespace,
        cluster: data.clusterName,
        selfLink: data.selfLink
      })
    }
  }

  getChildResources(name, namespace, cluster) {
    const children = []
    const { resourceType } = this.props
    resourceType.name === 'HCMApplication' || resourceType.name === 'HCMCompliance'
      ? apolloClient.getResource(resourceType, {namespace, name, cluster})
        .then(response => {
          const resourceData = response.data.items[0]
          // Create object specifying Application/Compliance resources that can be deleted
          _.map(resourceData.deployables, (curr, idx) => {
            children.push({
              id: idx + '-deployable-' + curr.metadata.name,
              selfLink: curr.metadata.selfLink,
              label: curr.metadata.name + ' [Deployable]',
              selected: true
            })
          })
          _.map(resourceData.placementBindings, (curr, idx) => {
            children.push({
              id: idx + '-placementBinding-' + curr.metadata.name,
              selfLink: curr.metadata.selfLink,
              label: curr.metadata.name + ' [PlacementBinding]',
              selected: true
            })
          })
          _.map(resourceData.placementPolicies, (curr, idx) => {
            children.push({
              id: idx + '-placementPolicy-' + curr.metadata.name,
              selfLink: curr.metadata.selfLink,
              label: curr.metadata.name + ' [PlacementPolicy]',
              selected: true
            })
          })
          _.map(resourceData.applicationRelationships, (curr, idx) => {
            children.push({
              id: idx + '-appRelationship-' + curr.metadata.name,
              selfLink: curr.metadata.selfLink,
              label: curr.metadata.name + ' [ApplicationRelationship]',
              selected: true
            })
          })
          this.setState({
            selected: children,
            loading: false
          })
        })
      : this.setState({
        loading: false
      })
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
          name: '',
          namespace: '',
          clusterName: '',
          selfLink: ''
        }
      }
    })
  }

  handleSubmit() {
    const { selected, selfLink, name, namespace, cluster } = this.state
    this.setState({
      loading: true
    })
    if (!selfLink || selfLink === '') {
      const { resourceType } = this.props
      if (resourceType.name === 'HCMRelease') {
        apolloClient.remove({kind: 'release', name, namespace, cluster}).then(res => {
          if (res.errors) {
            this.setState({
              loading: false,
              errors: res.errors[0].message
            })
          } else {
            this.handleClose()
          }
        })
      } else {
        this.setState({
          errors: msgs.get('modal.errors.querying.resource', this.context.locale)
        })
      }
    } else {
      apolloClient.remove({selfLink, childResources: selected || []}).then(res => {
        if (res.errors) {
          this.setState({
            loading: false,
            errors: res.errors[0].message
          })
        } else {
          this.handleClose()
        }
      })
    }
  }

  modalBody = (name, label, locale) => {
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
    const { name, loading, errors } = this.state
    const bodyLabel = msgs.get(label.label, locale) || msgs.get('modal.remove.resource', locale)
    const heading = msgs.get(label.heading, locale)
    return (
      <div>
        {loading && <Loading />}
        <Modal
          danger
          id='remove-resource-modal'
          open={open}
          primaryButtonText={msgs.get(label.primaryBtn, locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalLabel={bodyLabel}
          modalHeading={heading}
          onRequestClose={this.handleClose.bind(this)}
          onRequestSubmit={this.handleSubmit.bind(this)}
          role='region'
          aria-label={heading}>
          <div>
            {(errors !== '' && errors !== undefined)
              ? <Notification
                kind='error'
                title=''
                subtitle={errors} />
              : null}
          </div>
          {this.modalBody(name, label, locale)}
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

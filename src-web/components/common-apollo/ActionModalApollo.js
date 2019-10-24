/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import React from 'react'
import loadable from 'loadable-components'
import { GET_ACTION_MODAL_STATE } from '../../apollo-client/queries/StateQueries'
import { Query } from 'react-apollo'
import { getIcamLinkForSubscription } from '../common/ResourceDetails/utils'

let RemoveResourceModal
let LabelEditingModal
let ResourceModal
let LogsModal

class ActionModalApollo extends React.PureComponent {
  getMatchedModal = ({ type, resourceType, open, data }) => {
    // remove the typename field
    resourceType = { name: resourceType.name, list: resourceType.list }
    switch (type) {
    case 'table.actions.edit': {
      return (
        open &&
          this.getResourceModal({
            open: true,
            type: 'resource-edit',
            action: 'put',
            resourceType,
            editorMode: 'json',
            label: {
              primaryBtn: 'modal.button.submit',
              label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }
    case 'table.actions.applications.perfmon': {
      const link = getIcamLinkForSubscription(data._uid, data.clusterName)

      window.open(link, '_blank')
      return null
    }
    case 'table.actions.applications.remove':
    case 'table.actions.compliance.remove':
    case 'table.actions.policy.remove':
    case 'table.actions.remove': {
      return (
        open &&
          this.getRemoveResourceModal({
            open: true,
            type: 'resource-remove',
            resourceType,
            label: {
              primaryBtn: `modal.remove-${resourceType.name.toLowerCase()}.heading`,
              label: `modal.remove-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.remove-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }
    case 'table.actions.cluster.edit.labels': {
      return (
        open &&
          this.getLabelEditingModal({
            open: true,
            type: 'label-editing',
            action: 'put',
            resourceType,
            label: {
              primaryBtn: 'modal.button.submit',
              label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }
    case 'table.actions.pod.logs': {
      return (
        open &&
          this.getLogsModal({
            open: true,
            type: 'view-logs',
            resourceType,
            data: data
          })
      )
    }
    default:
      return null
    }
  };

  getLogsModal = props => {
    LogsModal =
      LogsModal === undefined
        ? loadable(() =>
            import(/* webpackChunkName: "logs-modal" */ '../modals/LogsModal')
        )
        : LogsModal
    return this.getModal(LogsModal, props)
  };

  getResourceModal = props => {
    ResourceModal =
      ResourceModal === undefined
        ? loadable(() =>
            import(/* webpackChunkName: "edit-resource-modal" */ '../modals/ResourceModal')
        )
        : ResourceModal
    return this.getModal(ResourceModal, props)
  };

  getRemoveResourceModal = props => {
    RemoveResourceModal =
      RemoveResourceModal === undefined
        ? loadable(() =>
            import(/* webpackChunkName: "remove-resource-modal" */ '../modals/RemoveResourceModal')
        )
        : RemoveResourceModal
    return this.getModal(RemoveResourceModal, props)
  };

  getLabelEditingModal = props => {
    LabelEditingModal =
      LabelEditingModal === undefined
        ? loadable(() =>
            import(/* webpackChunkName: "label-editing-modal" */ '../modals/LabelEditingModal')
        )
        : LabelEditingModal
    return this.getModal(LabelEditingModal, props)
  };

  getModal = (Component, props) => <Component {...props} />;

  render() {
    return (
      <Query query={GET_ACTION_MODAL_STATE}>
        {({ data }) => {
          if (_.get(data, 'actionModal.open')) {
            return this.getMatchedModal(_.get(data, 'actionModal'))
          } else {
            return null
          }
        }}
      </Query>
    )
  }
}

export default ActionModalApollo

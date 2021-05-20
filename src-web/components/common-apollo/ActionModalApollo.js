/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import loadable from '@loadable/component'
import { GET_ACTION_MODAL_STATE } from '../../apollo-client/queries/StateQueries'
import { Query } from 'react-apollo'

let RemoveResourceModal
let SyncResourceModal

class ActionModalApollo extends React.PureComponent {
  getMatchedModal = ({ type, resourceType, open, data }) => {
    switch (type) {
    case 'table.actions.applications.remove':
    case 'table.actions.subscriptions.remove':
    case 'table.actions.placementrules.remove':
    case 'table.actions.channels.remove':
    case 'table.actions.remove': {
      return (
        open &&
          this.getRemoveResourceModal({
            open: true,
            type: 'resource-remove',
            resourceType,
            label: {
              primaryBtn: 'modal.remove.submit',
              label: `modal.remove-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.remove-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }

    case 'actions.sync.application': {
      return (
        open &&
          this.getSyncResourceModal({
            open: true,
            type: 'resource-sync',
            resourceType,
            label: {
              primaryBtn: 'modal.sync.submit',
              label: `modal.sync-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.sync-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }

    default:
      return null
    }
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

  getSyncResourceModal = props => {
    SyncResourceModal =
      SyncResourceModal === undefined
        ? loadable(() =>
            import(/* webpackChunkName: "sync-resource-modal" */ '../modals/SyncResourceModal')
        )
        : SyncResourceModal
    return this.getModal(SyncResourceModal, props)
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

ActionModalApollo.contextTypes = {
  locale: PropTypes.string
}

ActionModalApollo.propTypes = {
  locale: PropTypes.string
}

export default ActionModalApollo

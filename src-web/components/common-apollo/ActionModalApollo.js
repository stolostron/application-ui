/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import loadable from 'loadable-components'
import { GET_ACTION_MODAL_STATE } from '../../apollo-client/queries/StateQueries'
import { Query } from 'react-apollo'
import { getICAMLinkForApp } from '../common/ResourceDetails/utils'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

let RemoveResourceModal
let ResourceModal
let LogsModal

class ActionModalApollo extends React.PureComponent {
  getMatchedModal = ({ type, resourceType, open, data }) => {
    // remove the typename field
    if (resourceType.name == RESOURCE_TYPES.QUERY_APPLICATIONS.name) {
      resourceType = RESOURCE_TYPES.HCM_APPLICATIONS //use hcm app to edit, delete selection
    }
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
    case 'table.actions.applications.edit': {
      return (
        open &&
          this.getResourceModal({
            open: true,
            type: 'resource-edit',
            action: 'put',
            resourceType,
            editorMode: 'yaml',
            label: {
              primaryBtn: 'modal.button.submit',
              label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
              heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
            },
            data: data
          })
      )
    }
    case 'table.actions.applications.icam': {
      //the account id is stored under the kind attribute
      const link = getICAMLinkForApp(
        data._uid,
        data.name,
        data.clusterName,
        data.kind
      )
      window.open(link, '_blank')
      return null
    }
    case 'table.actions.applications.grafana': {
      window.open(data.dashboard, '_blank')
      return null
    }
    case 'table.actions.applications.remove':
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
  namespaceAccountId: PropTypes.string
}

export default ActionModalApollo

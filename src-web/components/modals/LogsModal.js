/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import ScrollBox from './ScrollBox'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import {
  Modal,
  DropdownV2,
  Loading,
  Notification
} from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

resources(() => {
  require('../../../scss/logs.scss')
})

class LogsModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      loading: true,
      loadingLogs: true,
      errors: ''
    }
  }

  componentWillMount() {
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      const intervalId = setInterval(
        this.reload.bind(this),
        config['featureFlags:liveUpdatesPollInterval']
      )
      this.setState({ intervalId: intervalId })
    }
    const { resourceType, data: { namespace, name, clusterName } } = this.props
    apolloClient
      .getResource(resourceType, { namespace, name, clusterName })
      .then(response => {
        const item = response.data.items[0]
        this.setState({
          loading: false,
          selectedContainer: item.containers[0].name,
          containers: item.containers,
          podName: item.metadata.name,
          podNamespace: item.metadata.namespace,
          clusterName: item.cluster.metadata.name
        })
        this.fetchLogs(
          item.containers[0].name,
          item.metadata.name,
          item.metadata.namespace,
          item.cluster.metadata.name
        )
      })
  }

  fetchLogs(containerName, podName, podNamespace, clusterName) {
    return apolloClient
      .getLogs(containerName, podName, podNamespace, clusterName)
      .then(result => {
        if (result.data.logs.errors && result.data.logs.errors.length > 0) {
          this.setState({
            loadingLogs: false
          })
          return result.data.logs.errors[0]
        } else {
          this.setState({
            logs: result.data.logs,
            loadingLogs: result.loading
          })
        }
      })
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  handleClose() {
    const { type } = this.props

    if (this.client) {
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
            __typename: 'ActionModalData',
            name: '',
            namespace: '',
            clusterName: '',
            selfLink: '',
            _uid: '',
            kind: ''
          }
        }
      })
    }
  }

  render() {
    const { open } = this.props,
          { containers, loadingLogs, logs, podName, errors } = this.state,
          { locale } = this.context

    return (
      <Modal
        id="view-logs-modal"
        className="logs"
        open={open}
        passiveModal
        modalLabel="Pod"
        modalHeading={podName}
        primaryButtonDisabled
        onRequestClose={this.handleClose.bind(this)}
        role="region"
        aria-label="logs"
      >
        <div className="logs-container">
          {errors !== '' && errors !== undefined ? (
            <Notification kind="error" title="" subtitle={errors} />
          ) : null}
          <div className="logs-container__actions">
            <div className="dropdown-container">
              <DropdownV2
                ariaLabel={msgs.get('dropdown.pod.label', locale)}
                label={containers ? containers[0].name : ''}
                onChange={this.handleContainerChange.bind(this)}
                items={
                  containers
                    ? containers.map((container, index) => ({
                      id: `${container.name}-${index}`,
                      label: container.name,
                      value: container.name
                    }))
                    : []
                }
              />
            </div>
          </div>

          {(() => {
            if (loadingLogs) {
              return (
                <Loading withOverlay={false} className="content-spinner" />
              )
            }
            return (
              <ScrollBox className="logs-container__content" content={logs} />
            )
          })()}
        </div>
      </Modal>
    )
  }

  handleContainerChange(data) {
    const containerName = data.selectedItem.label
    const { loading } = this.state
    this.setState({
      loadingLogs: true,
      selectedContainer: containerName
    })
    if (!loading) {
      const { podName, podNamespace, clusterName } = this.state
      this.fetchLogs(containerName, podName, podNamespace, clusterName)
    }
  }

  reload() {
    const {
      clusterName,
      loading,
      podName,
      podNamespace,
      selectedContainer
    } = this.state
    if (!loading) {
      this.fetchLogs(selectedContainer, podName, podNamespace, clusterName)
    }
  }
}

LogsModal.contextTypes = {
  locale: PropTypes.string
}

LogsModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  type: PropTypes.string
}

export default LogsModal

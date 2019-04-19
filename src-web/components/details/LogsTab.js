/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ScrollBox from '../modals/ScrollBox'
import apolloClient from '../../../lib/client/apollo-client'
import { DropdownV2, Loading, Notification } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

resources(() => {
  require('../../../scss/logs.scss')
})

class LogsTab extends React.Component {

  static propTypes = {
    cluster: PropTypes.string,
    name: PropTypes.string,
    namespace: PropTypes.string,
    resourceJson: PropTypes.object,
    resourceLoading: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      loading: false,
      errors: ''
    }
  }

  componentDidMount() {
    const { resourceJson } = this.props
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      const intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      /* eslint-disable-next-line react/no-did-mount-set-state */
      this.setState({ intervalId })
    }

    if (_.get(resourceJson, 'spec.containers')) {
      /* eslint-disable-next-line react/no-did-mount-set-state */
      this.setState({
        loading: true,
        selectedContainer: resourceJson.spec.containers[0].name
      }, () => this.fetchLogs())
    }
  }

  componentDidUpdate(prevProps) {
    const { resourceJson, resourceLoading } = this.props
    if (prevProps.resourceJson !== resourceJson && !resourceLoading) {
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState({
        loading: true,
        selectedContainer: resourceJson.spec.containers[0].name
      }, () => this.fetchLogs())
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const { resourceJson, resourceLoading } = this.props
    const { selectedContainer, loading, logs, errors } = this.state
    const { locale } = this.context

    return (
      <div className='details-logs'>
        {(errors !== '' && errors !== undefined)
          ? <Notification
            kind='error'
            title=''
            subtitle={errors} />
          : null}

        {(() => {
          if (resourceLoading || loading)
            return <Loading withOverlay={false} className='content-spinner' />

          return (
            <React.Fragment>
              <div className='details-logs-dropdowns'>
                <DropdownV2
                  ariaLabel={msgs.get('dropdown.pod.label', locale)}
                  light
                  label={selectedContainer}
                  onChange={this.handleContainerChange.bind(this)}
                  items={resourceJson ? resourceJson.spec.containers.map((container, index) => ({ id: `${container.name}-${index}`, label: container.name, value: container.name})) : []} />
              </div>
              <ScrollBox className='logs-container__content' content={logs} />
            </React.Fragment>
          )
        })()}
      </div>
    )
  }

  fetchLogs() {
    const { cluster, namespace, name } = this.props
    const { selectedContainer } = this.state
    return apolloClient.getLogs(selectedContainer, name, namespace, cluster).then(result => {
      if (result.errors && result.errors.length > 0){
        this.setState({ errors: result.errors[0].message, loading: false })
      } else {
        this.setState({
          logs: result.data.logs,
          loading: false
        })
      }
    })
  }

  handleContainerChange(data) {
    const containerName = data.selectedItem.value
    this.setState({
      logs: '',
      loading: true,
      errors: '',
      selectedContainer: containerName,
    }, () => this.fetchLogs())
  }

  reload() {
    if (!this.state.loading)
      this.fetchLogs()
  }
}

LogsTab.contextTypes = {
  locale: PropTypes.string
}

export default LogsTab

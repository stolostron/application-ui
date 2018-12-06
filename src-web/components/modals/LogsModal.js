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
import ScrollBox from './ScrollBox'
import { Modal, DropdownV2, Loading } from 'carbon-components-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchLogs, resetLogs } from '../../actions/logs'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { REQUEST_STATUS } from '../../actions/index'
import resources from '../../../lib/shared/resources'
import { updateModal } from '../../actions/common'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

resources(() => {
  require('../../../scss/logs.scss')
})

class LogsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedContainer: props.containerName,
      xhrPoll: false
    }
  }

  componentWillMount() {
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      const intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      this.setState({ intervalId: intervalId })
    }
  }

  componentDidMount() {
    const { containerName, podName, podNamespace, clusterName } = this.props
    this.props.fetchLogs(containerName, podName, podNamespace, clusterName)
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
    this.props.resetLogs()
  }

  render() {
    const { logs, status, containers, podName } = this.props,
          { xhrPoll } = this.state,
          { locale } = this.context

    return (
      <Modal
        id='view-logs-modal'
        className='logs'
        open={open}
        passiveModal
        modalLabel='Pod'
        modalHeading={podName}
        primaryButtonDisabled
        onRequestClose={this.props.handleClose}
        role='region'
        aria-label='logs'>
        <div className='logs-container'>
          <div className='logs-container__actions'>
            <div className='dropdown-container'>
              <DropdownV2
                ariaLabel={msgs.get('dropdown.pod.label', locale)}
                label={containers[0].name}
                onChange={this.handleContainerChange.bind(this)}
                items={containers.map((container, index) => ({ id: `${container.name}-${index}`, label: container.name, value: container.name}))} />
            </div>
          </div>

          {(() => {
            if (!xhrPoll && status !== REQUEST_STATUS.DONE) {
              return <Loading withOverlay={false} className='content-spinner' />
            }
            return <ScrollBox className='logs-container__content' content={logs} />
          })()}
        </div>
      </Modal>
    )
  }

  handleContainerChange(data) {
    const containerName = data.selectedItem.label,
          { fetchLogs, status } = this.props
    this.setState({
      xhrPoll: false,
      selectedContainer: containerName,
    })
    if (status === REQUEST_STATUS.DONE) {
      const { podName, podNamespace, clusterName } = this.props
      fetchLogs(containerName, podName, podNamespace, clusterName)
    }
  }

  reload() {
    const { selectedContainer } = this.state
    const { podName, podNamespace, clusterName } = this.props
    if (this.props.status === REQUEST_STATUS.DONE) {
      this.setState({ xhrPoll: true })
      this.props.fetchLogs(selectedContainer, podName, podNamespace, clusterName)
    }
  }
}

LogsModal.contextTypes = {
  locale: PropTypes.string
}

LogsModal.propTypes = {
  clusterName: PropTypes.string,
  containerName: PropTypes.string,
  containers: PropTypes.array,
  fetchLogs: PropTypes.func,
  handleClose: PropTypes.func,
  logs: PropTypes.string,
  podName: PropTypes.string,
  podNamespace: PropTypes.string,
  resetLogs: PropTypes.func,
  status: PropTypes.string,
}


const mapStateToProps = (state, ownProps) => {
//   const { logs } = formattedLogData(state, {'storeRoot': RESOURCE_TYPES.LOGS.name})
  return {
    logs: state.logs && state.logs.data,
    status: state.logs && state.logs.status,
    containers: ownProps.data.containers,
    containerName: ownProps.data.containers[0].name,
    podName: ownProps.data.metadata.name,
    podNamespace: ownProps.data.metadata.namespace,
    clusterName: ownProps.data.cluster.metadata.name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClose: () => dispatch(updateModal({open: false, type: 'view-logs'})),
    fetchLogs: (containerName, podName, podNamespace, clusterName) => dispatch(fetchLogs(containerName, podName, podNamespace, clusterName)),
    resetLogs: () => dispatch(resetLogs(RESOURCE_TYPES.LOGS)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LogsModal))

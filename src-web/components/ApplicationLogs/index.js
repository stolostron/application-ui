/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import React from '../../../node_modules/react'
import msgs from '../../../nls/platform.properties'
import { Icon, Loading, DropdownV2 } from 'carbon-components-react'
import ScrollBox from '../modals/ScrollBox'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import resources from '../../../lib/shared/resources'
import {
  createPodsList,
  createContainersList,
  handlePodChange,
  handleContainerChange,
  getPodsFromApplicationRelated
} from './utils'
import {
  fetchContainersForPod,
  fetchLogsForContainer
} from '../../reducers/reducerAppLogs'
import apolloClient from '../../../lib/client/apollo-client'
import R from 'ramda'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    fetchContainersForPod: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchContainersForPod(apolloClient, selfLink, namespace, name, cluster)
      ),
    fetchLogsForContainer: (
      containerName,
      podName,
      podNamespace,
      clusterName
    ) =>
      dispatch(
        fetchLogsForContainer(
          apolloClient,
          containerName,
          podName,
          podNamespace,
          clusterName
        )
      )
  }
}

const mapStateToProps = state => {
  const { AppLogs, HCMApplicationList } = state
  return {
    podData: getPodsFromApplicationRelated(HCMApplicationList),
    containerData: AppLogs.containerData,
    logData: AppLogs.logData,
    currentSelectedPod: AppLogs.currentSelectedPod,
    currentSelectedContainer: AppLogs.currentSelectedContainer,
    logLoading: AppLogs.logLoading
  }
}

class ApplicationLogs extends React.Component {
  render() {
    const { locale } = this.context
    const {
      serverProps,
      actions,
      fetchContainersForPod,
      fetchLogsForContainer,
      podData,
      containerData,
      logData,
      currentSelectedPod,
      currentSelectedContainer,
      logLoading
    } = this.props
    const podItems = createPodsList(podData, [])
    const containerItems = createContainersList(containerData, [])

    return (
      <div id="ApplicationLogs">
        <div className="dropdown-container">
          <div className="dropdown-pods-list">
            <DropdownV2
              ariaLabel={msgs.get('dropdown.pod.label', locale)}
              light
              disabled={R.isEmpty(podItems)}
              label={msgs.get('description.title.selectPod', locale)}
              onChange={event =>
                handlePodChange(
                  event,
                  fetchContainersForPod,
                  podData,
                  actions.setCurrentPod
                )
              }
              items={podItems}
            />
          </div>
          <span className="dropdown-divider">
            {msgs.get('tabs.logs.dropdown.divider')}
          </span>
          <div className="dropdown-containers-list">
            <DropdownV2
              ariaLabel={msgs.get('dropdown.pod.label', locale)}
              light
              disabled={R.isEmpty(containerItems)}
              label={msgs.get('description.title.selectContainer', locale)}
              onChange={event =>
                handleContainerChange(
                  event,
                  fetchLogsForContainer,
                  podData,
                  containerData,
                  actions.setCurrentContainer,
                  currentSelectedPod
                )
              }
              items={containerItems}
              selectedItem={currentSelectedContainer}
            />
          </div>
          {serverProps && serverProps.isKibanaRunning &&
            <div className="view-external-container">
              <p className="viewExternalIconTitle">
                <a href="/kibana" target="_blank">
                  {msgs.get('tabs.logs.viewExternal')}
                </a>
              </p>
              <a href="/kibana" target="_blank">
                <Icon
                  name="icon--launch"
                  fill="#6089bf"
                  description=""
                  className="viewExternalIcon"
                />
              </a>
            </div>
          }
        </div>
        {currentSelectedContainer && logLoading ? (
          <div className="logs-loading-box">
            <Loading withOverlay={false} />
          </div>
        ) : (
          <ScrollBox className="logs-container__content" content={logData} />
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationLogs)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import React from '../../../node_modules/react'
import msgs from '../../../nls/platform.properties'
import { Icon } from 'carbon-components-react'
import ScrollBox from '../modals/ScrollBox'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import { DropdownV2 } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import { handlePodChange, handleContainerChange } from './utils'
import { fetchContainersForPod } from '../../reducers/reducerAppLogs'
import apolloClient from '../../../lib/client/apollo-client'
import { getPodsFromApplicationRelated } from './utils'

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
      )
  }
}

const mapStateToProps = state => {
  const { AppLogs, HCMApplicationList } = state
  return {
    podData: getPodsFromApplicationRelated(HCMApplicationList),
    containerData: AppLogs.containerData,
    currentSelectedPod: AppLogs.currentSelectedPod,
    currentSelectedContainer: AppLogs.currentSelectedContainer
  }
}

const createPodsList = (podData, podsList) => {
  if (podData && podData[0]) {
    podData[0].items.map((item, i) => {
      podsList[i] = item.name
    })
  }
  return podsList
}

const createContainersList = (containerData, containersList) => {
  if (containerData && containerData.data && containerData.data.getResource && containerData.data.getResource.spec && containerData.data.getResource.spec.containers) {
    containerData.data.getResource.spec.containers.map((item, i) => {
      containersList[i] = item.name
    })
  }
  return containersList
}

const isObjEmpty = (obj) => {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

class ApplicationLogs extends React.Component {
  render() {
    const { locale } = this.context
    const {
      actions,
      fetchContainersForPod,
      podData,
      containerData,
      currentSelectedPod,
      currentSelectedContainer,
    } = this.props

    const podItems = createPodsList(podData, [])
    const containerItems = createContainersList(containerData, [])
    const logsContent = 'Testing logs...'
    // console.log("1", currentSelectedPod)
    // console.log("2", currentSelectedContainer)
    // console.log("1a", podItems)
    // console.log("2a", containerItems)

    return (
      <React.Fragment>
        <div id="ApplicationLogs">
          <div className="dropdown-container">
            <div className="dropdown-pods-list">
              <DropdownV2
                ariaLabel={msgs.get('dropdown.pod.label', locale)}
                light
                label={currentSelectedPod}
                onChange={event =>
                  handlePodChange(
                    event,
                    fetchContainersForPod,
                    podData,
                    actions.setCurrentPod,
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
                disabled={isObjEmpty(containerItems)}
                label={currentSelectedContainer}
                onChange={event =>
                  handleContainerChange(
                    event,
                    containerData,
                    actions.setCurrentContainer,
                  )
                }
                items={containerItems}
              />
            </div>
            <div className="view-external-container">
              <p className="viewExternalIconTitle">
                {msgs.get('tabs.logs.viewExternal')}
              </p>
              <Icon
                name="icon--launch"
                fill="#6089bf"
                description=""
                className="viewExternalIcon"
              />
            </div>
          </div>
          <ScrollBox
            className="logs-container__content"
            content={logsContent}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationLogs)

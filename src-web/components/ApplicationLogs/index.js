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
import { handlePodChange } from './utils'
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
  const applicationName =
    HCMApplicationList &&
    HCMApplicationList.items &&
    HCMApplicationList.items[0] &&
    HCMApplicationList.items[0].name
  return {
    podData: getPodsFromApplicationRelated(HCMApplicationList),
    currentSelectedPod: AppLogs.currentSelectedPod,
    currentApplication: applicationName || ''
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

class ApplicationLogs extends React.Component {
  render() {
    const { locale } = this.context
    const {
      podData,
      actions,
      fetchContainersForPod,
      currentSelectedPod,
      currentApplication
    } = this.props

    const podItems = createPodsList(podData, [])
    const containerItems = ['container1', 'container2', 'container3']
    const logsContent = 'Testing logs...'

    // // For these 4 guys here you are going to need to determine their values
    // // based on the currentSelectedPod.
    // // However currentSelectedPod doesn't contain these values because currently
    // // its just the name.
    // // There are two ways you go about solving this.
    // // 1 - Write an additional util function that takes in podData and currentSelectedPod
    // //     and searches through podData to find the matching POD and then return the
    // //     object so you can extract those values.
    // // 2 - You can modify the setCurrentPod action and the SET_CURRENT_SELECTED_POD case
    // //     to do this logic for you to where currentSelectedPod is no longer just a name
    // //     but an OBJECT that contains the name as well as this data.
    // //     Now that I'm writing all this I think thats what I would do, because you
    // //     never know if and when you might need taht data elsewhere. But I wanted
    // //     to explain the two options.
    // const podSelfLink = 'something'
    // const podNamespace = 'something'
    // const podName = 'something'
    // const podCluster = 'something'

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
                    // podSelfLink,
                    // podNamespace,
                    // podName,
                    // podCluster,
                    podData,
                    apolloClient,
                    fetchContainersForPod,
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
                label="Containers"
                // onChange={this.handleContainerChange.bind(this)}
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

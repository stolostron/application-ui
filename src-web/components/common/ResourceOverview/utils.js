/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import _ from 'lodash'

import React from 'react'
import { SkeletonText } from 'carbon-components-react'
import { Module } from 'carbon-addons-cloud-react'

import { UPDATE_ACTION_MODAL } from '../../../apollo-client/queries/StateQueries'
import msgs from '../../../../nls/platform.properties'

export const kindsToExcludeForDeployments = [
  'cluster',
  'subscription',
  'channel',
  'events',
  'application',
  'deployable',
  'placementbinding',
  'placementrule',
  'placementpolicy',
  'applicationrelationship',
  'vulnerabilitypolicy',
  'mutationpolicy'
]

const getRemoteSubsCounts = (
  subData,
  allSubscriptions,
  failedSubsCount,
  noStatusSubsCount
) => {
  Object.keys(subData).forEach(key => {
    if (key === 'Failed') {
      failedSubsCount = subData[key]
    } else if (key === 'Subscribed') {
      allSubscriptions = subData[key]
    } else {
      // All statuses that are neither "Failed" or "Subscribed" belong to "No status"
      noStatusSubsCount += subData[key]
    }
  })
  allSubscriptions += failedSubsCount + noStatusSubsCount

  return [allSubscriptions, failedSubsCount, noStatusSubsCount]
}

export const getSubscriptionDataOnManagedClustersSingle = (
  applications,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    let managedClusterCount = 0
    let allSubscriptions = 0
    let failedSubsCount = 0
    let noStatusSubsCount = 0

    Object.keys(applications.items).forEach(appIndex => {
      // Get subscription data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace
      ) {
        if (applications.items[appIndex].clusterCount !== undefined) {
          managedClusterCount = applications.items[appIndex].clusterCount
        }
        // Increment counts if the data exists
        if (applications.items[appIndex].remoteSubscriptionStatusCount) {
          const countData = getRemoteSubsCounts(
            applications.items[appIndex].remoteSubscriptionStatusCount,
            allSubscriptions,
            failedSubsCount,
            noStatusSubsCount
          )
          allSubscriptions = countData[0]
          failedSubsCount = countData[1]
          noStatusSubsCount = countData[2]
        }
      }
    })

    return {
      clusters: managedClusterCount,
      total: allSubscriptions,
      failed: failedSubsCount,
      noStatus: noStatusSubsCount
    }
  }
  // data is undefined... -1 is used to identify when skeleton text load bar should appear
  return {
    clusters: -1
  }
}

const getSubObjs = (subData, allSubscriptions, allChannels) => {
  Object.keys(subData).forEach(subIndex => {
    const subObj = {
      status: subData[subIndex].status,
      id: subData[subIndex]._uid
    }
    allSubscriptions = allSubscriptions.concat(subObj)
    allChannels = allChannels.concat(subData[subIndex].channel)
  })
  return [allSubscriptions, allChannels]
}

export const getSubscriptionDataOnHub = (
  applications,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    let allSubscriptions = []
    let failedSubsCount = 0
    let noStatusSubsCount = 0
    let allChannels = []

    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).forEach(appIndex => {
        // Get subscription data for the current application opened
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace &&
          applications.items[appIndex].hubSubscriptions
        ) {
          const subObjs = getSubObjs(
            applications.items[appIndex].hubSubscriptions,
            allSubscriptions,
            allChannels
          )
          allSubscriptions = subObjs[0]
          allChannels = subObjs[1]
        }
      })
    } else {
      // Root application view
      // Get subscription data for all applications
      Object.keys(applications.items).forEach(appIndex => {
        if (applications.items[appIndex].hubSubscriptions) {
          const subObjs = getSubObjs(
            applications.items[appIndex].hubSubscriptions,
            allSubscriptions,
            allChannels
          )
          allSubscriptions = subObjs[0]
          allChannels = subObjs[1]
        }
      })
    }

    if (allChannels.length > 0) {
      // Remove duplicate channels (that were found in more than one app)
      allChannels = R.uniq(allChannels)
    }

    if (allSubscriptions.length > 0) {
      // Remove duplicate subscriptions (that were found in more than one app)
      allSubscriptions = R.uniq(allSubscriptions)

      // Increment "no status" and "failed" counts using the new non-duplicated subscriptions list
      Object.keys(allSubscriptions).forEach(key => {
        if (
          allSubscriptions[key].status === null ||
          allSubscriptions[key].status === undefined ||
          allSubscriptions[key].status === ''
        ) {
          noStatusSubsCount++
        } else if (
          allSubscriptions[key].status.toLowerCase() !== 'propagated'
        ) {
          failedSubsCount++
        }
      })
    }

    return {
      total: allSubscriptions.length,
      failed: failedSubsCount,
      noStatus: noStatusSubsCount,
      channels: allChannels.length
    }
  }
  // data is undefined... -1 is used to identify when skeleton text load bar should appear
  return {
    total: -1,
    channels: -1
  }
}

export const getPodData = (
  applications,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    let allPods = 0
    let runningPods = 0
    let failedPods = 0
    let inProgressPods = 0

    Object.keys(applications.items).forEach(appIndex => {
      // Get pod data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace &&
        applications.items[appIndex].podStatusCount
      ) {
        // Increment counts if the data exists
        const podData = applications.items[appIndex].podStatusCount
        const podStatuses = Object.keys(podData)
        podStatuses.forEach(status => {
          if (
            status.toLowerCase() === 'running' ||
            status.toLowerCase() === 'pass' ||
            status.toLowerCase() === 'deployed'
          ) {
            runningPods += podData[status]
          } else if (
            status.toLowerCase() === 'pending' ||
            status.toLowerCase().includes('progress')
          ) {
            inProgressPods += podData[status]
          } else if (
            status.toLowerCase().includes('fail') ||
            status.toLowerCase().includes('error') ||
            status.toLowerCase().includes('backoff')
          ) {
            failedPods += podData[status]
          } else {
            allPods += podData[status]
          }
        })
        allPods += runningPods + failedPods + inProgressPods
      }
    })

    return {
      total: allPods,
      running: runningPods,
      failed: failedPods,
      inProgress: inProgressPods
    }
  }
  // data is undefined... -1 is used to identify when skeleton text load bar should appear
  return {
    total: -1
  }
}

export const concatDataForTextKey = (
  mainCounter,
  valueToShow,
  textOption1,
  textOption2
) => {
  return mainCounter === -1
    ? -1
    : valueToShow
      .toString()
      .concat(' ', valueToShow === 1 ? textOption1 : textOption2)
}

export const concatDataForSubTextKey = (
  mainCounter,
  valueToCheck,
  valueToShow,
  text
) => {
  return mainCounter === -1
    ? -1
    : valueToCheck > 0 ? valueToShow.toString().concat(' ', text) : ''
}

export const loadingComponent = () => {
  return (
    <Module className={'bx--tile search-query-card-loading'} size="single">
      <div className="search-query-card-loading">
        <SkeletonText />
        <SkeletonText />
      </div>
    </Module>
  )
}

export const showEditModalByType = (
  closeModal,
  editResource,
  resourceType,
  dataInfo,
  link
) => {
  const data = R.pathOr([], ['data', 'items'], dataInfo)[0]
  const name = R.pathOr('', ['metadata', 'name'], data)
  const namespace = R.pathOr('', ['metadata', 'namespace'], data)
  closeModal()
  editResource(resourceType, {
    name: name,
    namespace: namespace,
    data: data,
    helpLink: link
  })
}

export const handleEditResource = (
  dispatch,
  updateModal,
  resourceType,
  data
) => {
  return dispatch(
    updateModal({
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
      helpLink: (data && data.helpLink) || '',
      name: (data && data.name) || '',
      namespace: (data && data.namespace) || '',
      data: (data && data.data) || '',
      resourceDescriptionKey: (data && data.resourceDescriptionKey) || ''
    })
  )
}

export const handleDeleteResource = (client, resourceType, item) => {
  const name = _.get(item, 'name', '')
  const namespace = _.get(item, 'namespace', '')
  client.mutate({
    mutation: UPDATE_ACTION_MODAL,
    variables: {
      __typename: 'actionModal',
      open: true,
      type: 'table.actions.remove',
      resourceType: {
        __typename: 'resourceType',
        name: resourceType.name,
        list: resourceType.list
      },
      data: {
        __typename: 'ModalData',
        name,
        namespace,
        clusterName: _.get(item, 'cluster', ''),
        selfLink: _.get(item, 'selfLink', ''),
        _uid: _.get(item, '_uid', ''),
        kind: _.get(item, 'kind', '')
      }
    }
  })
}

export const getNumClustersForApp = data => {
  if (data) {
    return data.clusterCount || 0
  }

  return 0
}

export const getNumDeployables = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(elem => elem.kind === 'deployable')
    return filtered.reduce(
      (acc, cur) => acc + (cur.items instanceof Array ? cur.items.length : 0),
      0
    )
  } else {
    return 0
  }
}

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    if (params.namespace) {
      if (params.showRelated) {
        return `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${
          params.name
        }%20namespace%3A${params.namespace}"}&showrelated=${
          params.showRelated
        }`
      } else {
        return `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${
          params.name
        }%20namespace%3A${params.namespace}"}`
      }
    } else if (params.showRelated) {
      return `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${
        params.name
      }"}&showrelated=${params.showRelated}`
    } else {
      return `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${
        params.name
      }"}`
    }
  }
  return ''
}

export const getPoliciesLinkForOneApplication = params => {
  if (params && params.name) {
    return `/multicloud/policies/all?card=false&filters=%7B"textsearch"%3A%5B"${
      params.name
    }"%5D%7D&index=2`
  }
  return ''
}

export const getCardsCommonDetails = (
  subscriptionDataOnHub,
  subscriptionDataOnManagedClusters,
  isSingleApplicationView,
  appName,
  appNS,
  locale
) => {
  const targetLinkForClusters = getSearchLinkForOneApplication({
    name: encodeURIComponent(appName),
    namespace: encodeURIComponent(appNS),
    showRelated: 'cluster'
  })

  const targetLinkForSubscriptions = getSearchLinkForOneApplication({
    name: encodeURIComponent(appName),
    namespace: encodeURIComponent(appNS),
    showRelated: 'subscription'
  })

  const failedLowercase = 'dashboard.card.deployment.failed.lowercase'

  return [
    {
      msgKey:
        subscriptionDataOnHub.total === 1
          ? msgs.get('dashboard.card.deployment.subscription', locale)
          : msgs.get('dashboard.card.deployment.subscriptions', locale),
      count: subscriptionDataOnHub.total,
      targetLink:
        subscriptionDataOnHub.total === 0 ? '' : targetLinkForSubscriptions,
      textKey: msgs.get('dashboard.card.deployment.subscriptions.text', locale),
      subtextKeyFirst: concatDataForSubTextKey(
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.failed,
        msgs.get(failedLowercase, locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.noStatus,
        subscriptionDataOnHub.noStatus,
        msgs.get('dashboard.card.deployment.noStatus', locale)
      )
    },
    {
      msgKey:
        subscriptionDataOnManagedClusters.clusters === 1
          ? msgs.get('dashboard.card.deployment.managedCluster', locale)
          : msgs.get('dashboard.card.deployment.managedClusters', locale),
      count: subscriptionDataOnManagedClusters.clusters,
      targetLink:
        subscriptionDataOnManagedClusters.clusters === 0
          ? ''
          : targetLinkForClusters,
      textKey: concatDataForTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.total,
        msgs.get('dashboard.card.deployment.totalSubscription', locale),
        msgs.get('dashboard.card.deployment.totalSubscriptions', locale)
      ),
      subtextKeyFirst: concatDataForSubTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.failed,
        msgs.get(failedLowercase, locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.noStatus,
        subscriptionDataOnManagedClusters.noStatus,
        msgs.get('dashboard.card.deployment.noStatus', locale)
      )
    }
  ]
}

export const getAppOverviewCardsData = (
  topologyData,
  appName,
  appNamespace,
  nodeStatuses,
  targetLink
) => {
  // Get app details only when topology data is properly loaded for the selected app
  if (
    typeof topologyData.loaded !== 'undefined' &&
    typeof topologyData.nodes !== 'undefined' &&
    topologyData.activeFilters &&
    topologyData.activeFilters.application &&
    topologyData.activeFilters.application.name === appName &&
    topologyData.activeFilters.application.namespace === appNamespace
  ) {
    let creationTimestamp = ''
    let remoteClusterCount = 0
    let localClusterDeploy = false
    const tempNodeStatuses = { green: 0, yellow: 0, red: 0, orange: 0 }
    let statusLoaded = false
    const subsList = []

    topologyData.nodes.map(node => {
      // Get date and time of app creation
      if (
        node.type === 'application' &&
        _.get(node, 'specs.raw.metadata.creationTimestamp')
      ) {
        const timestampArray = new Date(
          node.specs.raw.metadata.creationTimestamp
        )
          .toUTCString()
          .split(' ')
        const date =
          timestampArray[2] + ' ' + timestampArray[1] + ' ' + timestampArray[3]
        const timeArray = timestampArray[4].split(':')
        const timePeriod = timeArray[0] < 12 ? 'am' : 'pm'
        const timeHour12 = timeArray[0] % 12 || 12
        const time = timeHour12 + ':' + timeArray[1] + ' ' + timePeriod

        creationTimestamp = date + ', ' + time
      } else if (node.type === 'cluster' && _.get(node, 'specs.clusterNames')) {
        // Get remote cluster count
        remoteClusterCount = node.specs.clusterNames.length
      } else if (node.type === 'subscription') {
        subsList.push({
          name: node.name,
          id: node.id
        })
        if (_.get(node, 'specs.raw.spec.placement.local')) {
          localClusterDeploy = true
        }
      } else if (
        node.type !== 'application' &&
        node.type !== 'cluster' &&
        node.type !== 'subscription' &&
        node.type !== 'rules' &&
        _.get(node, 'specs.pulse')
      ) {
        // Get cluster resource statuses
        statusLoaded = true
        tempNodeStatuses[node.specs.pulse]++
      }
    })

    // Update the node status list if the statuses have changed
    if (statusLoaded && !_.isEqual(nodeStatuses, tempNodeStatuses)) {
      Object.keys(nodeStatuses).forEach(pulse => {
        nodeStatuses[pulse] = tempNodeStatuses[pulse]
      })
    }

    return {
      appName: appName,
      appNamespace: appNamespace,
      creationTimestamp: creationTimestamp,
      remoteClusterCount: remoteClusterCount,
      localClusterDeploy: localClusterDeploy,
      nodeStatuses: nodeStatuses,
      targetLink: targetLink,
      subsList: subsList
    }
  } else {
    return {
      appName: appName,
      appNamespace: appNamespace,
      creationTimestamp: -1,
      remoteClusterCount: -1,
      localClusterDeploy: false,
      nodeStatuses: -1,
      targetLink: targetLink,
      subsList: -1
    }
  }
}

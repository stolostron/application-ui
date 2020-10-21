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
import { getShortDateTime } from '../../../../lib/client/resource-helper'

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

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    const name = `%20name%3A${params.name}`
    const namespace = params.namespace
      ? `%20namespace%3A${params.namespace}`
      : ''
    const showRelated = params.showRelated
      ? `&showrelated=${params.showRelated}`
      : ''
    return `/multicloud/search?filters={"textsearch":"kind%3Aapplication${name}${namespace}"}${showRelated}`
  }
  return ''
}

const checkDupClusters = (clusterList, cluster) => {
  // Add cluster to cluster list if it's not a duplicate
  if (!_.find(clusterList, cluster)) {
    clusterList = clusterList.concat(cluster)
  }

  return clusterList
}

const getClusterCount = appData => {
  let remoteClusterList = []
  let remoteClusterCount = 0
  let localClusterDeploy = false

  if (appData && appData.related) {
    appData.related.forEach(resource => {
      if (resource.kind === 'subscription' && resource.items) {
        resource.items.forEach(sub => {
          if (sub._hostingSubscription) {
            if (sub.cluster === 'local-cluster') {
              localClusterDeploy = true
            } else {
              const remoteCluster = { cluster: sub.cluster }
              remoteClusterList = checkDupClusters(
                remoteClusterList,
                remoteCluster
              )
            }
          } else if (sub.localPlacement === 'true') {
            localClusterDeploy = true
          }
        })
        remoteClusterCount = remoteClusterList.length
      }
    })
  }

  return {
    remoteCount: remoteClusterCount,
    isLocal: localClusterDeploy
  }
}

const getRepoResourceData = (appData, channelIdentifier) => {
  let resourceType = ''
  let resourcePath = ''
  if (appData && appData.related) {
    appData.related.forEach(resource => {
      if (resource.kind === 'channel' && resource.items) {
        resource.items.forEach(chn => {
          // Get resource type and path of corresponding channel
          if (
            chn.name === channelIdentifier[1] &&
            chn.namespace === channelIdentifier[0]
          ) {
            resourceType = chn.type
            resourcePath = chn.pathname
          }
        })
      }
    })
  }

  return {
    type: resourceType,
    path: resourcePath
  }
}

const getGitTypeData = node => {
  const gitTypeData = {}
  const nodeAnnotations = _.get(node, 'specs.raw.metadata.annotations', [])

  nodeAnnotations['apps.open-cluster-management.io/git-branch']
    ? Object.assign(gitTypeData, {
      gitBranch: nodeAnnotations['apps.open-cluster-management.io/git-branch']
    })
    : Object.assign(gitTypeData, {
      gitBranch:
          nodeAnnotations['apps.open-cluster-management.io/github-branch']
    })
  nodeAnnotations['apps.open-cluster-management.io/git-path']
    ? Object.assign(gitTypeData, {
      gitPath: nodeAnnotations['apps.open-cluster-management.io/git-path']
    })
    : Object.assign(gitTypeData, {
      gitPath: nodeAnnotations['apps.open-cluster-management.io/github-path']
    })

  return gitTypeData
}

export const getAppOverviewCardsData = (
  selectedAppData,
  topologyData,
  appName,
  appNamespace,
  targetLink,
  locale
) => {
  // Get app details only when topology data is properly loaded for the selected app
  const appData = _.get(topologyData, 'activeFilters.application')
  if (
    !selectedAppData ||
    selectedAppData.status !== 'DONE' ||
    topologyData.status !== 'DONE' ||
    topologyData.detailsLoaded !== true
  ) {
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

  if (
    typeof topologyData.loaded !== 'undefined' &&
    typeof topologyData.nodes !== 'undefined' &&
    appData &&
    appData.name === appName &&
    appData.namespace === appNamespace
  ) {
    let creationTimestamp = ''
    const nodeStatuses = { green: 0, yellow: 0, red: 0, orange: 0 }
    const subsList = []

    const selectedAppDataItem = _.get(selectedAppData, 'items[0]', '')
    const clusterData = getClusterCount(selectedAppDataItem)

    topologyData.nodes.map(node => {
      // Get date and time of app creation
      if (node.type === 'application') {
        creationTimestamp = getShortDateTime(
          node.specs.raw.metadata.creationTimestamp,
          locale
        )
      } else if (
        node.type === 'subscription' &&
        _.get(node, 'specs.parent.parentType') !== 'cluster'
      ) {
        // Get name and namespace of channel to match with data from HCMAppList
        const channelIdentifier = _.get(
          node,
          'specs.raw.spec.channel',
          ''
        ).split('/')
        // Get repo resource type and URL
        const repoResourceData = getRepoResourceData(
          selectedAppDataItem,
          channelIdentifier
        )
        const gitTypeData = getGitTypeData(node)

        // Get time window type
        const timeWindowData = _.get(node, 'specs.raw.spec.timewindow', '')

        subsList.push({
          name: node.name,
          id: node.id,
          resourceType: repoResourceData.type,
          resourcePath: repoResourceData.path,
          gitBranch: gitTypeData.gitBranch,
          gitPath: gitTypeData.gitPath,
          timeWindowType: timeWindowData.windowtype,
          timeWindowDays: timeWindowData.daysofweek,
          timeWindowTimezone: timeWindowData.location,
          timeWindowRanges: timeWindowData.hours
        })
      } else if (
        node.type !== 'cluster' &&
        node.type !== 'subscription' &&
        node.type !== 'placements' &&
        _.get(node, 'specs.pulse')
      ) {
        // Get cluster resource statuses
        nodeStatuses[node.specs.pulse]++
      }
    })

    return {
      appName: appName,
      appNamespace: appNamespace,
      creationTimestamp: creationTimestamp,
      remoteClusterCount: clusterData.remoteCount,
      localClusterDeploy: clusterData.isLocal,
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

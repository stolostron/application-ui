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

const getClusterCount = node => {
  let remoteClusterCount = 0
  let localClusterDeploy = false
  const clusterNames = _.get(node, 'specs.allClusters', [])

  localClusterDeploy = clusterNames.indexOf('local-cluster') !== -1
  remoteClusterCount = localClusterDeploy
    ? clusterNames.length - 1
    : clusterNames.length

  return {
    remoteCount: remoteClusterCount,
    isLocal: localClusterDeploy
  }
}

const getSubCardData = (subData, node) => {
  let resourceType = ''
  let resourcePath = ''
  let gitBranch = ''
  let gitPath = ''
  let packageName = ''
  let packageFilterVersion = ''
  let timeWindowType = 'none'
  let timeWindowDays = ''
  let timeWindowTimezone = ''
  let timeWindowRanges = ''

  const relatedChns = _.get(node, 'specs.allChannels', [])
  gitBranch = _.get(
    subData,
    ['metadata', 'annotations', 'apps.open-cluster-management.io/git-branch'],
    ''
  )
  gitPath = _.get(
    subData,
    ['metadata', 'annotations', 'apps.open-cluster-management.io/git-path'],
    ''
  )
  packageName = _.get(subData, 'spec.name', '')
  packageFilterVersion = _.get(subData, 'spec.packageFilter.version', '')
  timeWindowType = _.get(subData, 'spec.timewindow.windowtype', 'none')
  timeWindowDays = _.get(subData, 'spec.timewindow.daysofweek', '')
  timeWindowTimezone = _.get(subData, 'spec.timewindow.location', '')
  timeWindowRanges = _.get(subData, 'spec.timewindow.hours', '')

  // Get related channel data
  let chnData
  relatedChns.forEach(chnl => {
    if (
      `${_.get(chnl, 'metadata.namespace', '')}/${_.get(
        chnl,
        'metadata.name',
        ''
      )}` === _.get(subData, 'spec.channel', '')
    ) {
      chnData = chnl
    }
  })
  if (chnData) {
    resourceType = _.get(chnData, 'spec.type', '')
    resourcePath = _.get(chnData, 'spec.pathname', '')
  }
  return {
    name: _.get(subData, 'metadata.name', ''),
    resourceType: resourceType,
    resourcePath: resourcePath,
    gitBranch: gitBranch,
    gitPath: gitPath,
    package: packageName,
    packageFilterVersion: packageFilterVersion,
    timeWindowType: timeWindowType,
    timeWindowDays: timeWindowDays,
    timeWindowTimezone: timeWindowTimezone,
    timeWindowRanges: timeWindowRanges
  }
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

    let clusterData = {
      remoteCount: 0,
      isLocal: false
    }

    topologyData.nodes.map(node => {
      //get only the top app node

      if (
        _.get(node, 'type', '') === 'application' &&
        _.get(node, 'id').indexOf('--deployable') === -1
      ) {
        clusterData = getClusterCount(node)
        // Get date and time of app creation
        creationTimestamp = getShortDateTime(
          node.specs.raw.metadata.creationTimestamp,
          locale
        )
        const allSubscriptions = _.get(node, 'specs.allSubscriptions', [])
        allSubscriptions.forEach(subs => {
          subsList.push(getSubCardData(subs, node))
        })
      }
      //get pulse for all objects generated from a ddeployable
      if (
        _.get(node, 'id', '').indexOf('--deployable') !== -1 &&
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

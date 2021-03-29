/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import _ from 'lodash'
import { getShortDateTime } from '../../../../lib/client/resource-helper'

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    const name = `%20name%3A${params.name}`
    const namespace = params.namespace
      ? `%20namespace%3A${params.namespace}`
      : ''
    const showRelated = params.showRelated
      ? `&showrelated=${params.showRelated}`
      : ''
    return `/search?filters={"textsearch":"kind%3Aapplication${name}${namespace}"}${showRelated}`
  }
  return ''
}

export const getSearchLinkForArgoApplications = source => {
  if (source) {
    let textsearch = 'kind:application apigroup:argoproj.io'
    for (const [key, value] of Object.entries(source)) {
      textsearch = `${textsearch} ${key}:${value}`
    }
    return `/search?filters={"textsearch":"${encodeURIComponent(textsearch)}"}`
  }
  return ''
}

export const getRepoTypeForArgoApplication = source => {
  if (source && source.path) {
    return 'git'
  } else if (source && source.chart) {
    return 'helmrepo'
  }
  return ''
}

const getSubCardData = (subData, node) => {
  let resourceType = ''
  let resourcePath = ''
  let gitBranch = ''
  let gitPath = ''
  let packageName = ''
  let packageFilterVersion = ''
  let timeWindowType = ''
  let timeWindowDays = ''
  let timeWindowTimezone = ''
  let timeWindowRanges = ''

  const relatedChns = _.get(node, 'specs.allChannels', [])
  gitBranch = _.get(
    subData,
    ['metadata', 'annotations', 'apps.open-cluster-management.io/git-branch'],
    _.get(
      subData,
      [
        'metadata',
        'annotations',
        'apps.open-cluster-management.io/github-branch'
      ],
      ''
    )
  )
  gitPath = _.get(
    subData,
    ['metadata', 'annotations', 'apps.open-cluster-management.io/git-path'],
    _.get(
      subData,
      [
        'metadata',
        'annotations',
        'apps.open-cluster-management.io/github-path'
      ],
      ''
    )
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
    (selectedAppData.status !== 'DONE' && selectedAppData.status !== 'ERROR') || //allow search microservice to not be found
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
      subsList: -1,
      isArgoApp: false,
      argoSource: -1
    }
  }

  if (
    typeof topologyData.loaded !== 'undefined' &&
    typeof topologyData.nodes !== 'undefined' &&
    appData &&
    appData.name === appName &&
    appData.namespace === appNamespace
  ) {
    let apiGroup = 'app.k8s.io'
    let creationTimestamp = ''
    const nodeStatuses = { green: 0, yellow: 0, red: 0, orange: 0 }
    const subsList = []
    let clusterNames = []
    let argoSource = {}
    let isArgoApp = false
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
        clusterData = _.get(node, 'specs.allClusters', {
          isLocal: false,
          remoteCount: 0
        })
        // Get date and time of app creation
        creationTimestamp = getShortDateTime(
          node.specs.raw.metadata.creationTimestamp,
          locale
        )
        const allSubscriptions = _.get(node, 'specs.allSubscriptions', [])
        allSubscriptions.forEach(subs => {
          subsList.push(getSubCardData(subs, node))
        })

        isArgoApp =
          _.get(node, ['specs', 'raw', 'apiVersion'], '').indexOf('argo') !==
          -1
        if (isArgoApp) {
          // set argocd api group
          apiGroup = 'argoproj.io'
          // set argo app cluster names
          clusterNames = _.get(node, ['specs', 'clusterNames'], [])
          argoSource = _.get(node, ['specs', 'raw', 'spec', 'source'], {})
        }
      }
      //get pulse for all objects generated from a deployable
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
      subsList: subsList,
      apiGroup: apiGroup,
      clusterNames: clusterNames,
      isArgoApp: isArgoApp,
      argoSource: argoSource
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
      subsList: -1,
      apiGroup: 'app.k8s.io',
      clusterNames: [],
      isArgoApp: false,
      argoSource: -1
    }
  }
}

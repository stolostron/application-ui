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
import { LOCAL_HUB_NAME } from '../../../../lib/shared/constants'
import { getShortDateTime } from '../../../../lib/client/resource-helper'
import { createEditLink } from '../../Topology/utils/diagram-helpers'

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    const name = `%20name%3A${params.name}`
    const namespace = params.namespace
      ? `%20namespace%3A${params.namespace}`
      : ''
    const cluster = params.cluster ? `%20cluster%3A${params.cluster}` : ''
    const showRelated = params.showRelated
      ? `&showrelated=${params.showRelated}`
      : ''
    const apiGroup = params.apiGroup ? `%20apigroup%3A${params.apiGroup}` : ''
    const apiversion = params.apiVersion
      ? `%20apiversion%3A${params.apiVersion}`
      : ''
    return `/search?filters={"textsearch":"kind%3Aapplication${name}${namespace}${cluster}${apiGroup}${apiversion}"}${showRelated}`
  }
  return ''
}

export const getSearchLinkForArgoApplications = source => {
  if (source) {
    let textsearch = 'kind:application apigroup:argoproj.io'
    for (const [key, value] of Object.entries(source)) {
      if (key !== 'directory') {
        textsearch = `${textsearch} ${key}:${value}`
      }
    }
    return `/search?filters={"textsearch":"${encodeURIComponent(textsearch)}"}`
  }
  return ''
}

export const getRepoTypeForArgoApplication = source => {
  if (source && source.path) {
    return 'github'
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
  let bucketPath = ''
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
  bucketPath = _.get(subData, [
    'metadata',
    'annotations',
    'apps.open-cluster-management.io/bucket-path'
  ])
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
    bucketPath: bucketPath,
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
      creationTimestamp: -1,
      lastSyncedTimestamp: -1,
      remoteClusterCount: -1,
      localClusterDeploy: false,
      nodeStatuses: -1,
      subsList: -1,
      isArgoApp: false,
      argoSource: -1,
      destinationNs: -1,
      destinationCluster: '',
      editArgoSetLink: ''
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
    let lastSyncedTimestamp = ''
    let destinationNs = ''
    let destinationCluster = ''
    const nodeStatuses = { green: 0, yellow: 0, red: 0, orange: 0 }
    const subsList = []
    let clusterNames = []
    let argoSource = {}
    let isArgoApp = false
    let editArgoSetLink = ''
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
        let lastSynced = ''
        allSubscriptions.forEach(subs => {
          if (!lastSynced) {
            lastSynced = _.get(
              subs,
              'metadata.annotations["apps.open-cluster-management.io/manual-refresh-time"]',
              ''
            )
          }
          subsList.push(getSubCardData(subs, node))
        })
        lastSyncedTimestamp = getShortDateTime(lastSynced, locale)

        isArgoApp =
          _.get(node, ['specs', 'raw', 'apiVersion'], '').indexOf('argo') !==
          -1
        if (isArgoApp) {
          // set argocd api group
          apiGroup = 'argoproj.io'
          // set argo app cluster names
          clusterNames = _.get(node, ['specs', 'clusterNames'], [])
          argoSource = _.get(node, ['specs', 'raw', 'spec', 'source'], {})
          lastSyncedTimestamp = getShortDateTime(
            _.get(node, ['specs', 'raw', 'status', 'reconciledAt'], ''),
            locale
          )

          // set destination namespace and cluster
          const relatedApps = _.get(node, ['specs', 'relatedApps'], [])
          relatedApps.filter(app => {
            if (
              app.name === appName &&
              app.namespace === appNamespace &&
              app.destinationNamespace
            ) {
              destinationNs = app.destinationNamespace
              destinationCluster = app.destinationName
                ? app.destinationName
                : app.destinationCluster ? app.destinationCluster : ''
            }
          })

          const ownerReferences = _.get(
            node,
            'specs.raw.metadata.ownerReferences',
            []
          )
          if (
            ownerReferences.length > 0 &&
            ownerReferences[0].kind.toLowerCase() === 'applicationset'
          ) {
            const res = {
              cluster: node.cluster || LOCAL_HUB_NAME,
              namespace: appNamespace,
              name: _.get(ownerReferences[0], 'name', 'unknown'),
              apiversion: 'v1alpha1',
              kind: _.get(ownerReferences[0], 'kind', 'unknown'),
              specs: {
                raw: {
                  apiVersion: _.get(
                    ownerReferences[0],
                    'apiVersion',
                    'argoproj.io/v1alpha1'
                  )
                }
              }
            }
            editArgoSetLink = createEditLink(res)
          }
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
      creationTimestamp: creationTimestamp,
      lastSyncedTimestamp: lastSyncedTimestamp,
      remoteClusterCount: clusterData.remoteCount,
      localClusterDeploy: clusterData.isLocal,
      nodeStatuses: nodeStatuses,
      subsList: subsList,
      apiGroup: apiGroup,
      clusterNames: clusterNames,
      isArgoApp: isArgoApp,
      argoSource: argoSource,
      destinationNs: destinationNs,
      destinationCluster: destinationCluster,
      editArgoSetLink: editArgoSetLink
    }
  } else {
    return {
      creationTimestamp: -1,
      lastSyncedTimestamp: -1,
      remoteClusterCount: -1,
      localClusterDeploy: false,
      nodeStatuses: -1,
      subsList: -1,
      apiGroup: 'app.k8s.io',
      clusterNames: [],
      isArgoApp: false,
      argoSource: -1,
      destinationNs: -1,
      destinationCluster: '',
      editArgoSetLink: ''
    }
  }
}

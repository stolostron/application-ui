/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
import _ from 'lodash'

import React from 'react'
import { SkeletonText } from 'carbon-components-react'
import { Module } from 'carbon-addons-cloud-react'
import { getShortDateTime } from '../../../../lib/client/resource-helper'

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

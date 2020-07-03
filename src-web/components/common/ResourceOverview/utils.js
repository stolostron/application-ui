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

import {
  kindsToExcludeForDeployments,
  getResourcesStatusPerChannel
} from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'
import {
  concatDataForSubTextKey,
  concatDataForTextKey
} from '../../ApplicationDeploymentPipeline/components/InfoCards/utils'

import { UPDATE_ACTION_MODAL } from '../../../apollo-client/queries/StateQueries'
import msgs from '../../../../nls/platform.properties'

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

export const getNumDeployments = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(
      elem => !kindsToExcludeForDeployments.includes(elem.kind)
    )
    return filtered.reduce(
      (acc, cur) => acc + (cur.items instanceof Array ? cur.items.length : 0),
      0
    )
  } else {
    return 0
  }
}

export const getNumInProgressDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[2] + status[3]
}

export const getNumFailedDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[1]
}

export const getNumCompletedDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[0] + status[4]
}

export const getNumPolicyViolations = data => {
  //data is a single app object
  if (data && data.policies) {
    return data.policies.length
  }

  return 0
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

export const getSearchLinkForAllApplications = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Aapplication"}'
}

export const getSearchLinkForAllSubscriptions = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20status%3APropagated"}'
}

export const getSearchLinkForAllClusters = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Acluster"}'
}

export const getSearchLinkForAllChannels = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Achannel"}'
}

export const getSearchLinkForAllPlacementRules = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Aplacementrule"}'
}

export const getCardsCommonDetails = (
  subscriptionDataOnHub,
  subscriptionDataOnManagedClusters,
  isSingleApplicationView,
  appName,
  appNS,
  locale
) => {
  const targetLinkForClusters = isSingleApplicationView
    ? getSearchLinkForOneApplication({
      name: encodeURIComponent(appName),
      namespace: encodeURIComponent(appNS),
      showRelated: 'cluster'
    })
    : getSearchLinkForAllClusters()

  const targetLinkForSubscriptions = isSingleApplicationView
    ? getSearchLinkForOneApplication({
      name: encodeURIComponent(appName),
      namespace: encodeURIComponent(appNS),
      showRelated: 'subscription'
    })
    : getSearchLinkForAllSubscriptions()

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

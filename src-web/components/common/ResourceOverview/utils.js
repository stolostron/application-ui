/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  kindsToExcludeForDeployments,
  getResourcesStatusPerChannel
} from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

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

export const getNumPolicyViolationsForList = appList => {
  //a list of app objects {items: apps}
  let nbPolicies = 0

  if (appList && appList.items && appList.items instanceof Array) {
    appList.items.forEach(app => {
      nbPolicies = nbPolicies + getNumPolicyViolations(app)
    })
  }
  return nbPolicies
}

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    if (params.showRelated) {
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

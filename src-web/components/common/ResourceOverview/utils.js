/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'

import React from 'react'
import { Icon, Link } from 'carbon-components-react'
import msgs from '../../../../nls/platform.properties'
import {
  kindsToExcludeForDeployments,
  getResourcesStatusPerChannel,
  editResourceClick
} from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'
import { getICAMLinkForApp } from '../ResourceDetails/utils'

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

//top menu actions for single app
/* eslint-disable react/prop-types */
export const HeaderActions = (
  { serverProps, getApplicationResource, app, namespaceAccountId },
  locale
) => {
  const dashboard = (app && app.dashboard) || ''
  let icamLink = ''
  if (app && app._uid && namespaceAccountId) {
    icamLink = getICAMLinkForApp(
      app._uid,
      app.name,
      app.cluster,
      namespaceAccountId
    )
  }
  return (
    <div className="app-info-and-dashboard-links">
      {serverProps &&
        serverProps.isICAMRunning && (
          <span>
            <Link href={icamLink} target="_blank" rel="noopener noreferrer">
              <Icon
                className="app-dashboard-icon"
                name="icon--launch"
                fill="#3D70B2"
              />
              {msgs.get('application.launch.icam', locale)}
            </Link>
            <span className="app-info-and-dashboard-links-separator" />
          </span>
      )}
      {serverProps &&
        serverProps.isGrafanaRunning && (
          <span>
            <Link
              href={dashboard}
              aria-disabled={!dashboard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                className="app-dashboard-icon"
                name="icon--launch"
                fill="#3D70B2"
              />
              {msgs.get('application.launch.grafana', locale)}
            </Link>
            <span className="app-info-and-dashboard-links-separator" />
          </span>
      )}
      <Link
        href="#"
        aria-disabled={!app}
        onClick={() => {
          //call edit app here
          editResourceClick(app, getApplicationResource)
        }}
      >
        <Icon className="app-dashboard-icon" name="icon--edit" fill="#3D70B2" />
        {msgs.get('application.edit.app', locale)}
      </Link>
    </div>
  )
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

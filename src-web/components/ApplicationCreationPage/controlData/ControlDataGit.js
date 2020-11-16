/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import {
  VALIDATE_ALPHANUMERIC,
  VALID_REPOPATH,
  VALIDATE_URL
} from '../../TemplateEditor/utils/validation'
import placementData from './ControlDataPlacement'
import prePostTasks from './ControlDataPrePostTasks'
import {
  getGitBranches,
  loadExistingChannels,
  updateChannelControls,
  updateGitBranchFolders
} from './utils'
import _ from 'lodash'

export const updateGitCredentials = (
  urlControl,
  globalControl,
  setLoadingState
) => {
  const groupControlData = _.get(urlControl, 'groupControlData')

  const userCtrlData = _.get(
    groupControlData.find(({ id }) => id === 'githubUser'),
    'active',
    ''
  )

  const tokenCtrlData = _.get(
    groupControlData.find(({ id }) => id === 'githubAccessId'),
    'active',
    ''
  )

  if (
    (userCtrlData.length > 0 && tokenCtrlData.length > 0) ||
    (userCtrlData.length === 0 && tokenCtrlData.length === 0)
  ) {
    getGitBranches(_.get(urlControl, 'groupControlData'), setLoadingState)
  }
  return groupControlData
}

const githubChannelData = [
  ///////////////////////  github  /////////////////////////////////////
  {
    id: 'channelNamespaceExists',
    type: 'hidden',
    active: true
  },
  {
    id: 'channelName',
    type: 'hidden',
    active: ''
  },
  {
    id: 'channelNamespace',
    type: 'hidden',
    active: ''
  },
  {
    name: 'creation.app.github.url',
    tooltip: 'tooltip.creation.app.github.url',
    id: 'githubURL',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.github.url',
    available: [],
    validation: VALIDATE_URL,
    fetchAvailable: loadExistingChannels('git'),
    reverse: 'Channel[0].spec.pathname',
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.github.user',
    tooltip: 'tooltip.creation.app.github.user',
    id: 'githubUser',
    type: 'text',
    editing: { hidden: true }, // if editing existing app, hide this field initially
    active: '',
    encode: true,
    placeholder: 'app.enter.select.username',
    onSelect: updateGitCredentials
  },
  {
    name: 'creation.app.github.accessid',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubAccessId',
    type: 'password',
    editing: { hidden: true }, // if editing existing app, hide this field initially
    encode: true,
    active: '',
    placeholder: 'app.enter.access.token',
    onSelect: updateGitCredentials
  },
  {
    name: 'creation.app.github.branch',
    tooltip: 'tooltip.creation.app.github.branch',
    id: 'githubBranch',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.branch',
    available: [],
    validation: VALIDATE_ALPHANUMERIC,
    reverse: [
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/github-branch"]',
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/git-branch"]'
    ],
    onSelect: updateGitBranchFolders,
    cacheUserValueKey: 'create.app.github.branch'
  },
  {
    name: 'creation.app.github.path',
    tooltip: 'tooltip.creation.app.github.path',
    id: 'githubPath',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.path',
    available: [],
    validation: VALID_REPOPATH,
    reverse: [
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/github-path"]',
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/git-path"]'
    ],
    cacheUserValueKey: 'create.app.github.path'
  },
  {
    id: 'gitReconcileOption',
    type: 'checkbox',
    name: 'creation.app.github.reconcileOption',
    tooltip: 'tooltip.creation.app.github.reconcileOption',
    active: false,
    available: [],
    reverse:
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/reconcile-option"]'
  },
  {
    id: 'gitInsecureSkipVerify',
    type: 'checkbox',
    name: 'Disable server certificate verification',
    tooltip:
      'Disable server TLS certificate verification for Git server connection.',
    active: false,
    available: [],
    editing: { hidden: true } // if editing existing app, hide this field initially
  },

  ...prePostTasks,

  ...placementData
]

export default githubChannelData

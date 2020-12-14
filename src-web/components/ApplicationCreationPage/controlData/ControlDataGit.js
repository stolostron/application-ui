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

import { VALID_REPOPATH, VALIDATE_URL } from 'temptifly'
import placementData from './ControlDataPlacement'
import prePostTasks from './ControlDataPrePostTasks'
import {
  getGitBranches,
  loadExistingChannels,
  updateChannelControls,
  updateGitBranchFolders
} from './utils'
import _ from 'lodash'

export const validateBranch = branch => {
  // Validate branch name according to rules from https://git-scm.com/docs/git-check-ref-format
  // Rule 2 and exceptions do not apply

  const negativeExpressions = [
    // (3) They cannot have two consecutive dots .. anywhere
    /\.\./,
    //  (4) They cannot have ASCII control characters (i.e. bytes whose values are lower than \040, or \177 DEL),
    //      space, tilde ~, caret ^, or colon : anywhere
    //  (5) They cannot have question-mark ?, asterisk *, or open bracket [ anywhere
    // (10) They cannot contain a \
    /[\000-\037\177 ~^:?*[\\]/,
    // (6) They cannot begin or end with a slash / or contain multiple consecutive slashes
    /^\//,
    /\/$/,
    /\/\//,
    // (7) They cannot end with a dot .
    /\.$/,
    // (8) They cannot contain a sequence @{
    /@\{/
  ]

  if (negativeExpressions.some(ne => ne.test(branch))) {
    // at least one rule is broken
    return false
  }

  // (9) They cannot be the single character @
  if (branch === '@') {
    return false
  }

  // (1) They can include slash / for hierarchical (directory) grouping, but no slash-separated component
  // can begin with a dot . or end with the sequence .lock
  const components = branch.split('/')
  if (
    components.length > 0 &&
    components.some(c => c.startsWith('.') || c.endsWith('.lock'))
  ) {
    return false
  }

  return true
}

export const VALIDATE_GITBRANCH = {
  tester: {
    test: validateBranch
  },
  notification: 'creation.valid.gitbranch',
  required: false
}

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

const githubChannelData = async () => [
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
    validation: VALIDATE_GITBRANCH,
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
    active: true,
    available: [],
    reverse:
      'Subscription[0].metadata.annotations["apps.open-cluster-management.io/reconcile-option"]'
  },
  {
    id: 'gitInsecureSkipVerify',
    type: 'checkbox',
    name: 'creation.app.insecureSkipVerify.label',
    tooltip: 'creation.app.insecureSkipVerify.git.tooltip',
    active: false,
    available: [],
    editing: { hidden: true } // if editing existing app, hide this field initially
  },

  ...prePostTasks,

  ...(await placementData())
]

export default githubChannelData

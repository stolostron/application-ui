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
  VALIDATE_URL
} from '../../TemplateEditor/utils/validation'
import placementData from './ControlDataPlacement'
import prePostTasks from './ControlDataPrePostTasks'
import {
  getGitBranches,
  loadExistingChannels,
  updateChannelControls
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
    id: 'channelName',
    type: 'hidden',
    active: 'resource'
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
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.github.user',
    tooltip: 'tooltip.creation.app.github.user',
    id: 'githubUser',
    type: 'text',
    active: '',
    encode: true,
    placeholder: 'app.enter.select.username',
    onSelect: updateGitCredentials
  },
  {
    name: 'creation.app.github.accessid',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubAccessId',
    type: 'text',
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
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.path'
  },
  {
    id: 'gitReconcileOption',
    type: 'checkbox',
    name: 'creation.app.github.reconcileOption',
    tooltip: 'tooltip.creation.app.github.reconcileOption',
    active: false,
    available: []
  },

  ...prePostTasks,

  ...placementData
]

export default githubChannelData

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

import { VALIDATE_URL } from '../../TemplateEditor/utils/validation'
import { loadExistingChannels, updateChannelControls } from './utils'

import placementData from './ControlDataPlacement'
import prePostTasks from './ControlDataPrePostTasks'

const helmReleaseChannelData = [
  ///////////////////////  HelmRelease  /////////////////////////////////////
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
    name: 'creation.app.helmrepo.url',
    tooltip: 'tooltip.creation.app.helmrepo.url',
    id: 'helmURL',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.helmrepo.url',
    available: [],
    validation: VALIDATE_URL,
    fetchAvailable: loadExistingChannels('helmrepo'),
    reverse: 'Channel[0].spec.pathname',
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.helmrepo.user',
    tooltip: 'tooltip.creation.app.helmrepo.user',
    id: 'helmUser',
    type: 'text',
    editing: {hidden: true}, // if editing existing app, hide this field initially
    active: '',
    encode: true,
    placeholder: 'app.enter.helmrepo.username'
  },
  {
    name: 'creation.app.helmrepo.password',
    tooltip: 'tooltip.creation.app.helmrepo.password',
    id: 'helmPassword',
    type: 'text',
    editing: {hidden: true}, // if editing existing app, hide this field initially
    encode: true,
    active: '',
    placeholder: 'app.enter.helmrepo.password'
  },
  {
    name: 'creation.app.helmrepo.chart.name',
    tooltip: 'tooltip.creation.app.helmrepo.chart.name',
    id: 'helmChartName',
    type: 'text',
    active: '',
    placeholder: 'app.enter.helmrepo.chart.name',
    validation: {
      required: true
    },
    reverse: 'Subscription[0].spec.name'
  },
  {
    name: 'creation.app.helmrepo.package.version',
    tooltip: 'tooltip.creation.app.helmrepo.package.version',
    id: 'helmPackageVersion',
    type: 'text',
    active: '',
    placeholder: 'app.enter.helmrepo.package.version',
    reverse: 'Subscription[0].spec.packageFilter.version'
  },

  ...prePostTasks,

  ...placementData
]

export default helmReleaseChannelData

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
  VALIDATE_ALPHANUMERIC
} from '../../TemplateEditor/utils/validation'
import {
  loadExistingChannels,
  updateChannelControls
} from './utils'
import placementData from './ControlDataPlacement'


const hubClusterChannelData = [
  ///////////////////////  Hub Cluster  /////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  clusters  /////////////////////////////////////
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
    name: 'creation.app.namespace.name',
    tooltip: 'tooltip.creation.app.namespace.name',
    id: 'namespaceChannelName',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.namespace.name',
    available: [],
    validation: [],
    fetchAvailable: loadExistingChannels('namespace'),
    onSelect: updateChannelControls
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  pre/post jobs  /////////////////////////////////////
  {
    id: 'perPostSection',
    type: 'section',
    title: 'creation.app.section.prePost',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  {
    name: 'creation.app.pre.job',
    tooltip: 'tooltip.creation.app.preJob',
    id: 'preJob',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.preJob',
    validation: VALIDATE_ALPHANUMERIC,
    available: []
  },
  {
    name: 'creation.app.post.job',
    tooltip: 'tooltip.creation.app.postJob',
    id: 'postJob',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.postJob',
    validation: VALIDATE_ALPHANUMERIC,
    available: []
  },

  ...placementData
]

export default hubClusterChannelData

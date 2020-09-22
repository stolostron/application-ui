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

const objectstoreChannelData = [
  ///////////////////////  Objectstore  /////////////////////////////////////
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
    name: 'creation.app.objectstore.url',
    tooltip: 'tooltip.creation.app.objectstore.url',
    id: 'objectstoreURL',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.objectstore.url',
    available: [],
    validation: VALIDATE_URL,
    fetchAvailable: loadExistingChannels('objectstore'),
    reverse: 'Channel[0].spec.pathname',
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.objectstore.accesskey',
    tooltip: 'tooltip.creation.app.objectstore.accesskey',
    id: 'accessKey',
    type: 'text',
    editing: {hidden: true}, // if editing existing app, hide this field initially
    active: '',
    encode: true,
    placeholder: 'app.enter.accesskey'
  },
  {
    name: 'creation.app.objectstore.secretkey',
    tooltip: 'tooltip.creation.app.objectstore.secretkey',
    id: 'secretKey',
    type: 'password',
    editing: {hidden: true}, // if editing existing app, hide this field initially
    encode: true,
    active: '',
    placeholder: 'app.enter.secretkey'
  },

  ...prePostTasks,
  ...placementData
]

export default objectstoreChannelData

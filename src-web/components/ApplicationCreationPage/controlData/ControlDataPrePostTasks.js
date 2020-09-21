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

import { loadExistingSecrets, updatePrePostControls } from './utils'

const prePostTasks = [
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
    name: 'creation.app.ansible.secret.name',
    tooltip: 'tooltip.creation.app.ansibleSecretName',
    id: 'ansibleSecretName',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.ansibleSecretName',
    available: [],
    fetchAvailable: loadExistingSecrets(),
    onSelect: updatePrePostControls,
    reverse: 'Subscription[0].spec.hooksecretref.name',
    validation: {}
  },
  {
    name: 'creation.app.ansible.secret.host',
    id: 'ansibleTowerHost',
    type: 'text',
    isHiddenWhenEditingExistingResouce: true,
    active: '',
    encode: true,
    placeholder: 'app.enter.select.ansibleTowerHost'
  },
  {
    name: 'creation.app.ansible.secret.token',
    id: 'ansibleTowerToken',
    type: 'text',
    isHiddenWhenEditingExistingResouce: true,
    encode: true,
    active: '',
    placeholder: 'app.enter.select.ansibleTowerToken'
  }
]

export default prePostTasks

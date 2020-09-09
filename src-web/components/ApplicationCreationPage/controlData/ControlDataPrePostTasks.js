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

import { HCMSecretList } from '../../../../lib/client/queries'
import _ from 'lodash'

export const loadExistingSecrets = () => {
  return {
    query: HCMSecretList,
    loadingDesc: 'creation.app.loading.rules',
    setAvailable: setAvailableSecrets.bind(null)
  }
}

export const setAvailableSecrets = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { items } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  control.active = ''

  const error = items ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (items) {
    control.availableData = _.keyBy(items, 'metadata.name')
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }

  return control
}

export const updatePrePostControls = urlControl => {
  const groupControlData = _.get(urlControl, 'groupControlData')

  const { active, availableData } = urlControl

  const selectedSecret = availableData && availableData[active]

  const ansibleHost =
    groupControlData &&
    groupControlData.find(({ id }) => id === 'ansibleTowerHost')
  const ansibleToken =
    groupControlData &&
    groupControlData.find(({ id }) => id === 'ansibleTowerToken')

  if (!selectedSecret) {
    //new secret, show host task info
    _.set(ansibleHost, 'type', 'text')
    _.set(ansibleToken, 'type', 'text')
  } else {
    //existing secret, hide and clean host and token
    _.set(ansibleHost, 'type', 'hidden')
    _.set(ansibleToken, 'type', 'hidden')
    _.set(ansibleHost, 'active', '')
    _.set(ansibleToken, 'active', '')
  }

  return urlControl
}

const prePostTasks = [
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  pre/post jobs  /////////////////////////////////////
  {
    id: 'perPostSection',
    type: 'section',
    title: 'creation.app.section.prePost',
    overline: true,
    collapsable: true,
    collapsed: true
  },
  {
    name: 'creation.app.ansible.secret.name',
    tooltip: 'tooltip.creation.app.ansibleSecretName',
    id: 'ansibleSecretName',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.ansibleSecretName',
    available: [],
    //    fetchAvailable: loadExistingSecrets(),
    //    onSelect: updatePrePostControls,
    validation: {}
  },
  {
    name: 'creation.app.ansible.secret.host',
    id: 'ansibleTowerHost',
    type: 'text',
    active: '',
    encode: true,
    placeholder: 'app.enter.select.ansibleTowerHost'
  },
  {
    name: 'creation.app.ansible.secret.token',
    id: 'ansibleTowerToken',
    type: 'text',
    encode: true,
    active: '',
    placeholder: 'app.enter.select.ansibleTowerToken'
  }
]

export default prePostTasks

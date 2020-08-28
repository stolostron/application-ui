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

import _ from 'lodash'

const onlineClustersCheckbox = 'online-cluster-only-checkbox'
const localClusterCheckbox = 'local-cluster-checkbox'

export const setAvailableRules = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { placementrules } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  control.active = ''

  const selectedNS = control.ns
  const error = placementrules ? null : result.error

  if (error) {
    control.isFailed = true
  } else if (placementrules) {
    if (_.get(control, 'ns', '') === '') {
      control.available = [] // no app namespace selected so no rule to show
    } else {
      control.availableData = _.keyBy(
        placementrules.filter(
          rule => _.get(rule, 'metadata.namespace', '') === selectedNS
        ),
        'metadata.name'
      )
      control.available = Object.keys(control.availableData).sort()
      if (Object.keys(control.availableData).length === 0) {
        _.set(control, 'type', 'hidden')
      }
    }
  } else {
    control.isLoading = loading
  }

  return control
}

export const setAvailableNSSpecs = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { items } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  const error = items ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (items) {
    control.availableData = _.keyBy(items, 'metadata.name')
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }
}

export const getExistingPRControlsSection = (initiatingControl, control) => {
  //returns the existing placement rule options for the channel selection
  let result = []

  if (_.get(initiatingControl, 'groupControlData')) {
    //the update happened on a single channel, get that channel only PRs
    const controlDataList = _.get(initiatingControl, 'groupControlData')

    const channelInfo = {}

    controlDataList.forEach(controlDataObject => {
      channelInfo[controlDataObject.id] = controlDataObject
    })

    result.push(channelInfo)
  } else {
    //this is a global update, get all channels PRs
    const channelsControl = control.find(({ id }) => id === 'channels')

    if (channelsControl) {
      result = _.get(channelsControl, 'controlMapArr', [])
    }
  }

  return result
}

export const updateNewRuleControlsData = (selectedPR, control) => {
  const onlineControl = _.get(control, onlineClustersCheckbox)
  const clusterSelectorControl = _.get(control, 'clusterSelector')

  const clusterReplicasControl = _.get(control, 'clusterReplicas')

  const localClusterControl = _.get(control, localClusterCheckbox)

  if (selectedPR) {
    const clusterConditionsList = _.get(
      selectedPR,
      'raw.spec.clusterConditions',
      []
    )
    const localClusterData = clusterConditionsList.filter(
      rule =>
        _.get(rule, 'status', '').toLowerCase() === 'true' &&
        _.get(rule, 'type', '') === 'ManagedClusterConditionAvailable'
    )

    onlineControl.active = localClusterData.length > 0
    localClusterData.length > 0 && _.set(onlineControl, 'type', 'checkbox')

    const clusterReplicas = _.get(selectedPR, 'raw.spec.clusterReplicas', '')
    clusterReplicasControl.active = _.toString(clusterReplicas)
    clusterReplicas !== '' && _.set(clusterReplicasControl, 'type', 'text')

    const clusterSelectorData = _.get(
      selectedPR,
      'raw.spec.clusterSelector.matchLabels',
      null
    )

    clusterSelectorData !== null &&
      _.set(clusterSelectorControl, 'type', 'custom')

    clusterSelectorControl.active.mode = clusterSelectorData !== null

    if (clusterSelectorData) {
      clusterSelectorControl.active.clusterLabelsList.splice(
        0,
        clusterSelectorControl.active.clusterLabelsList.length
      )

      const newData = []
      let idx = 0
      Object.keys(clusterSelectorData).forEach(key => {
        newData.push({
          id: idx,
          labelName: key,
          labelValue: clusterSelectorData[key],
          validValue: true
        })
        idx = idx + 1
      })

      clusterSelectorControl.active.mode =
        clusterSelectorControl.active.clusterLabelsList.length > 0

      if (newData.length === 0) {
        newData.push({
          id: 0,
          labelName: '',
          labelValue: '',
          validValue: true
        })
      }

      clusterSelectorControl.showData = newData
      clusterSelectorControl.active = {
        mode: true,
        clusterLabelsList: newData,
        clusterLabelsListID: newData.length
      }
    }

    _.set(localClusterControl, 'type', 'hidden')
  } else {
    _.set(localClusterControl, 'type', 'checkbox')

    _.set(onlineControl, 'type', 'checkbox')
    _.set(onlineControl, 'active', false)

    _.set(clusterSelectorControl, 'type', 'custom')
    _.set(clusterSelectorControl, 'active.mode', false)
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: true }
    ]
    clusterSelectorControl.showData = []

    _.set(clusterReplicasControl, 'type', 'text')
    _.set(clusterReplicasControl, 'active', '')

    clusterSelectorControl.showData = []
  }

  return control
}

export const setAvailableChannelSpecs = (type, control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { items } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  const error = items ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (items) {
    control.availableData = _.keyBy(
      items.filter(({ type: p }) => {
        return p.toLowerCase().startsWith(type)
      }),
      'objectPath'
    )
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }
}

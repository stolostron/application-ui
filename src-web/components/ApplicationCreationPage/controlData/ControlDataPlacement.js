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

import React from 'react'
import { HCMPlacementRuleList } from '../../../../lib/client/queries'
import TimeWindow from '../components/TimeWindow'
import ClusterSelector from '../components/ClusterSelector'
import {
  setAvailableRules,
  getExistingPRControlsSection,
  updateNewRuleControlsData
} from './utils'
import _ from 'lodash'

const existingRuleCheckbox = 'existingrule-checkbox'
const localClusterCheckbox = 'local-cluster-checkbox'

export const loadExistingPlacementRules = () => {
  return {
    query: HCMPlacementRuleList,
    loadingDesc: 'creation.app.loading.rules',
    setAvailable: setAvailableRules.bind(null)
  }
}
export const updateNewRuleControls = (urlControl, controlGlobal) => {
  const controlList = getExistingPRControlsSection(urlControl, controlGlobal)

  const { active, availableData } = urlControl
  const selectedPR = availableData[active]

  controlList.forEach(control => {
    const selectedRuleNameControl = _.get(control, 'selectedRuleName')
    selectedRuleNameControl.active = active

    updateNewRuleControlsData(selectedPR, control)
  })
}

export const updateDisplayForPlacementControls = (
  urlControl,
  controlGlobal
) => {
  //hide or show placement rule settings if user selects an existing PR
  const { active } = urlControl
  const controlList = getExistingPRControlsSection(urlControl, controlGlobal)

  controlList.forEach(control => {
    const existingRuleControl = _.get(control, 'placementrulecombo')

    const onlineControl = _.get(control, 'online-cluster-only-checkbox')
    const clusterSelectorControl = _.get(control, 'clusterSelector')

    const localClusterControl = _.get(control, localClusterCheckbox)

    const selectedRuleNameControl = _.get(control, 'selectedRuleName')

    if (active === true) {
      _.set(existingRuleControl, 'type', 'singleselect')

      _.set(onlineControl, 'type', 'hidden')
      _.set(clusterSelectorControl, 'type', 'hidden')
      _.set(localClusterControl, 'type', 'hidden')
    } else {
      _.set(existingRuleControl, 'type', 'hidden')
      selectedRuleNameControl && _.set(selectedRuleNameControl, 'active', '')

      _.set(onlineControl, 'type', 'checkbox')
      _.set(clusterSelectorControl, 'type', 'custom')
      _.set(localClusterControl, 'type', 'checkbox')
    }

    //reset all values
    _.set(localClusterControl, 'active', false)
    _.set(onlineControl, 'active', true)
    clusterSelectorControl.active.clusterLabelsListID = 1
    delete clusterSelectorControl.active.clusterLabelsList
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: true }
    ]
    clusterSelectorControl.active.mode = false
    delete clusterSelectorControl.showData
  })
}

export const updatePlacementControls = placementControl => {
  //update PR controls on channel or ns change
  const { active, groupControlData } = placementControl

  const onlineControl = groupControlData.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )
  const clusterSelectorControl = groupControlData.find(
    ({ id }) => id === 'clusterSelector'
  )

  if (active === true) {
    onlineControl && _.set(onlineControl, 'type', 'hidden')
    clusterSelectorControl && _.set(clusterSelectorControl, 'type', 'hidden')
  } else {
    onlineControl && _.set(onlineControl, 'type', 'checkbox')
    clusterSelectorControl && _.set(clusterSelectorControl, 'type', 'custom')
  }

  return groupControlData
}

const placementData = [
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  clusters  /////////////////////////////////////
  {
    id: 'clusterSection',
    type: 'section',
    title: 'creation.app.placement.rule',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  {
    id: existingRuleCheckbox,
    type: 'hidden',
    name: 'creation.app.settings.existingRule',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: updateDisplayForPlacementControls,
    active: false,
    available: [],
    validation: {}
  },
  {
    name: 'creation.app.exitingRuleCombo',
    tooltip: 'tooltip.creation.app.exitingRuleCombo',
    id: 'placementrulecombo',
    type: 'hidden',
    fetchAvailable: loadExistingPlacementRules(),
    onSelect: updateNewRuleControls,
    validation: {}
  },
  {
    id: 'selectedRuleName',
    type: 'hidden',
    active: ''
  },
  {
    id: localClusterCheckbox,
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControls,
    active: false,
    available: []
  },
  {
    id: 'online-cluster-only-checkbox',
    type: 'checkbox',
    name: 'creation.app.settings.onlineClusters',
    tooltip: 'tooltip.creation.app.settings.onlineClusters',
    active: true,
    available: []
  },
  {
    type: 'custom',
    id: 'clusterSelector',
    component: <ClusterSelector />,
    available: []
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  settings  /////////////////////////////////////
  {
    id: 'settingsSection',
    type: 'section',
    title: 'creation.app.section.settings',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  {
    type: 'custom',
    name: 'creation.app.settings.timeWindow',
    tooltip: 'creation.app.settings.timeWindow.tooltip',
    id: 'timeWindow',
    component: <TimeWindow />,
    available: []
  }
]

export default placementData

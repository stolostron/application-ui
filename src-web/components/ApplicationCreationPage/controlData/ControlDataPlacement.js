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

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import { HCMPlacementRuleList } from '../../../../lib/client/queries'
import TimeWindow, {
  reverse as reverseTimeWindow,
  summarize as summarizeTimeWindow
} from '../components/TimeWindow'
import ClusterSelector, {
  reverse as reverseClusterSelector,
  summarize as summarizeClusterSelector
} from '../components/ClusterSelector'
import {
  setAvailableRules,
  getExistingPRControlsSection,
  updateNewRuleControlsData
} from './utils'
import _ from 'lodash'
import msgs from '../../../../nls/platform.properties'

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
      _.set(onlineControl, 'disabled', false)
      _.set(clusterSelectorControl, 'type', 'custom')
      _.set(localClusterControl, 'type', 'checkbox')
    }

    //reset all values
    _.set(localClusterControl, 'active', false)
    _.set(onlineControl, 'active', false)
    clusterSelectorControl.active.clusterLabelsListID = 1
    delete clusterSelectorControl.active.clusterLabelsList
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: false }
    ]
    clusterSelectorControl.active.mode = true
    delete clusterSelectorControl.showData
  })
}

export const updatePlacementControlsForLocal = placementControl => {
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
    onlineControl && _.set(onlineControl, 'disabled', false)
    onlineControl && _.set(onlineControl, 'active', false)
    if (clusterSelectorControl) {
      _.set(clusterSelectorControl, 'type', 'custom')
      clusterSelectorControl.active &&
        _.set(clusterSelectorControl.active, 'mode', true)
    }
  }

  return groupControlData
}

export const updatePlacementControlsForCustom = placementControl => {
  const { active, groupControlData } = placementControl

  const onlineControl = groupControlData.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )

  if (active && active.mode) {
    onlineControl && _.set(onlineControl, 'active', false)
  } else {
    onlineControl && _.set(onlineControl, 'active', true)
  }

  return groupControlData
}

export const updatePlacementControlsForAllOnline = placementControl => {
  const { active, groupControlData } = placementControl

  const clusterSelectorControl = groupControlData.find(
    ({ id }) => id === 'clusterSelector'
  )

  if (clusterSelectorControl && clusterSelectorControl.active) {
    active
      ? _.set(clusterSelectorControl.active, 'mode', false)
      : _.set(clusterSelectorControl.active, 'mode', true)
  }

  return groupControlData
}

export const summarizeOnline = (control, globalControlData, summary) => {
  const localClusterCheckboxControl = control.groupControlData.find(
    ({ id }) => id === localClusterCheckbox
  )
  const onlineClusterCheckboxControl = control.groupControlData.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )
  const clusterSelectorControl = control.groupControlData.find(
    ({ id }) => id === 'clusterSelector'
  )

  if (_.get(localClusterCheckboxControl, 'active', false) === true) {
    msgs.get('edit.app.localCluster.summary')
  } else if (_.get(onlineClusterCheckboxControl, 'active', false) === true) {
    summary.push(msgs.get('edit.app.onlineClusters.summary'))
  } else if (_.get(clusterSelectorControl, 'active.mode', false) === true) {
    summary.push(msgs.get('edit.app.labelClusters.summary'))
  }
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
    type: 'custom',
    id: 'clusterSelector',
    component: <ClusterSelector />,
    available: [],
    onSelect: updatePlacementControlsForCustom,
    reverse: reverseClusterSelector,
    summarize: summarizeClusterSelector
  },
  {
    id: 'online-cluster-only-checkbox',
    type: 'checkbox',
    name: 'creation.app.settings.onlineClusters',
    tooltip: 'tooltip.creation.app.settings.onlineClusters',
    active: false,
    available: [],
    onSelect: updatePlacementControlsForAllOnline,
    reverse: 'PlacementRule[0].spec.clusterConditions[0].type',
    summarize: summarizeOnline.bind(null)
  },
  {
    id: localClusterCheckbox,
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControlsForLocal,
    active: false,
    available: [],
    reverse: 'Subscription[0].spec.placement.local',
    summarize: (control, controlData, summary) => {
      if (control.active) {
        summary.push(msgs.get('edit.app.localCluster.summary'))
      }
    }
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
    available: [],
    reverse: reverseTimeWindow,
    summarize: summarizeTimeWindow
  }
]

export default placementData

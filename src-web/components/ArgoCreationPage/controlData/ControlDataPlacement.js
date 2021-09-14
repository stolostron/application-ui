/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.

 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import { HCMPlacementList } from '../../../../lib/client/queries'
import { setAvailableRules } from './utils'
import ClusterSelector, {
  reverse as reverseClusterSelector,
  summary as summaryClusterSelector
} from '../../common/ClusterSelector'
import _ from 'lodash'

const existingRuleCheckbox = 'existingrule-checkbox'

export const loadExistingPlacement = () => {
  const getQueryVariables = (control, globalControl) => {
    const nsControl = globalControl.find(
      ({ id: idCtrl }) => idCtrl === 'argoServer'
    )
    if (nsControl.active) {
      delete control.exception
      return { namespace: nsControl.active }
    } else {
      return { namespace: '_undefined_' }
    }
  }
  return {
    query: HCMPlacementList,
    variables: getQueryVariables,
    loadingDesc: 'creation.app.loading.rules',
    setAvailable: setAvailableRules.bind(null)
  }
}

export const updateDisplayForPlacementControls = (
  urlControl,
  globalControl
) => {
  //hide or show placement settings if user selects an existing PR
  const { active } = urlControl
  const existingRuleControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'decisionResourceName'
  )
  const clusterSelectorControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'clusterSelector'
  )

  if (active === true) {
    _.set(existingRuleControl, 'type', 'combobox')
    _.set(clusterSelectorControl, 'type', 'hidden')
  } else {
    _.set(existingRuleControl, 'type', 'hidden')
    _.set(existingRuleControl, 'active', '')
    _.set(clusterSelectorControl, 'type', 'custom')
  }

  //reset all values
  if (clusterSelectorControl.active) {
    clusterSelectorControl.active.clusterLabelsListID = 1
    delete clusterSelectorControl.active.clusterLabelsList
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: false }
    ]
    clusterSelectorControl.active.mode = true
    delete clusterSelectorControl.showData
  }

  return globalControl
}

const placementData = () => [
  ///////////////////////  placement  /////////////////////////////////////
  {
    id: 'placement',
    type: 'step',
    title: 'argo.placement.title'
  },
  {
    id: existingRuleCheckbox,
    type: 'checkbox',
    name: 'creation.app.settings.existingRule',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: updateDisplayForPlacementControls,
    active: false,
    available: [],
    validation: {}
  },
  {
    name: 'argo.cluster.decision.resource.name',
    tooltip: 'argo.cluster.decision.resource.name.tooltip',
    id: 'decisionResourceName',
    type: 'hidden',
    placeholder: 'argo.cluster.decision.resource.placeholder',
    fetchAvailable: loadExistingPlacement(),
    validation: {
      notification: 'import.form.invalid.dns.label'
    }
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
    reverse: reverseClusterSelector,
    summary: summaryClusterSelector
  }
]

export default placementData

/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import _ from 'lodash'

export const updatePropagationPolicy = (urlControl, controlGlobal) => {
  const { active } = urlControl
  const propagationPolicy = controlGlobal.find(
    ({ id }) => id === 'propagationPolicy'
  )
  // render propagationPolicy
  if (active) {
    _.set(propagationPolicy, 'type', 'singleselect')
  }
  // reset
  if (!active) {
    _.set(propagationPolicy, 'type', 'hidden')
  }

  return controlGlobal
}

export const commonSyncPolicies = [
  {
    id: 'allowEmpty',
    type: 'checkbox',
    name: 'argo.sync.policy.allow.empty',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'applyOutOfSyncOnly',
    type: 'checkbox',
    name: 'argo.sync.policy.apply.out.of.sync.only',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'selfHeal',
    type: 'checkbox',
    name: 'argo.sync.policy.self.heal',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'createNamespace',
    type: 'checkbox',
    name: 'argo.sync.policy.create.namespace',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'validate',
    type: 'checkbox',
    name: 'argo.sync.policy.validate',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'prunePropagationPolicy',
    type: 'checkbox',
    name: 'argo.sync.policy.prune.propagation.policy',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: updatePropagationPolicy,
    active: false,
    validation: {}
  },
  {
    id: 'propagationPolicy',
    type: 'hidden',
    name: 'argo.sync.policy.prune.propagation.policy.title',
    available: ['foreground', 'background', 'orphan'],
    active: 'foreground',
    validation: {
      required: true
    }
  }
]

export const gitSyncPolicies = [
  {
    id: 'prune',
    type: 'checkbox',
    name: 'argo.sync.policy.prune',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'pruneLast',
    type: 'checkbox',
    name: 'argo.sync.policy.prune.last',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  },
  {
    id: 'replace',
    type: 'checkbox',
    name: 'argo.sync.policy.replace',
    tooltip: 'tooltip.creation.app.settings.existingRule',
    onSelect: {},
    active: false,
    validation: {}
  }
]

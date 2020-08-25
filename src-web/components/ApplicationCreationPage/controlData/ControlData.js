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
import {
  VALIDATE_ALPHANUMERIC,
  VALIDATE_URL
} from '../../TemplateEditor/utils/validation'
import {
  HCMChannelList,
  HCMNamespaceList,
  HCMPlacementRuleList
} from '../../../../lib/client/queries'
import TimeWindow from '../components/TimeWindow'
import ClusterSelector from '../components/ClusterSelector'
import _ from 'lodash'

const VALID_DNS_LABEL = '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'
const exiting_rule_checkbox = 'existingrule-checkbox'
const online_cluster_only_checkbox = 'online-cluster-only-checkbox'
const local_cluster_checkbox = 'local-cluster-checkbox'
const active_mode = 'active.mode'

export const loadExistingPlacementRules = () => {
  return {
    query: HCMPlacementRuleList,
    loadingDesc: 'creation.app.loading.rules',
    setAvailable: setAvailableRules.bind(null)
  }
}

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
}

export const loadExistingNamespaces = () => {
  return {
    query: HCMNamespaceList,
    loadingDesc: 'creation.app.loading.namespaces',
    setAvailable: setAvailableNSSpecs.bind(null)
  }
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

export const getExistingPRControlsSection = control => {
  //returns the existing placement rule options for this channel
  const channelsControl = control.find(({ id }) => id === 'channels')

  if (channelsControl) {
    const channelControlsList = _.get(channelsControl, 'controlMapArr', [])

    if (channelControlsList.length > 0) {
      return channelControlsList[0]
    }
  }

  return null
}

export const updateNSControls = (nsControl, globalControl) => {
  const { active, availableData } = nsControl
  const userDefinedNSControl = globalControl.find(
    ({ id }) => id === 'userDefinedNamespace'
  )

  const control = getExistingPRControlsSection(globalControl)
  if (control) {
    const existingRuleControl = _.get(control, 'placementrulecombo')
    const existingruleCheckbox = _.get(control, exiting_rule_checkbox)
    //update placement rule controls
    if (existingRuleControl && existingruleCheckbox) {
      if (userDefinedNSControl) {
        if (availableData[active] === undefined) {
          userDefinedNSControl.active = active
          _.set(existingruleCheckbox, 'type', 'hidden')
          _.set(existingRuleControl, 'type', 'hidden')

          _.set(existingRuleControl, 'ns', '')
        } else {
          _.set(existingruleCheckbox, 'type', 'checkbox')
          _.set(existingruleCheckbox, 'active', false)

          _.set(existingRuleControl, 'ns', active)
          _.set(existingRuleControl, 'type', 'hidden')

          userDefinedNSControl.active = active
        }
      }
      _.set(existingRuleControl, 'active', '')
      updateNewRuleControlsData('', control)
    }
  }

  return userDefinedNSControl
}

export const updateNewRuleControls = (urlControl, controlGlobal) => {
  const control = getExistingPRControlsSection(controlGlobal)

  const { active, availableData } = urlControl
  const selectedPR = availableData[active]

  const selectedRuleNameControl = _.get(control, 'selectedRuleName')
  selectedRuleNameControl.active = active

  return updateNewRuleControlsData(selectedPR, control)
}

export const updateNewRuleControlsData = (selectedPR, control) => {
  const onlineControl = _.get(control, online_cluster_only_checkbox)
  const clusterSelectorControl = _.get(control, 'clusterSelector')

  const clusterReplicasControl = _.get(control, 'clusterReplicas')

  const localClusterControl = _.get(control, local_cluster_checkbox)

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
    _.set(clusterSelectorControl, active_mode, false)
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

export const updateDisplayForPlacementControls = (
  urlControl,
  controlGlobal
) => {
  //hide or show placement rule settings if user selects an existing PR
  const { active } = urlControl

  const control = getExistingPRControlsSection(controlGlobal)

  const existingRuleControl = _.get(control, 'placementrulecombo')

  const onlineControl = _.get(control, online_cluster_only_checkbox)
  const clusterSelectorControl = _.get(control, 'clusterSelector')

  const clusterReplicasControl = _.get(control, 'clusterReplicas')

  const localClusterControl = _.get(control, local_cluster_checkbox)

  if (active === true) {
    _.set(existingRuleControl, 'type', 'singleselect')

    _.set(onlineControl, 'type', 'hidden')
    _.set(clusterSelectorControl, 'type', 'hidden')
    _.set(clusterReplicasControl, 'type', 'hidden')
    _.set(localClusterControl, 'type', 'hidden')
  } else {
    _.set(existingRuleControl, 'type', 'hidden')

    _.set(onlineControl, 'type', 'checkbox')
    _.set(clusterSelectorControl, 'type', 'custom')
    _.set(clusterReplicasControl, 'type', 'text')
    _.set(localClusterControl, 'type', 'checkbox')
  }

  //reset all values
  _.set(localClusterControl, 'active', false)
  _.set(onlineControl, 'active', false)
  _.set(clusterReplicasControl, 'active', '')
  clusterSelectorControl.active.clusterLabelsListID = 1
  delete clusterSelectorControl.active.clusterLabelsList
  clusterSelectorControl.active.clusterLabelsList = [
    { id: 0, labelName: '', labelValue: '', validValue: true }
  ]
  clusterSelectorControl.active.mode = false
  delete clusterSelectorControl.showData
  return control
}

export const updatePlacementControls = placementControl => {
  //update PR controls on channel or ns change
  const { active, groupControlData } = placementControl

  const onlineControl = groupControlData.find(
    ({ id }) => id === online_cluster_only_checkbox
  )
  const clusterSelectorControl = groupControlData.find(
    ({ id }) => id === 'clusterSelector'
  )
  const clusterReplicasControl = groupControlData.find(
    ({ id }) => id === 'clusterReplicas'
  )

  if (active === true) {
    onlineControl && _.set(onlineControl, 'type', 'hidden')
    clusterSelectorControl && _.set(clusterSelectorControl, 'type', 'hidden')
    clusterReplicasControl && _.set(clusterReplicasControl, 'type', 'hidden')
  } else {
    onlineControl && _.set(onlineControl, 'type', 'checkbox')
    clusterSelectorControl && _.set(clusterSelectorControl, 'type', 'custom')
    clusterReplicasControl && _.set(clusterReplicasControl, 'type', 'text')
  }

  return groupControlData
}

export const loadExistingChannels = type => {
  return {
    query: HCMChannelList,
    loadingDesc: 'creation.app.loading.channels',
    setAvailable: setAvailableChannelSpecs.bind(null, type)
  }
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

const updateChannelControls = (urlControl, globalControl) => {
  //update existing placement rule section when user changes the namespace
  const nsControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'namespace'
  )
  updateNSControls(nsControl, globalControl)

  const { active, availableData, groupControlData } = urlControl
  const pathData = availableData[active]

  const nameControl = groupControlData.find(
    ({ id: idCtrl }) => idCtrl === 'channelName'
  )
  const namespaceControl = groupControlData.find(
    ({ id }) => id === 'channelNamespace'
  )
  // change channel name and namespace to reflect github path
  if (active) {
    const a = document.createElement('a')
    a.href = active

    // if existing channel, reuse channel name and namespace
    if (pathData && pathData.metadata) {
      nameControl.active = pathData.metadata.name
      namespaceControl.active = pathData.metadata.namespace
    } else {
      let name = a.pathname.split('/').pop()
      name = name.split('.').shift()
      nameControl.active = `${name}-chn`
      namespaceControl.active = ''
    }
  } else {
    nameControl.active = 'resource'
    namespaceControl.active = ''
  }

  let control
  // if existing channel, hide user/token controls
  const type = !pathData ? 'text' : 'hidden'
  const setType = cid => {
    control = groupControlData.find(({ id }) => id === cid)
    _.set(control, 'type', type)
    if (type === 'hidden') {
      _.set(control, 'active', '')
    }
  }
  const { id } = urlControl
  if (id === 'githubURL') {
    setType('githubUser')
    setType('githubAccessId')
  } else if (id === 'objectstoreURL') {
    setType('accessKey')
    setType('secretKey')
  }
}

const githubChannelData = [
  ///////////////////////  github  /////////////////////////////////////
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
    name: 'creation.app.github.url',
    tooltip: 'tooltip.creation.app.github.url',
    id: 'githubURL',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.github.url',
    available: [],
    validation: VALIDATE_URL,
    fetchAvailable: loadExistingChannels('git'),
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.github.user',
    tooltip: 'tooltip.creation.app.github.user',
    id: 'githubUser',
    type: 'text',
    active: '',
    encode: true,
    placeholder: 'app.enter.select.username'
  },
  {
    name: 'creation.app.github.accessid',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubAccessId',
    type: 'text',
    encode: true,
    active: '',
    placeholder: 'app.enter.access.token'
  },
  {
    name: 'creation.app.github.branch',
    tooltip: 'tooltip.creation.app.github.branch',
    id: 'githubBranch',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.branch',
    available: ['master'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.branch'
  },
  {
    name: 'creation.app.github.path',
    tooltip: 'tooltip.creation.app.github.path',
    id: 'githubPath',
    type: 'combobox',
    active: '',
    placeholder: 'app.enter.select.path',
    available: [],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.path'
  },
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
    id: exiting_rule_checkbox,
    type: 'checkbox',
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
    id: local_cluster_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControls,
    active: false,
    available: []
  },
  {
    id: online_cluster_only_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.onlineClusters',
    tooltip: 'tooltip.creation.app.settings.onlineClusters',
    active: false,
    available: []
  },
  {
    type: 'custom',
    id: 'clusterSelector',
    component: <ClusterSelector />,
    available: []
  },
  {
    name: 'creation.app.settings.clustersReplica',
    tooltip: 'tooltip.creation.app.settings.clustersReplica',
    id: 'clusterReplicas',
    type: 'text',
    active: '',
    placeholder: 'creation.app.settings.ph.clustersReplica',
    available: [],
    validation: {}
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

const hubClusterChannelData = [
  ///////////////////////  Hub Cluster  /////////////////////////////////////

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
    id: exiting_rule_checkbox,
    type: 'checkbox',
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
    id: local_cluster_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControls,
    active: false,
    available: []
  },
  {
    id: online_cluster_only_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.onlineClusters',
    tooltip: 'tooltip.creation.app.settings.onlineClusters',
    active: false,
    available: []
  },
  {
    type: 'custom',
    id: 'clusterSelector',
    component: <ClusterSelector />,
    available: []
  },
  {
    name: 'creation.app.settings.clustersReplica',
    tooltip: 'tooltip.creation.app.settings.clustersReplica',
    id: 'clusterReplicas',
    type: 'text',
    active: '',
    placeholder: 'creation.app.settings.ph.clustersReplica',
    available: [],
    validation: {}
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  settings  /////////////////////////////////////
  {
    id: 'channelName',
    type: 'hidden',
    active: 'resource'
  },
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

const helmReleaseChannelData = [
  ///////////////////////  HelmRelease  /////////////////////////////////////
  {
    name: 'creation.ocp.purpose',
    tooltip: 'tooltip.creation.ocp.purpose',
    id: 'purposehl',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.purpose'
  }
]

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
    fetchAvailable: loadExistingChannels('objectbucket'),
    onSelect: updateChannelControls
  },
  {
    name: 'creation.app.objectstore.accesskey',
    tooltip: 'tooltip.creation.app.objectstore.accesskey',
    id: 'accessKey',
    type: 'text',
    active: '',
    encode: true,
    placeholder: 'app.enter.accesskey'
  },
  {
    name: 'creation.app.objectstore.secretkey',
    tooltip: 'tooltip.creation.app.objectstore.secretkey',
    id: 'secretKey',
    type: 'text',
    encode: true,
    active: '',
    placeholder: 'app.enter.secretkey'
  },
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
    id: exiting_rule_checkbox,
    type: 'checkbox',
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
    id: local_cluster_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControls,
    active: false,
    available: []
  },
  {
    id: online_cluster_only_checkbox,
    type: 'checkbox',
    name: 'creation.app.settings.onlineClusters',
    tooltip: 'tooltip.creation.app.settings.onlineClusters',
    active: false,
    available: []
  },
  {
    type: 'custom',
    id: 'clusterSelector',
    component: <ClusterSelector />,
    available: []
  },
  {
    name: 'creation.app.settings.clustersReplica',
    tooltip: 'tooltip.creation.app.settings.clustersReplica',
    id: 'clusterReplicas',
    type: 'text',
    active: '',
    placeholder: 'creation.app.settings.ph.clustersReplica',
    available: [],
    validation: {}
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

export const controlData = [
  {
    id: 'main',
    type: 'section',
    note: 'creation.view.required.mark'
  },
  {
    name: 'creation.app.name',
    tooltip: 'tooltip.creation.app.name',
    id: 'name',
    type: 'text',
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true
    }
  },
  {
    name: 'creation.app.namespace',
    tooltip: 'tooltip.creation.app.namespace',
    id: 'namespace',
    type: 'combobox',
    fetchAvailable: loadExistingNamespaces(),
    onSelect: updateNSControls,
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true
    }
  },
  {
    id: 'userDefinedNamespace',
    type: 'hidden',
    active: ''
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channelSection',
    type: 'section',
    title: 'creation.app.channels',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channels',
    type: 'group',
    prompts: {
      nameId: 'channelPrompt',
      baseName: 'resource',
      addPrompt: 'creation.app.add.channel',
      deletePrompt: 'creation.app.delete.channel'
    },
    controlData: [
      {
        id: 'channel',
        type: 'section',
        title: 'creation.app.channel.title',
        collapsable: true,
        collapsed: false
      },
      ///////////////////////  channel name  /////////////////////////////////////
      {
        id: 'channelPrompt',
        type: 'hidden',
        active: ''
      },
      {
        id: 'channelType',
        type: 'cards',
        sort: false,
        collapseCardsControlOnSelect: true,
        scrollViewToTopOnSelect: true,
        title: 'creation.app.channel.type',
        collapsable: true,
        collapsed: false,
        available: [
          {
            id: 'github',
            logo: 'git-repo.svg',
            title: 'creation.app.channel.github',
            tooltip: 'tooltip.creation.app.channel.git',
            change: {
              insertControlData: githubChannelData
            }
          },
          {
            id: 'deployable',
            logo: 'namespace-repo.svg',
            title: 'creation.app.channel.deployable',
            tooltip: 'tooltip.creation.app.channel.namespace',
            change: {
              insertControlData: hubClusterChannelData
            }
          },
          {
            id: 'helmrepo',
            logo: 'helm-repo.png',
            title: 'creation.app.channel.helmrepo',
            tooltip: 'tooltip.creation.app.channel.helmrepo',
            change: {
              insertControlData: helmReleaseChannelData
            }
          },
          {
            id: 'objectstore',
            logo: 'object-bucket-repo.svg',
            title: 'creation.app.channel.objectstore',
            tooltip: 'tooltip.creation.app.channel.objectstore',
            change: {
              insertControlData: objectstoreChannelData
            }
          }
        ],
        active: '',
        validation: {}
      }
    ]
  }
]

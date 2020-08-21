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

export const updateNSControls = (urlControl, control) => {
  const { active, availableData } = urlControl
  const userDefinedNSControl = control.find(
    ({ id }) => id === 'userDefinedNamespace'
  )
  const existingRuleControl = control.find(
    ({ id }) => id === 'placementrulecombo'
  )
  const existingruleCheckbox = control.find(
    ({ id }) => id === 'existingrule-checkbox'
  )

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

      userDefinedNSControl.active = ''
    }
  }

  _.set(existingRuleControl, 'active', '')

  updateNewRuleControlsData('', control)
  return userDefinedNSControl
}

export const updateNewRuleControls = (urlControl, control) => {
  const { active, availableData } = urlControl
  const selectedPR = availableData[active]

  const selectedRuleNameControl = control.find(
    ({ id }) => id === 'selectedRuleName'
  )
  selectedRuleNameControl.active = active

  updateNewRuleControlsData(selectedPR, control)
}

export const updateNewRuleControlsData = (selectedPR, control) => {
  const onlineControl = control.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )
  const clusterSelectorControl = control.find(
    ({ id }) => id === 'clusterSelector'
  )

  const clusterReplicasControl = control.find(
    ({ id }) => id === 'clusterReplicas'
  )

  const localClusterControl = control.find(
    ({ id }) => id === 'local-cluster-checkbox'
  )

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
      Object.keys(clusterSelectorData).forEach((key) => {
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

export const updateDisplayForPlacementControls = (urlControl, control) => {
  const { active } = urlControl

  const existingRuleControl = control.find(
    ({ id }) => id === 'placementrulecombo'
  )

  const onlineControl = control.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )
  const clusterSelectorControl = control.find(
    ({ id }) => id === 'clusterSelector'
  )

  const clusterReplicasControl = control.find(
    ({ id }) => id === 'clusterReplicas'
  )

  const localClusterControl = control.find(
    ({ id }) => id === 'local-cluster-checkbox'
  )

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

    _.set(onlineControl, 'active', false)
    _.set(clusterSelectorControl, 'active.mode', false)
    _.set(clusterReplicasControl, 'active', '')
    _.set(clusterSelectorControl, 'active.mode', false)
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: true }
    ]
  }

  return control
}

export const updatePlacementControls = (urlControl, control) => {
  const { active } = urlControl

  const onlineControl = control.find(
    ({ id }) => id === 'online-cluster-only-checkbox'
  )
  const clusterSelectorControl = control.find(
    ({ id }) => id === 'clusterSelector'
  )

  const clusterReplicasControl = control.find(
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

  return control
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
        return type.startsWith(p.toLowerCase())
      }),
      'objectPath'
    )
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }
}

const updateChannelControls = urlControl => {
  const { active, availableData, groupControlData } = urlControl
  const pathData = availableData[active]

  const nameControl = groupControlData.find(({ id }) => id === 'channelName')
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
  }
]

const deployableChannelData = [
  ///////////////////////  Deployable  /////////////////////////////////////
  {
    name: 'creation.ocp.purpose',
    tooltip: 'tooltip.creation.ocp.purpose',
    id: 'purposedc',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.purpose'
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
    numbered: '1',
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
            logo: 'resource-github-icon.svg',
            title: 'creation.app.channel.github',
            tooltip: 'tooltip.creation.app.channel.git',
            change: {
              insertControlData: githubChannelData
            }
          },
          {
            id: 'deployable',
            logo: 'resource-deployable-icon.svg',
            title: 'creation.app.channel.deployable',
            tooltip: 'tooltip.creation.app.channel.namespace',
            change: {
              insertControlData: deployableChannelData
            }
          },
          {
            id: 'helmrepo',
            logo: 'resource-helmrepo-icon.svg',
            title: 'creation.app.channel.helmrepo',
            tooltip: 'tooltip.creation.app.channel.helmrepo',
            change: {
              insertControlData: helmReleaseChannelData
            }
          },
          {
            id: 'objectstore',
            logo: 'resource-objectstore-icon.svg',
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
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  clusters  /////////////////////////////////////
  {
    id: 'clusterSection',
    type: 'section',
    title: 'creation.app.placement.rule',
    numbered: '2',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  {
    id: 'existingrule-checkbox',
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
    id: 'local-cluster-checkbox',
    type: 'checkbox',
    name: 'creation.app.settings.localClusters',
    tooltip: 'tooltip.creation.app.settings.localClusters',
    onSelect: updatePlacementControls,
    active: true,
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
    numbered: '3',
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

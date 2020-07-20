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

import { VALIDATE_ALPHANUMERIC } from '../../TemplateEditor/utils/update-controls'

const VALID_DNS_LABEL = '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'

const githubChannelData = [
  ///////////////////////  github  /////////////////////////////////////
  {
    name: 'creation.app.github.path',
    tooltip: 'tooltip.creation.app.github.path',
    id: 'githubPath',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.path'
  },
  {
    name: 'creation.app.github.user',
    tooltip: 'tooltip.creation.app.github.user',
    id: 'githubUser',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.user'
  },
  {
    name: 'creation.app.github.accessid',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubAccessId',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.accessid'
  },
  {
    name: 'creation.app.github.branch',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubBranch',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.accessid'
  },
  {
    name: 'creation.app.github.commit',
    tooltip: 'tooltip.creation.app.github.accessid',
    id: 'githubCommit',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.app.github.accessid'
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
    name: 'creation.ocp.purpose',
    tooltip: 'tooltip.creation.ocp.purpose',
    id: 'purposeos',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.purpose'
  }
]

const secretNameChannelData = [
  ///////////////////////  Secret name  /////////////////////////////////////
  {
    name: 'creation.ocp.purpose',
    tooltip: 'tooltip.creation.ocp.purpose',
    id: 'purposesc',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.purpose'
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
    syncWith: 'namespace',
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
    type: 'text',
    syncedWith: 'name',
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true
    }
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
      nameId: 'channelName',
      baseName: 'channel',
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
        id: 'channelName',
        type: 'hidden',
        active: 'channel'
      },
      {
        id: 'channelType',
        type: 'cards',
        sort: false,
        collapseControlOnSelect: true,
        title: 'creation.app.channel.type',
        collapsable: true,
        collapsed: false,
        available: [
          {
            id: 'github',
            logo: 'resource-github-icon.svg',
            title: 'creation.app.channel.github',
            tooltip: 'tooltip.creation.app.channel.existing',
            change: {
              insertControlData: githubChannelData
            }
          },
          {
            id: 'deployable',
            logo: 'resource-deployable-icon.svg',
            title: 'creation.app.channel.deployable',
            tooltip: 'tooltip.creation.app.channel.existing',
            change: {
              insertControlData: deployableChannelData
            }
          },
          {
            id: 'helmrepo',
            logo: 'resource-helmrepo-icon.svg',
            title: 'creation.app.channel.helmrepo',
            tooltip: 'tooltip.creation.app.channel.existing',
            change: {
              insertControlData: helmReleaseChannelData
            }
          },
          {
            id: 'objectstore',
            logo: 'resource-objectstore-icon.svg',
            title: 'creation.app.channel.objectstore',
            tooltip: 'tooltip.creation.app.channel.existing',
            change: {
              insertControlData: objectstoreChannelData
            }
          },
          {
            id: 'secret',
            logo: 'resource-secret-icon.svg',
            title: 'creation.app.channel.secret',
            tooltip: 'tooltip.creation.app.channel.existing',
            change: {
              insertControlData: secretNameChannelData
            }
          }
        ],
        active: '',
        validation: {
          notification: 'creation.ocp.cluster.must.select.resource.type',
          required: true
        }
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
    name: 'creation.view.policy.binding',
    description: 'policy.create.selectors.tooltip',
    placeholder: 'creation.view.policy.select.selectors',
    id: 'clusters',
    type: 'multiselect',
    available: []
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  settings  /////////////////////////////////////
  {
    id: 'settingsSection',
    type: 'section',
    title: 'creation.app.section.settings',
    numbered: '4',
    overline: true,
    collapsable: true,
    collapsed: false
  },

  {
    id: 'online-cluster-only-checkbox',
    type: 'checkbox',
    name: 'creation.app.settings.onlineClustersOnly',
    tooltip: 'tooltip.creation.app.settings.onlineClustersOnly',
    active: true,
    available: []
  },
  // {
  //   id: 'keep-resources-when-deleted-from-app',
  //   type: 'checkbox',
  //   name: 'creation.app.settings.keepResourcesWhenDeletedFromApp',
  //   tooltip: 'tooltip.creation.app.settings.keepResourcesWhenDeletedFromApp',
  //   active: false,
  //   available: [],
  // },
  // {
  //   id: 'disable-resource-reconciliation',
  //   type: 'checkbox',
  //   name: 'creation.app.settings.disableResourceReconciliation',
  //   tooltip: 'tooltip.creation.app.settings.disableResourceReconciliation',
  //   active: false,
  //   available: [],
  // },

  {
    id: 'time-window-title',
    type: 'title',
    title: 'creation.app.settings.timeWindow',
    tooltip: 'tooltip.creation.app.settings.timeWindow'
  },
  {
    id: 'time-window-active-mode',
    type: 'checkbox',
    name: 'creation.app.settings.timeWindow.activeMode',
    active: true,
    available: []
  },
  {
    id: 'time-window-block-mode',
    type: 'checkbox',
    name: 'creation.app.settings.timeWindow.blockMode',
    active: true,
    available: []
  }
]

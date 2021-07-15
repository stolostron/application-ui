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

import config from '../../../../lib/shared/config'

export const controlData = [
  {
    id: 'createStep',
    type: 'step',
    title: 'argo.basic.info'
  },
  {
    id: 'showSecrets',
    type: 'hidden',
    active: false
  },
  ///////////////////////  General  /////////////////////////////////////
  {
    name: 'argo.create.name',
    tooltip: 'argo.set.name.tooltip',
    id: 'appSetName',
    type: 'text',
    label: 'argo.create.name',
    placeholder: 'argo.create.placeholder',
    validation: {
      required: true
    }
  },
  {
    name: 'argo.cluster.name',
    tooltip: 'argo.cluster.tooltip',
    id: 'clusterName',
    type: 'combobox',
    label: 'argo.cluster.name',
    placeholder: 'argo.cluster.placeholder',
    validation: {
      required: true
    }
  },
  ///////////////////////  cluster decision resource  /////////////////////////////////////
  {
    id: 'decisionResource',
    type: 'group',
    onlyOne: true,
    controlData: [
      {
        id: 'decisionResource',
        type: 'section',
        collapsable: true,
        subtitle: 'argo.cluster.decision.resource.title'
      },
      ///////// name /////////
      {
        name: 'argo.cluster.decision.resource.name',
        tooltip: 'tooltip.creation.ocp.aws.instance.type',
        id: 'decisionResourceName',
        type: 'combobox',
        placeholder: 'argo.cluster.decision.resource.placeholder',
        validation: {
          required: true
        }
      },
      ///////// requeue time /////////
      {
        name: 'argo.cluster.decision.requeue.title',
        tooltip: 'tooltip.creation.ocp.aws.instance.type',
        id: 'requeueTime',
        type: 'combobox',
        placeholder: 'argo.cluster.decision.resource.placeholder',
        active: '30',
        available: ['30', '60', '120', '180'],
        validation: {
          required: true
        }
      }
    ]
  },
  ///////////////////////  template  /////////////////////////////////////
  {
    id: 'template',
    type: 'step',
    title: 'argo.template.title'
  },
  {
    id: 'source',
    type: 'title',
    info: 'argo.template.source.title'
  },
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channels',
    type: 'group',
    controlData: [
      {
        id: 'channel',
        type: 'section',
        title: 'creation.app.channel.title',
        collapsable: true,
        collapsed: false,
        editing: { editMode: true }
      },
      ///////////////////////  channel name  /////////////////////////////////////
      {
        id: 'channelPrompt',
        type: 'hidden',
        active: ''
      },
      {
        id: 'selfLinks',
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
            logo: `${config.contextPath}/graphics/git-repo.svg`,
            title: 'channel.type.git',
            tooltip: 'tooltip.creation.app.channel.git'
            // change: {
            //   insertControlData: await gitChannelData()
            // }
          },
          {
            id: 'helmrepo',
            logo: `${config.contextPath}/graphics/helm-repo.png`,
            title: 'channel.type.helmrepo',
            tooltip: 'tooltip.channel.type.helmrepo'
            // change: {
            //   insertControlData: await helmReleaseChannelData()
            // }
          }
        ],
        active: '',
        validation: {}
      }
    ]
  },
  ///////// destination //////////
  {
    id: 'destination',
    type: 'title',
    info: 'argo.template.destination.title'
  },
  {
    id: 'destinationType',
    type: 'singleselect',
    name: 'argo.destination.type',
    active: 'Name',
    available: [
      {
        id: 'Name',
        title: 'argo.destination.name',
        change: {
          insertControlData: [
            {
              id: 'destinationName',
              tooltip: 'argo.destination.name.tooltip',
              type: 'combobox',
              placeholder: 'argo.destination.name.placeholder',
              validation: {
                required: true
              }
            }
          ]
        }
      },
      {
        id: 'Server',
        title: 'argo.destination.server'
      }
    ],
    validation: {
      required: true
    }
  },
  {
    id: 'destinationNS',
    name: 'argo.destination.namespace',
    tooltip: 'argo.destination.namespace.tooltip',
    type: 'combobox',
    placeholder: 'argo.destination.namespace.placeholder',
    validation: {
      required: true
    }
  },
  ///////////////////////  sync policy  /////////////////////////////////////
  {
    id: 'syncPolicy',
    type: 'step',
    title: 'argo.sync.policy.title'
  },
  {
    id: 'policy',
    type: 'title',
    info: 'argo.sync.policy.subtitle'
  },
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
  },
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
    onSelect: {},
    active: false,
    validation: {}
  }
]

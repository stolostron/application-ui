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

import {VALIDATE_ALPHANUMERIC, VALIDATE_NUMERIC} from '../../TemplateEditor/utils/update-controls'

const VALID_DNS_LABEL = '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'


export const controlData = [
  {
    id: 'main',
    type: 'section',
    note: 'creation.view.required.mark',
  },
  {
    name: 'creation.app.name',
    tooltip: 'tooltip.creation.app.name',
    id: 'name',
    type: 'text',
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true,
    },
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
    collapsed: false,
  },
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channels',
    type: 'group',
    prompts: {
      nameId: 'channelName',
      baseName: 'channel',
      addPrompt: 'creation.app.add.channel',
      deletePrompt: 'creation.app.delete.channel',
    },
    controlData: [
      {
        id: 'channel',
        type: 'section',
        subtitle: 'creation.app.channel.group',
        collapsable: true,
        collapsed: false,
      },
      ///////////////////////  channel name  /////////////////////////////////////
      {
        id: 'channelName',
        type: 'hidden',
        active: 'channel',
      },
      ///////////////////////  channel type  /////////////////////////////////////
      {
        name: 'creation.app.channel.type',
        tooltip: 'tooltip.creation.app.channel.type',
        id: 'channelType',
        type: 'text',
        validation: VALIDATE_NUMERIC,
      },
      ///////////////////////  repo  /////////////////////////////////////
      {
        name: 'creation.app.repository',
        tooltip: 'tooltip.creation.app.repository',
        id: 'repository',
        type: 'combobox',
        active: 'us-east-1',
        available: [],
        validation: VALIDATE_ALPHANUMERIC,
        cacheUserValueKey: 'create.app.repository',
      },
    ],
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
    collapsed: true,
  },

  {
    name: 'creation.view.policy.binding',
    description: 'policy.create.selectors.tooltip',
    placeholder: 'creation.view.policy.select.selectors',
    id: 'clusters',
    type: 'multiselect',
    available: [],
  },

  {
    name: 'creation.app.namespace',
    tooltip: 'tooltip.creation.app.namespace',
    id: 'name',
    type: 'text',
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true,
    },
  },


]

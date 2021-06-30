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

import {
  loadExistingAnsibleProviders,
  getSharedSubscriptionWarning
} from './utils'
import React from 'react'

const OpenNewTab = () => (
  <svg
    width="24px"
    height="24px"
    x="0px"
    y="0px"
    viewBox="0 0 1024 1024"
    xmlSpace="preserve"
    role="presentation"
  >
    <g stroke="none" strokeWidth="1" fillRule="evenodd">
      <path d="M576,320 L896,320 L896,192 L576,192 L576,320 Z M128,320 L448,320 L448,192 L128,192 L128,320 Z M930,64 L896,64 L128,64 L94,64 C42.085,64 0,106.085 0,158 L0,192 L0,832 L0,866 C0,917.915 42.085,960 94,960 L128,960 L488,960 C501.255,960 512,949.255 512,936 L512,856 C512,842.745 501.255,832 488,832 L140,832 C133.373,832 128,826.627 128,820 L128,448 L896,448 L896,552 C896,565.255 906.745,576 920,576 L1000,576 C1013.255,576 1024,565.255 1024,552 L1024,158 C1024,106.085 981.915,64 930,64 L930,64 Z" />
      <path d="M968,784 L848,784 L848,664 C848,650.7 837.3,640 824,640 L776,640 C762.7,640 752,650.7 752,664 L752,784 L632,784 C618.7,784 608,794.7 608,808 L608,856 C608,869.3 618.7,880 632,880 L752,880 L752,1000 C752,1013.3 762.7,1024 776,1024 L824,1024 C837.3,1024 848,1013.3 848,1000 L848,880 L968,880 C981.3,880 992,869.3 992,856 L992,808 C992,794.7 981.3,784 968,784" />
    </g>
  </svg>
)

const prePostTasks = [
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  pre/post jobs  /////////////////////////////////////
  {
    id: 'perPostSection',
    type: 'section',
    title: 'creation.app.section.prePost',
    overline: true,
    collapsable: true,
    collapsed: true,
    info: getSharedSubscriptionWarning,
    editing: { collapsed: true, editMode: true } // if editing existing app, collapse this field initially
  },
  {
    name: 'creation.app.ansible.credential.name',
    tooltip: 'tooltip.creation.app.ansibleSecretName',
    id: 'ansibleSecretName',
    type: 'singleselect',
    active: '',
    placeholder: 'app.enter.select.ansibleSecretName',
    available: [],
    fetchAvailable: loadExistingAnsibleProviders(),
    reverse: 'Subscription[0].spec.hooksecretref.name',
    validation: {},
    prompts: {
      prompt: 'creation.ocp.cloud.add.connection',
      icon: <OpenNewTab />,
      type: 'link',
      url: '/multicloud/credentials/add', // launch to credential page
      positionBottomRight: true,
      id: 'add-provider-connection'
    }
  }
]

export default prePostTasks

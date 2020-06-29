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

import {VALIDATE_ALPHANUMERIC} from '../../TemplateEditor/utils/update-controls'

const VALID_DNS_LABEL = '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'

const clouds = [
  'auto-detect',
  'AWS',
  'GCP',
  'Azure',
  'IBM',
  'VMWare',
  'RH',
  'Datacenter']

export const controlData = [
  {
    id: 'main',
    type: 'section',
    title: 'creation.ocp.cluster.details',
    collapsable: true,
  },
  {
    name: 'creation.ocp.name',
    tooltip: 'tooltip.creation.ocp.name',
    id: 'name',
    type: 'text',
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true,
    },
  },


  ////////////////////// LABELS /////////////////////////
  {
    id: 'chooseLabels',
    type: 'section',
    title: 'creation.ocp.cluster.labels',
    overline: true,
    collapsable: true,
    collapsed:false,
  },
  {
    name: 'creation.ocp.cloud',
    tooltip: 'tooltip.creation.ocp.cloud',
    id: 'cloud',
    type: 'combobox',
    active: 'auto-detect',
    available: clouds,
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.cloud',
  },
  {
    name: 'creation.ocp.purpose',
    tooltip: 'tooltip.creation.ocp.purpose',
    id: 'purpose',
    type: 'combobox',
    active: '',
    placeholder: 'cluster.create.select.purpose',
    available: ['dev', 'prod', 'qa'],
    validation: VALIDATE_ALPHANUMERIC,
    cacheUserValueKey: 'create.cluster.purpose',
  },
  {
    name: 'creation.ocp.addition.labels',
    tooltip: 'tooltip.creation.ocp.addition.labels',
    id: 'additional',
    type: 'labels',
    active: []
  },
  ////////////////////// OPTIONS /////////////////////////
  {
    id: 'applicationManager',
    type: 'hidden',
    name: 'creation.ocp.applicationManager',
    active: 'true',
    available: ['false', 'true']
  },
  {
    id: 'policyController',
    type: 'hidden',
    name: 'creation.ocp.policyController',
    active: 'true',
    available: ['false', 'true']
  },
  {
    id: 'certPolicyController',
    type: 'hidden',
    name: 'creation.ocp.certPolicyController',
    active: 'true',
    available: ['false', 'true']
  },
  {
    id: 'cisPolicyController',
    type: 'hidden',
    name: 'creation.ocp.cisPolicyController',
    active: 'false',
    available: ['false', 'true']
  },
  {
    id: 'iamPolicyController',
    type: 'hidden',
    name: 'creation.ocp.iamPolicyController',
    active: 'true',
    available: ['false', 'true']
  },
  {
    id: 'searchCollector',
    type: 'hidden',
    name: 'creation.ocp.searchCollector',
    active: 'true',
    available: ['false', 'true']
  }

]

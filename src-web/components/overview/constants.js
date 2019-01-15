/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export const CardTypes = Object.freeze({
  provider: 'provider',
  counts: 'counts',
  heatmap: 'heatmap',
  piechart: 'piechart',
  linegraph: 'linegraph',
})

export const CardActions = Object.freeze({
  pie: 'pie',
  line: 'line',
  remove: 'remove',
})

export const DataType = Object.freeze({
  pods: 'pods',
  cluster: 'cluster',
  compliance: 'compliance',
  cpu: 'cpu',
  memory: 'memory',
  storage: 'storage',
})

export const TagTypes = Object.freeze({
  nounits: 'nounits',
  units: 'units',
  nopercent: 'nopercent',
})

export const HeatSelections = Object.freeze({
  groupBy: 'groupBy',
  size: 'size',
  shade: 'shade',
})

export const GroupByChoices = Object.freeze({
  provider: 'provider',
  region: 'region',
  purpose: 'purpose',
  service: 'service',
})

export const SizeChoices = Object.freeze({
  workers: 'workers',
  pods: 'pods',
  nonCompliant: 'nonCompliant',
})

export const ShadeChoices = Object.freeze({
  vcpu: 'vcpu',
  memory: 'memory',
  storage: 'storage',
})

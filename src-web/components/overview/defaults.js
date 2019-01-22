/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { CardTypes, CardActions, DataType, TagTypes, GroupByChoices, SizeChoices, ShadeChoices } from './constants.js'
import {PROVIDER_FILTER} from './filterHelper'
import msgs from '../../../nls/platform.properties'


export const getDefaultViewState = (locale) => {
  const activeFilters={}
  activeFilters[PROVIDER_FILTER] = []
  activeFilters['environment'] = []
  activeFilters['region'] = []
  activeFilters['vendor'] = []

  const state =  {
    activeFilters,
    heatMapState: {
      expanded: false,
      heatMapChoices: {
        groupBy: GroupByChoices.provider,
        size: SizeChoices.workers,
        shade: ShadeChoices.vcpu,
      }
    },
    bannerCards: [],
    providerCards: [],
    cardOrder: [
      {
        type: CardTypes.counts,
        actions: [],
      },
      {
        type: CardTypes.heatmap,
        actions: [],
      },
      {
        type: CardTypes.piechart,
        title: msgs.get('overview.status.policies', locale),
        dataType: DataType.compliance,
        labelKey: 'compliant',
        pieData: {
          'compliant':{name: msgs.get('overview.status.compliant', locale), values: ['compliant'], className:'compliant'},
          'default': {name: msgs.get('overview.status.noncompliant', locale), className:'non-compliant'},
        },
        actions: [CardActions.line],
      },
      {
        type: CardTypes.piechart,
        title: msgs.get('overview.status.pods', locale),
        dataType: DataType.pods,
        labelKey: 'running',
        pieData: {
          'running':{name: msgs.get('overview.status.running', locale), values: ['running', 'succeeded'], className:'running'},
          'pending':{name: msgs.get('overview.status.pending', locale), values: ['pending'], className:'pending'},
          'default': {name: msgs.get('overview.status.failed', locale), className:'failed'},
        },
        actions: [CardActions.line],
      },
      {
        type: CardTypes.piechart,
        title: msgs.get('overview.status.clusters', locale),
        dataType: DataType.cluster,
        labelKey: 'ready',
        pieData: {
          'ready':{name: msgs.get('overview.status.ready', locale), values: ['ok'], className:'ready'},
          'default': {name: msgs.get('overview.status.offline', locale), className:'offline'},
        },
        actions: [CardActions.line],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.vcpu', locale),
        dataType: DataType.cpu,
        tagType: TagTypes.nounits,
        actions: [CardActions.pie],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.memory', locale),
        dataType: DataType.memory,
        tagType: TagTypes.units,
        actions: [CardActions.pie],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.storage', locale),
        dataType: DataType.storage,
        tagType: TagTypes.units,
        actions: [CardActions.pie],
      },

    ]
  }
  return state
}


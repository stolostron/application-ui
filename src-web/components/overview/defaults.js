/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { CardTypes, CardActions, TagTypes, GroupByChoices, SizeChoices, ShadeChoices } from './constants.js'
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
    heatMapChoices: {
      groupBy: GroupByChoices.provider,
      size: SizeChoices.workers,
      shade: ShadeChoices.vcpu,
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
        overviewKey: 'policies', //TODO
        valueKey: 'status',      //TODO
        labelKey: 'compliant',
        pieData: {
          'compliant':{name: msgs.get('overview.status.compliant', locale), values: ['compliant'], className:'compliant'},
          'default': {name: msgs.get('overview.status.noncompliant', locale), className:'noncompliant'},
        },
        actions: [CardActions.line],
      },
      {
        type: CardTypes.piechart,
        title: msgs.get('overview.status.pods', locale),
        overviewKey: 'pods',
        valueKey: 'status',
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
        overviewKey: 'clusters',
        valueKey: 'status',
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
        overviewKey: 'clusters',
        valueKey: 'cpu',
        tagType: TagTypes.nounits,
        actions: [CardActions.pie],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.memory', locale),
        overviewKey: 'clusters',
        valueKey: 'memory',
        deflateValues: true,
        tagType: TagTypes.units,
        actions: [CardActions.pie],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.storage', locale),
        overviewKey: 'clusters',
        valueKey: 'storage',
        deflateValues: true,
        tagType: TagTypes.units,
        actions: [CardActions.pie],
      },

    ]
  }
  return state
}


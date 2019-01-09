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
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import _ from 'lodash'

export const addDefaultProviders = (cardOrder, locale) => {

  // first try config file
  let defaultProviders = config['overview']
  if (!defaultProviders) {
    // else default to these
    defaultProviders = [
      {'title':  msgs.get('provider.aws', locale), 'include':['aws']},
      {'title':  msgs.get('provider.azure', locale), 'include':['azure']},
      {'title':  msgs.get('provider.ibm', locale), 'include':['ibm']},
      {'title':  msgs.get('provider.datacenter', locale), 'exclude':['aws','azure','ibm']}
    ]
  }

  // add defaults to cardOrder
  _.cloneDeep(defaultProviders).reverse().forEach(({title, include=[], exclude=[]})=>{
    cardOrder.unshift({
      title,
      type: CardTypes.provider,
      include,
      exclude,
      actions: [ CardActions.remove],
    })
  })
}

export const getDefaultViewState = (locale) => {
  const state =  {
    activeFilters: {
      cloud: [],
      environment: [],
      region: [],
      vendor: [],
    },
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
        actions: [ CardActions.remove],
      },
      {
        type: CardTypes.heatmap,
        actions: [ CardActions.remove],
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
        actions: [  CardActions.line, CardActions.remove],
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
        actions: [  CardActions.line, CardActions.remove],
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
        actions: [ CardActions.line, CardActions.remove],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.vcpu', locale),
        overviewKey: 'clusters',
        valueKey: 'cpu',
        tagType: TagTypes.nounits,
        actions: [  CardActions.pie, CardActions.remove],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.memory', locale),
        overviewKey: 'clusters',
        valueKey: 'memory',
        deflateValues: true,
        tagType: TagTypes.units,
        actions: [CardActions.pie, CardActions.remove],
      },
      {
        type: CardTypes.linegraph,
        title: msgs.get('overview.status.storage', locale),
        overviewKey: 'clusters',
        valueKey: 'storage',
        deflateValues: true,
        tagType: TagTypes.units,
        actions: [CardActions.pie, CardActions.remove],
      },

    ]
  }
  addDefaultProviders(state.cardOrder, locale)
  return state
}


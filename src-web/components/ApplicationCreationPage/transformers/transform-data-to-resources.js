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

import _ from 'lodash'


// remove the kube stuff
const kube = [
  'creationTimestamp',
  'status',
  'uid',
  'deployables',
  'livenessProbe',
  'resourceVersion',
  'generation']

const keepKeys = [
  'apps.open-cluster-management.io/git-branch',
  'apps.open-cluster-management.io/git-path'
]

const isFiltered = (value, key, parentKey) => {
  if (kube.includes(key)) {
    return true
  }
  if (parentKey==='annotations' && !keepKeys.includes(key)) {
    return true
  }
  return false
}

const filter = (value, parentKey) => {
  if (typeof value==='object') {
    return filterDeep(value, parentKey)
  }
  return value
}

const filterDeep = (obj, parentKey) => {
  const newObj = {}
  let key
  let value
  for (key in obj) {
    value = filter(obj[key], key)
    if (!isFiltered(value, key, parentKey)) {
      newObj[key] = value
    }
  }
  return newObj
}

export const getApplicationResources = (application) => {
  if (application) {
    const {app, subscriptions} = _.cloneDeep(application)
    const resources = []

    // application
    resources.push(filterDeep(app))

    // for each subscriptions, do channel and rule
    subscriptions.forEach(subscription=>{
      const {channels, rules} = subscription
      delete subscription.channels
      delete subscription.rules
      resources.push(filterDeep(channels[0]))
      resources.push(filterDeep(subscription))
      if (rules) {
        resources.push(filterDeep(rules[0]))
      }
    })
    return resources
  }
  return null
}

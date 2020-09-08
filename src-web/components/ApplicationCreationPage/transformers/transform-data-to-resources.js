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


// remove the system stuff
const system = ['creationTimestamp', 'status', 'uid', 'annotations', 'livenessProbe', 'resourceVersion']
const keepKeys = ['apps.open-cluster-management.io/git']

const isFiltered = (value, key, parentKey) => {
  if (key==='generation') {
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
    const {app, subscriptions, channels, rules} = application
    const resources = []


    var ff = filterDeep(app)

    resources.push(ff)


    return resources

  }
  return null
}

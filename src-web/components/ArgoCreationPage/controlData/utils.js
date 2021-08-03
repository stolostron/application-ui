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

import { HCMChannelList } from '../../../../lib/client/queries'
import apolloClient from '../../../../lib/client/apollo-client'
import _ from 'lodash'

export const loadExistingChannels = type => {
  return {
    query: HCMChannelList,
    loadingDesc: 'creation.app.loading.channels',
    setAvailable: setAvailableChannelSpecs.bind(null, type)
  }
}

export const setAvailableChannelSpecs = (type, control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { items } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  const error = items ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (items) {
    const keyFn = item => {
      return `${_.get(item, 'objectPath', '')}`
    }
    control.availableData = _.keyBy(
      items
        .filter(({ type: p }) => {
          return p.toLowerCase().startsWith(type)
        })
        .filter(({ objectPath: path }) => {
          return !path
            .toLowerCase()
            .includes('multiclusterhub-repo.open-cluster-management')
        }),
      keyFn
    )
    control.available = _.map(
      Object.values(control.availableData),
      keyFn
    ).sort()
    control.isLoaded = true
  } else {
    control.isLoading = loading
  }
  return control
}

//return channel path, to show in the combo as a user selection
export const channelSimplified = (value, control) => {
  if (!control || !value) {
    return value
  }
  const mappedData = _.get(control, 'availableData', {})[value]
  return (mappedData && _.get(mappedData, 'objectPath')) || value
}

export const loadExistingArgoServer = () => {
  return {
    query: () => {
      return apolloClient.getArgoServerNS()
    },
    loadingDesc: 'creation.app.loading.rules',
    setAvailable: setAvailableArgoServer.bind(null)
  }
}

export const setAvailableArgoServer = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { argoServers } = _.get(data, 'data', '')
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  const error = argoServers ? null : result.error || data.errors

  if (error) {
    control.isFailed = true
    control.isLoaded = true
  } else if (argoServers) {
    const argoServerNS = _.get(argoServers, 'argoServerNS')
    control.availableData = _.keyBy(argoServerNS, 'name')
    control.available = Object.keys(control.availableData).sort()
    control.isLoaded = true
  } else {
    control.isLoading = loading
  }
  return control
}

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
import _ from 'lodash'

export const loadExistingChannels = type => {
  return {
    query: HCMChannelList,
    loadingDesc: 'creation.app.loading.channels',
    setAvailable: setAvailableChannelSpecs.bind(null, type)
  }
}

// export const updateGitBranchFolders = async (
//   branchControl,
//   globalControls,
//   setLoadingState
// ) => {
//   const groupControlData = _.get(branchControl, 'groupControlData', [])
//   const branchName = _.get(branchControl, 'active', '')
//   retrieveGitDetails(branchName, groupControlData, setLoadingState)
// }

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
  } else {
    control.isLoading = loading
  }
  return control
}

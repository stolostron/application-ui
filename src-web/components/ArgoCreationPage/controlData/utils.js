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
import msgs from '../../../../nls/platform.properties'
import { convertStringToQuery } from '../../../../lib/client/search-helper'
import { SEARCH_QUERY } from '../../../apollo-client/queries/SearchQueries'
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

export const setAvailableRules = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { placements } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false

  const error = placements ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (placements) {
    if (placements.length > 0) {
      control.availableData = _.keyBy(placements, 'metadata.name')
      control.available = Object.keys(control.availableData).sort()
      //remove default placement rule name if this is not on the list of available placements
      //in that case the name was set by the reverse function on control initialization
      if (control.active && !control.available.includes(control.active)) {
        control.exception = msgs.get('argo.placement.exception', [
          control.active
        ])
      }
    } else {
      control.availableData = []
    }
  } else {
    control.isLoading = loading
  }

  return control
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
    control.exception = msgs.get('argo.server.exception')
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

const retrieveGitDetails = async (
  branchName,
  groupControlData,
  setLoadingState
) => {
  try {
    const gitControl = groupControlData.find(({ id }) => id === 'githubURL')
    const branchCtrl = groupControlData.find(({ id }) => id === 'githubBranch')
    const githubPathCtrl = groupControlData.find(
      ({ id }) => id === 'githubPath'
    )

    const selectedChannel = _.get(gitControl, 'availableData', {})[
      _.get(gitControl, 'active', '')
    ]
    // get git repository path from channel object if this is an existing channel, use the combo value otherwise
    const gitUrl = selectedChannel
      ? _.get(selectedChannel, 'objectPath', '')
      : _.get(gitControl, 'active', '')

    if (!gitUrl) {
      branchCtrl.active = ''
      branchCtrl.available = []
      return
    }

    //check only github repos
    const url = new URL(gitUrl)
    if (url.host !== 'github.com') {
      return
    }
    const queryVariables = {
      gitUrl,
      namespace: _.get(selectedChannel, 'metadata.namespace', ''),
      secretRef: _.get(selectedChannel, 'secretRef', '')
    }

    githubPathCtrl.active = ''
    githubPathCtrl.available = []

    if (branchName) {
      //get folders for branch
      setLoadingState(githubPathCtrl, true)
      const pathQueryVariables = {
        ...queryVariables,
        branch: branchName
      }

      apolloClient.getGitChannelPaths(pathQueryVariables).then(
        result => {
          const items = _.get(result, 'data.items', []) || []

          items.forEach(path => {
            githubPathCtrl.available.push(path)
          })
          setLoadingState(githubPathCtrl, false)
        },
        () => {
          //on error
          setLoadingState(githubPathCtrl, false)
        }
      )
    } else {
      //get branches
      setLoadingState(branchCtrl, true)
      const onError = () => {
        branchCtrl.exception = msgs.get('creation.app.loading.branch.error')
        setLoadingState(branchCtrl, false)
      }
      apolloClient.getGitChannelBranches(queryVariables).then(result => {
        if (_.get(result, 'errors')) {
          onError()
        } else {
          branchCtrl.active = ''
          branchCtrl.available = []

          const items = _.get(result, 'data.items', []) || []
          items.forEach(branch => {
            branchCtrl.available.push(branch)
          })
          delete branchCtrl.exception
          setLoadingState(branchCtrl, false)
        }
      }, onError)
    }
  } catch (err) {
    //return err
  }
}

export const updateArgoSelection = async control => {
  const selectedNS = _.get(control, 'active', '')
  if (selectedNS) {
    const query = convertStringToQuery(
      `kind:managedclustersetbinding namespace:${selectedNS}`
    )
    const result = await apolloClient.search(SEARCH_QUERY, { input: [query] })
    const items = _.get(result, 'data.searchResult[0].items', [])
    if (items.length === 0) {
      control.exception = msgs.get('argo.server.selection.exception')
      control.forceUpdate()
    }
  } else {
    delete control.exception
  }
  return control
}

export const updateGitBranchFolders = async (
  branchControl,
  globalControls,
  setLoadingState
) => {
  const groupControlData = _.get(branchControl, 'groupControlData', [])
  const branchName = _.get(branchControl, 'active', '')
  retrieveGitDetails(branchName, groupControlData, setLoadingState)
}

export const getGitBranches = async (groupControlData, setLoadingState) => {
  retrieveGitDetails(null, groupControlData, setLoadingState)
}

export const getUniqueChannelName = (channelPath, groupControlData) => {
  //create a unique name for a new channel, based on path and type
  if (!channelPath || !groupControlData) {
    return ''
  }

  //get the channel type and append to url to make sure different type of channels are unique, yet using the same url
  const channelTypeSection = groupControlData.find(
    ({ id }) => id === 'channelType'
  )

  let channelTypeStr
  let channelType
  if (channelTypeSection) {
    channelTypeStr = _.get(channelTypeSection, 'active', [''])[0]
  }

  switch (channelTypeStr) {
  case 'github':
    channelType = 'g'
    break
  case 'helmrepo':
    channelType = 'h'
    break
  case 'objectstore':
    channelType = 'o'
    break
  default:
    channelType = 'ns'
  }

  let channelName = _.trim(channelPath)
  if (_.startsWith(channelName, 'https://')) {
    channelName = _.trimStart(channelName, 'https://')
  }
  if (_.startsWith(channelName, 'http://')) {
    channelName = _.trimStart(channelName, 'http://')
  }
  if (_.endsWith(channelName, '.git')) {
    channelName = _.trimEnd(channelName, '.git')
  }

  channelName = _.replace(channelName, /\./g, '')
  channelName = _.replace(channelName, /:/g, '')
  channelName = _.replace(channelName, /\//g, '-')

  channelName = _.trimEnd(channelName, '-')
  channelName = channelName.toLowerCase()

  //max name for ns or resources is 63 chars
  // trim channel name to max 58 char to allow a max of 63 char length
  //for the channel authentication (which is channelName-auth) object and channel ns (channelName-ns)
  if (channelName.length > 58) {
    channelName = channelName.substring(channelName.length - 56)
  }
  channelName = `${channelType}${channelName}`

  return channelName
}

export const updateSyncPolicies = (urlControl, globalControl) => {
  const selectedID = _.get(urlControl, 'id')
  const pruneControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'prune'
  )
  const pruneLastControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'pruneLast'
  )
  const replaceControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'replace'
  )

  if (selectedID.includes('git')) {
    _.set(pruneControl, 'type', 'checkbox')
    _.set(pruneLastControl, 'type', 'checkbox')
    _.set(replaceControl, 'type', 'checkbox')
  } else {
    // reset values
    _.set(pruneControl, 'type', 'hidden')
    _.set(pruneLastControl, 'type', 'hidden')
    _.set(replaceControl, 'type', 'hidden')
  }
}

export const updateChannelControls = (
  urlControl,
  globalControl,
  setLoadingState
) => {
  updateSyncPolicies(urlControl, globalControl)

  getGitBranches(_.get(urlControl, 'groupControlData'), setLoadingState)

  //update existing placement rule section when user changes the namespace
  const nsControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'namespace'
  )
  const { active, availableData, groupControlData } = urlControl

  const pathData = availableData ? availableData[active] : ''

  const nameControl = groupControlData.find(
    ({ id: idCtrlCHName }) => idCtrlCHName === 'channelName'
  )
  const namespaceControl = groupControlData.find(
    ({ id: idChannelNS }) => idChannelNS === 'channelNamespace'
  )
  //use this to record if the namespace for the channel used already exists
  //this could happen when using an existing channel OR a new channel and the ns was created before but not deleted
  const namespaceControlExists = groupControlData.find(
    ({ id: idCtrlNSExists }) => idCtrlNSExists === 'channelNamespaceExists'
  )
  let originalChannelControl = null
  // change channel name and namespace to reflect repository path
  if (active) {
    // if existing channel, reuse channel name and namespace
    if (pathData && pathData.metadata) {
      nameControl.active = pathData.metadata.name
      namespaceControl.active = pathData.metadata.namespace
    } else {
      //generate a unique name for this channel
      const channelName = getUniqueChannelName(active, groupControlData)
      const channelNS = `${channelName}-ns`

      originalChannelControl = findOriginalChannelControl(
        globalControl,
        channelName,
        nameControl
      )

      if (originalChannelControl) {
        // if existing channel, reuse channel name and namespace
        nameControl.active = channelName
        namespaceControl.active = channelNS
        namespaceControlExists.active = true
      } else {
        nameControl.active = channelName
        namespaceControl.active = ''
        namespaceControlExists.active =
          _.get(nsControl, 'availableData', {})[channelNS] === undefined
            ? false
            : true
      }
    }
  } else {
    nameControl.active = ''
    namespaceControl.active = ''
    namespaceControlExists.active = false
  }

  return globalControl
}

// Find first control defining the same channel in the current app
export const findOriginalChannelControl = (
  globalControl,
  channelName,
  nameControl
) => {
  const channelsControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'channels'
  )
  if (channelsControl) {
    //get all active channels and see if this channel name was created prior to this; reuse it if found
    const activeDataChannels = _.get(channelsControl, 'active', [])
    for (const channelInfo of activeDataChannels) {
      const channelNameInfo = channelInfo.find(
        ({ id: idChannelInfo }) => idChannelInfo === 'channelName'
      )
      if (channelNameInfo) {
        if (channelNameInfo === nameControl) {
          return null
        } else if (_.get(channelNameInfo, 'active', '') === channelName) {
          return channelInfo
        }
      }
    }
  }
}

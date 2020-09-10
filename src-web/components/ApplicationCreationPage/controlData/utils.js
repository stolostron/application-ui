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

import msgs from '../../../../nls/platform.properties'
import { HCMChannelList, HCMSecretsList } from '../../../../lib/client/queries'

import _ from 'lodash'

const GitHub = require('github-api')

const onlineClustersCheckbox = 'online-cluster-only-checkbox'
const existingRuleCheckbox = 'existingrule-checkbox'
const localClusterCheckbox = 'local-cluster-checkbox'

export const loadExistingChannels = type => {
  return {
    query: HCMChannelList,
    loadingDesc: 'creation.app.loading.channels',
    setAvailable: setAvailableChannelSpecs.bind(null, type)
  }
}

export const loadExistingSecrets = () => {
  const getQueryVariables = (control, globalControl) => {
    const nsControl = globalControl.find(
      ({ id: idCtrl }) => idCtrl === 'namespace'
    )
    if (nsControl.active) {
      delete control.exception
      return { namespace: nsControl.active }
    } else {
      control.exception = msgs.get('creation.app.loading.secrets.ns.err')
      return {}
    }
  }
  return {
    query: HCMSecretsList,
    variables: getQueryVariables,
    loadingDesc: 'creation.app.loading.secrets',
    setAvailable: setAvailableSecrets.bind(null)
  }
}

export const updateChannelControls = (
  urlControl,
  globalControl,
  setLoadingState
) => {
  getGitBranches(_.get(urlControl, 'groupControlData'), setLoadingState)

  //update existing placement rule section when user changes the namespace
  const nsControl = globalControl.find(
    ({ id: idCtrl }) => idCtrl === 'namespace'
  )
  updateControlsForNS(urlControl, nsControl, globalControl)

  const { active, availableData, groupControlData } = urlControl
  const pathData = availableData[active]

  const nameControl = groupControlData.find(
    ({ id: idCtrl }) => idCtrl === 'channelName'
  )
  const namespaceControl = groupControlData.find(
    ({ id }) => id === 'channelNamespace'
  )
  // change channel name and namespace to reflect repository path
  if (active) {
    const a = document.createElement('a')
    a.href = active

    // if existing channel, reuse channel name and namespace
    if (pathData && pathData.metadata) {
      nameControl.active = pathData.metadata.name
      namespaceControl.active = pathData.metadata.namespace
    } else {
      let name = a.pathname.split('/').pop()
      name = name.split('.').shift()
      nameControl.active = `${name}-chn`
      namespaceControl.active = ''
    }
  } else {
    nameControl.active = 'resource'
    namespaceControl.active = ''
  }

  let control
  // if existing channel, hide user/token controls
  const type = !pathData ? 'text' : 'hidden'
  const setType = cid => {
    control = groupControlData.find(({ id }) => id === cid)
    _.set(control, 'type', type)
    if (type === 'hidden') {
      _.set(control, 'active', '')
    }
  }
  const { id } = urlControl
  switch (id) {
  case 'githubURL':
    setType('githubUser')
    setType('githubAccessId')
    break
  case 'objectstoreURL':
    setType('accessKey')
    setType('secretKey')
    break
  case 'helmURL':
    setType('helmUser')
    setType('helmPassword')
    break
  }

  return globalControl
}

export const updateControlsForNS = (
  initiatingControl,
  nsControl,
  globalControl
) => {
  const { active, availableData = {} } = nsControl

  const controlList = getExistingPRControlsSection(
    initiatingControl,
    globalControl
  )
  controlList.forEach(control => {
    const existingRuleControl = _.get(control, 'placementrulecombo')
    const existingruleCheckbox = _.get(control, existingRuleCheckbox)
    const selectedRuleNameControl = _.get(control, 'selectedRuleName')
    //update placement rule controls
    if (existingRuleControl && existingruleCheckbox) {
      if (availableData[active] === undefined) {
        //user defined namespace
        _.set(existingruleCheckbox, 'type', 'hidden')
        _.set(existingRuleControl, 'type', 'hidden')

        _.set(existingRuleControl, 'ns', '')
        selectedRuleNameControl && _.set(selectedRuleNameControl, 'active', '')
        _.set(existingruleCheckbox, 'active', false)
      } else {
        //existing namespace
        _.set(existingruleCheckbox, 'type', 'checkbox')
        _.set(existingruleCheckbox, 'active', false)

        _.set(existingRuleControl, 'ns', active)
        _.set(existingRuleControl, 'type', 'hidden')
      }
      _.set(existingRuleControl, 'active', '')
      updateNewRuleControlsData('', control)
    }
  })

  return globalControl
}

export const getGitBranches = async (groupControlData, setLoadingState) => {
  try {
    const gitControl = groupControlData.find(({ id }) => id === 'githubURL')
    const branchCtrl = groupControlData.find(({ id }) => id === 'githubBranch')

    const userCtrl = groupControlData.find(({ id }) => id === 'githubUser')

    const tokenCtrl = groupControlData.find(
      ({ id }) => id === 'githubAccessId'
    )

    let gitPath = _.get(gitControl, 'active', '')
    let existingPrivateChannel = false

    if (gitPath.length === 0) {
      branchCtrl.active = ''
      branchCtrl.available = []
    }

    if (gitPath.length > 0) {
      let github = new GitHub()

      if (
        _.get(userCtrl, 'active', '').length > 0 &&
        _.get(tokenCtrl, 'active', '').length > 0
      ) {
        //use authentication
        github = new GitHub({
          username: userCtrl.active,
          password: tokenCtrl.active,
          auth: 'basic'
        })
      } else {
        //check if this is an existing private channel
        const selectedChannel = _.get(
          _.get(gitControl, 'availableData', {}),
          gitPath
        )
        if (
          selectedChannel &&
          _.get(selectedChannel, 'raw.spec.secretRef.name')
        ) {
          //this is a private channel, don't try to retreive the branches
          existingPrivateChannel = true
        }
      }

      const gitUrl = new URL(gitPath)

      if (gitUrl.host === 'github.com' && existingPrivateChannel === false) {
        //check only github repos; and only new private channels since we don't have the channel secret info for existing channels
        //get the url path, then remove first / and .git
        gitPath = gitUrl.pathname.substring(1).replace('.git', '')

        const repoObj = github.getRepo(gitPath)

        setLoadingState(branchCtrl, true)
        await repoObj.listBranches().then(
          result => {
            branchCtrl.active = ''
            branchCtrl.available = []

            if (result.data) {
              result.data.forEach(branch => {
                branchCtrl.available.push(branch.name)
              })
            }
            setLoadingState(branchCtrl, false)
          },
          () => {
            branchCtrl.active = ''
            branchCtrl.available = ['master']
            setLoadingState(branchCtrl, false)
          }
        )
      }
    }
  } catch (err) {
    //return err
  }

  return groupControlData
}

export const setAvailableRules = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { placementrules } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  control.active = ''

  const selectedNS = control.ns
  const error = placementrules ? null : result.error

  if (error) {
    control.isFailed = true
  } else if (placementrules) {
    if (_.get(control, 'ns', '') === '') {
      control.available = [] // no app namespace selected so no rule to show
    } else {
      control.availableData = _.keyBy(
        placementrules.filter(
          rule => _.get(rule, 'metadata.namespace', '') === selectedNS
        ),
        'metadata.name'
      )
      control.available = Object.keys(control.availableData).sort()
      if (Object.keys(control.availableData).length === 0) {
        _.set(control, 'type', 'hidden')
        const groupControlData = _.get(control, 'groupControlData')
        const existingRule = groupControlData.find(
          ({ id }) => id === existingRuleCheckbox
        )
        existingRule && _.set(existingRule, 'type', 'hidden')
      }
    }
  } else {
    control.isLoading = loading
  }

  return control
}

export const setAvailableNSSpecs = (control, result) => {
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
    control.availableData = _.keyBy(items, 'metadata.name')
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }

  return control
}

export const getExistingPRControlsSection = (initiatingControl, control) => {
  //returns the existing placement rule options for the channel selection
  let result = []

  if (_.get(initiatingControl, 'groupControlData')) {
    //the update happened on a single channel, get that channel only PRs
    const controlDataList = _.get(initiatingControl, 'groupControlData')

    const channelInfo = {}

    controlDataList.forEach(controlDataObject => {
      channelInfo[controlDataObject.id] = controlDataObject
    })

    result.push(channelInfo)
  } else {
    //this is a global update, get all channels PRs
    const channelsControl = control.find(({ id }) => id === 'channels')

    if (channelsControl) {
      result = _.get(channelsControl, 'controlMapArr', [])
    }
  }

  return result
}

export const updateNewRuleControlsData = (selectedPR, control) => {
  const onlineControl = _.get(control, onlineClustersCheckbox)
  const clusterSelectorControl = _.get(control, 'clusterSelector')

  const localClusterControl = _.get(control, localClusterCheckbox)

  if (selectedPR) {
    const clusterConditionsList = _.get(
      selectedPR,
      'raw.spec.clusterConditions',
      []
    )
    const localClusterData = clusterConditionsList.filter(
      rule =>
        _.get(rule, 'status', '').toLowerCase() === 'true' &&
        _.get(rule, 'type', '') === 'ManagedClusterConditionAvailable'
    )

    onlineControl.active = localClusterData.length > 0
    localClusterData.length > 0 && _.set(onlineControl, 'type', 'checkbox')

    const clusterSelectorData = _.get(
      selectedPR,
      'raw.spec.clusterSelector.matchLabels',
      null
    )

    clusterSelectorData !== null &&
      _.set(clusterSelectorControl, 'type', 'custom')

    clusterSelectorControl.active.mode = clusterSelectorData !== null

    if (clusterSelectorData) {
      clusterSelectorControl.active.clusterLabelsList.splice(
        0,
        clusterSelectorControl.active.clusterLabelsList.length
      )

      const newData = []
      let idx = 0
      Object.keys(clusterSelectorData).forEach(key => {
        newData.push({
          id: idx,
          labelName: key,
          labelValue: clusterSelectorData[key],
          validValue: true
        })
        idx = idx + 1
      })

      clusterSelectorControl.active.mode =
        clusterSelectorControl.active.clusterLabelsList.length > 0

      if (newData.length === 0) {
        newData.push({
          id: 0,
          labelName: '',
          labelValue: '',
          validValue: true
        })
      }

      clusterSelectorControl.showData = newData
      clusterSelectorControl.active = {
        mode: true,
        clusterLabelsList: newData,
        clusterLabelsListID: newData.length
      }
    }

    _.set(localClusterControl, 'type', 'hidden')
  } else {
    _.set(localClusterControl, 'type', 'checkbox')

    _.set(onlineControl, 'type', 'checkbox')
    _.set(onlineControl, 'active', true)

    _.set(clusterSelectorControl, 'type', 'custom')
    _.set(clusterSelectorControl, 'active.mode', false)
    clusterSelectorControl.active.clusterLabelsList = [
      { id: 0, labelName: '', labelValue: '', validValue: true }
    ]
    clusterSelectorControl.showData = []
  }

  return control
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
    control.availableData = _.keyBy(
      items.filter(({ type: p }) => {
        return p.toLowerCase().startsWith(type)
      }),
      'objectPath'
    )
    control.available = Object.keys(control.availableData).sort()
  } else {
    control.isLoading = loading
  }

  return control
}

export const setAvailableSecrets = (control, result) => {
  const { loading } = result
  const { data = {} } = result
  const { secrets } = data
  control.available = []
  control.availableMap = {}
  control.isLoading = false
  const error = secrets ? null : result.error
  if (error) {
    control.isFailed = true
  } else if (secrets) {
    control.availableData = _.keyBy(secrets, 'name')
    control.available = Object.keys(control.availableData).sort()
    if (control.active && !control.available.includes(control.active)) {
      control.setActive('')
    }
  } else {
    control.isLoading = loading
  }

  updatePrePostControls(control)

  return control
}

export const updatePrePostControls = urlControl => {
  const groupControlData = _.get(urlControl, 'groupControlData')

  const { active, availableData } = urlControl

  const selectedSecret = availableData && availableData[active]

  const ansibleHost =
    groupControlData &&
    groupControlData.find(({ id }) => id === 'ansibleTowerHost')
  const ansibleToken =
    groupControlData &&
    groupControlData.find(({ id }) => id === 'ansibleTowerToken')

  if (!selectedSecret) {
    //new secret, show host task info
    _.set(ansibleHost, 'type', 'text')
    _.set(ansibleToken, 'type', 'text')
  } else {
    //existing secret, hide and clean host and token
    _.set(ansibleHost, 'type', 'hidden')
    _.set(ansibleToken, 'type', 'hidden')
    _.set(ansibleHost, 'active', '')
    _.set(ansibleToken, 'active', '')
  }

  return urlControl
}

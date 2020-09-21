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

import { HCMNamespaceList } from '../../../../lib/client/queries'
import gitChannelData from './ControlDataGit'
import helmReleaseChannelData from './ControlDataHelm'
import hubClusterChannelData from './ControlDataLocalCluster'
import objectstoreChannelData from './ControlDataObjectStore'
import {
  setAvailableNSSpecs,
  getExistingPRControlsSection,
  updateNewRuleControlsData
} from './utils'
import {
  initializeControls,
} from '../../TemplateEditor/utils/utils'
import _ from 'lodash'

const VALID_DNS_LABEL = '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'
const existingRuleCheckbox = 'existingrule-checkbox'

export const loadExistingNamespaces = () => {
  return {
    query: HCMNamespaceList,
    loadingDesc: 'creation.app.loading.namespaces',
    setAvailable: setAvailableNSSpecs.bind(null)
  }
}

export const updateNSControls = (nsControl, globalControl) => {
  const { active, availableData = {} } = nsControl

  const userDefinedNSControl = globalControl.find(
    ({ id }) => id === 'userDefinedNamespace'
  )

  userDefinedNSControl.active =
    availableData[active] === undefined ? active : ''

  return updateControlsForNS(nsControl, nsControl, globalControl)
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
        selectedRuleNameControl && _.set(selectedRuleNameControl, 'active', '')

        _.set(existingRuleControl, 'ns', active)
        _.set(existingRuleControl, 'type', 'hidden')
      }
      _.set(existingRuleControl, 'active', '')
      updateNewRuleControlsData('', control)
    }
  })

  return globalControl
}

// only called when editing an existing application
// examines resources to create the correct resource types that are being deployed
const discoverGroupsFromSource = (control, cd, templateObject, forceUpdate, locale) =>{
  const { controlData: groupData, prompts: { nameId, baseName } } = control
  templateObject = _.cloneDeep(templateObject)
  const times = _.get(templateObject, 'Subscription.length')
  if (times) {
    const active = []
    _.times(times, ()=>{

      // add a group for every subscription
      const newGroup = initializeControls(
        groupData,
        cd,
        forceUpdate,
        locale,
        active.length + 1,
        true
      )
      active.push(newGroup)
      const nameControl = _.keyBy(newGroup, 'id')[nameId]
      nameControl.active = `${baseName}-${active.length - 1}`

      // add a channel for every group
      const cardsControl = newGroup.find(
        ({ id }) => id === 'channelType'
      )
      discoverChannelFromSource(cardsControl, newGroup, cd, templateObject, forceUpdate, times>1, locale)
      shiftTemplateObject(templateObject)
    })
    control.active = active
  }
}

const discoverChannelFromSource = (cardsControl, groupControlData, globalControl, templateObject, forceUpdate, multiple, locale) =>{
  // determine channel type
  let id

  // try channel type first
  switch (_.get(templateObject, 'Channel[0].$raw.spec.type')) {
  case 'Git':
  case 'GitHub':
    id = 'github'
    break
  case 'HelmRepo':
    id = 'helmrepo'
    break
  case 'Namespace':
    id = 'deployable'
    break
  case 'ObjectBucket':
    id = 'objectstore'
    break
  }

  // if that didn't work, try the subscription
  if (!id) {
    const subscription = _.get(templateObject, 'Subscription[0].$raw')
    switch (true) {

    // if it has a package filter assume helm
    case !!_.get(subscription, 'spec.packageFilter.version'):
      id = 'helmrepo'
      break

    default:
      id = 'github'
      break
    }



  }
  cardsControl.active = id

  // insert channel type control data in this group
  const insertControlData = _.get(cardsControl.availableMap[id], 'change.insertControlData')
  if (insertControlData) {
    const insertInx = groupControlData.findIndex(
      ({ id:_id }) => _id === cardsControl.id
    )
    // splice control data with data from this card
    groupControlData.splice(
      insertInx + 1,
      0,
      ..._.cloneDeep(insertControlData)
    )
    groupControlData.forEach(cd => {
      cd.groupControlData = groupControlData
    })
    initializeControls(groupControlData, globalControl, forceUpdate, locale)

    // if more then one group, collapse all groups
    if (multiple) {
      groupControlData.filter(
        ({ type }) => type === 'section'
      ).forEach(section=>{
        section.collapsed = true
      })
    }

  }
}

// called for each group when editor refreshes control active values from the template
// reverse source path always points to first template resource (ex: Subscription[0])
// so after one group has been processed, pop the top Subscription so that next pass
// the Subscription[0] points to the next group
const shiftTemplateObject = (templateObject) =>{

  // pop the subscription off of all subscriptions
  let subscription = _.get(templateObject, 'Subscription')
  if (subscription) {
    subscription = subscription.shift()
    // if this subscription pointed to a placement rule in this template
    // remove that placement rule too
    const name = _.get(subscription, '$synced.spec.$v.placement.$v.placementRef.$v.name.$v')
    if (name) {
      const rules = templateObject.PlacementRules||[]
      const inx = rules.findIndex(rule=>{
        return name === _.get(rule, '$synced.metadata.$v.name.$v')
      })
      if (inx!==-1) {
        templateObject.PlacementRule.splice(inx,1)
      }
    }
  }
}

export const controlData = [
  {
    id: 'main',
    type: 'section',
    note: 'creation.view.required.mark'
  },
  {
    name: 'creation.app.name',
    tooltip: 'tooltip.creation.app.name',
    id: 'name',
    type: 'text',
    editing: {disabled: true}, // if editing existing app, disable this field
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true
    },
    reverse: 'Application[0].metadata.name'
  },
  {
    name: 'creation.app.namespace',
    tooltip: 'tooltip.creation.app.namespace',
    id: 'namespace',
    type: 'combobox',
    fetchAvailable: loadExistingNamespaces(),
    editing: {disabled: true}, // if editing existing app, disable this field
    onSelect: updateNSControls,
    validation: {
      constraint: VALID_DNS_LABEL,
      notification: 'import.form.invalid.dns.label',
      required: true
    },
    reverse: 'Application[0].metadata.namespace'
  },
  {
    id: 'userDefinedNamespace',
    type: 'hidden',
    active: ''
  },
  ////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channelSection',
    type: 'section',
    title: 'creation.app.channels',
    overline: true,
    collapsable: true,
    collapsed: false
  },
  ///////////////////////  channels  /////////////////////////////////////
  {
    id: 'channels',
    type: 'group',
    prompts: {
      nameId: 'channelPrompt',
      baseName: 'resource',
      addPrompt: 'creation.app.add.channel',
      deletePrompt: 'creation.app.delete.channel'
    },
    discover: discoverGroupsFromSource,
    shift: shiftTemplateObject,
    controlData: [
      {
        id: 'channel',
        type: 'section',
        title: 'creation.app.channel.title',
        collapsable: true,
        collapsed: false
      },
      ///////////////////////  channel name  /////////////////////////////////////
      {
        id: 'channelPrompt',
        type: 'hidden',
        active: ''
      },
      {
        id: 'channelType',
        type: 'cards',
        sort: false,
        collapseCardsControlOnSelect: true,
        scrollViewToTopOnSelect: true,
        title: 'creation.app.channel.type',
        collapsable: true,
        collapsed: false,
        available: [
          {
            id: 'github',
            logo: 'git-repo.svg',
            title: 'channel.type.git',
            tooltip: 'tooltip.creation.app.channel.git',
            change: {
              insertControlData: gitChannelData
            }
          },
          {
            id: 'deployable',
            logo: 'namespace-repo.svg',
            title: 'channel.type.namespace',
            tooltip: 'tooltip.creation.app.channel.namespace',
            change: {
              insertControlData: hubClusterChannelData
            }
          },
          {
            id: 'helmrepo',
            logo: 'helm-repo.png',
            title: 'channel.type.helmrepo',
            tooltip: 'tooltip.channel.type.helmrepo',
            change: {
              insertControlData: helmReleaseChannelData
            }
          },
          {
            id: 'objectstore',
            logo: 'object-bucket-repo.svg',
            title: 'channel.type.objectbucket',
            tooltip: 'tooltip.channel.type.objectbucket',
            change: {
              insertControlData: objectstoreChannelData
            }
          }
        ],
        active: '',
        validation: {}
      }
    ]
  }
]

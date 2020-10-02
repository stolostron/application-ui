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

import { initializeControls, getSourcePath } from '../../TemplateEditor/utils/utils'
import _ from 'lodash'


//only called when editing an existing application
//examines resources to create the correct resource types that are being deployed
export const discoverGroupsFromSource = (
  control,
  cd,
  templateObject,
  editor,
  locale
) => {
  const { controlData: groupData, prompts: { nameId, baseName } } = control
  templateObject = _.cloneDeep(templateObject)
  const times = _.get(templateObject, 'Subscription.length')
  if (times) {
    const active = []
    _.times(times, () => {
      // add a group for every subscription
      const newGroup = initializeControls(
        groupData,
        editor,
        locale,
        active.length + 1,
        true
      )
      active.push(newGroup)
      const nameControl = _.keyBy(newGroup, 'id')[nameId]
      nameControl.active = `${baseName}-${active.length - 1}`

      // add a channel for every group
      const cardsControl = newGroup.find(({ id }) => id === 'channelType')
      discoverChannelFromSource(
        cardsControl,
        newGroup,
        cd,
        templateObject,
        editor,
        times > 1,
        locale
      )
      shiftTemplateObject(templateObject)
    })
    control.active = active
  }
}

const discoverChannelFromSource = (
  cardsControl,
  groupControlData,
  globalControl,
  templateObject,
  editor,
  multiple,
  locale
) => {
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
  case 'ObjectBucket':
    id = 'objectstore'
    break
  case 'Namespace':
    id = 'other'
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
      id = 'other'
      break
    }
  }
  cardsControl.active = id

  // if editing an existing app that doesn't have a standard channel type
  // show the other channel type
  if (id==='other') {
    delete cardsControl.availableMap[id].hidden
  }

  // insert channel type control data in this group
  const insertControlData = _.get(
    cardsControl.availableMap[id],
    'change.insertControlData'
  )
  if (insertControlData) {
    const insertInx = groupControlData.findIndex(
      ({ id: _id }) => _id === cardsControl.id
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
    initializeControls(groupControlData, editor, locale)

    // initialize channel namespace
    const path = 'Subscription[0].spec.channel'
    const channel = _.get(templateObject, getSourcePath(path))
    if (channel) {
      const [ns] = channel.$v.split('/')
      if (ns) {
        const channelNamespace = groupControlData.find(
          ({ id: _id }) => _id === 'channelNamespace'
        )
        channelNamespace.active = ns
      }
    }

    // if more then one group, collapse all groups
    if (multiple) {
      groupControlData
        .filter(({ type }) => type === 'section')
        .forEach(section => {
          section.collapsed = true
        })
    }
  }
}

//called for each group when editor refreshes control active values from the template
//reverse source path always points to first template resource (ex: Subscription[0])
//so after one group has been processed, pop the top Subscription so that next pass
//the Subscription[0] points to the next group
export const shiftTemplateObject = templateObject => {
// pop the subscription off of all subscriptions
  let subscription = _.get(templateObject, 'Subscription')
  if (subscription) {
    subscription = subscription.shift()

    // if this subscription pointed to a channel in this template
    // remove that channel too
    let name = _.get(
      subscription,
      '$synced.spec.$v.channel.$v'
    )
    if (name) {
      const [ns, n] = name.split('/')
      const channels = templateObject.Channel || []
      const inx = channels.findIndex(rule => {
        return n === _.get(rule, '$synced.metadata.$v.name.$v')
      && ns === _.get(rule, '$synced.metadata.$v.namespace.$v')
      })
      if (inx !== -1) {
        templateObject.Channel.splice(inx, 1)
      }
    }

    // if this subscription pointed to a placement rule in this template
    // remove that placement rule too
    name = _.get(
      subscription,
      '$synced.spec.$v.placement.$v.placementRef.$v.name.$v'
    )
    if (name) {
      const rules = templateObject.PlacementRules || []
      const inx = rules.findIndex(rule => {
        return name === _.get(rule, '$synced.metadata.$v.name.$v')
      })
      if (inx !== -1) {
        templateObject.PlacementRule.splice(inx, 1)
      }
    }
  }
}

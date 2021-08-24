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

import { getResourceID } from 'temptifly'
import _ from 'lodash'

//only called when editing an existing application
//examines resources to create the correct resource types that are being deployed
export const discoverGroupsFromSource = (control, cd, templateObject) => {
  const applicationResource = _.get(
    templateObject,
    'ApplicationSet[0].$raw',
    {}
  )

  // get application selflink
  const selfLinkControl = cd.find(({ id }) => id === 'selfLink')
  const selfLink = getResourceID(applicationResource)
  if (selfLinkControl) {
    selfLinkControl['active'] = selfLink
  }

  //argoServer
  const argoServer = cd.find(({ id }) => id === 'argoServer')
  const ns = _.get(applicationResource, 'metadata.namespace')
  _.set(argoServer, 'active', ns)

  // requeue time
  const requeueTime = cd.find(({ id }) => id === 'requeueTime')
  _.set(
    requeueTime,
    'active',
    _.get(
      applicationResource,
      'spec.generators[0].clusterDecisionResource.requeueAfterSeconds'
    )
  )
  // Template
  // add a channel for every group
  templateObject = _.cloneDeep(templateObject)
  const source = _.get(applicationResource, 'spec.template.spec.source')
  const chart = _.get(source, 'chart')
  const id = chart ? 'helmrepo' : 'github'

  control.active[0][3].active = id
  // insert channel type control data in this group

  const availableMap = _.get(control.active[0][3].availableMap, id)
  const insertControlData = _.get(availableMap, 'change.insertControlData')
  control.active[0] = [...control.active[0], ...insertControlData]

  if (insertControlData) {
    const { repoURL, path, targetRevision } = source
    const githubURL = insertControlData.find(({ id }) => id === 'githubURL')
    const githubPath = insertControlData.find(({ id }) => id === 'githubPath')
    const githubBranch = insertControlData.find(
      ({ id }) => id === 'githubBranch'
    )
    _.set(githubURL, 'active', repoURL)
    _.set(githubPath, 'active', path)
    _.set(githubBranch, 'active', targetRevision)
  }

  // Placement
  const placementResource = _.get(templateObject, 'Placement[0]')
  const selfLinksControl = cd.find(({ id }) => id === 'selfLinks')
  const clusterSelectorControl = cd.find(({ id }) => id === 'clusterSelector')

  if (selfLinksControl && placementResource) {
    const placementSelfLink = getResourceID(placementResource.$raw)
    _.set(selfLinksControl, 'active.Placement', placementSelfLink)
  } else {
    // const matchLabels = _.get(applicationResource, 'spec.generators[0].clusterDecisionResource.labelSelector.matchLabels')
    // const placementName = _.values(matchLabels)[0]
    const existingRuleControl = cd.find(
      ({ id }) => id === 'existingrule-checkbox'
    )
    _.set(existingRuleControl, 'active', true)

    const decisionResourceControl = cd.find(
      ({ id }) => id === 'decisionResourceName'
    )
    _.set(decisionResourceControl, 'type', 'combobox')
    _.set(clusterSelectorControl, 'type', 'hidden')
  }
}

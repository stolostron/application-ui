/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import R from 'ramda'
import _ from 'lodash'
import {
  getNodePropery,
  addPropertyToList,
  createDeployableYamlLink,
  setResourceDeployStatus,
  setPodDeployStatus,
  setSubscriptionDeployStatus,
  setApplicationDeployStatus,
  setPlacementRuleDeployStatus,
  addDetails,
  addNodeOCPRouteLocationForCluster,
  addIngressNodeInfo,
  setClusterStatus
} from '../../utils/diagram-helpers'
import msgs from '../../../../../nls/platform.properties'

const resName = 'resource.name'

export const getNodeDetails = node => {
  const details = []
  if (node) {
    const { type, specs } = node
    const { labels = [] } = node

    //if resource has a row number add deployable yaml
    createDeployableYamlLink(node, details)
    details.push({
      type: 'spacer'
    })
    details.push({
      type: 'label',
      labelKey: 'prop.details.section'
    })
    details.push({
      type: 'spacer'
    })

    switch (type) {
    case 'cluster':
      setClusterStatus(node, details)
      break

    case 'placement':
      {
        const { placements = [] } = specs
        details.push({
          type: 'label',
          labelKey: 'resource.placement'
        })
        placements.forEach(placement => {
          details.push({
            type: 'snippet',
            value: placement
          })
        })
      }
      break

    case 'package':
      addDetails(details, [
        {
          labelKey: resName,
          value: _.get(node, 'specs.raw.metadata.name', '')
        },
        {
          labelKey: 'resource.message',
          value: msgs.get('resource.helm.nodata.message')
        }
      ])
      break

    default:
      addK8Details(node, details)
      break
    }

    // labels
    if (labels && labels.length) {
      details.push({
        type: 'label',
        labelKey: 'resource.labels'
      })
      labels.forEach(({ name: lname, value: lvalue }) => {
        const labelDetails = [{ value: `${lname} = ${lvalue}`, indent: true }]
        addDetails(details, labelDetails)
      })
    }
  }
  return details
}

function addK8Details(node, details) {
  const { clusterName, type, layout = {} } = node
  const { type: ltype } = layout

  // not all resources have a namespace

  let namespace = ''
  if (node && R.pathOr('', ['specs', 'pulse'])(node) !== 'orange') {
    const kindModel = _.get(node, `specs.${type}Model`, {})
    let computedNSList = []
    Object.values(kindModel).forEach(item => {
      computedNSList = R.union(computedNSList, [item.namespace])
    })

    computedNSList.forEach(item => {
      namespace = namespace.length === 0 ? item : `${namespace},${item}`
    })
  }

  // the main stuff
  const mainDetails = [
    {
      labelKey: 'resource.type',
      value: ltype || type
    },
    {
      labelKey: 'resource.cluster',
      value: clusterName ? clusterName : undefined
    },
    {
      labelKey: 'resource.namespace',
      value: namespace
        ? namespace
        : R.pathOr('N/A', ['specs', 'raw', 'metadata', 'namespace'])(node)
    }
  ]

  //for charts
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'chartName'],
      'raw.spec.chart.name'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'releaseName'],
      'raw.spec.release.name'
    )
  )
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'version'],
      'raw.spec.version'
    )
  )
  //

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'metadata', 'labels'],
      'raw.spec.metadata.label',
      'No labels'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'replicas'],
      'raw.spec.replicas'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'selector', 'matchLabels'],
      'raw.spec.selector'
    )
  )

  if (!R.pathOr(['specs', 'raw', 'spec', 'selector', 'matchLabels'])) {
    addPropertyToList(
      mainDetails,
      getNodePropery(
        node,
        ['specs', 'raw', 'spec', 'selector'],
        'raw.spec.selector'
      )
    )
  }

  addPropertyToList(
    mainDetails,
    getNodePropery(node, ['specs', 'raw', 'spec', 'ports'], 'raw.spec.ports')
  )

  //subscription specific
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'channel'],
      'raw.spec.channel'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'packageFilter', 'filterRef'],
      'raw.spec.packageFilter'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'placement', 'placementRef'],
      'raw.spec.placementRef'
    )
  )

  //PR specific
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'clusterSelector', 'matchLabels'],
      'raw.spec.clusterSelector'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'clusterConditions'],
      'raw.spec.clusterConditions'
    )
  )
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'clusterLabels', 'matchLabels'],
      'raw.spec.clusterLabels'
    )
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'clusterReplicas'],
      'raw.spec.clusterReplicas'
    )
  )

  if (type === 'placements') {
    const specNbOfClustersTarget = R.pathOr(
      [],
      ['specs', 'raw', 'status', 'decisions']
    )(node)
    mainDetails.push({
      labelKey: 'raw.status.decisionCls',
      value: specNbOfClustersTarget.length
    })
  }

  //routes
  addPropertyToList(
    mainDetails,
    getNodePropery(node, ['specs', 'raw', 'spec', 'to'], 'raw.spec.to')
  )

  addPropertyToList(
    mainDetails,
    getNodePropery(node, ['specs', 'raw', 'spec', 'host'], 'raw.spec.host')
  )

  //persistent volume claim
  addPropertyToList(
    mainDetails,
    getNodePropery(
      node,
      ['specs', 'raw', 'spec', 'accessModes'],
      'raw.spec.accessmode'
    )
  )
  addDetails(details, mainDetails)

  details.push({
    type: 'spacer'
  })

  //if Route with host, show it here
  addNodeOCPRouteLocationForCluster(node, null, details)

  //add Ingress service info
  addIngressNodeInfo(node, details)

  setApplicationDeployStatus(node, details)
  //subscriptions status
  setSubscriptionDeployStatus(node, details)
  //placement rule details
  setPlacementRuleDeployStatus(node, details)

  //show error if the resource doesn't produce pods and was not deployed on remote clusters
  setResourceDeployStatus(node, details)

  // kube model details
  setPodDeployStatus(node, details)

  return details
}

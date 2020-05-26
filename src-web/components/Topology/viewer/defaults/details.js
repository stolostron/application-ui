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
  createResourceSearchLink,
  setResourceDeployStatus,
  setPodDeployStatus,
  setSubscriptionDeployStatus,
  setApplicationDeployStatus,
  addDetails,
  getAge
} from '../../utils/diagram-helpers'

export const getNodeDetails = node => {
  const details = []
  if (node) {
    const { type, specs } = node
    let { labels = [] } = node
    switch (type) {
    case 'cluster':
      {
        const { cluster, violations = [], clusters = [] } = specs
        const clusterArr = cluster ? [cluster] : clusters
        clusterArr.forEach(c => {
          const {
            metadata = {},
            capacity = {},
            usage = {},
            clusterip,
            status
          } = c
          const { name, namespace, creationTimestamp } = metadata
          void ({ labels } = metadata)
          const { nodes, cpu: cc, memory: cm, storage: cs } = capacity
          const { pods, cpu: uc, memory: um, storage: us } = usage

          // general details
          addDetails(details, [
            { labelKey: 'resource.name', value: name },
            { labelKey: 'resource.namespace', value: namespace },
            { labelKey: 'resource.clusterip', value: clusterip },
            { labelKey: 'resource.pods', value: pods },
            { labelKey: 'resource.nodes', value: nodes },
            { labelKey: 'resource.status', value: status },
            {
              labelKey: 'resource.cpu',
              value: `${getPercentage(
                inflateKubeValue(uc),
                inflateKubeValue(cc)
              )}%`
            },
            {
              labelKey: 'resource.memory',
              value: `${getPercentage(
                inflateKubeValue(um),
                inflateKubeValue(cm)
              )}%`
            },
            {
              labelKey: 'resource.storage',
              value: `${getPercentage(
                inflateKubeValue(us),
                inflateKubeValue(cs)
              )}%`
            },
            { labelKey: 'resource.created', value: getAge(creationTimestamp) }
          ])

          // violations
          if (violations.length > 0) {
            details.push({
              type: 'label',
              labelKey: 'resource.violations'
            })
            violations.forEach(name => {
              const violationDetails = [{ value: name }]
              addDetails(details, violationDetails)
            })
          } else {
            addDetails(details, [
              { labelKey: 'resource.violations', value: '-' }
            ])
          }
          details.push({
            type: 'spacer'
          })
        })
      }
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

    case 'helmrelease':
      {
        const spec = _.get(node, 'specs.raw.spec')
        if (spec) {
          const { chartName, urls, version } = spec
          addDetails(details, [
            { labelKey: 'resource.name', value: chartName },
            { labelKey: 'resource.url', value: urls },
            { labelKey: 'resource.version', value: version }
          ])
        } else {
          addK8Details(node, details)
        }
      }
      break

    case 'policy': {
      const {
        policy: {
          metadata: { name, namespace, creationTimestamp, annotations },
          remediation,
          spec
        }
      } = specs
      addDetails(details, [
        { labelKey: 'resource.name', value: name },
        { labelKey: 'resource.namespace', value: namespace },
        { labelKey: 'resource.created', value: getAge(creationTimestamp) },
        { labelKey: 'resource.remediation', value: remediation }
      ])

      Object.entries(annotations).forEach(([name, value]) => {
        switch (name) {
        case 'policy.mcm.ibm.com/categories': {
          details.push({
            type: 'label',
            labelKey: 'resource.categories'
          })
          value.split(',').forEach(type => {
            type = type.trim()
            if (type) {
              addDetails(details, [
                { value: _.capitalize(_.startCase(type)) }
              ])
            }
          })
          break
        }
        case 'policy.mcm.ibm.com/controls':
          addDetails(details, [{ labelKey: 'resource.controls', value }])
          break
        case 'policy.mcm.ibm.com/standards':
          addDetails(details, [{ labelKey: 'resource.standards', value }])
          break
        }
      })
      const addTemplates = key => {
        const templates = spec[key]
        if (templates) {
          details.push({
            type: 'label',
            labelKey: `resource.${key.replace('-', '.')}`
          })
          templates.forEach(template => {
            addDetails(details, [
              {
                value: _.get(template, 'objectDefinition.kind', '-'),
                indent: true
              }
            ])
          })
        }
      }
      addTemplates('object-templates')
      addTemplates('role-templates')
      addTemplates('policy-templates')
      break
    }

    default:
      addK8Details(node, details)
      break
    }

    // deployable status
    const deployStatuses = _.get(node, 'specs.deployStatuses')
    if (deployStatuses) {
      deployStatuses.forEach(
        ({ lastUpdateTime, phase, reason, resourceStatus }) => {
          details.push({
            type: 'label',
            labelKey: 'resource.status',
            value: phase
          })
          if (reason) {
            details.push({
              type: 'label',
              labelKey: 'resource.reason',
              value: reason
            })
          }
          if (resourceStatus) {
            details.push({
              type: 'label',
              labelKey: 'resource.status.last.updated',
              value: getAge(lastUpdateTime)
            })
            details.push({
              type: 'label',
              labelKey: 'resource.resource.status'
            })
            details.push({
              type: 'snippet',
              value: resourceStatus
            })
          }
        }
      )
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

function addK8Details(node, details, podOnly, index) {
  const { clusterName, name, namespace, type, layout = {} } = node
  const { type: ltype } = layout
  // the main stuff
  if (!podOnly) {
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
          : R.pathOr(undefined, ['specs', 'raw', 'metadata', 'namespace'])(node)
      }
    ]

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
        ['specs', 'raw', 'spec', 'clusterReplicas'],
        'raw.spec.clusterReplicas'
      )
    )

    if (type === 'rules') {
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
  } else {
    if (index) {
      if (index > 1) {
        details.push({
          type: 'spacer'
        })
      }
      const podName = [
        {
          labelKey: 'resource.index.name',
          labelValue: index,
          value: name
        }
      ]
      addDetails(details, podName)
    } else {
      const podName = [
        {
          labelKey: 'resource.name',
          value: name
        }
      ]
      addDetails(details, podName)
    }
  }

  details.push({
    type: 'spacer'
  })

  setApplicationDeployStatus(node, details)
  //subscriptions status
  setSubscriptionDeployStatus(node, details)

  //show error if the resource doesn't produce pods and was not deployed on remote clusters
  setResourceDeployStatus(node, details)

  details.push({
    type: 'spacer'
  })
  //if the resource was deployed on any cluster, show search link here
  createResourceSearchLink(node, details)
  //if resource has a row number add deployable yaml
  createDeployableYamlLink(node, details)

  // kube model details
  setPodDeployStatus(node, details)

  return details
}

export const inflateKubeValue = value => {
  if (value) {
    const match = value.match(/\D/g)
    if (match) {
      // if value has suffix
      const unit = match.join('')
      const val = value.match(/\d+/g).map(Number)[0]
      const BINARY_PREFIXES = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
      const SI_PREFIXES = ['m', 'k', 'M', 'G', 'T', 'P', 'E']
      const num =
        unit && unit.length === 2
          ? factorize(BINARY_PREFIXES, unit, 'binary')
          : factorize(SI_PREFIXES, unit, 'si')
      return val * num
    }
    return parseFloat(value)
  }
  return ''
}

function factorize(prefixes, unit, type) {
  let factorize = 1
  for (var index = 0; index < prefixes.length; index++) {
    if (unit === prefixes[index]) {
      const base = type === 'binary' ? 1024 : 1000
      const unitM = unit === 'm' ? -1 : index
      const exponent = type === 'binary' ? index + 1 : unitM
      factorize = Math.pow(base, exponent)
    }
  }
  return factorize
}

export const getPercentage = (value, total) => {
  return Math.floor(100 * value / total) || 0
}

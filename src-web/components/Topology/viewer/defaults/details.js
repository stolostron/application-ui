/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import moment from 'moment'
import _ from 'lodash'

export const getNodeDetails = (node) => {
  const details = []
  if (node) {
    const { type, specs, layout={} } = node
    let { labels=[] } = node
    switch (type) {
    case 'cluster': {
      const { cluster: {metadata={}, capacity, usage, clusterip, status }, violations=[]} = specs
      const { name, namespace, creationTimestamp } = metadata
      void ({ labels } = metadata)
      const { nodes, cpu:cc, memory:cm, storage:cs } = capacity
      const { pods, cpu:uc, memory:um, storage:us } = usage

      // general details
      addDetails(details, [
        {labelKey: 'resource.name', value: name},
        {labelKey: 'resource.namespace', value: namespace},
        {labelKey: 'resource.clusterip', value: clusterip},
        {labelKey: 'resource.pods', value: pods},
        {labelKey: 'resource.nodes', value: nodes},
        {labelKey: 'resource.status', value: status},
        {labelKey: 'resource.cpu', value: `${getPercentage(inflateKubeValue(uc), inflateKubeValue(cc))}%`},
        {labelKey: 'resource.memory', value: `${getPercentage(inflateKubeValue(um), inflateKubeValue(cm))}%`},
        {labelKey: 'resource.storage', value: `${getPercentage(inflateKubeValue(us), inflateKubeValue(cs))}%`},
        {labelKey: 'resource.created', value: getAge(creationTimestamp)},
      ])

      // violations
      if (violations.length>0) {
        details.push({
          type: 'label',
          labelKey: 'resource.violations'
        })
        violations.forEach(name=>{
          const violationDetails = [
            {value: name},
          ]
          addDetails(details, violationDetails)
        })
      } else {
        addDetails(details, [{labelKey:'resource.violations', value: '-'}])
      }
    }
      break

    case 'placement': {
      const { placements=[] } = specs
      details.push({
        type: 'label',
        labelKey: 'resource.placement'
      })
      placements.forEach(placement=>{
        details.push({
          type: 'snippet',
          value: placement
        })
      })
    }
      break

    case 'deployment': {
      addK8Details(node, details)
      const { hasPods, pods } = layout

      // pods
      if (hasPods) {
        const multiPods = pods.length>1
        details.push({
          type: 'spacer',
        })
        details.push({
          type: 'label',
          labelKey: multiPods ? 'resource.pods.deployed' : 'resource.pod.deployed',
          labelValue: multiPods ? pods.length : undefined
        })

        // the pod stuff
        pods.forEach((pod, idx)=>{
          addK8Details(pod, details, true, multiPods ? idx+1 : undefined)
        })
      }
    }
      break

    case 'helmrelease': {
      const spec = _.get(node, 'specs.raw.spec')
      if (spec) {
        const {chartName, urls, version } = spec
        addDetails(details, [
          {labelKey: 'resource.name', value: chartName},
          {labelKey: 'resource.url', value: urls},
          {labelKey: 'resource.version', value: version},
        ])
      } else {
        addK8Details(node, details)
      }
    }
      break

    case 'policy': {
      const {policy: { metadata: {name, namespace, creationTimestamp, annotations }, remediation, spec}} = specs
      addDetails(details, [
        {labelKey: 'resource.name', value: name},
        {labelKey: 'resource.namespace', value: namespace},
        {labelKey: 'resource.created', value: getAge(creationTimestamp)},
        {labelKey: 'resource.remediation', value: remediation},
      ])

      Object.entries(annotations).forEach(([name, value])=>{
        switch (name) {
        case 'policy.mcm.ibm.com/categories': {
          details.push({
            type: 'label',
            labelKey: 'resource.categories'
          })
          value.split(',').forEach(type=>{
            type = type.trim()
            if (type) {
              addDetails(details, [{value: _.capitalize(_.startCase(type))}])
            }
          })
          break
        }
        case 'policy.mcm.ibm.com/controls':
          addDetails(details, [
            {labelKey: 'resource.controls', value},
          ])
          break
        case 'policy.mcm.ibm.com/standards':
          addDetails(details, [
            {labelKey: 'resource.standards', value},
          ])
          break
        }
      })
      const addTemplates = (key) => {
        const templates = spec[key]
        if (templates) {
          details.push({
            type: 'label',
            labelKey: `resource.${key.replace('-', '.')}`
          })
          templates.forEach(template=>{
            addDetails(details, [{value: _.get(template, 'objectDefinition.kind', '-' ), indent:true}])
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
      deployStatuses.forEach(({lastUpdateTime, phase, reason, resourceStatus})=>{
        details.push({
          type: 'label',
          labelKey: 'resource.status',
          value: phase,
        })
        if (reason) {
          details.push({
            type: 'label',
            labelKey: 'resource.reason',
            value: reason,
          })
        }
        details.push({
          type: 'label',
          labelKey: 'resource.status.last.updated',
          value: getAge(lastUpdateTime),
        })
        details.push({
          type: 'label',
          labelKey: 'resource.resource.status'
        })
        details.push({
          type: 'snippet',
          value: resourceStatus
        })
      })
    }

    // labels
    if (labels && labels.length) {
      details.push({
        type: 'label',
        labelKey: 'resource.labels'
      })
      labels.forEach(({name:lname, value:lvalue})=>{
        const labelDetails = [
          {value: `${lname} = ${lvalue}`, indent:true},
        ]
        addDetails(details, labelDetails)
      })
    }

  }
  return details
}

function addK8Details(node, details, podOnly, index) {
  const { clusterName, name, namespace, type, layout={} } = node
  const { type: ltype } = layout

  // the main stuff
  if (!podOnly) {
    const mainDetails = [
      {labelKey: 'resource.type',
        value: ltype||type},
      {labelKey: 'resource.cluster',
        value: clusterName?clusterName:undefined},
      {labelKey: 'resource.namespace',
        value: namespace?namespace:undefined},
    ]
    addDetails(details, mainDetails)
  } else {
    if (index) {
      if (index>1) {
        details.push({
          type: 'spacer',
        })
      }
      const podName = [
        {labelKey: 'resource.index.name',
          labelValue: index,
          value: name},
      ]
      addDetails(details, podName)
    } else {
      const podName = [
        {labelKey: 'resource.name',
          value: name},
      ]
      addDetails(details, podName)
    }
  }

  // kube model details
  let podModel = _.get(node, 'specs.podModel')
  if (podModel) {
    if (podModel.name) {
      podModel = {}
      podModel[podModel.name] = podModel
    }
    Object.values(podModel) .forEach(pod=>{
      const { status, restarts, hostIP, podIP, startedAt, containers, cluster} = pod
      details.push({
        type: 'label',
        labelKey: 'resource.container.logs'
      })
      containers.forEach(({name:containerName})=>{
        details.push({
          type: 'link',
          value: {
            label: `${containerName}`,
            data: {
              name: pod.name,
              namespace: pod.namespace,
              clusterName: _.get(cluster, 'metadata.name'),
              containerName,
              containers
            }
          },
          indent: true,
        })
      })
      addDetails(details, [
        {labelKey: 'resource.hostip',
          value: hostIP},
        {labelKey: 'resource.podip',
          value: podIP},
        {labelKey: 'resource.created',
          value: getAge(startedAt)},
        {labelKey: 'resource.status',
          value: status},
        {labelKey: 'resource.restarts',
          value: restarts},
      ])
    })
  }
}

const addDetails = (details, dets) => {
  dets.forEach(({labelKey, labelValue, value, indent})=>{
    if (value!==undefined) {
      details.push({
        type: 'label',
        labelKey,
        labelValue,
        value,
        indent,
      })
    }
  })
}
export const inflateKubeValue = value => {
  const match = value.match(/\D/g)
  if (match) {
    // if value has suffix
    const unit = match.join('')
    const val = value.match(/\d+/g).map(Number)[0]
    const BINARY_PREFIXES = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
    const SI_PREFIXES = ['m', 'k', 'M', 'G', 'T', 'P', 'E' ]
    const num = unit && unit.length === 2 ? factorize(BINARY_PREFIXES, unit, 'binary') : factorize(SI_PREFIXES, unit, 'si')
    return val * num
  }
  return parseFloat(value)
}

function factorize(prefixes, unit, type) {
  let factorize = 1
  for (var index = 0; index < prefixes.length; index++) {
    if (unit === prefixes[index]) {
      const base = type === 'binary' ? 1024 : 1000
      const exponent = type === 'binary' ? (index + 1) : (unit === 'm' ? -1 : index)
      factorize = Math.pow(base, exponent)
    }
  }
  return factorize
}

export const getPercentage = (value, total) => {
  return Math.floor(100 * value / total) || 0
}

const getAge = (value) => {
  if (value) {
    if (value.includes('T')) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
    } else {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    }
  }
  return '-'
}

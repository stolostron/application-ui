/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import React from 'react'
import lodash from 'lodash'
import { Link } from 'react-router-dom'
import { Loading } from 'carbon-components-react'
import { getAge, getLabelsToString, getLabelsToList } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'details.name',
  uriKey: 'details.name',
  primaryKey: 'details.name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'details.name',
      transformFunction: createApplicationLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'details.namespace'
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'details.labels',
      transformFunction: getLabelsToString
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'details.creationTimestamp',
      transformFunction: getAge,
    },
    // {
    //   msgKey: 'table.header.status',
    //   resourceKey: 'details.status',
    //   transformFunction: getStatus,
    // },
    {
      msgKey: 'table.header.dashboard',
      resourceKey: 'details.dashboard',
      transformFunction: createDashboardLink,
    },
  ],
  tableActions: [
    'table.actions.applications.remove',
  ],
  detailKeys: {
    title: 'application.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
            type: 'i18n'
          },
          {
            resourceKey: 'details.name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'details.namespace'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.created',
            type: 'i18n'
          },
          {
            resourceKey: 'details.creationTimestamp',
            transformFunction: getAge
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'details.status',
            transformFunction: getStatus
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.labels',
            type: 'i18n'
          },
          {
            resourceKey: 'details.labels',
            transformFunction: getLabelsToList
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.annotations',
            type: 'i18n'
          },
          {
            resourceKey: 'details.annotations',
            transformFunction: getLabelsToList,
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.resource.version',
            type: 'i18n'
          },
          {
            resourceKey: 'details.resourceVersion'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.self.link',
            type: 'i18n'
          },
          {
            resourceKey: 'details.selfLink'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.uid',
            type: 'i18n'
          },
          {
            resourceKey: 'details.uid'
          }
        ]
      },
    ]
  },
  placementPolicyKeys: {
    title: 'application.placement.policies',
    defaultSortField: 'name',
    resourceKey: 'placementPolicies',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'name',
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'namespace',
        msgKey: 'table.header.namespace'
      },
      {
        key: 'replicas',
        resourceKey: 'replicas',
        msgKey: 'table.header.replicas'
      },
      {
        key: 'clusterSelector',
        resourceKey: 'clusterSelector',
        msgKey: 'table.header.cluster.selector',
        transformFunction: getLabelsToList,
      },
      {
        key: 'resourceSelector',
        resourceKey: 'resourceSelector',
        msgKey: 'table.header.resource.selector',
        transformFunction: getLabelsToList,
      },
    ],
  },
  deployablesKeys: {
    title: 'application.deployables',
    defaultSortField: 'name',
    resourceKey: 'deployables',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'name',
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'deployer.namespace',
        msgKey: 'table.header.namespace'
      },
      {
        key: 'chartName',
        resourceKey: 'deployer.chartName',
        msgKey: 'table.header.chartName'
      },
      {
        key: 'repository',
        resourceKey: 'deployer.repository',
        msgKey: 'table.header.helm.repository'
      },
      {
        key: 'version',
        resourceKey: 'deployer.version',
        msgKey: 'table.header.chartVersion'
      },
      {
        key: 'dependencies',
        resourceKey: 'dependencies',
        msgKey: 'table.header.dependencies',
        transformFunction: getDependencies
      },
    ],
  },
  topologyOrder: ['application', 'deployer', 'policy', 'dependency'],
  topologyShapes: {
    'application': {
      shape: 'roundedSq',
      className: 'container'
    },
    'deployer': {
      shape: 'circle',
      className: 'service'
    },
    'policy': {
      shape: 'roundedRect',
      className: 'service'
    },
    'dependency': {
      shape: 'octogon',
      className: 'internet'
    }
  },
  topologyNodeDescription: setNodeInfo,
  topologyTransform: topologyTransform,
  topologyNodeDetails: getNodeDetails,
  topologyActiveFilters: getActiveFilters
}

export function createApplicationLink(item = {}){
  const {details: {name, namespace = 'default'}} = item
  return <Link to={`/hcmconsole/applications/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`}>{name}</Link>
}

export function createDashboardLink({details: {dashboard=''}} = {}, locale){
  if (dashboard !== null && dashboard !== '')
    return <a target="_blank" rel="noopener noreferrer" href={dashboard}>{msgs.get('table.actions.launch.grafana', locale)}</a>

  return '-'
}

export function getStatus(item = {}){
  return item.hasPendingActions ?
    <Loading id={`loading-${item.name}`} small withOverlay={false} />
    :
    item.status
}

export function getDependencies(item = {}){
  if (item.dependencies) {
    let str = ''
    item.dependencies.forEach(({name, kind}) => {
      str += `${name} (${kind}), `
    })
    return str.substring(0, str.length - 2)
  }
  return '-'
}

export function getActiveFilters(item) {
  const {details} = item
  const label = lodash.map(details.labels, (value, key) => {
    return { label: `${key}: ${value}`, name: key, value}
  })
  return {
    namespace: [],
    label
  }
}

export function topologyTransform(item) {
  const links=[]
  const nodes=[]
  if (item) {
    const {details: {name, namespace}, deployables=[], placementPolicies=[]} = item

    // create application node
    const appId = `application${name}`
    nodes.push({
      name,
      namespace,
      type: 'application',
      uid: appId
    })

    // create its deployables nodes
    deployables.forEach(({name, deployer: {chartName}, dependencies})=>{
      const depId = `deployer${name}`
      nodes.push({
        name,
        chartName,
        type: 'deployer',
        uid: depId
      })
      links.push({
        source: appId,
        target: depId,
        label: 'uses',
        uid: appId+depId
      })

      // create deployable dependencies
      dependencies = dependencies || []
      dependencies.forEach(({name, kind})=>{
        const dpId = `dependency${name}`
        nodes.push({
          name,
          kind,
          type: 'dependency',
          uid: dpId
        })
        links.push({
          source: depId,
          target: dpId,
          label: 'depends',
          uid: depId+dpId
        })

      })
    })

    placementPolicies.forEach(({name})=>{
      const polId = `policy${name}`
      nodes.push({
        name,
        type: 'policy',
        uid: polId
      })
      links.push({
        source: appId,
        target: polId,
        label: 'uses',
        uid: appId+polId
      })
    })
  }
  return {
    links,
    nodes
  }
}

export function setNodeInfo({type, namespace, chartName, kind, layout}, locale) {
  switch (type) {
  case 'application':
    layout.info = namespace
    break
  case 'deployer':
    layout.info = chartName
    break
  case 'dependency':
    layout.info = kind
    break
  case 'policy':
    layout.info = msgs.get('application.policy', locale)
    break
  default:
    break
  }
}

export function getNodeDetails(currentNode) {
  const details = []
  if (currentNode){
    currentNode.type && details.push({
      type: 'label',
      labelKey: 'resource.type',
      value: currentNode.type,
    })
    currentNode.cluster && details.push({
      type: 'label',
      labelKey: 'resource.cluster',
      value: currentNode.clusterName,
    })
    currentNode.namespace && details.push({
      type: 'label',
      labelKey: 'resource.namespace',
      value: currentNode.namespace,
    })
  }
  return details
}

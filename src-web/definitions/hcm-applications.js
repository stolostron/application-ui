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
    {
      msgKey: 'table.header.status',
      resourceKey: 'details.status',
      transformFunction: getStatus,
    },
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
            isList: true
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
    ],
  },
  topologyOrder: ['application', 'appservice', 'dependency'],
  topologyShapes: {
    'application': {
      shape: 'circle',
      className: 'container'
    },
    'appservice': {
      shape: 'heptagon',
      className: 'container'
    },
    'dependency': {
      shape: 'octogon',
      className: 'container'
    }
  },
  topologyNodeDescription: setNodeInfo,
  topologyTransform: topologyTransform,
  topologyNodeDetails: getNodeDetails
}

export function createApplicationLink(item = {}){
  const {details: {name}} = item
  return <Link to={`/hcmconsole/applications/${encodeURIComponent(name)}`}>{name}</Link>
}

export function createDashboardLink({details: {dashboard=''}} = {}, locale){
  if (dashboard !== '')
    return <a target="_blank" href={dashboard}>{msgs.get('table.actions.launch.grafana', locale)}</a>

  return '-'
}

export function getStatus(item = {}){
  return item.hasPendingActions ?
    <Loading id={`loading-${item.name}`} small withOverlay={false} />
    :
    item.status
}

export function topologyTransform(resourceItem) {
  const links=[]
  const nodes=[]
  if (resourceItem) {
    const {name, namespace, components, dependencies, relationships} = resourceItem

    // create application node
    const appId = `application${name}`
    nodes.push({
      name,
      namespace,
      type: 'application',
      uid: appId
    })

    // create its component nodes
    components.forEach(component=>{
      const {name, namespace} = component
      const cmpId = `component${name}`
      nodes.push({
        name,
        namespace,
        type: 'appservice',
        uid: cmpId
      })
      links.push({
        source: appId,
        target: cmpId,
        label: 'uses',
        uid: appId+cmpId
      })
    })

    // create component dependencies
    dependencies.forEach(dependency=>{
      const {name} = dependency
      const depId = `dependency${name}`
      nodes.push({
        name,
        type: 'dependency',
        uid: depId
      })
    })

    // create relationships between components and dependencies
    relationships.forEach(({source, destination, type})=>{
      const cmpId = `component${source}`
      const depId = `dependency${destination}`
      links.push({
        source: cmpId,
        target: depId,
        label: type,
        uid: cmpId+depId
      })
    })

  }
  return {
    links,
    nodes
  }
}

export function setNodeInfo({type, namespace, layout}, locale) {
  switch (type) {
  case 'application':
  case 'appservice':
    layout.info = msgs.get('topology.namespace', [namespace], locale)
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

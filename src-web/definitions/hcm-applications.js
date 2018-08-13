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
import { getAge, getLabelsToString } from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
  uriKey: 'name',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createApplicationLink,
    },
    {
      msgKey: 'table.header.components',
      resourceKey: 'components',
      transformFunction: createComponentsAndDependenciesList('components'),
    },
    {
      msgKey: 'table.header.dependencies',
      resourceKey: 'dependencies',
      transformFunction: createComponentsAndDependenciesList('dependencies'),
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'labels',
      transformFunction: createLabelsList,
    },
    {
      msgKey: 'table.header.annotations',
      resourceKey: 'annotations',
      transformFunction: createAnnotationsList,
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatus,
    },
    {
      msgKey: 'table.header.dashboard',
      resourceKey: 'dashboard',
      transformFunction: createDashboardLink,
    },
  ],
  tableActions: [
    'table.actions.applications.deploy',
    'table.actions.applications.dashboard',
    'table.actions.applications.undeploy',
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
            resourceKey: 'name'
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
            resourceKey: 'namespace'
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
            resourceKey: 'created',
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
            resourceKey: 'status'
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
            resourceKey: 'labels',
            transformFunction: getLabelsToString
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
            resourceKey: 'annotations',
            transformFunction: getLabelsToString
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
            resourceKey: 'resourceVersion'
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
            resourceKey: 'selfLink'
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
            resourceKey: 'uid'
          }
        ]
      },
    ]
  },
  topologyOrder: ['application', 'appservice', 'dependency'],
  topologyNodeDescription: setNodeInfo,
  topologyTransform: topologyTransform
}

export function createApplicationLink(item = {}){
  return <Link to={`/hcmconsole/applications/${encodeURIComponent(item.name)}`}>{item.name}</Link>
}

/**
 * Create an HTML list from an array of AppNodes.
 * Used to display components and dependencies of an application.
 *
 */
export function createComponentsAndDependenciesList(dataKey){
  return function createList(item = {}) {

    return <ul>
      {lodash.map(item[dataKey], (value) => {
        return <li key={value.name + value.cluster}>
          {`${value.name}[${value.cluster}]`}
        </li>
      })}
    </ul>
  }
}

/**
 * Create an HTML list <ul> containing the application labels.
 *
 */
export function createLabelsList(item = {}) {
  return <ul>
    {lodash.map(item['labels'], (value, key) => {
      return <li key={key+value}>
        {`${key}=${value !== '' ? value : '""'}`}
      </li>
    })
    }
  </ul>
}

/**
 * Create an HTML list <ul> containing the application annotations.
 *
 */
export function createAnnotationsList(item = {}) {
  return <ul>
    {lodash.map(item['annotations'], (value, key) => {
      // Removing 'dashboard' and 'status' annotations to avoid duplication
      // because these are shown in a separate column.
      return key !== 'dashboard' && key !== 'status' && <li key={key + value}>
        {`${key}=${value !== '' ? value : '""'}`}
      </li>
    })
    }
  </ul>
}

export function createDashboardLink(item = {}, locale){
  if(item.dashboard && item.dashboard !== '')
    return <a target="_blank" href={item.Dashboard}>{msgs.get('table.actions.launch.grafana', locale)}</a>

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

export function setNodeInfo({type, namespace, layout}) {
  switch (type) {
  case 'application':
  case 'appservice':
    layout.info = namespace
    break
  default:
    break
  }
}

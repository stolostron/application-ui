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
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
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
}

export function createApplicationLink(item = {}){
  return <Link to={`/hcmconsole/application/topology/${encodeURIComponent(item.name)}`}>{item.name}</Link>
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

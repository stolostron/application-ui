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
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'Name',
  primaryKey: 'Name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'Name',
    },
    {
      msgKey: 'table.header.components',
      resourceKey: 'Components',
      transformFunction: createComponentsAndDependenciesList('Components'),
    },
    {
      msgKey: 'table.header.dependencies',
      resourceKey: 'Dependencies',
      transformFunction: createComponentsAndDependenciesList('Dependencies'),
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'Labels',
      transformFunction: createLabelsList,
    },
    {
      msgKey: 'table.header.annotations',
      resourceKey: 'Annotations',
      transformFunction: createAnnotationsList,
    },
    {
      msgKey: 'table.header.dashboard',
      resourceKey: 'Dashboard',
      transformFunction: createDashboardLink,
    },
  ],
  tableActions: [
    'table.actions.create.dashboard',
  ],
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
        return <li key={value.Name+value.Cluster}>
          {`${value.Name}[${value.Cluster}]`}
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
    {lodash.map(item['Labels'], (value, key) => {
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
    {lodash.map(item['Annotations'], (value, key) => {
      // Removing the dashboard annotation to avoid duplication because
      // the dashboard link is shown in a separate column.
      return key !== 'dashboard' && <li key={key+value}>
        {`${key}=${value !== '' ? value : '""'}`}
      </li>
    })
    }
  </ul>
}

export function createDashboardLink(item = {}, locale){
  if(item.Dashboard && item.Dashboard !== '')
    return <a target="_blank" href={item.Dashboard}>{msgs.get('table.actions.launch.grafana', locale)}</a>

  return '-'
}

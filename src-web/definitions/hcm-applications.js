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
      transformFunction: createListFromKeyValue('Labels')
    },
    {
      msgKey: 'table.header.annotations',
      resourceKey: 'Annotations',
      transformFunction: createListFromKeyValue('Annotations')
    },
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
 * Create an HTML unordered list <ul> from an object (key-value)
 *
 */
export function createListFromKeyValue(dataKey) {
  return function createList(item = {}) {

    return <ul>
      {lodash.map(item[dataKey], (value, key) => {
        return <li key={key+value}>
          {`${key}=${value !== '' ? value : '""'}`}
        </li>
      })
      }
    </ul>
  }
}


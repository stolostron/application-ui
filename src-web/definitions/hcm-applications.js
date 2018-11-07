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
import { Loading } from 'carbon-components-react'
import {getAge, getLabelsToString, getLabelsToList} from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'

export default {
  defaultSortField: 'metadata.name',
  uriKey: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
      transformFunction: createApplicationLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace'
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'metadata.labels',
      transformFunction: getLabelsToString
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'metadata.creationTimestamp',
      transformFunction: getAge,
    },
    // {
    //   msgKey: 'table.header.status',
    //   resourceKey: 'metadata.status',
    //   transformFunction: getStatus,
    // },
    {
      msgKey: 'table.header.dashboard',
      resourceKey: 'dashboard',
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
            resourceKey: 'metadata.name'
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
            resourceKey: 'metadata.namespace'
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
            resourceKey: 'metadata.creationTimestamp',
            transformFunction: getAge
          }
        ]
      },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.status',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'status',
      //       transformFunction: getStatus
      //     }
      //   ]
      // },
      {
        cells: [
          {
            resourceKey: 'description.title.labels',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.labels',
            transformFunction: getLabelsToList
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.selector',
            type: 'i18n'
          },
          {
            resourceKey: 'selector',
            transformFunction: getLabelsToList,
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
            resourceKey: 'metadata.annotations',
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
            resourceKey: 'metadata.resourceVersion'
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
            resourceKey: 'metadata.selfLink'
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
            resourceKey: 'metadata.uid'
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
        resourceKey: 'metadata.name',
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
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
      {
        key: 'timestamp',
        resourceKey: 'metadata.creationTimestamp',
        msgKey: 'table.header.created',
        transformFunction: getAge
      },
    ],
  },
  deployablesKeys: {
    title: 'application.deployables',
    defaultSortField: 'name',
    resourceKey: 'deployables',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'metadata.name',
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'table.header.namespace'
      },
      {
        key: 'chart',
        resourceKey: 'deployer',
        msgKey: 'table.header.chartDetails',
        transformFunction: getChart
      },
      {
        key: 'dependencies',
        resourceKey: 'dependencies',
        msgKey: 'table.header.dependencies',
        transformFunction: getDependencies
      },
      {
        key: 'timestamp',
        resourceKey: 'metadata.creationTimestamp',
        msgKey: 'table.header.created',
        transformFunction: getAge
      },
    ],
  },
  applicationRelationshipKeys: {
    title: 'application.relationships',
    defaultSortField: 'name',
    resourceKey: 'applicationRelationships',
    normalizedKey: 'metadata.name',
    tableKeys: [
      {
        key: 'name',
        resourceKey: 'metadata.name',
        msgKey: 'table.header.name'
      },
      {
        key: 'namespace',
        resourceKey: 'metadata.namespace',
        msgKey: 'table.header.namespace'
      },
      {
        key: 'source',
        resourceKey: 'source',
        msgKey: 'table.header.source',
        transformFunction: getRelationshipSourceDest
      },
      {
        key: 'destination',
        resourceKey: 'destination',
        msgKey: 'table.header.destination',
        transformFunction: getRelationshipSourceDest
      },
      {
        key: 'type',
        resourceKey: 'type',
        msgKey: 'table.header.type'
      },
      {
        key: 'timestamp',
        resourceKey: 'metadata.creationTimestamp',
        msgKey: 'table.header.created',
        transformFunction: getAge
      },
    ],
  },
}

export function createApplicationLink(item = {}, ...param){
  const {metadata: {name, namespace = 'default'}} = item
  if (param[2]) return item.metadata.name
  return <Link to={`${config.contextPath}/applications/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`}>{name}</Link>
}

export function createDashboardLink({ dashboard = '' } , locale){
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

export function getChart(item = {}, locale){
  if (item.deployer){
    if (item.deployer.chartURL) {
      return (
        <ul>
          <li key='name' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartUrl', locale)}</b>{` = ${item.deployer.chartURL ? item.deployer.chartURL : '-'}`}
          </li>
          <li key='namespace' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartNamespace', locale)}</b>{` = ${item.deployer.namespace ? item.deployer.namespace : '-'}`}
          </li>
        </ul>
      )
    } else {
      return (
        <ul>
          <li key='name' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartName', locale)}</b>{` = ${item.deployer.chartName ? item.deployer.chartName : '-'}`}
          </li>
          <li key='repo' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartRepo', locale)}</b>{` = ${item.deployer.repository ? item.deployer.repository : '-'}`}
          </li>
          <li key='version' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartVersion', locale)}</b>{` = ${item.deployer.version ? item.deployer.version : '-'}`}
          </li>
          <li key='namespace' style={{display:'block'}}>
            <b>{msgs.get('table.header.chartNamespace', locale)}</b>{` = ${item.deployer.namespace ? item.deployer.namespace : '-'}`}
          </li>
        </ul>
      )
    }
  }
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

export function getRelationshipSourceDest(item, locale, arg) {
  return arg === 'source'
    ? <ul>
      <li style={{display:'block'}}><b>{'name'}</b>{` = ${item.source ? item.source.name : '-'}`}</li>
      <li style={{display:'block'}}><b>{'kind'}</b>{` = ${item.source ? item.source.name : '-'}`}</li>
    </ul>
    : <ul>
      <li style={{display:'block'}}><b>{'name'}</b>{` = ${item.destination ? item.destination.name : '-'}`}</li>
      <li style={{display:'block'}}><b>{'kind'}</b>{` = ${item.destination ? item.destination.name : '-'}`}</li>
    </ul>
}

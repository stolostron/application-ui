/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Loading } from 'carbon-components-react'
import lodash from 'lodash'
import { getAge, getLabelsToList } from '../../lib/client/resource-helper'
import {
  getNumClusters,
  getNumPolicyViolations,
  getNumRemoteSubscriptions
} from '../components/common/ResourceOverview/utils'
import msgs from '../../nls/platform.properties'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'
import { validator } from './validators/hcm-application-validator'

export default {
  defaultSortField: 'name',
  uriKey: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.applicationName',
      resourceKey: 'name',
      transformFunction: createApplicationLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.managedClusters',
      resourceKey: 'clusters',
      transformFunction: getNumClusters
    },
    {
      msgKey: 'table.header.subscriptions',
      resourceKey: 'subscriptions',
      transformFunction: getNumRemoteSubscriptions
    },
    {
      msgKey: 'table.header.policyViolations',
      resourceKey: 'violations',
      transformFunction: getNumPolicyViolations
    },
    {
      msgKey: 'table.header.incidents',
      resourceKey: 'incidents'
    },
    // {
    //   msgKey: 'table.header.deployables',
    //   resourceKey: 'deployables',
    //   transformFunction: getNumDeployables
    // },
    // {
    //   msgKey: 'table.header.deployments',
    //   resourceKey: 'deployments',
    //   transformFunction: getNumDeployments
    // },
    // {
    //   msgKey: 'table.header.deployment.completedDeployments',
    //   resourceKey: 'completedDeployments',
    //   transformFunction: getNumCompletedDeployments
    // },
    // {
    //   msgKey: 'table.header.deployment.inProgress',
    //   resourceKey: 'inProgressDeployments',
    //   transformFunction: getNumInProgressDeployments
    // },
    // {
    //   msgKey: 'table.header.deployment.failed',
    //   resourceKey: 'failedDeployments',
    //   transformFunction: getNumFailedDeployments
    // },
    // {
    //   msgKey: 'table.header.labels',
    //   resourceKey: 'metadata.labels',
    //   transformFunction: getLabelsToString,
    // },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
    // {
    //   msgKey: 'table.header.status',
    //   resourceKey: 'metadata.status',
    //   transformFunction: getStatus,
    // },
    // {
    //   msgKey: 'table.header.dashboard',
    //   resourceKey: 'dashboard',
    //   transformFunction: createDashboardLink
    // }
  ],
  tableActions: [
    'table.actions.applications.perfmon',
    'table.actions.applications.remove'
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
            resourceKey: 'label'
            // transformFunction: getLabelsToList
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
            resourceKey: 'annotations',
            transformFunction: getLabelsToList
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
            resourceKey: '_uid'
          }
        ]
      }
    ]
  },
  deploymentKeys: {
    title: 'application.works',
    defaultSortField: 'name',
    resourceKey: 'deployments',
    normalizedKey: 'name',
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
        key: 'cluster',
        resourceKey: 'cluster',
        msgKey: 'table.header.cluster'
      },
      // {
      //   key: 'release',
      //   resourceKey: 'release',
      //   msgKey: 'table.header.helm.release'
      // },
      {
        key: 'apigroup',
        resourceKey: 'apigroup',
        msgKey: 'table.header.apiGroups'
      },
      {
        key: 'status',
        resourceKey: 'status',
        msgKey: 'table.header.status'
      },
      // {
      //   key: 'reason',
      //   resourceKey: 'reason',
      //   msgKey: 'table.header.reason'
      // },
      {
        key: 'kind',
        resourceKey: 'kind',
        msgKey: 'table.header.kind'
      },
      {
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      },
      {
        key: 'updated',
        resourceKey: 'updated',
        msgKey: 'table.header.updated',
        transformFunction: getAge
      }
    ]
  },
  deployableKeys: {
    title: 'application.deployables',
    defaultSortField: 'name',
    resourceKey: 'deployables',
    normalizedKey: 'name',
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
      // {
      //   key: 'chart',
      //   resourceKey: 'deployer',
      //   msgKey: 'table.header.deployerDetails',
      //   transformFunction: getDeployerDetails
      // },
      // {
      //   key: 'dependencies',
      //   resourceKey: 'dependencies',
      //   msgKey: 'table.header.dependencies',
      //   transformFunction: getDependencies
      // },
      {
        key: 'cluster',
        resourceKey: 'cluster',
        msgKey: 'table.header.cluster'
      },
      {
        key: 'apigroup',
        resourceKey: 'apigroup',
        msgKey: 'table.header.apiGroups'
      },
      {
        key: 'status',
        resourceKey: 'status',
        msgKey: 'table.header.status'
      },
      {
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ]
  },
  subscriptionKeys: {
    title: 'application.subscriptions',
    defaultSortField: 'name',
    resourceKey: 'subscriptions',
    normalizedKey: 'name',
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
        key: 'cluster',
        resourceKey: 'cluster',
        msgKey: 'table.header.cluster'
      },
      {
        key: 'channel',
        resourceKey: 'channel',
        msgKey: 'table.header.channel'
      },
      {
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ]
  },
  placementRuleKeys: {
    title: 'application.placement.rules',
    defaultSortField: 'name',
    resourceKey: 'placementRules',
    normalizedKey: 'name',
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
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ]
  },
  placementPolicyKeys: {
    title: 'application.placement.policies',
    defaultSortField: 'name',
    resourceKey: 'placementPolicies',
    normalizedKey: 'name',
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
        resourceKey: 'clusterReplicas',
        msgKey: 'table.header.replicas'
      },
      {
        key: 'clusterSelector',
        resourceKey: 'clusterLabels',
        msgKey: 'table.header.cluster.selector',
        transformFunction: getLabelsToList
      },
      {
        key: 'resourceSelector',
        resourceKey: 'resourceSelector',
        msgKey: 'table.header.resource.selector',
        transformFunction: getLabelsToList
      },
      {
        key: 'decisions',
        resourceKey: 'status',
        msgKey: 'table.header.decisions',
        transformFunction: getDecisions
      },
      {
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ],
    tableActions: ['table.actions.application.edit']
  },
  placementBindingKeys: {
    title: 'application.placement.bindings',
    defaultSortField: 'name',
    resourceKey: 'placementBindings',
    normalizedKey: 'name',
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
        key: 'placementpolicy',
        resourceKey: 'placementRef.name',
        msgKey: 'table.header.placementpolicy'
      },
      {
        key: 'subjects',
        resourceKey: 'subjects',
        msgKey: 'table.header.subjects',
        transformFunction: getSubjects
      },
      {
        key: 'timestamp',
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ]
  },
  applicationRelationshipKeys: {
    title: 'application.relationships',
    defaultSortField: 'name',
    resourceKey: 'applicationRelationships',
    normalizedKey: 'name',
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
        resourceKey: 'created',
        msgKey: 'table.header.created',
        transformFunction: getAge
      }
    ]
  }
}

export function createApplicationLink(item = {}, ...param) {
  const { name, namespace = 'default' } = item ? item : item
  if (param[2]) return item.name
  const link = `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}`
  return <Link to={link}>{name}</Link>
}

export function createDashboardLink({ dashboard = '' }, locale) {
  if (dashboard !== null && dashboard !== '') {
    return (
      <a target="_blank" rel="noopener noreferrer" href={dashboard}>
        {msgs.get('table.actions.launch.grafana', locale)}
      </a>
    )
  }

  return '-'
}

export function getStatus(item = {}) {
  return item.hasPendingActions ? (
    <Loading id={`loading-${item.name}`} small withOverlay={false} />
  ) : (
    item.status
  )
}

export function getDecisions(item = {}) {
  const decisions =
    lodash.get(item, 'placementPolicies[0].status.decisions') ||
    lodash.get(item, 'status.decisions')
  if (decisions) {
    return decisions.map(decision => decision.clusterName).join(', ')
  }
  return '-'
}

export function getDeployerDetails(item = {}, locale) {
  if (item.deployer) {
    // deployer was a chart
    if (item.deployer.chartURL) {
      return (
        <ul>
          <li key="name" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartUrl', locale)}</b>
            {` = ${item.deployer.chartURL ? item.deployer.chartURL : '-'}`}
          </li>
          <li key="namespace" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartNamespace', locale)}</b>
            {` = ${item.deployer.namespace ? item.deployer.namespace : '-'}`}
          </li>
        </ul>
      )
      // deployer was a chart
    } else if (item.deployer.chartName) {
      return (
        <ul>
          <li key="name" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartName', locale)}</b>
            {` = ${item.deployer.chartName ? item.deployer.chartName : '-'}`}
          </li>
          <li key="repo" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartRepo', locale)}</b>
            {` = ${item.deployer.repository ? item.deployer.repository : '-'}`}
          </li>
          <li key="version" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartVersion', locale)}</b>
            {` = ${item.deployer.version ? item.deployer.version : '-'}`}
          </li>
          <li key="namespace" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.chartNamespace', locale)}</b>
            {` = ${item.deployer.namespace ? item.deployer.namespace : '-'}`}
          </li>
        </ul>
      )
    } else if (item.deployer.kubeKind) {
      // deployer was a k8 object
      return (
        <ul>
          <li key="name" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.kind', locale)}</b>
            {` = ${item.deployer.kubeKind ? item.deployer.kubeKind : '-'}`}
          </li>
          <li key="namespace" style={{ display: 'block' }}>
            <b>{msgs.get('table.header.name', locale)}</b>
            {` = ${item.deployer.kubeName ? item.deployer.kubeName : '-'}`}
          </li>
        </ul>
      )
    }
  }
}

export function getDependencies(item = {}) {
  if (item.dependencies) {
    let str = ''
    item.dependencies.forEach(({ name, kind }) => {
      str += `${name} [${kind}], `
    })
    return str.substring(0, str.length - 2)
  }
  return '-'
}

export function getRelationshipSourceDest(item, locale, arg) {
  return arg === 'source' ? (
    <ul>
      <li style={{ display: 'block' }}>
        <b>name</b>
        {` = ${item.source ? item.source.name : '-'}`}
      </li>
      <li style={{ display: 'block' }}>
        <b>kind</b>
        {` = ${item.source ? item.source.name : '-'}`}
      </li>
    </ul>
  ) : (
    <ul>
      <li style={{ display: 'block' }}>
        <b>name</b>
        {` = ${item.destination ? item.destination.name : '-'}`}
      </li>
      <li style={{ display: 'block' }}>
        <b>kind</b>
        {` = ${item.destination ? item.destination.name : '-'}`}
      </li>
    </ul>
  )
}

export function getSubjects(item) {
  return (
    item.subjects &&
    item.subjects.map(subject => `${subject.name}(${subject.kind})`).join(', ')
  )
}

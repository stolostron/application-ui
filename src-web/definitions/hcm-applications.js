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
import {getAge, getLabelsToString, getLabelsToList, dumpAndSync} from '../../lib/client/resource-helper'
import msgs from '../../nls/platform.properties'
import { Link } from 'react-router-dom'
import _ from 'lodash'
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
      {
        cells: [
          {
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.status',
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

  /////////////////////// DESIGN TAB //////////////////////////////////
  topologyOrder: ['application', 'deployer', 'policy', 'dependency'],
  topologyShapes: {
    'application': {
      shape: 'roundedSq',
      className: 'container',
      nodeRadius: 30
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
      shape: 'hexagon',
      className: 'internet'
    }
  },
  topologyNodeLayout: setNodeInfo,
  topologyTransform: topologyTransform,
  topologyNodeDetails: getNodeDetails,
  topologyRequiredFilters: getRequiredFilters,
  topologyOptions: {
    showLineLabels: true, // show labels on lines
  }
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

export function getRequiredFilters(item) {
  let label = []
  const {selector={}} = item
  for (var key in selector) {
    if (selector.hasOwnProperty(key)) {
      switch (key) {

      case 'matchLabels':
        for (var k in selector[key]) {
          if (selector[key].hasOwnProperty(k)) {
            const v = selector[key][k]
            label.push({ label: `${k}: ${v}`, name: k, value: v})
          }
        }
        break

      case 'matchExpressions':
        selector[key].forEach(({key:k='', operator='', values=[]})=>{
          switch (operator.toLowerCase()) {
          case 'in':
            label = values.map(v => {
              return { label: `${k}: ${v}`, name: k, value:v}
            })
            break

          case 'notin':
            //TODO
            break

          default:
            break
          }
        })
        break

      default:
        break
      }
    }
  }
  return {
    namespace: [],
    label
  }
}

export function topologyTransform(item) {
  const links=[]
  const nodes=[]
  let yaml = ''
  if (item) {
    const keys = ['deployables', 'placementPolicies']
    yaml = dumpAndSync(item, keys)

    // create application node
    const name = _.get(item, 'synced.metadata.$v.name.$v')
    const appId = `application--${name}`
    nodes.push({
      name,
      namespace: _.get(item, 'synced.metadata.$v.namespace.$v'),
      application: item,
      type: 'application',
      uid: appId,
      $r: 0
    })

    // create other nodes and their links to application
    keys.forEach(key=>{
      const arr = item[key]
      if (Array.isArray(arr)) {
        arr.forEach((member, idx)=>{
          if (member.synced) {
            const name = _.get(member, 'synced.metadata.$v.name', member)
            const memberId = `member--${name.$v}--${idx}`
            nodes.push({
              name: name.$v,
              member,
              type: key === 'deployables' ? 'deployer' : 'policy',
              uid: memberId,
              $r: name.$r
            })
            links.push({
              source: appId,
              target: memberId,
              label: 'uses',
              uid: appId+memberId
            })
          }
        })
      }
    })
  }

  return {
    links,
    nodes,
    yaml
  }
}

export function setNodeInfo(node, locale) {
  const {type, layout} = node
  switch (type) {
  case 'application':
    layout.info = node.namespace
    break
  case 'deployer':
    layout.info = _.get(node, 'deployer.chartName.$v')
    break
  case 'dependency':
    layout.info =  _.get(node, 'dependency.kind.$v')
    break
  case 'policy':
    layout.info = msgs.get('application.policy', locale)
    break
  default:
    break
  }
}

export function getNodeDetails(currentNode, context) {
  const details = []
  if (currentNode){
    let dets = []
    const {type, application={}, deployer={}, policy={}, dependency={}} = currentNode
    const {metadata: appDetails} = application
    const {chartName, namespace: dspace, repository, version} = deployer
    const {namespace: pspace, replicas} = policy
    const {kind} = dependency
    switch (type) {
    case 'application':
      dets = [
        {labelKey: 'resource.type',
          value: type},
        {labelKey: 'resource.namespace',
          value: appDetails.namespace},
        {labelKey: 'table.header.created',
          value: getAge(appDetails, context, 'creationTimestamp')},
        {labelKey: 'table.header.labels',
          value: getLabelsToString(appDetails, context, 'labels')},
      ]
      break

    case 'deployer':
      dets = [
        {labelKey: 'resource.type',
          value: type},
        {labelKey: 'resource.namespace',
          value: dspace},
        {labelKey: 'table.header.chartName',
          value: chartName},
        {labelKey: 'table.header.helm.repository',
          value: repository},
        {labelKey: 'table.header.resource.version',
          value: version},
      ]
      break
    case 'policy':
      dets = [
        {labelKey: 'resource.type',
          value: type},
        {labelKey: 'resource.namespace',
          value: pspace},
        {labelKey: 'table.header.replicas',
          value: replicas},
      ]
      break
    case 'dependency':
      dets = [
        {labelKey: 'resource.type',
          value: type},
        {labelKey: 'table.header.kind',
          value: kind},
      ]
      break
    }

    // add to details
    dets.forEach(({labelKey, value})=>{
      if (value) {
        details.push({
          type: 'label',
          labelKey,
          value,
        })
      }
    })
  }
  return details
}

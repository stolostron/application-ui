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
import {getAge, getLabelsToList} from '../../lib/client/resource-helper'
import { Icon } from 'carbon-components-react'
import { Link } from 'react-router-dom'
import resources from '../../lib/shared/resources'

resources(() => {
  require('../../scss/table.scss')
})

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  policyRules: {
    title: 'table.header.rules',
    defaultSortField: 'name',
    resourceKey: 'rules',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'ruleUID',
        key: 'ruleUID',
      },
      {
        msgKey: 'table.header.templateType',
        resourceKey: 'templateType',
        key: 'templateType',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
        key: 'complianceType',
      },
      {
        msgKey: 'table.header.apiGroups',
        resourceKey: 'apiGroups',
        key: 'apiGroups',
        transformFunction: getAPIGroups
      },
      {
        msgKey: 'table.header.ruleVerbs',
        resourceKey: 'verbs',
        key: 'verbs',
        transformFunction: getRuleVerbs
      },
      {
        msgKey: 'table.header.resources',
        resourceKey: 'resources',
        key: 'resources',
      },
    ],
  },
  policyViolations: {
    resourceKey: 'violations',
    title: 'table.header.violation',
    defaultSortField: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.status',
        resourceKey: 'status',
        key: 'status',
        transformFunction: getStatus,
      },
      {
        msgKey: 'table.header.cluster',
        resourceKey: 'cluster',
        key: 'cluster',
      },
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.message',
        resourceKey: 'message',
        key: 'message',
      },
      {
        msgKey: 'table.header.reason',
        resourceKey: 'reason',
        key: 'reason',
      },
      {
        msgKey: 'table.header.selector',
        resourceKey: 'selector',
        key: 'selector',
        transformFunction: getLabelsToList
      },
    ],
  },
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
      transformFunction: createPolicyLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatus,
    },
    {
      msgKey: 'table.header.enforcement',
      resourceKey: 'enforcement',
      transformFunction: getEnforcement,
    },
  ],
  tableActions: [
    'table.actions.policy.remove',
  ],
  detailKeys: {
    title: 'policy.details',
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
            resourceKey: 'description.title.exclude_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.exclude_namespace',
            transformFunction: getExcludeNamespace
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.include_namespace',
            type: 'i18n'
          },
          {
            resourceKey: 'detail.include_namespace',
            transformFunction: getIncludeNamespace
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.enforcement',
            type: 'i18n'
          },
          {
            resourceKey: 'enforcement'
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
            resourceKey: 'description.title.annotations',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.annotations',
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
  policyTemplatesKeys: {
    title: 'policy.template.details',
    headerRows: ['description.title.name', 'description.title.last.transition', 'description.title.templateType'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'name',
          },
          {
            resourceKey: 'lastTransition',
            transformFunction: getAge
          },
          {
            resourceKey: 'templateType',
          }
        ]
      }
    ]
  },
}

export function createPolicyLink(item = {}){
  return  <Link to={`/hcmconsole/policies/local/${encodeURIComponent(item.metadata.namespace)}/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
}

export function getStatus(item= {},locale) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.status&&expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    if (item.status.toLowerCase() === 'compliant') {
      return (
        <div className='table-status-row'>
          <div className='compliance-table-status table-status-icon'>
            <Icon className={'table-status__compliant'} name={'icon--checkmark--glyph'} description='' />
          </div>
          <p>{msgs.get('policy.status.compliant', locale)}</p>
        </div>
      )
    } else {
      return (
        <div className='table-status-row'>
          <div className='compliance-table-status  table-status-icon'>
            <Icon className={'table-status__not_compliant'} name={'icon--error--glyph'} description='' />
          </div>
          <p>
            {msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)}
          </p>
        </div>
      )
    }
    // return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
  }
  return '-'
}

export function getExcludeNamespace(item) {
  const namespace = lodash.get(item, 'detail.exclude_namespace')
  if (namespace) {
    return namespace.join(', ')
  }
  return '-'
}

export function getIncludeNamespace(item) {
  const namespace = lodash.get(item, 'detail.include_namespace')
  if (namespace) {
    return namespace.join(', ')
  }
  return '-'
}

export function getEnforcement(item, locale) {
  const expectedEnforcements = [ 'enforce', 'inform']
  if (item.enforcement&&expectedEnforcements.indexOf(item.enforcement.toLowerCase()) > -1){
    return msgs.get(`policy.enforcement.${item.enforcement.toLowerCase()}`, locale)
  }
  return '-'
}

export function getAPIGroups(item) {
  const apiGroups = lodash.get(item, 'apiGroups')
  if (apiGroups) {
    return apiGroups.join(', ')
  }
  return '-'
}

export function getRuleVerbs(item) {
  const verbs = lodash.get(item, 'verbs')
  if (verbs) {
    return verbs.join(', ')
  }
  return '-'
}

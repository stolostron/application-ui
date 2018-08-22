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

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  policyRules: {
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'ruleUID',
      },
      {
        msgKey: 'table.header.templateType',
        resourceKey: 'templateType',
      },
      {
        msgKey: 'table.header.complianceType',
        resourceKey: 'complianceType',
      },
      {
        msgKey: 'table.header.apiGroups',
        resourceKey: 'apiGroups',
        transformFunction: getAPIGroups
      },
      {
        msgKey: 'table.header.ruleVerbs',
        resourceKey: 'verbs',
        transformFunction: getRuleVerbs
      },
      {
        msgKey: 'table.header.resources',
        resourceKey: 'resources',
      },
    ],
  },
  policyViolations: {
    tableKeys: [
      {
        msgKey: 'table.header.status',
        resourceKey: 'status',
        transformFunction: getStatus,
      },
      {
        msgKey: 'table.header.cluster',
        resourceKey: 'cluster',
      },
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
      },
      {
        msgKey: 'table.header.message',
        resourceKey: 'message',
      },
      {
        msgKey: 'table.header.reason',
        resourceKey: 'reason',
      },
      {
        msgKey: 'table.header.selector',
        resourceKey: 'selector',
        transformFunction: getSelector
      },
    ],
  },
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createPolicyLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
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
            resourceKey: 'exclude_namespace',
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
            resourceKey: 'include_namespace',
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
            resourceKey: 'detail.creationTime',
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
            resourceKey: 'detail.annotations',
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
            resourceKey: 'detail.resourceVersion'
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
            resourceKey: 'detail.selfLink'
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
            resourceKey: 'detail.uid'
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
  return  <Link to={`/hcmconsole/policies/local/${encodeURIComponent(item.namespace)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
}

export function getStatus(item) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.status&&expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    if (item.status === 'compliant') {
      return (
        <div className='compliance-table-status'>
          <Icon className={'table-status__compliant'} name={'icon--checkmark--glyph'} />
        </div>
      )
    } else {
      return (
        <div className='compliance-table-status'>
          <Icon className={'table-status__not_compliant'} name={'icon--error--glyph'} />
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

export function getSelector(item) {
  const selectors = lodash.get(item, 'selector', [])
  let result = ''
  if (selectors) {
    Object.entries(selectors).forEach(([key, value]) => {
      result = `${result} \n ${key}: ${JSON.stringify(value)}`
    })
    return result
  }
  return '-'
}

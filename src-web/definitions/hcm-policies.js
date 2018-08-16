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
import { Link } from 'react-router-dom'
import {getAge, getLabelsToString} from '../../lib/client/resource-helper'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
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
  return <Link to={`/hcmconsole/policies/${encodeURIComponent(item.name)}/${encodeURIComponent(item.namespace)}`}>{item.name}</Link>
}

export function getStatus(item, locale) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.status&&expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
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

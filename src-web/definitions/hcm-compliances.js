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
import msgs from '../../nls/platform.properties'
import { getAge } from '../../lib/client/resource-helper'
import { Icon } from 'carbon-components-react'
import { getAPIGroups, getRuleVerbs, getSelector } from './hcm-policies'
import { Link } from 'react-router-dom'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  compliancePolicies: {
    resourceKey: 'complianceStatus',
    title: 'table.header.compliancePolicies',
    defaultSortField: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.compliant',
        resourceKey: 'compliant',
        key: 'compliant',
        transformFunction: getStatusIcon,
      },
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
        link: createCompliancePolicyLink,
      },
      {
        msgKey: 'table.header.cluster',
        resourceKey: 'cluster',
        key: 'cluster',
      },
      {
        msgKey: 'table.header.valid',
        resourceKey: 'valid',
        key: 'valid',
      },
    ],
  },
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      link: createPolicyLink,
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.policy.compliant',
      resourceKey: 'policyCompliant',
    },
    {
      msgKey: 'table.header.cluster.compliant',
      resourceKey: 'clusterCompliant',
    },
  ],
  tableActions: [
    'table.actions.compliance.remove',
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
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'clusterCompliant'
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
        transformFunction: getStatusIconForPolicy,
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
  policyDetailKeys: {
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
            resourceKey: 'description.title.enforcement',
            type: 'i18n'
          },
          {
            resourceKey: 'enforcement'
          }
        ]
      },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.created',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'detail.creationTime',
      //       transformFunction: getAge
      //     }
      //   ]
      // },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.annotations',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'detail.annotations',
      //       transformFunction: getLabelsToList
      //     }
      //   ]
      // },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.resource.version',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'detail.resourceVersion'
      //     }
      //   ]
      // },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.self.link',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'detail.selfLink'
      //     }
      //   ]
      // },
      // {
      //   cells: [
      //     {
      //       resourceKey: 'description.title.uid',
      //       type: 'i18n'
      //     },
      //     {
      //       resourceKey: 'detail.uid'
      //     }
      //   ]
      // },
    ]
  },
}

export function createPolicyLink(item = {}){
  return <Link to={`/hcmconsole/policies/${encodeURIComponent(item.namespace)}/${encodeURIComponent(item.name)}`}>{item.name}</Link>
}

export function getStatus(item, locale) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.status&&expectedStatuses.indexOf(item.status.toLowerCase()) > -1){
    return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
  }
  return '-'
}

export function getStatusIconForPolicy(item) {
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

export function getStatusIcon(item) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.compliant&&expectedStatuses.indexOf(item.compliant.toLowerCase()) > -1){
    if (item.compliant === 'compliant') {
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

export function createCompliancePolicyLink(item = {}){
  return  <Link to={`/hcmconsole/policies/${encodeURIComponent(item.complianceNamespace)}/${encodeURIComponent(item.complianceName)}
  /compliancePolicy/${encodeURIComponent(item.name)}/${item.cluster}`}>{item.name}</Link>
}

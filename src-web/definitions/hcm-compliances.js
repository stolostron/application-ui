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
import { getAge, getLabelsToList } from '../../lib/client/resource-helper'
import { Icon } from 'carbon-components-react'
import { getAPIGroups, getRuleVerbs } from './hcm-policies'
import { Link } from 'react-router-dom'
import StatusField from '../components/common/StatusField'
import config from '../../lib/shared/config'

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'metadata.namespace',
  compliancePolicies: {
    resourceKey: 'compliancePolicies',
    title: 'table.header.compliance.policies',
    defaultSortField: 'name',
    normalizedKey: 'name',
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
        transformFunction: createCompliancePolicyLink,
      },
      {
        msgKey: 'table.header.cluster.namespace',
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
  complianceStatus: {
    resourceKey: 'complianceStatus',
    title: 'table.header.compliance.compliant',
    defaultSortField: 'clusterNamespace',
    normalizedKey: 'clusterNamespace',
    tableKeys: [
      {
        msgKey: 'table.header.cluster.namespace',
        resourceKey: 'clusterNamespace',
        key: 'clusterNamespace',
      },
      {
        msgKey: 'table.header.compliance.policy.status',
        resourceKey: 'localCompliantStatus',
        key: 'localCompliantStatus',
      },
      {
        msgKey: 'table.header.compliance.policy.valid',
        resourceKey: 'localValidStatus',
        key: 'localValidStatus',
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
    title: 'compliance.details',
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
            resourceKey: 'description.title.cluster.compliant',
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
            resourceKey: 'metadata.creationTimestamp',
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
  policyRules: {
    title: 'table.header.rules',
    resourceKey: 'rules',
    defaultSortField: 'ruleUID',
    normalizedKey: 'ruleUID',
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
  roleRef: {
    title: 'policy.template.roleRef',
    headerRows: ['table.header.name', 'table.header.kind', 'table.header.apiGroups'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'name',
          },
          {
            resourceKey: 'kind',
          },
          {
            resourceKey: 'apiGroup',
          }
        ]
      }
    ]
  },
  roleSubjects: {
    resourceKey: 'roleSubjects',
    title: 'policy.template.roleSubjects',
    defaultSortField: 'name',
    tableKeys: [
      {
        msgKey: 'table.header.name',
        resourceKey: 'name',
        key: 'name',
      },
      {
        msgKey: 'table.header.apiGroups',
        resourceKey: 'apiGroup',
        key: 'apiGroup',
      },
      {
        msgKey: 'table.header.kind',
        resourceKey: 'kind',
        key: 'kind',
      },
    ],
  },
}

export function createPolicyLink(item = {}, ...param){
  if (param[2]) return item.metadata.name
  return <Link to={`${config.contextPath}/policies/${encodeURIComponent(item.metadata.namespace)}/${encodeURIComponent(item.metadata.name)}`}>{item.metadata.name}</Link>
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
          <Icon className={'table-status__compliant'} name={'icon--checkmark--glyph'} description='' />
        </div>
      )
    } else {
      return (
        <div className='compliance-table-status'>
          <Icon className={'table-status__not_compliant'} name={'icon--error--glyph'} description='' />
        </div>
      )
    }
    // return msgs.get(`policy.status.${item.status.toLowerCase()}`, locale)
  }
  return '-'
}

export function getStatusIcon(item, locale) {
  const expectedStatuses = [ 'compliant', 'notcompliant', 'noncompliant', 'invalid']
  if (item.compliant&&expectedStatuses.indexOf(item.compliant.toLowerCase()) > -1){
    if (item.compliant.toLowerCase() === 'compliant') {
      return <StatusField status='ok' text={msgs.get('policy.status.compliant', locale)} />
    } else {
      return <StatusField status='critical' text={msgs.get('policy.status.noncompliant', locale)} />
    }
  }
  return '-'
}

export function createCompliancePolicyLink(item = {}, ...param){
  if (param[2]) return item.metadata.name
  return <Link to={`${config.contextPath}/policies/${encodeURIComponent(item.complianceNamespace)}/${encodeURIComponent(item.complianceName)}/compliancePolicy/${encodeURIComponent(item.metadata.name)}/${item.cluster}`}>{item.metadata.name}</Link>
}

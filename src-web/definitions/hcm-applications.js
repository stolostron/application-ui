/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import React from 'react'
import { TooltipIcon } from 'carbon-components-react'
import { getAge, getLabelsToList } from '../../lib/client/resource-helper'
import { getNumClustersForApp } from '../components/common/ResourceOverview/utils'
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
      transformFunction: getNumClustersForApp
    },
    {
      msgKey: 'table.header.subscriptions',
      resourceKey: 'subscriptions',
      transformFunction: getNumRemoteSubs
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getAge
    }
  ],
  tableActions: [
    'table.actions.applications.edit',
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
      {
        cells: [
          {
            resourceKey: 'description.title.labels',
            type: 'i18n'
          },
          {
            resourceKey: 'label'
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
  }
}

export function createApplicationLink(item = {}, ...param) {
  const { name, namespace = 'default' } = item
  if (param[2]) return item.name
  const link = `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}`
  return <Link to={link}>{name}</Link>
}

export function getNumRemoteSubs(item = {}, locale) {
  let total = 0
  let failed = 0
  let unknown = 0
  let subscribed = 0

  if (item) {
    failed = R.path(['remoteSubscriptionStatusCount', 'Failed'], item) || 0
    unknown = R.path(['remoteSubscriptionStatusCount', 'null'], item) || 0
    subscribed =
      R.path(['remoteSubscriptionStatusCount', 'Subscribed'], item) || 0

    total = failed + unknown + subscribed
  }
  return (
    <ul>
      <LabelWithOptionalTooltip key="1" labelText={total} />
      {(failed != 0 || unknown != 0) && <span>{' | '}</span>}
      <LabelWithOptionalTooltip
        key="2"
        labelText={failed}
        iconName="failed-status"
        description={msgs.get('table.cell.failed', locale)}
      />
      <LabelWithOptionalTooltip
        key="3"
        labelText={unknown}
        iconName="no-status"
        description={msgs.get('table.cell.status.absent', locale)}
      />
    </ul>
  )
}

export const LabelWithOptionalTooltip = text => {
  if (text && text.labelText) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {text.iconName && (
          <TooltipIcon direction={'top'} tooltipText={text.description}>
            <img
              style={{ marginRight: '4px' }}
              width="10px"
              height="10px"
              src={`${config.contextPath}/graphics/${text.iconName}.svg`}
              alt={''}
            />
          </TooltipIcon>
        )}
        <p style={{ fontSize: '14px', paddingRight: '8px' }}>
          {text.labelText}
        </p>
      </div>
    )
  } else if (text && !text.iconName) {
    return <p style={{ fontSize: '14px' }}>{text.labelText}</p>
  }
  return <span />
}

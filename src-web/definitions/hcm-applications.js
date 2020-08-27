/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import React from 'react'
import { TooltipIcon } from 'carbon-components-react'
import {
  getCreationDate,
  getClusterCountString
} from '../../lib/client/resource-helper'
import { getSearchLink } from '../components/common/ResourceOverview/utils'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'
import { validator } from './validators/hcm-application-validator'
import { Label } from '@patternfly/react-core'
import msgs from '../../nls/platform.properties'

export default {
  defaultSortField: 'name',
  uriKey: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      transformFunction: createApplicationLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    },
    {
      msgKey: 'table.header.clusters',
      resourceKey: 'clusters',
      transformFunction: createClustersLink
    },
    {
      msgKey: 'table.header.resource',
      resourceKey: 'channels',
      transformFunction: getChannels
    },
    {
      msgKey: 'table.header.timeWindow',
      resourceKey: 'hubSubscriptions',
      transformFunction: getTimeWindow
    },
    {
      msgKey: 'table.header.created',
      resourceKey: 'created',
      transformFunction: getCreated
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
            transformFunction: getCreated
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
            resourceKey: 'labels'
          }
        ]
      }
    ]
  }
}

export function createApplicationLink(item = {}, ...param) {
  const { name, namespace = 'default' } = item
  if (param[2]) {
    return item.name
  }
  const link = `${config.contextPath}/${encodeURIComponent(
    namespace
  )}/${encodeURIComponent(name)}`
  return <Link to={link}>{name}</Link>
}

export function createClustersLink(item = {}, locale) {
  const clusterCount = R.path(['clusterCount'], item) || 0
  const localPlacement = (R.path(['hubSubscriptions'], item) || []).some(
    sub => sub.localPlacement
  )
  const clusterCountString = getClusterCountString(
    locale,
    clusterCount,
    localPlacement
  )

  if (clusterCount) {
    const searchLink = getSearchLink({
      properties: {
        name: item.name,
        namespace: item.namespace,
        kind: 'application',
        apigroup: 'app.k8s.io'
      },
      showRelated: 'cluster'
    })
    return <Link to={searchLink}>{clusterCountString}</Link>
  } else {
    return clusterCountString
  }
}

export function getChannels(item = {}, locale) {
  const groupByChannelType = R.groupBy(ch => {
    const channelType = (R.path(['ch.type'], ch) || '').toLowerCase()
    return channelType === 'github' ? 'git' : channelType
  })
  const channelMap = groupByChannelType(R.path(['hubChannels'], item) || [])

  return (
    <React.Fragment>
      {['git', 'helmrepo', 'namespace', 'objectbucket'].map(chType => {
        if (channelMap[chType]) {
          return (
            <Label
              key={`${item.name}-${item.namespace}-${chType}`}
              onClick={event => {
                event.preventDefault()
                event.nativeEvent.preventDefault()
                event.stopPropagation()
              }}
              color="grey"
              href="#"
              className="table-label"
            >
              {msgs.get(`channel.type.${chType}`, locale)}
            </Label>
          )
        }
      })}
    </React.Fragment>
  )
}

export function getTimeWindow(item = {}, locale) {
  return (R.path(['hubSubscriptions'], item) || []).some(sub => sub.timeWindow)
    ? msgs.get('table.cell.yes', locale)
    : ''
}

export function getCreated(item = {}) {
  const timestamp = R.path(['created'], item) || ''
  return timestamp ? getCreationDate(timestamp) : '-'
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
      <li>
        <LabelWithOptionalTooltip key="1" labelText={total} />
        {(failed !== 0 || unknown !== 0) && <span>{' | '}</span>}
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
      </li>
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

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
import {
  getCreationDate,
  getClusterCountString
} from '../../lib/client/resource-helper'
import { getSearchLink } from '../components/common/ResourceOverview/utils'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'
import { validator } from './validators/hcm-application-validator'
import msgs from '../../nls/platform.properties'
import ChannelLabels from '../components/common/ChannelLabels'

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
    {
      key: 'table.actions.applications.view',
      link: {
        replace: true,
        url: item =>
          `/multicloud/applications/${encodeURIComponent(
            item.namespace
          )}/${encodeURIComponent(item.name)}`
      }
    },
    {
      key: 'table.actions.applications.edit',
      link: {
        replace: true,
        url: item =>
          `/multicloud/applications/${encodeURIComponent(
            item.namespace
          )}/${encodeURIComponent(item.name)}/yaml`
      }
    },
    {
      key: 'table.actions.applications.search',
      link: {
        replace: false, // Search is in a different SPA, so add history
        url: item =>
          getSearchLink({
            properties: {
              name: item.name,
              namespace: item.namespace,
              kind: 'application',
              apigroup: 'app.k8s.io'
            }
          })
      }
    },
    {
      key: 'table.actions.applications.remove',
      modal: true
    }
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

export function createClustersLink(item = {}, locale = '') {
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
    return <a href={searchLink}>{clusterCountString}</a>
  } else {
    return clusterCountString
  }
}

export function getChannels(item = {}, locale = '') {
  return (
    <ChannelLabels
      channels={(R.path(['hubChannels'], item) || []).map(ch => ({
        type: ch['ch.type'],
        pathname: ch['ch.pathname']
      }))}
      locale={locale}
    />
  )
}

export function getTimeWindow(item = {}, locale = '') {
  return (R.path(['hubSubscriptions'], item) || []).some(sub => sub.timeWindow)
    ? msgs.get('table.cell.yes', locale)
    : ''
}

export function getCreated(item = {}) {
  const timestamp = R.path(['created'], item) || ''
  return timestamp ? getCreationDate(timestamp) : '-'
}

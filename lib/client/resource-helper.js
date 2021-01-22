/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import moment from 'moment'
import R from 'ramda'
import 'moment/min/locales'
import _ from 'lodash'
import msgs from '../../nls/platform.properties'
import { Tag, CodeSnippet } from 'carbon-components-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import queryString from 'query-string'
import { RESOURCE_TYPES } from '../shared/constants'
/*
* UI helpers to help with data transformations
* */

export const transform = (resource, key, locale, isSearch) => {
  let value = _.get(resource, key.resourceKey)
  if (key.type === 'timestamp') {
    return moment.unix(value).format('MMM Do YYYY \\at h:mm A')
  } else if (key.type === 'i18n') {
    return msgs.get(key.resourceKey, locale)
  } else if (key.type === 'boolean') {
    value = new Boolean(value).toString()
    return msgs.get(value, locale)
  } else if (
    key.transformFunction &&
    typeof key.transformFunction === 'function'
  ) {
    return key.transformFunction(resource, locale, key.resourceKey, isSearch)
  } else if (key.type === 'tag') {
    var data = key.getData(resource)
    return data
      ? data.map((tagText, index) => (
        <Tag
            /* eslint-disable-next-line react/no-array-index-key */
          key={`tag-${index}`}
          style={{ display: 'inline-block' }}
          type={'beta'}
          title={tagText.title}
          >
          {tagText.value ? `${tagText.name}:${tagText.value}` : tagText.name}
        </Tag>
      ))
      : '-'
  } else if (key.resourceKey === 'labels' && Array.isArray(value)) {
    return value.length >= 1 ? value.join(', ') : '-'
  } else {
    return value || value === 0 ? value : '-'
  }
}

export function getLabelsToList(item, locale, labelsKey) {
  labelsKey = labelsKey || 'labels'
  const labels = _.get(item, labelsKey)
  if (!labels || Object.keys(labels).length === 0) {
    return '-'
  }

  const showValueAsString = (value, key) => {
    return (
      <li key={key + value} style={{ display: 'block' }}>
        <b>{`${key}`}</b>
        {` = ${value !== '' ? value : '""'}`}
      </li>
    )
  }

  const showValueAsSnippet = (value, key) => {
    return (
      <li key={key + value} style={{ display: 'block' }}>
        <b>{key}</b>
        {' ='}
        <CopyToClipboard text={value}>
          <CodeSnippet
            className="removeCopyButton" //Currently used to remove copy button of conde snippet in application detail page  - Adam
            type="multi"
            feedback={msgs.get('button.copyButton.feedback', locale)}
          >
            {value}
          </CodeSnippet>
        </CopyToClipboard>
      </li>
    )
  }

  return (
    <ul>
      {_.map(labels, (value, key) => {
        try {
          if (typeof value === 'string') {
            if (!value.trim().startsWith('{')) {
              // definately a string
              return showValueAsString(value, key)
            } else {
              value = JSON.parse(value)
            }
          }
          // maybe a snippet
          return showValueAsSnippet(JSON.stringify(value, null, 2), key)
        } catch (e) {
          // any errors, show as string
          return showValueAsString(value, key)
        }
      })}
    </ul>
  )
}

const getMoment = (timestamp, locale = '') => {
  const momentObj = moment(
    timestamp,
    timestamp.includes('T') ? 'YYYY-MM-DDTHH:mm:ssZ' : 'YYYY-MM-DD HH:mm:ss'
  )
  momentObj.locale(locale.toLowerCase())
  return momentObj
}

export const getAge = (item, locale, timestampKey) => {
  const key = timestampKey ? timestampKey : 'created'
  const createdTime = _.get(item, key)
  if (createdTime) {
    return getMoment(createdTime, locale).fromNow()
  }
  return '-'
}

export const getShortDateTime = (timestamp, locale, now = null) => {
  const timeFormat = 'h:mm a'
  const monthDayFormat = 'MMM D'
  const yearFormat = 'YYYY'
  if (!timestamp) {
    return '-'
  }
  if (!now) {
    now = moment()
  }
  const date = getMoment(timestamp, locale)
  if (date.isSame(now, 'day')) {
    return date.format(timeFormat)
  } else if (date.isSame(now, 'year')) {
    return date.format(`${monthDayFormat}, ${timeFormat}`)
  } else {
    return date.format(`${monthDayFormat} ${yearFormat}, ${timeFormat}`)
  }
}

export const getClusterCount = ({
  locale,
  remoteCount,
  localPlacement,
  name,
  namespace,
  kind,
  apigroup = 'apps.open-cluster-management.io'
}) => {
  const clusterCountString = getClusterCountString(
    locale,
    remoteCount,
    localPlacement
  )

  if (remoteCount) {
    const searchLink = getSearchLink({
      properties: {
        name: name,
        namespace: namespace,
        kind,
        apigroup
      },
      showRelated: 'cluster'
    })
    return (
      <a className="cluster-count-link" href={searchLink}>
        {clusterCountString}
      </a>
    )
  } else {
    return clusterCountString
  }
}

export const getClusterCountString = (locale, remoteCount, localPlacement) => {
  if (remoteCount) {
    return msgs.get(
      localPlacement
        ? 'cluster.count.remote_and_local'
        : 'cluster.count.remote',
      [remoteCount],
      locale
    )
  } else if (localPlacement) {
    return msgs.get('cluster.count.local', locale)
  } else {
    return msgs.get('cluster.count.none', locale)
  }
}

export const normalizeChannelType = chType => {
  const channelType = (chType && chType.toLowerCase()) || ''
  return channelType === 'github' ? 'git' : channelType
}

export const groupByChannelType = R.groupBy(ch =>
  normalizeChannelType(ch.type)
)

export const getChannelLabel = (chType, count, locale) => {
  const label = msgs.get(`channel.type.${chType}`, locale)
  const optionalCount = count > 1 ? ` (${count})` : ''
  return label + optionalCount
}

export const CHANNEL_TYPES = ['git', 'helmrepo', 'namespace', 'objectbucket']

export const getSearchLink = (params = {}) => {
  const { properties, showRelated } = params
  let textsearch = ''
  _.entries(properties).forEach(([key, value]) => {
    textsearch = `${textsearch}${textsearch ? ' ' : ''}${key}:${value}`
  })
  const queryParams = []
  if (textsearch) {
    queryParams.push(
      `filters={"textsearch":"${encodeURIComponent(textsearch)}"}`
    )
  }
  if (showRelated) {
    queryParams.push(`showrelated=${showRelated}`)
  }
  return `/search${queryParams.length ? '?' : ''}${queryParams.join('&')}`
}

export const getEditLink = item => {
  const editLink = getYamlEdit(item)
  return `/resources?cluster=local-cluster&${editLink}`
}

export const getYamlEdit = ({ name, namespace, __typename }) => {
  const resourceKind = _.find(RESOURCE_TYPES, { kind: __typename })
  const apiVersion = resourceKind ? resourceKind.apiVersion : 'v1'
  return decodeURIComponent(
    queryString.stringify({
      kind: __typename,
      name: name,
      namespace: namespace,
      apiversion: apiVersion
    })
  )
}

export const createEditLink = item => {
  return <a href={getEditLink(item)}>{item.name}</a>
}

export const getResourceType = (item, locale, key) => {
  return key ? _.get(item, key) : item.resourceType
}

export const getStoredObject = storageKey => {
  try {
    storageKey = `${storageKey} ${window.location.href}`
    const sessionObject = JSON.parse(sessionStorage.getItem(storageKey))
    if (
      sessionObject &&
      sessionObject.expiresAt &&
      sessionObject.expiresAt > Date.now()
    ) {
      return sessionObject.sessionData
    } else {
      sessionStorage.removeItem(storageKey)
    }
  } catch (error) {
    // no privileges
  }
  return null
}

export const saveStoredObject = (storageKey, object, expiring = 60) => {
  try {
    storageKey = `${storageKey} ${window.location.href}`
    const sessionObject = {
      expiresAt: Date.now() + expiring * 60 * 1000, // expire in 30 minutes
      sessionData: object
    }
    sessionStorage.setItem(storageKey, JSON.stringify(sessionObject))
  } catch (error) {
    // no privileges
  }
}

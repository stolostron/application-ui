/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import moment from 'moment'
import lodash from 'lodash'
import jsYaml from 'js-yaml'
import msgs from '../../nls/platform.properties'
import { Tag, CodeSnippet } from 'carbon-components-react'
import CopyToClipboard from 'react-copy-to-clipboard'

/*
* UI helpers to help with data transformations
* */

export const transform = (resource, key, locale, isSearch) => {
  let value = lodash.get(resource, key.resourceKey)
  if (key.type === 'timestamp') {
    return moment.unix(value).format('MMM Do YYYY \\at h:mm A')
  } else if (key.type === 'i18n') {
    return msgs.get(key.resourceKey, locale)
  } else if (key.type === 'boolean') {
    value = (new Boolean(value)).toString()
    return msgs.get(value, locale)
  } else if (key.transformFunction && typeof key.transformFunction === 'function') {
    return key.transformFunction(resource, locale, key.resourceKey, isSearch)
  } else if (key.type === 'tag') {
    var data = key.getData(resource)
    /* eslint-disable-next-line react/no-array-index-key */
    return data ? data.map((tagText, index) => <Tag key={`tag-${index}`} style={{display: 'inline-block'}} type={'beta'} title={tagText.title}>{tagText.value ? `${tagText.name}:${tagText.value}` : tagText.name}</Tag>) : '-'
  } else {
    return (value || value === 0) ? value : '-'
  }
}

export const getLabelsToString = (item, locale, labelsKey) => {
  labelsKey = labelsKey || 'labels'
  const labels = lodash.get(item, labelsKey)
  const labelKeys = labels && Object.keys(labels)
  if (labelKeys && labelKeys.length > 0) {
    let str = ''
    for (var key of labelKeys) {
      str += key + '=' + labels[key] + ','
    }
    return str.substring(0, str.length - 1)
  } else {
    return '-'
  }
}

export function getLabelsToList(item, locale, labelsKey) {
  labelsKey = labelsKey || 'labels'
  const labels = lodash.get(item, labelsKey)
  if (!labels || Object.keys(labels).length===0) {
    return '-'
  }

  const showValueAsString = (value, key) => {
    return (
      <li key={key + value} style={{display:'block'}}>
        <b>{`${key}`}</b>{` = ${value !== '' ? value : '""'}`}
      </li>
    )
  }

  const showValueAsSnippet = (value, key) => {
    return (
      <li key={key + value} style={{display:'block'}}>
        <b>{key}</b>{' ='}
        <CopyToClipboard text={value}>
          <CodeSnippet
            className='removeCopyButton' //Currently used to remove copy button of conde snippet in application detail page  - Adam
            type='multi'
            feedback={msgs.get('button.copyButton.feedback', locale)}>
            {value}
          </CodeSnippet>
        </CopyToClipboard>
      </li>
    )
  }

  return <ul>
    {lodash.map(labels, (value, key) => {
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
}

export const getTabs  = (tabs, getUrl) => {
  return tabs.map((tab, index) => {
    return {
      id: `${tab}-tab`,
      label: `tabs.${tab}`,
      url: getUrl(tab, index)
    }
  })
}


export const getAge = (item, locale, timestampKey) => {
  const key = timestampKey ? timestampKey : 'created'
  const createdTime = lodash.get(item, key)
  if (createdTime && createdTime.includes('T')) {
    return moment(createdTime, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
  } else if (createdTime) {
    return moment(createdTime, 'YYYY-MM-DD HH:mm:ss').fromNow()
  }
  return '-'
}

export const getNumDeployables = (data) => {
  if (data && data.deployables && data.deployables instanceof Array) {
    return data.deployables.length
  } else {
    return '-'
  }
}

export const getNumDeployments = (data) => {
  if (data && data.applicationWorks && data.applicationWorks instanceof Array) {
    return data.applicationWorks.length
  } else {
    return '-'
  }
}

export const getNumFailedDeployments = (data) => {
  if (data && data.applicationWorks && data.applicationWorks instanceof Array) {
    return data.applicationWorks.filter(obj => obj.status === 'Failed').length
  } else {
    return '-'
  }
}

export const saveLoad = (data) => {
  return jsYaml.safeLoadAll(data)
}

export const getResourceType = (item, locale, key) => {
  return key ? lodash.get(item, key) : item.resourceType
}


export const getClusterLink = (item) => {
  const { cluster: { consoleURL = '', metadata} } = item

  return consoleURL !== '' ?
    <a target='_blank' href={`${consoleURL}/console`}>{metadata.name}</a>
    : metadata.name
}

export function transformPVStatus(item, locale) {
  const translatedStatus = msgs.get(`table.cell.status.${item.status.toLowerCase()}`, locale)
  return translatedStatus ===  `table.cell.status.${item.status.toLowerCase()}`
    ? translatedStatus
    : item.status
}


export const getStoredObject = (storageKey) => {
  try {
    storageKey = `${storageKey} ${window.location.href}`
    const sessionObject = JSON.parse(sessionStorage.getItem(storageKey))
    if (sessionObject && sessionObject.expiresAt && sessionObject.expiresAt > Date.now()) {
      return sessionObject.sessionData
    } else {
      sessionStorage.removeItem(storageKey)
    }
  } catch (error) {
    // no privileges
  }
  return null
}

export const saveStoredObject = (storageKey, object, expiring=60) => {
  try {
    storageKey = `${storageKey} ${window.location.href}`
    const sessionObject = {
      expiresAt: Date.now() + expiring*60*1000, // expire in 30 minutes
      sessionData: object
    }
    sessionStorage.setItem(storageKey, JSON.stringify(sessionObject))
  } catch (error) {
    // no privileges
  }
}


export const getFreshOrStoredObject = (storageKey, object, expiring=60) => {
  try {
    let sessionObject
    storageKey = `${storageKey} ${window.location.href}`
    if (!object) {
      sessionObject = JSON.parse(sessionStorage.getItem(storageKey))
      if (sessionObject && sessionObject.expiresAt && sessionObject.expiresAt > Date.now()) {
        object = sessionObject.sessionData
      } else {
        sessionStorage.removeItem(storageKey)
      }
    } else {
      sessionObject = {
        expiresAt: Date.now() + expiring*60*1000, // expire in 30 minutes
        sessionData: object
      }
      sessionStorage.setItem(storageKey, JSON.stringify(sessionObject))
    }
  } catch (error) {
    // no privileges
  }
  return object
}


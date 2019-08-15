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
  } else {
    return value || value === 0 ? value : '-'
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
  )
}

export const getTabs = (tabs, getUrl) => {
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

export const getAgeForIncident = (item, locale, timestampKey) => {
  const key = timestampKey ? timestampKey : 'created'
  const createdTime = lodash.get(item, key)
  if (createdTime && createdTime.includes('T')) {
    return moment(createdTime, 'YYYY-MM-DDTHH:mm:ssZ').fromNow(true)
  } else if (createdTime) {
    return moment(createdTime, 'YYYY-MM-DD HH:mm:ss').fromNow(true)
  }
  return '-'
}
export const getTimeGMT = (item, locale, timestampKey) => {
  const key = timestampKey ? timestampKey : 'created'
  const createdTime = lodash.get(item, key)
  if (createdTime && createdTime.includes('T')) {
    return moment.parseZone(createdTime).format('MM/DD/YY HH:mm:ss')
  } else if (createdTime) {
    return moment.parseZone(createdTime).format('MM/DD/YY HH:mm:ss')
  }
  return '-'
}

export const getNumItems = data => {
  if (data && data.items && data.items instanceof Array) {
    return data.items.length
  } else {
    return '-'
  }
}

export const saveLoad = data => {
  return jsYaml.safeLoadAll(data)
}

export const getResourceType = (item, locale, key) => {
  return key ? lodash.get(item, key) : item.resourceType
}

export const getClusterLink = item => {
  const { cluster: { consoleURL = '', metadata } } = item

  return consoleURL !== '' ? (
    <a target="_blank" href={`${consoleURL}/console`}>
      {metadata.name}
    </a>
  ) : (
    metadata.name
  )
}

export function transformPVStatus(item, locale) {
  const translatedStatus = msgs.get(
    `table.cell.status.${item.status.toLowerCase()}`,
    locale
  )
  return translatedStatus === `table.cell.status.${item.status.toLowerCase()}`
    ? translatedStatus
    : item.status
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

export const getFreshOrStoredObject = (storageKey, object, expiring = 60) => {
  try {
    let sessionObject
    storageKey = `${storageKey} ${window.location.href}`
    if (!object) {
      sessionObject = JSON.parse(sessionStorage.getItem(storageKey))
      if (
        sessionObject &&
        sessionObject.expiresAt &&
        sessionObject.expiresAt > Date.now()
      ) {
        object = sessionObject.sessionData
      } else {
        sessionStorage.removeItem(storageKey)
      }
    } else {
      sessionObject = {
        expiresAt: Date.now() + expiring * 60 * 1000, // expire in 30 minutes
        sessionData: object
      }
      sessionStorage.setItem(storageKey, JSON.stringify(sessionObject))
    }
  } catch (error) {
    // no privileges
  }
  return object
}

// return the failed, completed, in progress resources related to these list of items
//the items can be HCMChannelList, HCMApplicationList
export const getDeploymentSummary = list => {
  if (list && list.items) {
    const deploymentDataList = list.items.map(item => {
      if (item && item.related) {
        var completed = 0
        var failed = 0
        var progress = 0
        var name = item.name || 'unknown'

        for (var i = 0; i < item.related.length; i++) {
          const kind = item.related[i].kind
          const correctKindAndItems =
            (kind === 'release' ||
              kind === 'deployment' ||
              kind === 'pod' ||
              kind === 'service' ||
              kind === 'replicaset') &&
            item.related[i].items

          if (kind && correctKindAndItems) {
            for (var j = 0; j < item.related[i].items.length; j++) {
              if (item.related[i].items[j].status) {
                const status = item.related[i].items[j].status.toLowerCase()
                if (status.includes('fail') || status.includes('error')) {
                  failed = failed + 1
                } else if (
                  status.includes('deployed') ||
                  status.includes('running')
                ) {
                  completed = completed + 1
                } else if (status.includes('progress')) {
                  progress = progress + 1
                } else {
                  //anything else is in progress
                  progress = progress + 1
                }
              } else {
                completed = completed + 1
              }
            }
          }
        }
        return {
          name: name,
          cm: completed,
          pr: progress,
          fl: failed
        }
      }
    })

    const emptyArray = []
    return emptyArray.concat.apply([], deploymentDataList)
  }
  return []
}

// return the cummulated data
export const getDeploymentCummulatedSummary = summaryList => {
  var completed = 0
  var failed = 0
  var progress = 0

  if (summaryList) {
    summaryList.forEach(item => {
      if (item && item.cm) completed = completed + item.cm
      if (item && item.pr) progress = progress + item.pr
      if (item && item.fl) failed = failed + item.fl
    })
  }

  return {
    cm: completed,
    pr: progress,
    fl: failed
  }
}

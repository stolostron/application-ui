/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import React from 'react'
import moment from 'moment'
import lodash from 'lodash'
import msgs from '../../nls/platform.properties'
import { Tag } from 'carbon-components-react'

/*
* UI helpers to help with data transformations
* */

export const transform = (resource, key, locale) => {
  let value = lodash.get(resource, key.resourceKey)
  if (key.type === 'timestamp') {
    return moment(value).format('MMM Do YYYY \\at h:mm A')
  } else if (key.type === 'i18n') {
    return msgs.get(key.resourceKey, locale)
  } else if (key.type === 'boolean') {
    value = (new Boolean(value)).toString()
    return msgs.get(value, locale)
  } else if (key.transformFunction && typeof key.transformFunction === 'function') {
    return key.transformFunction(resource, locale)
  } else if (key.type === 'tag') {
    var data = key.getData(resource)
    return data ? data.map((tagText, index) => <Tag key={`tag-${index}`} style={{display: 'inline-block'}} type={'beta'} title={tagText.title}>{tagText.value ? `${tagText.name}:${tagText.value}` : tagText.name}</Tag>) : '-'
  } else {
    return (value || value === 0) ? value : '-'
  }
}

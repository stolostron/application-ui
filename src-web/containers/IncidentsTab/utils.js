/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import moment from 'moment'
import 'moment/min/locales'

const getAge = (value, locale) => {
  if (value) {
    if (value.includes('T')) {
      const momentObj = moment(value, 'YYYY-MM-DDTHH:mm:ssZ')
      momentObj && momentObj.locale(locale.toLowerCase())
      return momentObj && momentObj.fromNow()
    } else {
      const momentObj = moment(value, 'YYYY-MM-DD HH:mm:ss')
      momentObj && momentObj.locale(locale.toLowerCase())
      return momentObj && momentObj.fromNow()
    }
  }
  return '-'
}

export const mapCell = (cell, locale) => {
  if (cell.id.endsWith(':id')) {
    const link = `/cemui/incidents/${encodeURIComponent(cell.value)}/details`
    return (
      <a target="_blank" rel="noopener noreferrer" href={link}>
        {cell.value}
      </a>
    )
  } else if (cell.id.endsWith(':createdTime')) {
    return getAge(cell.value, locale)
  } else if (cell.id.endsWith(':lastChanged')) {
    return getAge(cell.value, locale)
  }
  return cell.value
}

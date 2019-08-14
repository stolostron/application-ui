/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import moment from 'moment'

const getAge = value => {
  if (value) {
    if (value.includes('T')) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
    } else {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    }
  }
  return '-'
}

export const mapCell = cell => {
  if (cell.id.endsWith(':id')) {
    const link = `/cemui/incidents/${encodeURIComponent(cell.value)}/details`
    return (
      <a target="_blank" rel="noopener noreferrer" href={link}>
        {cell.value}
      </a>
    )
  } else if (cell.id.endsWith(':createdTime')) {
    return getAge(cell.value)
  } else if (cell.id.endsWith(':lastChanged')) {
    return getAge(cell.value)
  }
  return cell.value
}

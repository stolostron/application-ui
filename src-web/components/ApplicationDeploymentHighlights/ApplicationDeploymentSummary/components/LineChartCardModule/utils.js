/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../../../../nls/platform.properties'

export const getChartKeyColor = value => {
  switch (true) {
  case value === 'pr':
    return '#3dffef'
  case value === 'fl':
    return '#3dffef'
  case value === 'cm':
    return '#3dffef'
  default:
    return ''
  }
}

export const getChartKeyName = (value, locale) => {
  switch (true) {
  case value === 'pr':
    return msgs.get('channel.deploy.status.progress', locale)
  case value === 'fl':
    return msgs.get('channel.deploy.status.failed', locale)
  case value === 'cm':
    return msgs.get('channel.deploy.status.completed', locale)
  default:
    return ''
  }
}

export const getModuleData = data => {
  const chartCardItems = []
  data.map(({ name, cm, pr, fl }) => {
    return chartCardItems.push({
      name,
      cm,
      pr,
      fl
    })
  })
  return {
    chartCardItems
  }
}

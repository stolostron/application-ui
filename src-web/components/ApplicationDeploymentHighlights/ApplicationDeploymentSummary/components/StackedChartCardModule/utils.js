/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import msgs from '../../../../../../nls/platform.properties'

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
    const channel = R.find(R.propEq('name', name))(chartCardItems)
    if (channel) {
      //if channel already in the list, add new values
      channel.pr = channel.pr + pr
      channel.fl = channel.fl + fl
      channel.cm = channel.cm + cm
    } else {
      //new channel, add it to the list
      return chartCardItems.push({
        name,
        cm,
        pr,
        fl
      })
    }
  })
  return {
    chartCardItems
  }
}

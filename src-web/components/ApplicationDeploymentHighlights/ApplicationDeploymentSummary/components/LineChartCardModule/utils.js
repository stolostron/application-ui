/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../../../../nls/platform.properties'

export const getChartKeyColor = value => {
  if (value) return '#2de3bb'

  return '#2de3bb'
}

export const getChartKeyName = (value, locale) => {
  return msgs.get('channel.deploy.status.completed', locale)
}

export const getModuleData = data => {
  const chartCardItems = []
  var nb_items = 0

  data.map(({ name, counter }) => {
    //show only apps with at least one resource, and no more than 5
    if (nb_items < 5 && counter != 0) {
      nb_items = nb_items + 1
      return chartCardItems.push({
        name,
        counter
      })
    }
  })
  return {
    chartCardItems
  }
}

// return the max width of the app name shown in the chart
export const getMaxStringWidth = list => {
  let max = 0
  for (var i = 0; i < list.length; i++) {
    if (list[i].name && list[i].name.length > max) max = list[i].name.length
  }
  return max
}

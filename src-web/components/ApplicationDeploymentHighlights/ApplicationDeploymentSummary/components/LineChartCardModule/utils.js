/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../../../../nls/platform.properties'

export const getChartKeyName = (value, locale) => {
  return msgs.get('channel.deploy.status.completed', locale)
}

export const toPercent = (decimal, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`

export const getModuleData = data => {
  const chartCardItems = []
  var nb_items = 0
  data.map(({ name, completed, not_completed }) => {
    //show only apps with at least one resource, and no more than 5
    if (nb_items < 5 && completed != 0) {
      nb_items = nb_items + 1
      const total = completed + not_completed
      const percent_completed = total > 0 ? completed / total : 0
      const percent_not_completed = total > 0 ? not_completed / total : 0

      return chartCardItems.push({
        name,
        percent_completed,
        completed,
        percent_not_completed,
        total
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

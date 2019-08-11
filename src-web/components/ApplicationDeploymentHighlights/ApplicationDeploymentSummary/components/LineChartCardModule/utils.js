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
  if (value) return '#3dffef'

  return '#3dffef'
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

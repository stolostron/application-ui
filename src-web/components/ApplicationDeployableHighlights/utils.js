/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getResourcesStatusPerChannel } from '../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

// return the summary for the deployable
export const getDeployableSummary = item => {
  if (item && item.related instanceof Array && item.related.length > 0) {
    const status = getResourcesStatusPerChannel(item, false)
    const countsCardDataGeneralInfo = [
      {
        msgKey: 'dashboard.card.deployable.versions',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.completed',
        count: status[0] + status[4]
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        count: status[1],
        alert: true
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: status[2] + status[3]
      }
    ]
    return countsCardDataGeneralInfo
  }
  return [
    {
      msgKey: 'dashboard.card.deployable.versions',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.completed',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.failed',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.inProgress',
      count: '-'
    }
  ]
}

// return the incidents for the deployable
export const getDeployableIncidents = item => {
  const countsCardDataIncidents = [
    {
      msgKey: 'dashboard.card.deployable.incidents',
      count: 0,
      alert: true
    }
  ]
  if (item) return countsCardDataIncidents

  return countsCardDataIncidents
}

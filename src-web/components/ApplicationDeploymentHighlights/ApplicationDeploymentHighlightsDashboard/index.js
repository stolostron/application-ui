// /*******************************************************************************
//  * Licensed Materials - Property of IBM
//  * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
//  *
//  * Note to U.S. Government Users Restricted Rights:
//  * Use, duplication or disclosure restricted by GSA ADP Schedule
//  * Contract with IBM Corp.
//  *******************************************************************************/

import React from '../../../../node_modules/react'
import CountsCardModule from '../../CountsCardModule'
import { getNumItems } from '../../../../lib/client/resource-helper'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

const countsCardDataSummary = (
  HCMApplicationList,
  HCMChannelList,
  HCMClusterList
) => {
  const result = [
    {
      msgKey: 'dashboard.card.deployment.applications',
      count: getNumItems(HCMApplicationList)
    },
    {
      msgKey: 'dashboard.card.deployment.channels',
      count: getNumItems(HCMChannelList)
    },
    {
      msgKey: 'dashboard.card.deployment.placementRules',
      count: 0
    },
    {
      msgKey: 'dashboard.card.deployment.availabilityZones',
      count: 0
    },
    {
      msgKey: 'dashboard.card.deployment.clusters',
      count: getNumItems(HCMClusterList)
    }
  ]
  return result
}

const countsCardDataStatus = [
  {
    msgKey: 'dashboard.card.deployment.pending',
    count: 1
  },
  {
    msgKey: 'dashboard.card.deployment.inProgress',
    count: 2
  },
  {
    msgKey: 'dashboard.card.deployment.completed',
    count: 3
  }
]

const ApplicationDeploymentHighlightsDashboard = withLocale(
  ({ HCMApplicationList, HCMChannelList, HCMClusterList }) => {
    const countsCardData = countsCardDataSummary(
      HCMApplicationList,
      HCMChannelList,
      HCMClusterList
    )
    return (
      <React.Fragment>
        <div id="ApplicationDeploymentsDashboard">
          <div className="deployment-summary">
            <CountsCardModule
              data={countsCardData}
              title="dashboard.card.deployment.summary.title"
            />
          </div>
          <div className="deployment-status">
            <CountsCardModule
              data={countsCardDataStatus}
              title="dashboard.card.deployment.status.title"
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
)

export default withLocale(ApplicationDeploymentHighlightsDashboard)

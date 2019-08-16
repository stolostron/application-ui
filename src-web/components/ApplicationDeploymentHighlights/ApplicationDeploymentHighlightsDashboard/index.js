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
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import { getAllDeployablesStatus, getNumClusters } from './utils'
import { getNumItems } from '../../../../lib/client/resource-helper'

resources(() => {
  require('./style.scss')
})

const countsCardDataSummary = (
  HCMApplicationList,
  HCMChannelList,
  HCMSubscriptionList
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
      count: getNumClusters(HCMApplicationList, HCMSubscriptionList)
    }
  ]
  return result
}

const ApplicationDeploymentHighlightsDashboard = withLocale(
  ({ HCMApplicationList, HCMChannelList, HCMSubscriptionList }) => {
    const countsCardData = countsCardDataSummary(
      HCMApplicationList,
      HCMChannelList,
      HCMSubscriptionList
    )
    const summary = getAllDeployablesStatus(HCMApplicationList, false)
    const countsCardDataStatus = [
      {
        msgKey: 'dashboard.card.deployment.completed',
        count: summary[0]
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: summary[2]
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        count: summary[1],
        alert: true
      }
    ]
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

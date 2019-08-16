/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react'
import CountsCardModule from '../CountsCardModule'
import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'
import { getDeployableSummary, getDeployableIncidents } from './utils'

resources(() => {
  require('./style.scss')
})

const ApplicationDeployableHighlights = withLocale(
  ({ deployableDetails, locale }) => {
    const countsCardDataGeneralInfo = getDeployableSummary(deployableDetails)
    const countsCardDataIncidents = getDeployableIncidents(deployableDetails)
    return (
      <React.Fragment>
        <div id="ApplicationDeployableHighlights">
          <div className="deployable-highlights-header">
            {msgs.get('description.title.deployableHighlights', locale)}
          </div>

          <div className="deployable-highlights-container">
            <div className="deployable-highlights-title">
              {msgs.get('description.title.deployableSummary', locale)}
            </div>
            <div className="deployable-highlights-info">
              <CountsCardModule data={countsCardDataGeneralInfo} />
            </div>
            <div className="deployable-highlights-incidents">
              <CountsCardModule data={countsCardDataIncidents} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
)

export default withLocale(ApplicationDeployableHighlights)

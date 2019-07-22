/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react'
import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

const ApplicationDeployableSubscription = withLocale(({ locale }) => {
  return (
    <div id="ApplicationDeployableSubscription">
      <div className="deployable-subscription-header">
        {msgs.get('description.title.deployableSubscription', locale)}
      </div>
    </div>
  )
})

export default withLocale(ApplicationDeployableSubscription)

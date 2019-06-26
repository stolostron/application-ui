/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
// import { Tabs } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import './style.scss'

const ApplicationDeploymentPipeline = withLocale(({
  locale,
}) => {
  return (
    <div id="DeploymentPipeline" >
      {msgs.get('description.title.deploymentPipeline', locale)}
    </div>
  )
})
export default withLocale(ApplicationDeploymentPipeline)

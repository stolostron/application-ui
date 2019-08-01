/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import React from '../../../node_modules/react'
//import msgs from '../../../nls/platform.properties'
//import { Tile, Icon } from 'carbon-components-react'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

const ApplicationLogs = withLocale(() => {
  return <div id="Application Logs">ApplicationLogs Component</div>
})

export default withLocale(ApplicationLogs)

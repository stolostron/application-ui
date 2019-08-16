// /*******************************************************************************
//  * Licensed Materials - Property of IBM
//  * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
//  *
//  * Note to U.S. Government Users Restricted Rights:
//  * Use, duplication or disclosure restricted by GSA ADP Schedule
//  * Contract with IBM Corp.
//  *******************************************************************************/

import React from '../../../../../node_modules/react'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import { getStatusPercentages } from './utils'
import msgs from '../../../../../nls/platform.properties'

resources(() => {
  require('./style.scss')
})

const ProgressBar = withLocale(({ status, locale }) => {
  // format [pass, fail, inprogress, pending, unidentifed]
  const percentage = getStatusPercentages(status)
  const { pass, fail, inprogress, total } = percentage
  const noneFound = total === 0
  const style =
    (noneFound && 'linear-gradient(to right,  #cccccc 0%, #cccccc 100%)') ||
    `linear-gradient(to right,  #6ac4ff 0%,#6ac4ff ${pass}%, #53bd61 ${pass}%, #53bd61 ${inprogress}%, #ff0000 ${inprogress}%, #ff0000 ${fail}%, #cccccc ${fail}%, #cccccc 100%)`
  return (
    <div id="ProgressBar">
      <div
        className="progressContainer"
        style={{
          background: style
        }}
      />
      <div className="pass">
        {`${msgs.get('description.pass', locale)}: ${status[0]}`}
      </div>
      <div className="fail">
        {`${msgs.get('description.fail', locale)}: ${status[1]}`}
      </div>
      <div className="inprogress">
        {`${msgs.get('description.inprogress', locale)}: ${status[2]}`}
      </div>
      <div className="total">
        {`${msgs.get('description.total', locale)}: ${total}`}
      </div>
      <div className="percentageDeployed">
        {`${msgs.get('description.deployed', locale)}: ${Math.round(pass)}%`}
      </div>
    </div>
  )
})

export default withLocale(ProgressBar)

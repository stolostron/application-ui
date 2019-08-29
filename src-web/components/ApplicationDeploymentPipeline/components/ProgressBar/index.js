/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

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
  const { completed, fail, inprogress, total } = percentage
  const noneFound = total === 0
  const style =
    (noneFound && 'linear-gradient(to right,  #cccccc 0%, #cccccc 100%)') ||
    `linear-gradient(to right,  #007D79 0%,#007D79 ${completed}%, #92EEEE ${completed}%, #92EEEE ${completed +
      inprogress}%, #E0182D ${completed + inprogress}%, #E0182D ${completed +
      inprogress +
      fail}%, #cccccc ${completed + inprogress + fail}%, #cccccc 100%)`
  return (
    <div id="ProgressBar">
      <div className="percentagesContainers">
        <div className="pass">
          <div className="percentage">{`${Math.round(completed)}%`}</div>
          <div className="resourceType">
            <div className="completedSquare" />
            <div className="textResource">
              {msgs.get('description.pass', locale)}
            </div>
          </div>
        </div>
        <div className="inprogress">
          <div className="percentage">{`${Math.round(inprogress)}%`}</div>
          <div className="resourceType">
            <div className="inprogressSquare" />
            <div className="textResource">
              {msgs.get('description.inprogress', locale)}
            </div>
          </div>
        </div>
        <div className="fail">
          <div className="percentage">{`${Math.round(fail)}%`}</div>
          <div className="resourceType">
            <div className="failedSquare" />
            <div className="textResource">
              {msgs.get('description.fail', locale)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="progressContainer"
        style={{
          background: style
        }}
      />
    </div>
  )
})

export default withLocale(ProgressBar)

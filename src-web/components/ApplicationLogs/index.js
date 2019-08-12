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
import { Icon } from 'carbon-components-react'
import ScrollBox from '../modals/ScrollBox'
import { DropdownV2 } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

class ApplicationLogs extends React.Component {

  render() {
    const { locale } = this.context
    const podItems = ["pod1", "pod2", "pod3"]
    const containerItems = ["container1", "container2", "container3"]
    const logsContent = "Testing logs..."

    return (
      <React.Fragment>
        <div id="ApplicationLogs">
          <div className="dropdown-container">
            <div className="dropdown-pods-list">
              <DropdownV2
                ariaLabel={msgs.get("dropdown.pod.label", locale)}
                light
                label="Pods"
                // onChange={this.handleContainerChange.bind(this)}
                items={podItems} />
            </div>
            <span className="dropdown-divider">{msgs.get("tabs.logs.dropdown.divider")}</span>
            <div className="dropdown-containers-list">
              <DropdownV2
                ariaLabel={msgs.get("dropdown.pod.label", locale)}
                light
                label="Containers"
                // onChange={this.handleContainerChange.bind(this)}
                items={containerItems} />
            </div>
            <div className="view-external-container">
              <p className="viewExternalIconTitle">{msgs.get("tabs.logs.viewExternal")}</p>
              <Icon
                name="icon--launch"
                fill="#6089bf"
                description=""
                className="viewExternalIcon"
              />
            </div>
          </div>
          <ScrollBox className="logs-container__content" content={logsContent} />
        </div>
      </React.Fragment>
    )
  }
}

export default ApplicationLogs
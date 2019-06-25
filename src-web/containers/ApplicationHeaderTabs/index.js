/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import loadable from 'loadable-components'
import { Tabs, Tab } from 'carbon-components-react'
import './style.scss'

export const ApplicationsTab = loadable(() => import(/* webpackChunkName: "applications" */ '../ApplicationsTab'))

// This will render the three tabs
// Overview, Deployments, Incidents
const ApplicationHeaderTabs = () => {
  return (
    <div id="applicationheadertabs">
      <div className="whiteSpacer">
        <Tabs
          className="some-class"
          selected={0}
          onClick={()=>{}}
          onKeyDown={()=>{}}
          onSelectionChange={()=>{}}
          tabContentClassName="tab-content"
        >
          <Tab
            disabled={false}
            onClick={()=>{}}
            onKeyDown={()=>{}}
            label="Overview"
          >
            <div className="some-content" style={{paddingLeft: 16}}>
              <ApplicationsTab secondaryHeaderProps={{title: 'routes.applications'}} />
            </div>
          </Tab>
          <Tab
            disabled={false}
            onClick={()=>{}}
            onKeyDown={()=>{}}
            label="Deployments"
          >
            <div className="some-content" style={{paddingLeft: 16}}>
              Deployments
            </div>
          </Tab>
          <Tab
            disabled={false}
            onClick={()=>{}}
            onKeyDown={()=>{}}
            label="Incidents"
          >
            <div className="some-content" style={{paddingLeft: 16}}>
              Incidents
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default (ApplicationHeaderTabs)

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Icon, Link } from 'carbon-components-react'

import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import { editResourceClick } from '../ApplicationDeploymentPipeline/components/PipelineGrid/utils'
import { getICAMLinkForApp } from '../common/ResourceDetails/utils'

const HeaderActions = withLocale(
  ({
    serverProps,
    getApplicationResource,
    app,
    namespaceAccountId,
    locale
  }) => {
    const dashboard = (app && app.dashboard) || ''
    let icamLink = ''
    if (app && app._uid && namespaceAccountId) {
      icamLink = getICAMLinkForApp(
        app._uid,
        app.name,
        app.cluster,
        namespaceAccountId
      )
    }
    return (
      <div className="app-info-and-dashboard-links">
        {serverProps &&
          serverProps.isICAMRunning && (
            <span>
              <Link href={icamLink} target="_blank" rel="noopener noreferrer">
                <Icon
                  className="app-dashboard-icon"
                  name="icon--launch"
                  fill="#3D70B2"
                />
                {msgs.get('application.launch.icam', locale)}
              </Link>
              <span className="app-info-and-dashboard-links-separator" />
            </span>
        )}
        {serverProps &&
          serverProps.isGrafanaRunning && (
            <span>
              <Link
                href={dashboard}
                aria-disabled={!dashboard}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  className="app-dashboard-icon"
                  name="icon--launch"
                  fill="#3D70B2"
                />
                {msgs.get('application.launch.grafana', locale)}
              </Link>
              <span className="app-info-and-dashboard-links-separator" />
            </span>
        )}
        <Link
          href="#"
          id="headerAppLink"
          aria-disabled={!app}
          onClick={() => {
            //call edit app here
            editResourceClick(app, getApplicationResource)
          }}
        >
          <Icon
            className="app-dashboard-icon"
            name="icon--edit"
            fill="#3D70B2"
          />
          {msgs.get('application.edit.app', locale)}
        </Link>

        <p>Show the dropdown for the refresh here</p>
      </div>
    )
  }
)

export default withLocale(HeaderActions)

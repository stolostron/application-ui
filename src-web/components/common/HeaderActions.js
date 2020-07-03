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

const HeaderActions = withLocale(
  ({ serverProps, getApplicationResource, app, locale }) => {
    const dashboard = (app && app.dashboard) || ''

    return (
      <div className="app-info-and-dashboard-links">
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
        <span className="app-info-and-dashboard-links-separator" />&nbsp;
        <span className="app-info-and-dashboard-links-separator-f" />
      </div>
    )
  }
)

export default withLocale(HeaderActions)

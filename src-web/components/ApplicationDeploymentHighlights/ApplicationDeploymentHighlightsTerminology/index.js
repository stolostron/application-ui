/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Accordion, AccordionItem, Tile, Icon } from 'carbon-components-react'
import msgs from '../../../../nls/platform.properties'
import resources from '../../../../lib/shared/resources'
import PropTypes from 'prop-types'

resources(() => {
  require('./style.scss')
})

export default class ApplicationDeploymentHighlightsTerminology extends React.Component {
  render() {
    const { open } = this.props
    const { locale } = this.context

    return (
      <div id="ApplicationDeploymentHighlightsTerminology">
        <Accordion>
          <AccordionItem
            open={open}
            title={msgs.get(
              'description.title.deploymentHighlightsTerminology',
              locale
            )}
            iconDescription={msgs.get(
              'description.title.deploymentHighlightsTerminology.accordionDescription',
              locale
            )}
          >
            <Tile>
              <div className="terminology-item">
                <p className="deployment-highlights-terminology-header">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.subscriptions',
                    locale
                  )}
                </p>
                <p className="deployment-highlights-terminology-content">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.subscriptionsSummary',
                    locale
                  )}
                </p>
              </div>
              <div className="terminology-item">
                <p className="deployment-highlights-terminology-header">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.placementRules',
                    locale
                  )}
                </p>
                <p className="deployment-highlights-terminology-content">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.placementRulesSummary',
                    locale
                  )}
                </p>
              </div>
              <div className="terminology-item">
                <p className="deployment-highlights-terminology-header">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.channels',
                    locale
                  )}
                </p>
                <p className="deployment-highlights-terminology-content">
                  {msgs.get(
                    'description.title.deploymentHighlightsTerminology.channelsSummary',
                    locale
                  )}
                </p>
              </div>
              <div className="deployment-highlights-terminology-docs">
                <a
                  href="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="deployment-highlights-terminology-docs-text">
                    {msgs.get(
                      'description.title.deploymentHighlightsTerminology.docsLink',
                      locale
                    )}
                  </span>
                  <Icon
                    name="icon--launch"
                    fill="#6089bf"
                    description=""
                    className="deployment-highlights-terminology-docs-icon"
                  />
                </a>
              </div>
            </Tile>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
}

ApplicationDeploymentHighlightsTerminology.propTypes = {
  open: PropTypes.bool
}

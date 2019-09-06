/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Accordion, AccordionItem, Tile, Icon } from 'carbon-components-react'
import msgs from '../../../../nls/platform.properties'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

const ApplicationDeploymentHighlightsTerminology = withLocale(({ locale }) => {
  return (
    <div id="ApplicationDeploymentHighlightsTerminology">
      <Accordion>
        <AccordionItem
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
                  'description.title.deploymentHighlightsTerminology.deployables',
                  locale
                )}
              </p>
              <p className="deployment-highlights-terminology-content">
                {msgs.get(
                  'description.title.deploymentHighlightsTerminology.deployablesSummary',
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
              <a href="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/overview.html" target="_blank">
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
})
export default withLocale(ApplicationDeploymentHighlightsTerminology)

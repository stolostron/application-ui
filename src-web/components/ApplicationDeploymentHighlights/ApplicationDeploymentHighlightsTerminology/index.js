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
import { DOC_LINKS } from '../../../../lib/shared/constants'
import msgs from '../../../../nls/platform.properties'
import resources from '../../../../lib/shared/resources'
import PropTypes from 'prop-types'

resources(() => {
  require('./style.scss')
})

const terminologyItem = (headerMsg, contentMsg) => {
  return (
    <div className="terminology-item">
      <p className="deployment-highlights-terminology-header">{headerMsg}</p>
      <p className="deployment-highlights-terminology-content">{contentMsg}</p>
    </div>
  )
}

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
              {terminologyItem(
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.subscriptions'
                ),
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.subscriptionsSummary'
                )
              )}
              {terminologyItem(
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.placementRules'
                ),
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.placementRulesSummary'
                )
              )}
              {terminologyItem(
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.channels'
                ),
                msgs.get(
                  'description.title.deploymentHighlightsTerminology.channelsSummary'
                )
              )}
              <div className="deployment-highlights-terminology-docs">
                <a
                  href={DOC_LINKS.TERMINOLOGY}
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

/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import React from 'react'
import { AcmExpandableCard } from '@stolostron/ui-components'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import { DOC_LINKS } from '../../../../lib/shared/constants'
import msgs from '../../../../nls/platform.properties'
import resources from '../../../../lib/shared/resources'

resources(() => {
  require('./style.scss')
})

const terminologyItem = (headerMsg, contentMsg) => {
  return (
    <div className="terminology-item">
      <p className="deployment-highlights-terminology-title">{headerMsg}</p>
      <p className="deployment-highlights-terminology-content">{contentMsg}</p>
    </div>
  )
}

export default class ApplicationDeploymentHighlightsTerminology extends React.Component {
  render() {
    const { locale } = this.context

    return (
      <div id="ApplicationDeploymentHighlightsTerminology">
        <AcmExpandableCard
          title={msgs.get(
            'description.title.deploymentHighlightsTerminology',
            locale
          )}
        >
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
            <a href={DOC_LINKS.HOME} target="_blank" rel="noopener noreferrer">
              <span className="deployment-highlights-terminology-docs-text">
                {msgs.get(
                  'description.title.deploymentHighlightsTerminology.docsLink',
                  locale
                )}
              </span>
              <ExternalLinkAltIcon className="details-item-link-icon" />
            </a>
          </div>
        </AcmExpandableCard>
      </div>
    )
  }
}

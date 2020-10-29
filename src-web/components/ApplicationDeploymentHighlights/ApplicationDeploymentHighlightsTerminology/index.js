/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle
} from '@patternfly/react-core'
import { ArrowIcon } from '@patternfly/react-icons'
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
  constructor(props) {
    super(props)
    this.state = {
      showTerminology: localStorage.getItem('showTerminology')
        ? localStorage.getItem('showTerminology')
        : 'show'
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.showTerminology)
  }

  render() {
    const { locale } = this.context
    const { showTerminology } = this.state

    const onToggle = toggleStatus => {
      if (toggleStatus === 'show') {
        this.setState({ showTerminology: 'hide' })
        localStorage.setItem('showTerminology', 'hide')
      } else {
        this.setState({ showTerminology: 'show' })
        localStorage.setItem('showTerminology', 'show')
      }
    }

    return (
      <div id="ApplicationDeploymentHighlightsTerminology">
        <Accordion>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle(showTerminology)
              }}
              isExpanded={showTerminology === 'show'}
              id="terminology-header"
            >
              {msgs.get(
                'description.title.deploymentHighlightsTerminology',
                locale
              )}
            </AccordionToggle>
            <AccordionContent isHidden={showTerminology === 'hide'}>
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
                  href={DOC_LINKS.HOME}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="deployment-highlights-terminology-docs-text">
                    {msgs.get(
                      'description.title.deploymentHighlightsTerminology.docsLink',
                      locale
                    )}
                  </span>
                  <ArrowIcon className="details-item-link-icon" />
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
}

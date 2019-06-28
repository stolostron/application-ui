/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import { Accordion, AccordionItem, Tile } from 'carbon-components-react';
import msgs from '../../../../nls/platform.properties';
import { withLocale } from '../../../providers/LocaleProvider';

import './style.scss';

const ApplicationDeploymentHighlightsTerminology = withLocale(({ locale }) => {
  return (
    <div id="ApplicationDeploymentHighlightsTerminology">
      <Accordion>
        <AccordionItem
          title={msgs.get(
            'description.title.deploymentHighlightsTerminology',
            locale,
          )}
        >
          <Tile>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.channels',
                locale,
              )}
            </p>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.channelsSummary',
                locale,
              )}
            </p>
          </Tile>
          <Tile>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.channelGateConditions',
                locale,
              )}
            </p>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.channelGateConditionsSummary',
                locale,
              )}
            </p>
          </Tile>
          <Tile>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.deploymentConditions',
                locale,
              )}
            </p>
            <p>
              {msgs.get(
                'description.title.deploymentHighlightsTerminology.deploymentConditionsSummary',
                locale,
              )}
            </p>
          </Tile>
        </AccordionItem>
      </Accordion>
    </div>
  );
});
export default withLocale(ApplicationDeploymentHighlightsTerminology);

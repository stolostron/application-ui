/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Tooltip as CarbonTooltip } from 'carbon-components-react'
import PropTypes from 'prop-types'
import msgs from '../../../../nls/platform.properties'

class Tooltip extends React.PureComponent {
  static propTypes = {
    control: PropTypes.object.isRequired,
    locale: PropTypes.string
  };

  render() {
    const { control, locale } = this.props
    const { tooltip, learnMore } = control
    return tooltip ? (
      <CarbonTooltip
        showIcon={true}
        direction="top"
        tabIndex={0}
        triggerText=""
        triggerId=""
        icon={{
          viewBox: '0 0 16 16',
          width: '16',
          height: '16',
          svgData: {
            paths: [
              {
                d:
                  'M8,14.5 C11.5898509,14.5 14.5,11.5898509 14.5,8 C14.5,4.41014913 11.5898509,1.5 8,1.5 C4.41014913,1.5 1.5,4.41014913 1.5,8 C1.5,11.5898509 4.41014913,14.5 8,14.5 Z M8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 Z'
              }
            ],
            polygons: [{ points: '9 13 7 13 7 7 9 7' }],
            circles: [{ cx: '8', cy: '4', r: '1' }]
          }
        }}
      >
        <p id="tooltip-body">{tooltip}</p>
        {learnMore && (
          <div className="bx--tooltip__footer">
            <a
              className="bx--link"
              href={learnMore}
              target="_blank"
              rel="noreferrer"
            >
              {msgs.get('tooltip.link', locale)}
            </a>
          </div>
        )}
      </CarbonTooltip>
    ) : null
  }
}

export default Tooltip

// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import { PencilAltIcon } from '@patternfly/react-icons'
import PropTypes from 'prop-types'
import LabelWithPopover from './LabelWithPopover'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { withRouter } from 'react-router-dom'

resources(() => {
  require('../../../scss/time-window-labels.scss')
})

class TimeWindowLabels extends React.Component {
  render() {
    const { timeWindow, locale } = this.props
    const notSelectedLabel = msgs.get('timeWindow.label.noData', locale)

    return (
      <div className="label-with-popover-container timeWindow-labels">
        <LabelWithPopover
          key={timeWindow.subName + '-timeWindow'}
          labelContent={
            <div className="timeWindow-status-icon">{timeWindow.type}</div>
          }
          labelColor={timeWindow.type === 'active' ? 'green' : 'orange'}
        >
          <div className="timeWindow-labels-popover-content">
            {timeWindow.missingData ? (
              <div className="timeWindow-content">
                {msgs.get('timeWindow.label.missing.data', locale)}
              </div>
            ) : (
              <React.Fragment>
                <div className="timeWindow-title">
                  {msgs.get('timeWindow.label.days', locale)}
                </div>
                <div className="timeWindow-content">
                  {timeWindow.days
                    ? timeWindow.days.join(', ')
                    : notSelectedLabel}
                </div>

                <div className="timeWindow-title">
                  {msgs.get('timeWindow.label.timezone', locale)}
                </div>
                <div className="timeWindow-content">
                  {timeWindow.timezone ? timeWindow.timezone : notSelectedLabel}
                </div>

                <div className="timeWindow-title">
                  {msgs.get('timeWindow.label.ranges', locale)}
                </div>
                <div className="timeWindow-content">
                  {timeWindow.ranges
                    ? this.createTimeRanges(timeWindow.ranges)
                    : notSelectedLabel}
                </div>
              </React.Fragment>
            )}

            <div
              className="edit-time-window-link"
              tabIndex="0"
              role={'button'}
              onClick={this.toggleEditorTab.bind(this)}
              onKeyPress={this.toggleEditorTab.bind(this)}
            >
              {msgs.get(
                'dashboard.card.overview.cards.timeWindow.edit.label',
                locale
              )}
              <PencilAltIcon className="edit-time-window-btn-icon" />
            </div>
          </div>
        </LabelWithPopover>
      </div>
    )
  }

  createTimeRanges(ranges) {
    let timeRanges = ''

    ranges.forEach((range, i) => {
      const startTime = range.start.toLowerCase().replace(/^0/, '')
      const endTime = range.end.toLowerCase().replace(/^0/, '')
      const timeRange = startTime + ' - ' + endTime
      timeRanges = timeRanges.concat(
        timeRange + (i !== ranges.length - 1 ? ', ' : '')
      )
    })

    return timeRanges
  }

  toggleEditorTab() {
    const { location, history } = this.props
    const editPath =
      location.pathname +
      (location.pathname.slice(-1) === '/' ? 'edit' : '/edit')

    history.push(editPath)
  }
}

TimeWindowLabels.propTypes = {
  history: PropTypes.object,
  locale: PropTypes.string,
  location: PropTypes.object,
  timeWindow: PropTypes.object
}

export default withRouter(TimeWindowLabels)

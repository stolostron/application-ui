// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import { Icon } from 'carbon-components-react'
import PropTypes from 'prop-types'
import LabelWithPopover from './LabelWithPopover'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/time-window-labels.scss')
})

const createTimeRanges = ranges => {
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

const toggleEditorTab = () => {
  document.getElementById('advanced').click()
}

const TimeWindowLabels = ({ timeWindow, locale }) => {
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
          <div className="timeWindow-title">
            {msgs.get('timeWindow.label.days', locale)}
          </div>
          <div className="timeWindow-content">
            {timeWindow.days ? timeWindow.days.join(', ') : notSelectedLabel}
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
              ? createTimeRanges(timeWindow.ranges)
              : notSelectedLabel}
          </div>

          <div
            className="edit-time-window-link"
            tabIndex="0"
            role={'button'}
            onClick={toggleEditorTab.bind(this)}
            onKeyPress={toggleEditorTab.bind(this)}
          >
            {msgs.get(
              'dashboard.card.overview.cards.timeWindow.edit.label',
              locale
            )}
            <Icon
              name="icon--edit"
              fill="#0066cc"
              description=""
              className="edit-time-window-btn-icon"
            />
          </div>
        </div>
      </LabelWithPopover>
    </div>
  )
}

TimeWindowLabels.propTypes = {
  locale: PropTypes.string,
  timeWindow: PropTypes.object
}

export default TimeWindowLabels

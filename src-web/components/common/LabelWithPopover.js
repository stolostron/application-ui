// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Label, Popover } from '@patternfly/react-core'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/label-with-popover.scss')
})

const LabelWithPopover = ({ children, labelContent, labelIcon }) => (
  <div className="label-with-popover">
    <Popover
      bodyContent={children}
      className="label-with-popover"
      enableFlip
      position="bottom"
      flipBehavior={['bottom', 'top', 'right', 'left']}
      distance={10}
      zIndex={500}
    >
      <Label
        onClick={event => {
          event.preventDefault()
          event.nativeEvent.preventDefault()
          event.stopPropagation()
        }}
        color="grey"
        href="#"
        icon={labelIcon}
      >
        {labelContent}
      </Label>
    </Popover>
  </div>
)

LabelWithPopover.propTypes = {
  children: PropTypes.object,
  labelContent: PropTypes.object,
  labelIcon: PropTypes.object
}

export default LabelWithPopover

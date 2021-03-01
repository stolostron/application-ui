// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Divider,
  Label,
  Popover,
  Stack,
  StackItem
} from '@patternfly/react-core'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/label-with-popover.scss')
})

const LabelWithPopover = ({
  children,
  labelContent,
  labelIcon,
  labelColor
}) => (
  <div className="label-with-popover">
    <Popover
      bodyContent={
        <Stack>
          <StackItem className="close-button-spacer" />
          <StackItem>
            <Divider />
          </StackItem>
          <StackItem>{children}</StackItem>
        </Stack>
      }
      className="label-with-popover"
      enableFlip
      position="bottom"
      flipBehavior={['bottom', 'top', 'right', 'left']}
      distance={10}
      zIndex={999}
    >
      <Label
        onClick={event => {
          event.preventDefault()
          event.nativeEvent.preventDefault()
          event.stopPropagation()
        }}
        color={labelColor ? labelColor : 'grey'}
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
  labelColor: PropTypes.string,
  labelContent: PropTypes.object,
  labelIcon: PropTypes.object
}

export default LabelWithPopover

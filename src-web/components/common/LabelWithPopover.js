// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Label, Popover } from '@patternfly/react-core'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/label-with-popover.scss')
})

const LabelWithPopover = ({ children, labelContent, labelIcon }) => {
  const [
    { popoverOpen, popoverPinnedOpen, justClosed },
    setPopoverState
  ] = useState({
    popoverOpen: false,
    popoverPinnedOpen: false,
    justClosed: false
  })

  const closePopover = () => {
    setPopoverState(prevState => ({ ...prevState, popoverOpen: false }))
  }

  const openPopover = () => {
    setPopoverState(prevState => ({ ...prevState, popoverOpen: true }))
  }

  const shouldClose = () => {
    const pinned = popoverOpen && !popoverPinnedOpen
    setPopoverState({
      popoverOpen: pinned,
      popoverPinnedOpen: pinned,
      justClosed: true
    })
  }

  const pinPopover = () => {
    if (!justClosed) {
      setPopoverState({
        popoverOpen: true,
        popoverPinnedOpen: true,
        justClosed: false
      })
    } else {
      setPopoverState(prevState => ({ ...prevState, justClosed: false }))
    }
  }

  return (
    <div className="label-with-popover">
      <Popover
        bodyContent={children}
        isVisible={popoverOpen || popoverPinnedOpen}
        shouldClose={shouldClose}
        shouldOpen={pinPopover}
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
            pinPopover()
          }}
          onPointerEnter={openPopover}
          onPointerLeave={closePopover}
          color="grey"
          href="#"
          icon={labelIcon}
        >
          {labelContent}
        </Label>
      </Popover>
    </div>
  )
}

LabelWithPopover.propTypes = {
  children: PropTypes.object,
  labelContent: PropTypes.object,
  labelIcon: PropTypes.object
}

export default LabelWithPopover

// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Label, Popover } from '@patternfly/react-core'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/label-with-popover.scss')
})

const LabelWithPopover = ({
  children,
  labelContent,
  labelIcon,
  labelColor
}) => {
  const hoverDelay = 1500
  const [
    { popoverOpen, popoverPinnedOpen, justClosed, timeout },
    setPopoverState
  ] = useState({
    popoverOpen: false,
    popoverPinnedOpen: false,
    justClosed: false,
    timeout: null
  })

  const closePopover = () => {
    const newTimeout = setTimeout(
      () =>
        setPopoverState(prevState => ({
          ...prevState,
          popoverOpen: false,
          timeout: null
        })),
      hoverDelay
    )
    setPopoverState(prevState => ({ ...prevState, timeout: newTimeout }))
  }

  const openPopover = () => {
    setPopoverState(prevState => {
      if (timeout) {
        clearTimeout(timeout)
      }
      return { ...prevState, popoverOpen: true, timeout: null }
    })
  }

  const shouldClose = () => {
    const pinned = popoverOpen && !popoverPinnedOpen && !timeout
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
        onPointerEnter={openPopover}
        onPointerLeave={closePopover}
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
          color={labelColor ? labelColor : 'grey'}
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
  labelColor: PropTypes.string,
  labelContent: PropTypes.object,
  labelIcon: PropTypes.object
}

export default LabelWithPopover

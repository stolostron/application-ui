/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import { getSourcePath } from './utils'
import _ from 'lodash'

///////////////////////////////////////////////////////////////////////////////
//intialize controls and groups
///////////////////////////////////////////////////////////////////////////////
export const initializeControlFunctions = (
  controlData,
  parentControlData,
  forceUpdate
) => {
  controlData.forEach(control => {
    const { type, active = [] } = control
    switch (type) {
    case 'group': {
      active.forEach(cd => {
        initializeControlFunctions(cd, parentControlData, forceUpdate)
      })
      break
    }
    default:
      initialControl(control, parentControlData, forceUpdate)
    }
  })
}

///////////////////////////////////////////////////////////////////////////////
//initialze each control
///////////////////////////////////////////////////////////////////////////////
const initialControl = (control, controlData, forceUpdate) => {
  const { type, setActive, reverse } = control
  if (type !== 'title' && type !== 'section' && !setActive) {
    if (typeof control.onSelect === 'function') {
      control.onSelect = control.onSelect.bind(
        null,
        control,
        controlData,
        (ctrl, isLoading) => {
          if (isLoading) {
            ctrl.isLoading = isLoading
            forceUpdate()
          } else {
            setTimeout(() => {
              ctrl.isLoading = isLoading
              forceUpdate()
            })
          }
        }
      )
    }

    if (typeof control.isHidden === 'function') {
      control.isHidden = control.isHidden.bind(null, control, controlData)
    }

    if (typeof control.summarize === 'function') {
      control.summarize = control.summarize.bind(null, control, controlData)
    }

    control.setActive = value => {
      control.active = value
      if (typeof control.onSelect === 'function') {
        control.onSelect()
        forceUpdate()
      }
    }

    if (reverse) {
      const setActiveVal = (ctrl, path, templateObject) => {
        let active = _.get(templateObject, getSourcePath(path))
        switch (ctrl.type) {
        case 'checkbox':
          if (!active) {
            active = { $v: false }
          } else {
            active.$v = !!active.$v
          }
          break

        default:
          break
        }
        if (active) {
          ctrl.active = active.$v
          ctrl.sourcePath = active
        }
      }
      switch (true) { // match any case that is true
      case typeof reverse === 'string':
        control.reverse = (ctrl, templateObject) => {
          setActiveVal(ctrl, reverse, templateObject)
        }
        break

      case Array.isArray(reverse):
        control.reverse = (ctrl, templateObject) => {
          reverse.forEach(path => {
            setActiveVal(ctrl, path, templateObject)
          })
        }
        break
      }
    }
  }
}

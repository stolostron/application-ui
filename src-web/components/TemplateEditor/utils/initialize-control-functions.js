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


///////////////////////////////////////////////////////////////////////////////
// intialize controls and groups
///////////////////////////////////////////////////////////////////////////////
export const initializeControlFunctions = (
  controlData,
  forceUpdate,
  parentControlData
) => {
  controlData.forEach(control => {
    const { type, active=[] } = control
    switch (type) {
    case 'group': {
      active.forEach(cd=>{
        initializeControlFunctions(cd, forceUpdate, parentControlData)
      })
      break
    }
    default:
      initialControl(control, parentControlData||controlData, forceUpdate)
    }
  })
}

///////////////////////////////////////////////////////////////////////////////
// initialze each control
///////////////////////////////////////////////////////////////////////////////
const initialControl = (control, controlData, forceUpdate) => {
  const { type, setActive } = control
  if (type!=='title' && type!=='section' && !setActive) {
    if (typeof control.onSelect ==='function') {
      control.onSelect = control.onSelect.bind(null, control, controlData, (ctrl, isLoading)=>{
        if (isLoading) {
          ctrl.isLoading = isLoading
          forceUpdate()
        } else {
          setTimeout(() => {
            ctrl.isLoading = isLoading
            forceUpdate()
          })
        }
      })
    }

    if (typeof control.isHidden ==='function') {
      control.isHidden = control.isHidden.bind(null, control, controlData)
    }

    control.setActive = (value) =>{
      control.active = value
      if (typeof control.onSelect ==='function') {
        control.onSelect()
        forceUpdate()
      }
    }
  }
}

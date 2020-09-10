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

import { initializeControlData } from './initialize-control-data'
import { initializeControlFunctions } from './initialize-control-functions'
//import { initializeControlSourcePaths } from './initialize-control-source-paths'

export const initializeControls = (
  initialControlData,
  forceUpdate,
  locale,
  groupNum,
  inGroup
) => {

  const controlData = initializeControlData(
    initialControlData,
    locale,
    groupNum,
    inGroup
  )


  initializeControlFunctions(
    controlData,
    forceUpdate
  )


  //initializeControlSourcePaths(template,
  //  controlData);


  return controlData

}


//don't save user data until they create
export const cacheUserData = controlData => {
  controlData.forEach(control => {
    if (
      control.cacheUserValueKey &&
  control.userData &&
  control.userData.length > 0
    ) {
      const storageKey = `${control.cacheUserValueKey}--${
        window.location.href
      }`
      sessionStorage.setItem(storageKey, JSON.stringify(control.userData))
    }
  })
}


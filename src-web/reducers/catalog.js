/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from '../actions/index'
const initialStateCatalog = {
  catalogInstallValidationFailure: false,
  catalogInstallFailure: false,
  catalogInstallLoading: false,
}

const catalog = (state = initialStateCatalog, action) => {
  switch (action.type) {
  case Actions.CATALOG_INSTALL_LOADING: {
    const { status } = action.payload
    return { ...state, catalogInstallLoading: status }
  }
  case Actions.CATALOG_INSTALL_FAILURE: {
    const { status } = action.payload
    return { ...state, catalogInstallFailure: status }
  }
  case Actions.CATALOG_INSTALL_VALIDATION_FAILURE: {
    const { status } = action.payload
    return { ...state, catalogInstallValidationFailure: status }
  }
  default:
    return state
  }
}

export default catalog

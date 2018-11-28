/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from '../actions'
import { getFilterState, saveFilterState } from '../../lib/client/filter-helper'

const initialState = {
  diagramFilters: [],
}

export const diagram = (state=initialState, action) => {
  switch (action.type){
  default:
  case '@@INIT':{
    return initialState
  }
  case Actions.DIAGRAM_RESTORE_FILTERS: {
    const { namespace, name, initialDiagramFilters } = action
    const {filters: diagramFilters} = getFilterState(initialDiagramFilters, namespace, name)
    state.diagramFilters = diagramFilters
    return {...state}
  }
  case Actions.DIAGRAM_SAVE_FILTERS: {
    const { namespace, name, diagramFilters } = action
    saveFilterState(namespace, name, {filters:diagramFilters})
    state.diagramFilters = diagramFilters
    return {...state}
  }
  }
}

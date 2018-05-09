import * as Actions from '../actions'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

export const topology = (state = {}, action) => {

  if (action.resourceType && action.resourceType.name === RESOURCE_TYPES.HCM_TOPOLOGY.name){
    switch (action.type) {
    case Actions.RESOURCE_REQUEST: {
      return {... state, status: Actions.REQUEST_STATUS.IN_PROGRESS}
    }
    case Actions.RESOURCE_RECEIVE_SUCCESS: {
      return { ...state, status: Actions.REQUEST_STATUS.DONE, nodes: action.nodes, links: action.links }
    }
    case Actions.RESOURCE_RECEIVE_FAILURE: {
      return { ...state, status: Actions.REQUEST_STATUS.ERROR, nodes: action.nodes, links: action.links }
    }
    default: {
      console.warn('Uhnandled topology action', action) // eslint-disable-line no-console
      return {...state}
    }
    }
  } else {
    return {...state}
  }
}

/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

// @flow
//import type { ActionT } from '../../../lib/types/ReduxT'

// Create flux standard action.
//type ActionCreatorT = (payload: string, meta: string) => ActionT;
export const createAction = (type) => {
  return (payload, meta) => ({
    type,
    ...(payload !== undefined ? { payload } : {}),
    ...(meta !== undefined ? { meta } : {})
  })
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
import type { ActionT } from 'types';

// Create flux standard action.
type ActionCreatorT = (payload: string, meta: string) => ActionT;
export const createAction = (type: string): ActionCreatorT => {
  return (payload, meta) => ({
    type,
    ...(payload !== undefined ? { payload } : {}),
    ...(meta !== undefined ? { meta } : {}),
  });
};

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow

export type ActionT = {
  type: string,
  payload: any,
  meta?: any
};

export type ThunkT = (
  dispatch: (any) => void,
  getState: () => Object
) => void | ActionT;

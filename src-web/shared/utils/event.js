/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// returns an event handler which only gets called if user presses enter.
// this can be directly passed into onKeyPress props.
export const callOnEnter = (cb) => {
  if (typeof cb !== 'function') {
    throw Error('Callback not a function.')
  }
  return (event) => {
    if (event.key === 'Enter') {
      cb(event)
    }
  }
}

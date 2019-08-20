/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

export const getStatusPercentages = status => {
  // Get the total status count
  const total = status[0] + status[1] + status[2] + status[3]
  // Get the percentage of pass
  const pass = status[0] / total * 100
  // Get the percentage of inprogress
  const inprogress = status[2] / total * 100
  // Get the percentage of fail
  const fail = status[1] / total * 100
  // The remaining percentage is then pending
  return { pass: pass, inprogress: inprogress, fail: fail, total: total }
}

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// Incoming status looks like this
// status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed
export const getStatusPercentages = status => {
  // Get the total status count
  const total = status[0] + status[1] + status[2] + status[3] + status[4]
  // Get the percentage of pass
  const pass = status[0] / total * 100
  // Get the percentage of completed
  const completed = (status[0] + status[4]) / total * 100
  // Get the percentage of inprogress
  const inprogress = (status[2] + status[3]) / total * 100
  // Get the percentage of fail
  const fail = status[1] / total * 100
  if (total == 0) {
    return { pass: 0, completed: 0, inprogress: 0, fail: 0, total: 0 }
  } else {
    // The remaining percentage is then pending
    return {
      pass: pass,
      completed: completed,
      inprogress: inprogress,
      fail: fail,
      total: total
    }
  }
}

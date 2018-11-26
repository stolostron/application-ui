/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const formatNumber = (count) => {
  if (count > 999) {
    // show one decimal place
    const num = (count - (count % 100)) / 1000
    return num + 'k'
  }
  return count
}

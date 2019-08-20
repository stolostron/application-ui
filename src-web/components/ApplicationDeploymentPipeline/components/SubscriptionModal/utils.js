/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

//input [a,b,c,d] , output [a,b, 2+, 'c d']
//input [a,b,c,d, e] , output [a,b, 3+, 'c d e']
export const getLabelsListClass = list => {
  if (list.length > 2) {
    const placeholder = R.concat('+', list.length - 2)
    let result = R.insert(2, placeholder, list) //insert the placeholder label at position 3
    result = R.remove(3, list.length - 2, result) // remove everything after placeholder
    const lastElements = R.slice(2, list.length, list) //get all elements after first 2

    return {
      data: result,
      hover: R.join('', lastElements)
    }
  }
  return { data: list, hover: '' }
}

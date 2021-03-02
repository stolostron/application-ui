/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
import { LC } from './index'

// if term already exists in termsList, remove it. otherwise, add it.
// only works for value types, not arrays or objects.
export const addOrRemove = (termsList = [], term) => {
  return termsList.includes(term)
    ? termsList.filter(el => el !== term)
    : [...termsList, term]
}

// if not array, wrap
export const wrapWithArr = value => {
  if (value === null || value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

// check which items in one array match the items in another array, and return matches.
// only works if the elements are value types, not objects or arrays.
// case-insensitive
export const findCommonElements = (firstMatchArr, secondMatchArr) => {
  const firstMatchArrLC = LC(firstMatchArr)
  const findMatches = arr => LC(arr).filter(el => firstMatchArrLC.includes(el))
  // enable currying.
  return secondMatchArr ? findMatches(secondMatchArr) : arg => findMatches(arg)
}

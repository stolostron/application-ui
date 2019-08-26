/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getLabelsListClass, getCsvListClass, getSearchUrl } from './utils'

describe('getLabelsListClass', () => {
  const list1 = ['a', 'b', 'c', 'd']
  const list2 = ['a', 'b', 'c', 'd', 'e']
  const list3 = ['a', 'b']

  it('should return {data: [a,b, 2+] hover:c d}', () => {
    const result = {
      data: ['a', 'b', '+2'],
      hover: 'cd'
    }
    expect(getLabelsListClass(list1)).toEqual(result)
  })
  it('should return default data for reference', () => {
    const result = {
      data: ['a', 'b', '+3'],
      hover: 'cde'
    }
    expect(getLabelsListClass(list2)).toEqual(result)
  })
  it('should return default data for reference', () => {
    const result = {
      data: ['a', 'b'],
      hover: ''
    }
    expect(getLabelsListClass(list3)).toEqual(result)
  })
  it('should handle undefined object for reference', () => {
    expect(getLabelsListClass([])).toEqual({ data: [], hover: '' })
  })
})

describe('getCsvListClass', () => {
  const list1 = ['a', 'b', 'c', 'd']
  const list2 = ['a', 'b', 'c', 'd', 'e', 'f']
  const list3 = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

  it('should return {data: [a,b,c,d] hover: }', () => {
    const result = {
      data: ['a', 'b', 'c', 'd'],
      hover: ''
    }
    expect(getCsvListClass(list1)).toEqual(result)
  })
  it('should return {data: [a,b,c,d] hover: }', () => {
    const result = {
      data: ['a', 'b', 'c', 'd', 'e', 'f'],
      hover: ''
    }
    expect(getCsvListClass(list2)).toEqual(result)
  })
  it('should return {data: [a,b,c,d,e,f...] hover: g}', () => {
    const result = {
      data: ['a', 'b', 'c', 'd', 'e', 'f...'],
      hover: 'g'
    }
    expect(getCsvListClass(list3)).toEqual(result)
  })
  it('should handle undefined object for reference', () => {
    expect(getCsvListClass([])).toEqual({ data: [], hover: '' })
  })
})

describe('getSearchUrl', () => {
  it('url with the subscription for search', () => {
    expect(
      getSearchUrl('abc') ===
        '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3Aabc"}'
    )
  })
})

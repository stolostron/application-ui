/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getLabelsListClass, getCsvListClass, getSearchUrl } from './utils'

describe('getLabelsListClass', () => {
  const input1 = ['a', 'b', 'c', 'd']
  const input2 = ['a', 'b', 'c', 'd', 'e']

  const output1 = ['a', 'b', '2+', 'c d']
  const output2 = ['a', 'b', '3+', 'c d e']

  it('test case 1'),
  () => {
    expect(getLabelsListClass(input1)).toEqual(output1)
  }

  it('test case 2'),
  () => {
    expect(getLabelsListClass(input2)).toEqual(output2)
  }
})

describe('getCsvListClass', () => {
  const input1 = ['a', 'b', 'c']
  const input2 = ['a', 'b', 'c', 'd', 'e', 'f']
  const output1 = ['a', 'b', 'c']
  const output2 = ['a', 'b', 'c', 'd', 'e', '...']
  it('csv list length of 3'),
  () => {
    // should have no changes
    expect(getCsvListClass(input1)).toEqual(output1)
  }
  it('csv list length of 6'),
  () => {
    // returns first 5 and ...
    expect(getCsvListClass(input2)).toEqual(output2)
  }
})

describe('getSearchUrl', () => {
  it('pass value for search url'),
  () => {
    expect(getSearchUrl('abcdef')).toEqual(
      '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3A'
    )
  }
})

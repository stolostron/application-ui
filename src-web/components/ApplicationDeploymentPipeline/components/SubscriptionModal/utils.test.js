/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getLabelsListClass } from './utils'

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

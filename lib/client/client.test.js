/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { convertStringToQuery } from './search-helper'

//convertStringToQuery
describe('convertStringToQuery', () => {
  it('return query for an application', () => {
    const input = 'kind:application'
    const expectedOutput = {
      keywords: [],
      filters: { property: 'kind', values: ['application'] },
      relatedKinds: ['subscription', 'pod', 'cluster']
    }
    const output = convertStringToQuery(input)
    expect(output).toEqual(expectedOutput)
  })
  it('empty list', () => {
    const num = convertStringToQuery([])
    expect(num).toEqual(0) // empty string returned
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getPodsFromApplicationRelated } from './utils'

describe('getPodsFromApplicationRelated', () => {
  const hasPod = {
    items: [
      { related: [{ kind: 'pod' }] },
      { related: [{ kind: 'pod' }] },
      { related: [{ kind: 'cluster' }] }
    ]
  }
  const hasNoPod = { items: [] }

  // do some calls here
  it('should return a pod array of size 1', () => {
    const result = [{ kind: 'pod' }]
    expect(getPodsFromApplicationRelated(hasPod)).toEqual(result)
  })

  it('no pods returned', () => {
    expect(getPodsFromApplicationRelated(hasNoPod)).toEqual([])
  })
})

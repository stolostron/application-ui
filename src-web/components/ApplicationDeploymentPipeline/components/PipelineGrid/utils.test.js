/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import {
  createApplicationRows,
  createApplicationRowsLookUp,
  findMatchingSubscription
} from './utils'

describe('createApplicationRows', () => {
  const data = [
    {
      deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      metadata: { name: 'josh', namespace: 'namespace1' }
    }
  ]
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return a mapped object of application rows', () => {
    const result = [
      {
        deployables: [{ josh: 'hi' }, { dart: 'hi' }],
        id: '',
        name: '',
        namespace: ''
      }
    ]
    expect(createApplicationRows(data)).toEqual(result)
  })
  it('should return default data', () => {
    const result = [{ id: '', name: '', namespace: '', deployables: [] }]
    expect(createApplicationRows(applicationDud)).toEqual(result)
  })
  it('should handle undefined object', () => {
    expect(createApplicationRows(undefined)).toEqual({})
  })
})

describe('createApplicationRowsLookUp', () => {
  const data = [
    {
      deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      metadata: { name: 'josh', namespace: 'namespace1' }
    }
  ]
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return a mapped object of application rows for reference', () => {
    const result = {
      default: {
        deployables: [{ josh: 'hi' }, { dart: 'hi' }],
        id: '',
        name: '',
        namespace: ''
      }
    }
    expect(createApplicationRowsLookUp(data)).toEqual(result)
  })
  it('should return default data for reference', () => {
    const result = {
      default: { id: '', name: '', namespace: '', deployables: [] }
    }
    expect(createApplicationRowsLookUp(applicationDud)).toEqual(result)
  })
  it('should handle undefined object for reference', () => {
    expect(createApplicationRowsLookUp(undefined)).toEqual({})
  })
})

describe('findMatchingSubscription', () => {
  const data = [
    {
      channel: 'dev',
      raw: 'raw1'
    },
    {
      channel: 'dev2',
      raw: 'raw2'
    },
    {
      channel: 'dev3',
      raw: 'raw3'
    }
  ]
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return matching raw if found matching channel', () => {
    const result = 'raw3'
    expect(findMatchingSubscription(data, 'dev3')).toEqual(result)
  })
  it('should return matching raw if found matching channel', () => {
    const result = 'raw2'
    expect(findMatchingSubscription(data, 'dev2')).toEqual(result)
  })
  it('should return {} if not found matching channel', () => {
    expect(findMatchingSubscription(data, 'dev66')).toEqual({})
  })
  it('should return {} if incalid format passed in', () => {
    expect(findMatchingSubscription(applicationDud, 'dev66')).toEqual({})
  })
  it('should handle undefined object', () => {
    expect(findMatchingSubscription(undefined)).toEqual({})
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getApplicationsList, getDeployablesList } from './utils'

describe('getApplicationsList', () => {
  const applicationList = { items: [{ josh: 'hi' }, { dart: 'hi' }] }
  const applicationDud = { itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }
  it('should return application list of 2', () => {
    const result = [{ josh: 'hi' }, { dart: 'hi' }]
    expect(getApplicationsList(applicationList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getApplicationsList(applicationDud)).toEqual([])
  })
})

describe('getDeployablesList', () => {
  const applicationList = {
    items: [
      { deployables: [{ hi: 'hi' }, { hii: 'hii' }] },
      { deployables: [{ hiii: 'hiii' }] }
    ]
  }
  const applicationDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  }
  it('should return deployable list of 3', () => {
    const result = [{ hi: 'hi' }, { hii: 'hii' }, { hiii: 'hiii' }]
    expect(getDeployablesList(applicationList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getDeployablesList(applicationDud)).toEqual([])
  })
})

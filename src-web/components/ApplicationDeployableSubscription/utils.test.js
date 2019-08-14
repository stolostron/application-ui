/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getDeployableSubscription } from './utils'

describe('getDeployableSubscription', () => {
  const subscriptions = [
    {
      name: 's1',
      kind: 'subscription',
      related: [
        {
          kind: 'cluster',
          count: 3
        }
      ]
    }
  ]
  const empty_subscriptions = []
  it('should return first item in the list', () => {
    const result = {
      name: 's1',
      kind: 'subscription',
      related: [
        {
          kind: 'cluster',
          count: 3
        }
      ]
    }
    expect(getDeployableSubscription(subscriptions)).toEqual(result)
  })
  it('should return null', () => {
    expect(getDeployableSubscription(empty_subscriptions)).toEqual(null)
  })
})

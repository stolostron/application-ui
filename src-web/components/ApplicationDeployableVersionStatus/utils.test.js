/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getChannelStatusClass,
  getChannelClustersNb,
  getDeployableInfo,
  getSubscriptionForChannel
} from './utils'

describe('getChannelStatusClass', () => {
  const status1 = 'success'
  const status2 = 'failed'
  const status3 = 'inprogress'
  // these 3 cases are for null/empty/error cases which return generic statusTag
  const status4 = ''
  const status5 = null
  const status6 = 'hello'

  it('should return statusTagCompleted', () => {
    const result = 'statusTagCompleted'
    expect(getChannelStatusClass(status1)).toEqual(result)
  })
  it('should return statusTagFailed', () => {
    const result = 'statusTagFailed'
    expect(getChannelStatusClass(status2)).toEqual(result)
  })
  it('should return statusTagInProgress', () => {
    const result = 'statusTagInProgress'
    expect(getChannelStatusClass(status3)).toEqual(result)
  })
  it('should return statusTag', () => {
    const result = 'statusTag'
    expect(getChannelStatusClass(status4)).toEqual(result)
  })
  it('should return statusTag', () => {
    const result = 'statusTag'
    expect(getChannelStatusClass(status5)).toEqual(result)
  })
  it('should return statusTag', () => {
    const result = 'statusTag'
    expect(getChannelStatusClass(status6)).toEqual(result)
  })
})

describe('getChannelClustersNb', () => {
  const channel = {
    name: 'channel1',
    related: [
      {
        kind: 'cluster',
        count: 3,
        items: [
          { name: 'cluster1' },
          { name: 'cluster2' },
          { name: 'cluster3' }
        ]
      }
    ]
  }
  it('should return 3 clusters', () => {
    expect(getChannelClustersNb(channel)).toEqual(3)
  })
})

describe('getDeployableInfo', () => {
  const deployable = {
    items: [
      {
        name: 'deployable1',
        kind: 'deployable',
        related: [
          {
            kind: 'cluster',
            count: 3
          }
        ]
      }
    ]
  }
  it('should return first item in items', () => {
    const result = {
      name: 'deployable1',
      kind: 'deployable',
      related: [
        {
          kind: 'cluster',
          count: 3
        }
      ]
    }
    expect(getDeployableInfo(deployable)).toEqual(result)
  })
})

describe('getSubscriptionForChannel', () => {
  const channels = {
    name: 'channel1',
    namespace: 'chnamespace'
  }

  const channelsNoData = {
    namespace: 'chnamespace'
  }

  const subscriptions = [
    {
      name: 'subscr',
      namespace: 'subnamespace',
      channel: 'chnamespace/channel1'
    }
  ]

  const subscriptions2 = [
    {
      name: 'subscr',
      namespace: 'subnamespace',
      channel: 'test/channel1'
    }
  ]
  it('should return subscription name and namespace', () => {
    const result = 'subnamespace/subscr'
    expect(getSubscriptionForChannel(channels, subscriptions)).toEqual(result)
  })
  it('should return None', () => {
    const result = 'None'
    expect(getSubscriptionForChannel(channels, subscriptions2)).toEqual(result)
  })
  it('should return None if no channel name', () => {
    const result = 'None'
    expect(getSubscriptionForChannel(channelsNoData, subscriptions2)).toEqual(
      result
    )
  })
})

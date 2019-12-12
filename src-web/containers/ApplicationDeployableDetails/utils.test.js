/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getBreadCrumbs,
  getSubscriptions,
  getChannels,
  getDeployableDetails
} from './utils'

describe('getBreadCrumbs', () => {
  const deployableParams = {
    application: 'dragoon',
    namespace: 'hellena',
    name: 'dart'
  }
  const locale = 'en'
  const deployableParamsDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return an object of breadCrumbs used for the deployable details page', () => {
    // RESULT will have undefined because we are using config.contextPath which will
    // actually render multicloud
    const result = [
      { label: 'Applications', url: 'undefined' },
      { label: 'dragoon', url: 'undefined/hellena/dragoon' },
      {
        label: 'dart',
        url: 'undefined/hellena/dragoon/deployable/dart'
      }
    ]
    expect(getBreadCrumbs(deployableParams, locale)).toEqual(result)
  })
  it('should return an object of breadCrumbs used for the deployable details page with empty data', () => {
    const result = [
      { label: 'Applications', url: 'undefined' },
      { label: '', url: 'undefined//' },
      { label: '', url: 'undefined///deployable/' }
    ]
    expect(getBreadCrumbs(deployableParamsDud)).toEqual(result)
  })
  it('should handle undefined object', () => {
    const result = [{ label: 'Applications', url: 'undefined' }]
    expect(getBreadCrumbs(undefined)).toEqual(result)
  })
})

describe('getSubscriptions', () => {
  it('has subscriptions', () => {
    const subscriptions = getSubscriptions(subscriptionSearchResult)
    expect(subscriptions[0].name).toEqual('item1')
    expect(subscriptions[1].name).toEqual('item2')
  })
  it('no deployablsubscriptionsDetails', () => {
    const subscriptions = getSubscriptions({})
    expect(subscriptions).toHaveLength(0)
  })
})

describe('getChannels', () => {
  const subscriptions = [{ channel: 'aaa/bbb' }]

  const channelSample = { items: [{ name: 'bbb', namespace: 'aaa' }] }

  it('has channels', () => {
    const channels = getChannels(channelSample, subscriptions)

    expect(channels[0].name).toEqual('bbb')
    expect(channels[0].namespace).toEqual('aaa')
  })

  it('has no channels/subscriptions', () => {
    const channels = getChannels({}, {})
    expect(channels).toHaveLength(0)
  })
})

describe('getDeployableDetails', () => {
  it('has deployableDetails', () => {
    const deployableDetails = getDeployableDetails(subscriptionSearchResult)
    expect(deployableDetails.related[0].name).toEqual('sub1')
  })
  it('no deployableDetails', () => {
    const deployableDetails = getDeployableDetails({})
    expect(deployableDetails).toHaveLength(0)
  })
})

const subscriptionSearchResult = {
  data: {
    searchResult: [
      {
        related: [
          {
            kind: 'subscription',
            name: 'sub1',
            items: [{ name: 'item1' }]
          },
          {
            kind: 'subscription',
            name: 'sub2',
            items: [{ name: 'item2' }]
          }
        ]
      }
    ]
  }
}

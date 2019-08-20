/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require('react')
const renderer = require('react-test-renderer')
const SubscriptionModal = require('../SubscriptionModal').default

describe('subscriptionModal', () => {
  it('subscriptionModal renders correctly.', () => {
    const tree = renderer.create(<SubscriptionModal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

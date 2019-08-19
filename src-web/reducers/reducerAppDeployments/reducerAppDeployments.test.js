/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import reducerAppDeployments, {
  initialStateDeployments
} from '../reducerAppDeployments'

// const SET_SUBSCRIPTION_MODAL_HEADERS = 'SET_SUBSCRIPTION_MODAL_HEADERS'

describe('AppDeployments reducer', () => {
  it('handles OPEN_DISPLAY_SUBSCRIPTION_MODAL', () => {
    expect(
      reducerAppDeployments(initialStateDeployments, {
        type: 'OPEN_DISPLAY_SUBSCRIPTION_MODAL'
      })
    ).toEqual({
      ...initialStateDeployments,
      displaySubscriptionModal: true
    })
  })
  it('handles CLOSE_MODALS', () => {
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          displaySubscriptionModal: true
        },
        {
          type: 'CLOSE_MODALS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      currentSubscriptionInfo: {},
      displaySubscriptionModal: false
    })
  })
  it('handles SET_DEPLOYMENT_SEARCH', () => {
    const payload = 'legendofthedragoon'
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deploymentPipelineSearch: ''
        },
        {
          payload,
          type: 'SET_DEPLOYMENT_SEARCH'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deploymentPipelineSearch: payload
    })
  })
  it('handles SET_SUBSCRIPTION_MODAL_HEADERS', () => {
    const payload = {
      application: 'dart',
      subscription: 'feld'
    }
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: '',
            subscription: ''
          }
        },
        {
          payload,
          type: 'SET_SUBSCRIPTION_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: payload
    })
  })
  it('handles SET_SUBSCRIPTION_MODAL_HEADERS undefined', () => {
    const payload = {
      applicationnnnn: 'dart',
      deployablesssss: 'feld'
    }
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: '',
            subscription: ''
          }
        },
        {
          payload,
          type: 'SET_SUBSCRIPTION_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: {
        application: '',
        subscription: ''
      }
    })
  })
  it('handles SET_SUBSCRIPTION_MODAL_HEADERS undefined 2', () => {
    const payload = ''
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: 'shanna',
            subscription: 'lavitz'
          }
        },
        {
          payload,
          type: 'SET_SUBSCRIPTION_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: {
        application: '',
        subscription: ''
      }
    })
  })
  it('handles SET_LOADING', () => {
    const payload = false
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: true
        },
        {
          payload,
          type: 'SET_LOADING'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      loading: false
    })
  })
  it('handles SET_LOADING', () => {
    const payload = true
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: 'SET_LOADING'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      loading: true
    })
  })
})

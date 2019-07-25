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

// const SET_DEPLOYABLE_MODAL_HEADERS = 'SET_DEPLOYABLE_MODAL_HEADERS'

describe('AppDeployments reducer', () => {
  it('handles OPEN_DISPLAY_DEPLOYABLE_MODAL', () => {
    expect(
      reducerAppDeployments(initialStateDeployments, {
        type: 'OPEN_DISPLAY_DEPLOYABLE_MODAL'
      })
    ).toEqual({
      ...initialStateDeployments,
      displayDeployableModal: true
    })
  })
  it('handles CLOSE_MODALS', () => {
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          displayDeployableModal: true
        },
        {
          type: 'CLOSE_MODALS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      displayDeployableModal: false
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
  it('handles SET_DEPLOYABLE_MODAL_HEADERS', () => {
    const payload = {
      application: 'dart',
      deployable: 'feld'
    }
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deployableModalHeaderInfo: {
            application: '',
            deployable: ''
          }
        },
        {
          payload,
          type: 'SET_DEPLOYABLE_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deployableModalHeaderInfo: payload
    })
  })
  it('handles SET_DEPLOYABLE_MODAL_HEADERS undefined', () => {
    const payload = {
      applicationnnnn: 'dart',
      deployablesssss: 'feld'
    }
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deployableModalHeaderInfo: {
            application: '',
            deployable: ''
          }
        },
        {
          payload,
          type: 'SET_DEPLOYABLE_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deployableModalHeaderInfo: {
        application: '',
        deployable: ''
      }
    })
  })
  it('handles SET_DEPLOYABLE_MODAL_HEADERS undefined 2', () => {
    const payload = ''
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deployableModalHeaderInfo: {
            application: 'shanna',
            deployable: 'lavitz'
          }
        },
        {
          payload,
          type: 'SET_DEPLOYABLE_MODAL_HEADERS'
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deployableModalHeaderInfo: {
        application: '',
        deployable: ''
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

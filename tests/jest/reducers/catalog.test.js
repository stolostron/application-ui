/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/*
For a given input, a selector should always produce the same output.
 */

import catalog from '../../../src-web/reducers/catalog'
import * as Actions from '../../../src-web/actions'

describe('catalog reducer', () => {
  it('should return a state with CATALOG_INSTALL_LOADING status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_INSTALL_LOADING,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { catalogInstallLoading: 'test', test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with CATALOG_INSTALL_FAILURE status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_INSTALL_FAILURE,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { catalogInstallFailure: 'test', test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })
})

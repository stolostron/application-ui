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
import { addOrRemove } from '../../../src-web/reducers/catalog'
import * as Actions from '../../../src-web/actions'

describe('catalog reducer', () => {
  it('should return a state with CATALOG_FETCH_ERROR_STATUS_CHANGE status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_FETCH_ERROR_STATUS_CHANGE,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { catalogFetchFailure: 'test', test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with CATALOG_RESOURCE_SELECT status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_RESOURCE_SELECT,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = {
      selection: { name: undefined, repoName: undefined, url: undefined },
      test: 'test'
    }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with RESOURCES_FETCH_REQUEST_LOADING status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.RESOURCES_FETCH_REQUEST_LOADING,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { catalogFetchLoading: 'test', test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

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

  it('should return a state with CATALOG_INSTALL_VALIDATION_FAILURE status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_INSTALL_VALIDATION_FAILURE,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = {
      catalogInstallValidationFailure: 'test',
      test: 'test'
    }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with RESOURCES_FETCH_REQUEST_SUCCESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.RESOURCES_FETCH_REQUEST_SUCCESS,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = {
      catalogFetchFailure: false,
      items: undefined,
      test: 'test'
    }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with REPO_FETCH_REQUEST_SUCCESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.REPO_FETCH_REQUEST_SUCCESS,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { repos: undefined, test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })

  it('should return a state with CATALOG_DROPDOWN_FILTERS_VISIBILITY_TOGGLE status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.CATALOG_DROPDOWN_FILTERS_VISIBILITY_TOGGLE,
      payload: {
        status: 'test'
      }
    }
    const expectedValue = { dropdownFiltersVisibility: true, test: 'test' }
    expect(catalog(state, action)).toEqual(expectedValue)
  })
})


describe('catalog addOrRemove', () => {
  it('should return as expected', () => {
    const expectedValue = ['t', 'test']
    expect(addOrRemove('t', 'test')).toEqual(expectedValue)
  })
})

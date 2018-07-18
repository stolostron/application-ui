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

import {secondaryHeader, resourceReducerFunction, INITIAL_STATE} from '../../../src-web/reducers/common'

describe('secondaryHeader creation', () => {
  it('should return a default state', () => {
    const action = {}
    const expectedValue = {title: '', tabs: [], breadcrumbItems: [], links: []}
    expect(secondaryHeader(undefined, action)).toEqual(expectedValue)
  })
  it('should return a state with title', () => {
    const state = {}
    const action = {
      title: 'Clusters',
      tabs: '',
      breadcrumbItems: '',
      links: '',
      type: 'SECONDARY_HEADER_UPDATE'
    }
    const expectedValue = {
      title: 'Clusters',
      tabs: '',
      breadcrumbItems: '',
      links: ''
    }
    expect(secondaryHeader(state, action)).toEqual(expectedValue)
  })
})


describe('resourceReducerFunction', () => {
  it('should return the initial state', () => {
    const action = {
      type: 'unit-test'
    }
    expect(resourceReducerFunction(undefined, action)).toEqual(INITIAL_STATE)
  })
  it('should return a state with IN_PROGRESS status', () => {
    const state = {
      test: 'test',
      status: 'INCEPTION'
    }
    const action = {
      status: 'IN_PROGRESS',
      type: 'RESOURCE_REQUEST',
    }
    const expectedValue = {
      test: 'test',
      status: 'IN_PROGRESS'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with DONE status', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'RESOURCE_RECEIVE_SUCCESS',
      items: [],
      resourceVersion: 0
    }
    const expectedValue = {
      test: 'test',
      status: 'DONE',
      items: [],
      page: 1,
      resourceVersion: 0
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with ERROR status', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'RESOURCE_RECEIVE_FAILURE',
      err: 'error'
    }
    const expectedValue = {
      test: 'test',
      status: 'ERROR',
      err: 'error'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with post:IN_PROGRESS status', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'POST_REQUEST',
    }
    const expectedValue = {
      test: 'test',
      postStatus: 'IN_PROGRESS'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with post:DONE status', () => {
    const state = {
      test: 'test',
      items: ['test']
    }
    const action = {
      type: 'POST_RECEIVE_SUCCESS',
      item: ['test1']
    }
    const expectedValue = {
      test: 'test',
      items: ['test', 'test1'],
      postStatus: 'DONE'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with post:ERROR status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: 'POST_RECEIVE_FAILURE',
      err: {
        error: {
          response: {
            status: 404
          },
          message: 'error'
        }
      }
    }
    const expectedValue = {
      test: 'test',
      postStatusCode: 404,
      postErrorMsg: 'error',
      postStatus: 'ERROR'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with put:IN_PROGRESS status', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'PUT_REQUEST',
    }
    const expectedValue = {
      test: 'test',
      putStatus: 'IN_PROGRESS'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with put:DONE status', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'PUT_RECEIVE_SUCCESS',
    }
    const expectedValue = {
      test: 'test',
      putStatus: 'DONE'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with put:ERROR status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: 'PUT_RECEIVE_FAILURE',
      err: {
        error: {
          message: 'error'
        }
      }
    }
    const expectedValue = {
      test: 'test',
      putErrorMsg: 'error',
      putStatus: 'ERROR'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state with clear action', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'CLEAR_REQUEST_STATUS',
    }
    const expectedValue = {
      test: 'test',
      postStatus: undefined,
      postStatusCode: undefined,
      postErrorMsg: undefined,
      putStatus: undefined,
      putErrorMsg: undefined
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for table search action', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'TABLE_SEARCH',
      search: 'search'
    }
    const expectedValue = {
      test: 'test',
      search: 'search',
      page: 1
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for table sort action', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'TABLE_SORT',
      sortDirection: 'test',
      sortColumn: 'test'
    }
    const expectedValue = {
      test: 'test',
      sortDirection: 'test',
      sortColumn: 'test'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for table page change action', () => {
    const state = {
      test: 'test',
    }
    const action = {
      type: 'TABLE_PAGE_CHANGE',
      page: 1,
      pageSize: 10
    }
    const expectedValue = {
      test: 'test',
      page: 1,
      itemsPerPage: 10
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for resource modify action', () => {
    const state = {
      test: 'test',
      items: ['test']
    }
    const action = {
      type: 'RESOURCE_MODIFY',
      resourceType:{
        list: 'HCMPodList',
        name: 'HCMPod'
      }
    }
    const expectedValue = {
      test: 'test',
      items: [undefined]
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for resource delete action', () => {
    const state = {
      test: 'test',
      items: ['test']
    }
    const action = {
      type: 'RESOURCE_DELETE'
    }
    const expectedValue = {
      test: 'test',
      items: []
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
  it('should return a state for non-existing action', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: 'unit-test'
    }
    const expectedValue = {
      test: 'test'
    }
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue)
  })
})

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

import { resourceFilters } from '../../../src-web/reducers/filter'
import * as Actions from '../../../src-web/actions'

describe('filter reducer', () => {
  it('should return a state with RESOURCE_FILTERS_RECEIVE_SUCCESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      type: Actions.RESOURCE_FILTERS_RECEIVE_SUCCESS,
      filters: {
        clusterName: 'test',
        clusterLabels: 'test'
      }
    }
    const expectedValue = {'filters': {'clusterLabels': 'test', 'clusterNames': undefined}, 'status': 'DONE', 'test': 'test'}
    expect(resourceFilters(state, action)).toEqual(expectedValue)
  })

  it('should return a state with RESOURCE_FILTERS_UPDATE status', () => {
    const state = {
      test: 'test',
      selectedFilters: {}
    }
    const action = {
      type: Actions.RESOURCE_FILTERS_UPDATE,
      resourceName: 'test',
      selectedFilters:{}
    }
    const expectedValue = {'selectedFilters': {'test': {}}, 'test': 'test'}
    expect(resourceFilters(state, action)).toEqual(expectedValue)
  })
})

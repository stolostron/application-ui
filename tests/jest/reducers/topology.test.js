/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/*
For a given input, a selector should always produce the same output.
 */

import { topology } from '../../../src-web/reducers/topology'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import * as Actions from '../../../src-web/actions'

describe('topology reducer with topology name', () => {
  it('should return a state with IN_PROGRESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_REQUEST
    }
    const expectedValue = {
      fetchFilters: undefined,
      loaded: undefined,
      reloading: undefined,
      status: 'IN_PROGRESS',
      test: 'test'
    }
    expect(topology(state, action)).toEqual(expectedValue)
  })

  it('should return a state with DONE status', () => {
    const state = {
      test: 'test',
      activeFilters: 'noApplication'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_RECEIVE_SUCCESS,
      fetchFilters: 'receivedApplication'
    }
    const expectedValue = {
      links: undefined,
      nodes: undefined,
      status: 'DONE',
      loaded: true,
      reloading: false,
      test: 'test',
      activeFilters: 'receivedApplication'
    }
    expect(topology(state, action)).toEqual(expectedValue)
  })

  it('should return a state with ERROR status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_RECEIVE_FAILURE
    }
    const expectedValue = {
      links: undefined,
      nodes: undefined,
      status: 'ERROR',
      test: 'test'
    }
    expect(topology(state, action)).toEqual(expectedValue)
  })
})

describe('topology reducer', () => {
  it('should return a state with IN_PROGRESS status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_REQUEST
    }
    const expectedValue = { filtersStatus: 'IN_PROGRESS', test: 'test' }
    expect(topology(state, action)).toEqual(expectedValue)
  })

  it('should return a state without status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.REQUEST_STATUS.ERROR
    }
    const expectedValue = { test: 'test' }
    expect(topology(state, action)).toEqual(expectedValue)
  })

  it('should return a state with ERROR status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS,
      clusters: [
        {
          metadata: {
            name: 'myminikube',
            labels: {
              clusterip: '9.42.23.217',
              location: 'toronto',
              provider: 'IBM',
              purpose: 'test',
              runtime: 'kubernetes'
            }
          },
          __typename: 'Cluster'
        }
      ],
      namespaces: [
        {
          metadata: {
            name: 'default'
          },
          __typename: 'Namespace'
        }
      ],
      labels: [
        {
          name: 'app',
          value: 'loyalty-level',
          __typename: 'Label'
        },
        {
          name: 'solution',
          value: 'stock-trader',
          __typename: 'Label'
        }
      ],
      types: [
        'deployment',
        'host',
        'service',
        'pod',
        'container',
        'daemonset',
        'statefulset'
      ]
    }
    const expectedValue = {
      availableFilters: {
        clusters: [
          { filterValues: ['myminikube'], label: 'name: myminikube' },
          { filterValues: ['myminikube'], label: 'clusterip: 9.42.23.217' },
          { filterValues: ['myminikube'], label: 'location: toronto' },
          { filterValues: ['myminikube'], label: 'provider: IBM' },
          { filterValues: ['myminikube'], label: 'purpose: test' },
          { filterValues: ['myminikube'], label: 'runtime: kubernetes' }
        ],
        labels: [
          { label: 'app: loyalty-level', name: 'app', value: 'loyalty-level' },
          {
            label: 'solution: stock-trader',
            name: 'solution',
            value: 'stock-trader'
          }
        ],
        namespaces: [{ label: 'default' }],
        types: [
          { label: 'deployment' },
          { label: 'host' },
          { label: 'service' },
          { label: 'pod' },
          { label: 'container' },
          { label: 'daemonset' },
          { label: 'statefulset' },
          { label: 'other' }
        ]
      },
      otherTypeFilters: [],
      filtersStatus: 'DONE',
      test: 'test'
    }
    expect(topology(state, action)).toEqual(expectedValue)
  })

  it('should return a state without status', () => {
    const state = {
      test: 'test'
    }
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_UPDATE
    }
    const expectedValue = {
      activeFilters: { undefined: undefined },
      test: 'test'
    }
    expect(topology(state, action)).toEqual(expectedValue)
  })
})

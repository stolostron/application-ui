/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable import/no-named-as-default */

import React from 'react'
import { shallow } from 'enzyme'
import { MockedProvider } from 'react-apollo/test-utils'

import SecondaryHeaderApollo from '../../../src-web/components/SecondaryHeaderApollo'
import { GET_SEARCH_TABS } from '../../../src-web/apollo-client/queries/SearchQueries'

const mocks = {
  getSearchTabsMock: {
    request: { query: GET_SEARCH_TABS },
    result: {
      data: {
        searchQueryTabs: {
          tabs: [
            {
              queryName: 'UnitTesting',
              searchText: 'kind:pod',
              description: 'Search for pods',
              updated: false,
              id: 'UnitTesting'
            },
            {
              queryName: 'UnitTesting-1',
              searchText: 'kind:pod',
              description: 'Search for pods 1',
              updated: false,
              id: 'UnitTesting-1'
            }
          ],
          unsavedCount: 2,
          openedTabName: 'UnitTesting',
          openedTabId: 'UnitTesting'
        }
      }
    }
  }
}

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

describe('SecondaryHeaderApollo component 1', () => {
  it('Changes Apollo Client Cache For Edit Modal', async () => {
    const component = shallow(
      <MockedProvider mocks={[mocks.getSearchTabsMock]} addTypename={false}>
        <SecondaryHeaderApollo title="hello world" />
      </MockedProvider>
    )
    await delay(0)
    expect(component.find(SecondaryHeaderApollo)).toMatchSnapshot()
  })
})

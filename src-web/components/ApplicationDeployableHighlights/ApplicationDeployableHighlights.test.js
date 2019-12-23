/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

const React = require('../../../node_modules/react')
const renderer = require('../../../node_modules/react-test-renderer')
const ApplicationDeployableHighlights = require('../ApplicationDeployableHighlights')
  .default
const mockStore = configureStore([])

describe('ApplicationDeployableHighlights', () => {
  let store
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      actions: null
    })
  })

  it('ApplicationDeployableHighlights renders correctly.', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeployableHighlights />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

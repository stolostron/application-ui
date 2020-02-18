/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import * as actions from '../../../../actions'

const React = require('../../../../../node_modules/react')
const renderer = require('../../../../../node_modules/react-test-renderer')
const PipelineGrid = require('../PipelineGrid').default
const mockStore = configureStore([])

describe('PipelineGrid', () => {
  let store
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      actions: null
    })
  })

  const breadcrumbItems = 'a/b/sample-ns/sample-app'
  const applications = []
  const channels = []
  const appSubscriptions = []
  const getChannelResource = []
  const getSubscriptionResource = []
  const getPlacementRuleResource = []
  const editResource = []
  const appDropDownList = []
  const bulkSubscriptionList = []

  it('PipelineGrid renders correctly.', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PipelineGrid
            applications={applications}
            channels={channels}
            appSubscriptions={appSubscriptions}
            getChannelResource={getChannelResource}
            getSubscriptionResource={getSubscriptionResource}
            getPlacementRuleResource={getPlacementRuleResource}
            openSubscriptionModal={actions.openDisplaySubscriptionModal}
            setSubscriptionModalHeaderInfo={
              actions.setSubscriptionModalHeaderInfo
            }
            setCurrentDeployableSubscriptionData={
              actions.setCurrentDeployableSubscriptionData
            }
            setCurrentsubscriptionModalData={
              actions.setCurrentsubscriptionModalData
            }
            updateAppDropDownList={actions.updateAppDropDownList}
            appDropDownList={appDropDownList}
            bulkSubscriptionList={bulkSubscriptionList}
            editResource={editResource}
            breadcrumbItems={breadcrumbItems}
          />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { mount } from "enzyme";
const React = require("../../../../../../node_modules/react");
const renderer = require("../../../../../../node_modules/react-test-renderer");
const PipelineGrid = require("../../../../../../src-web/components/ApplicationDeploymentPipeline/components/PipelineGrid")
  .default;
import * as actions from "../../../../../../src-web/actions";

import { getChannelsList } from "../../../../../../src-web/components/ApplicationDeploymentPipeline/utils";
import {
  QueryApplicationList,
  HCMChannelList,
  HCMSubscriptionList,
  secondaryHeaderAllApps
} from "../../../TestingData";
const mockStore = configureStore([]);

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("PipelineGrid", () => {
  let store;
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      actions: null
    });
  });

  const breadcrumbItems = secondaryHeaderAllApps.breadcrumbItems; //"a/b/sample-ns/sample-app";

  const getChannelResource = jest.fn();
  const getSubscriptionResource = jest.fn();
  const getPlacementRuleResource = jest.fn();
  const editResource = jest.fn();
  const appDropDownList = [];
  const bulkSubscriptionList = HCMSubscriptionList.items;
  const editResourceClick = jest.fn();

  it("PipelineGrid renders correctly.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PipelineGrid
            applications={QueryApplicationList.items}
            channels={getChannelsList(HCMChannelList)}
            appSubscriptions={HCMSubscriptionList.items}
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
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationsTab renders correctly with data on single app, create channel error", () => {
    const wrapper = mount(
      <Provider store={store}>
        <PipelineGrid
          applications={QueryApplicationList.items}
          channels={HCMChannelList.items}
          appSubscriptions={HCMSubscriptionList.items}
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
          editResourceClick={editResourceClick}
        />
      </Provider>
    );

    wrapper
      .find(".channelEditIcon")
      .at(0)
      .simulate("click");

    wrapper
      .find(".yamlEditSubContainer")
      .at(0)
      .simulate("click");
    wrapper
      .find(".yamlEditSubContainer")
      .at(0)
      .simulate("keypress");
    wrapper
      .find(".subscriptionEditIcon")
      .at(0)
      .simulate("click");

    wrapper
      .find(".placementRuleDesc")
      .at(0)
      .simulate("click");
    wrapper
      .find(".placementRuleDesc")
      .at(0)
      .simulate("keypress");
    wrapper
      .find(".channelColumnDeployable")
      .at(0)
      .simulate("click");

    wrapper
      .find(".applicationTile")
      .at(0)
      .simulate("click");
  });
});

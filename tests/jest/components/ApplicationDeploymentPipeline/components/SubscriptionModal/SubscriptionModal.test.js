/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  HCMSubscriptionList,
  QueryApplicationList
} from "../../../TestingData";
import { mount } from "enzyme";
const React = require("react");
const renderer = require("react-test-renderer");
const SubscriptionModal = require("../../../../../../src-web/components/ApplicationDeploymentPipeline/components/SubscriptionModal")
  .default;

describe("subscriptionModal", () => {
  it("subscriptionModal with empty subscription list renders correctly.", () => {
    const tree = renderer.create(<SubscriptionModal />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("subscriptionModal with bulkSubscriptionList renders correctly on click.", () => {
    const label = "rbac-test-app-gbapp";
    const subscriptionModalSubscriptionInfo = HCMSubscriptionList.items[1];
    const bulkSubscriptionList = HCMSubscriptionList.items;

    const wrapper = mount(
      <SubscriptionModal
        label={label}
        closeModal={jest.fn()}
        subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
        open={true}
        bulkSubscriptionList={bulkSubscriptionList}
        applications={QueryApplicationList}
      />
    );
    wrapper
      .find(".modalAddRepo")
      .find(".bx--btn--primary")
      .simulate("click");
    wrapper
      .find(".modalAddRepo")
      .find(".bx--btn--secondary")
      .simulate("click");

    wrapper.find(".bx--modal-close").simulate("click");
  });

  it("subscriptionModal with bulkSubscriptionList renders correctly.", () => {
    const label = "rbac-test-app-gbapp";
    const subscriptionModalSubscriptionInfo = HCMSubscriptionList.items[1];
    const bulkSubscriptionList = HCMSubscriptionList.items;

    const tree = renderer
      .create(
        <SubscriptionModal
          label={label}
          subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
          open={true}
          bulkSubscriptionList={bulkSubscriptionList}
          applications={QueryApplicationList}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("subscriptionModal with bulkSubscriptionList renders correctly.", () => {
    const label = "rbac-test-app-gbapp";
    const subscriptionModalSubscriptionInfo = HCMSubscriptionList.items[0];
    const bulkSubscriptionList = HCMSubscriptionList.items;

    const tree = renderer
      .create(
        <SubscriptionModal
          label={label}
          subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
          open={true}
          bulkSubscriptionList={bulkSubscriptionList}
          applications={QueryApplicationList}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("subscriptionModal with bulkSubscriptionList renders correctly with empty subscriptionModalSubscriptionInfo.", () => {
    // pass subscription info

    const label = "rbac-test-app-gbapp";
    const bulkSubscriptionList = HCMSubscriptionList.items;
    const fakeData = {
      name: "mortgage-app-subscription",
      namespace: "default",
      _uid: "fake"
    };
    const tree = renderer
      .create(
        <SubscriptionModal
          label={label}
          subscriptionModalSubscriptionInfo={fakeData}
          open={true}
          bulkSubscriptionList={bulkSubscriptionList}
          applications={QueryApplicationList}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("subscriptionModal with bulkSubscriptionList renders correctly with undefined subscriptionModalSubscriptionInfo.", () => {
    // pass subscription info

    const label = "rbac-test-app-gbapp";
    const bulkSubscriptionList = HCMSubscriptionList.items;
    const fakeData = {
      name: "mortgage-app-subscription",
      namespace: "default"
    };
    const tree = renderer
      .create(
        <SubscriptionModal
          label={label}
          subscriptionModalSubscriptionInfo={fakeData}
          open={true}
          bulkSubscriptionList={bulkSubscriptionList}
          applications={QueryApplicationList}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

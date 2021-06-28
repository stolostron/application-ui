/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import { shallow } from "enzyme";
import { mount } from "enzyme";

import ChannelController from "../../../../../src-web/components/Topology/viewer/ChannelControl";

const channelControllerNoAllChannels = {
  activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
  isChangingChannel: undefined,
  changeTheChannel: jest.fn,
  allChannels: []
};

const channelController = {
  activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
  isChangingChannel: undefined,
  changeTheChannel: jest.fn,
  allChannels: [
    "__ALL__/__ALL__//__ALL__/__ALL__",
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///cassandra-cassandra-service///mysql-wordpress-pd-wordpress-mysql-deployment",
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///mysql-wordpress-pd-wordpress-mysql-service///staging-elasticsearch-elasticsearch-serviceaccount"
  ]
};

const channelController2 = {
  activeChannel:
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///elasticsearch-es-replicationcontroller///persistent-volume-provisioning-glusterfs-heketi-secret-secret",
  isChangingChannel: undefined,
  changeTheChannel: jest.fn,
  allChannels: [
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///mysql-wordpress-pd-wordpress-mysql-service///staging-elasticsearch-elasticsearch-serviceaccount",
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///elasticsearch-es-replicationcontroller///persistent-volume-provisioning-glusterfs-heketi-secret-secret",
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///persistent-volume-provisioning-glusterfs-slow-storageclass///spark-spark-gluster-spark-main-controller-replicationcontroller"
  ]
};

const channelController3 = {
  activeChannel: "nginx-blue/blue-nginx-subscription//demo/gitops",
  isChangingChannel: undefined,
  changeTheChannel: jest.fn,
  allChannels: [
    "__ALL__/__ALL__//__ALL__/__ALL__",
    "nginx-blue/blue-nginx-subscription//demo/gitops",
    "nginx-blue/ingress-nginx-subscription-blue//demo/gitops"
  ]
};

const channelController4 = {
  activeChannel: undefined,
  isChangingChannel: false,
  changeTheChannel: jest.fn,
  allChannels: [
    "__ALL__/__ALL__//__ALL__/__ALL__",
    "helloworld-demo-ns/helloworld-demo-subscription-1//rhacm-nginx-app-channel/nginx-app-channel",
    "helloworld-demo-ns/helloworld-demo-subscription-2//multilevel-channel/multilevel-channel"
  ]
};

describe("ChannelController with noAllChannels", () => {
  it("default", () => {
    const component = shallow(
      <ChannelController
        channelControl={channelControllerNoAllChannels}
        locale={"en-US"}
      />
    );
    expect(component).toMatchSnapshot();
  });
});

describe("ChannelController components 1", () => {
  it("default", () => {
    const component = shallow(
      <ChannelController channelControl={channelController} locale={"en-US"} />
    );
    expect(component).toMatchSnapshot();
  });
});

describe("ChannelController components 2", () => {
  it("ChannelController components 2", () => {
    const component = shallow(
      <ChannelController channelControl={channelController2} locale={"en-US"} />
    );
    expect(component).toMatchSnapshot();
  });
});

describe("ChannelController components 2. 2", () => {
  it("ChannelController components 2 2", () => {
    const wrapper = mount(
      <ChannelController channelControl={channelController2} locale={"en-US"} />
    );

    wrapper
      .find('[aria-label="Go to first page"]')
      .at(0)
      .simulate("click");

    wrapper
      .find('[aria-label="Go to first page"]')
      .at(0)
      .simulate("keypress");

    wrapper
      .find(`[aria-label="Go to previous page"]`)
      .at(0)
      .simulate("click");

    wrapper
      .find(`[aria-label="Go to previous page"]`)
      .at(0)
      .simulate("keypress");

    wrapper
      .find(`[aria-label="Go to next page"]`)
      .at(0)
      .simulate("click");

    wrapper
      .find(`[aria-label="Go to next page"]`)
      .at(0)
      .simulate("keypress");

    wrapper
      .find(`[aria-label="Go to last page"]`)
      .at(0)
      .simulate("click");

    wrapper
      .find(`[aria-label="Go to last page"]`)
      .at(0)
      .simulate("keypress");

    wrapper
      .find(".pf-c-form-control")
      .at(0)
      .simulate("keypress");
    wrapper
      .find(".pf-c-form-control")
      .at(0)
      .simulate("click");
  });
});

describe("ChannelController components 3", () => {
  it("ChannelController components 3", () => {
    const wrapper = shallow(
      <ChannelController channelControl={channelController3} locale={"en-US"} />
    );

    wrapper.find("AcmDropdown").simulate("select", "blue-nginx-subscription");
  });
});

describe("ChannelController components 4", () => {
  it("ChannelController components 4", () => {
    const wrapper = shallow(
      <ChannelController channelControl={channelController4} locale={"en-US"} />
    );
    wrapper
      .find("AcmDropdown")
      .simulate("select", "helloworld-demo-subscription-1");
  });
});

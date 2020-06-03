/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import { shallow } from "enzyme";
import { mount } from "enzyme";

import ChannelController from "../../../../../src-web/components/Topology/viewer/ChannelControl";

const channelController = {
  activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
  isChangingChannel: undefined,
  changeTheChannel: jest.fn,
  allChannels: [
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///cassandra-cassandra-service///mysql-wordpress-pd-wordpress-mysql-deployment",
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///mysql-wordpress-pd-wordpress-mysql-service///staging-elasticsearch-elasticsearch-serviceaccount"
  ]
};
describe("EditorBar components", () => {
  it("empty", () => {
    const component = shallow(<ChannelController />);
    expect(component).toMatchSnapshot();
  });

  it("default", () => {
    const component = shallow(
      <ChannelController channelControl={channelController} locale={"en-US"} />
    );
    expect(component).toMatchSnapshot();
  });
});

describe("EditorBar components", () => {
  it("empty", () => {
    const component = shallow(<ChannelController />);
    expect(component).toMatchSnapshot();
  });

  it("default", () => {
    const wrapper = mount(
      <ChannelController channelControl={channelController} locale={"en-US"} />
    );

    wrapper
      .find(".channel-control-subchannel")
      .at(0)
      .simulate("click");

    wrapper
      .find(".channel-control-subchannel")
      .at(0)
      .simulate("keypress");
  });
});

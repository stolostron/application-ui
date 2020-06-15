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
    "default/guestbook-app//gbapp-ch/guestbook-app-latest///persistent-volume-provisioning-glusterfs-slow-storageclass///spark-spark-gluster-spark-master-controller-replicationcontroller"
  ]
};
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
      <ChannelController channelControl={channelController} locale={"en-US"} />
    );
    expect(component).toMatchSnapshot();
  });
});

describe("ChannelController components 3", () => {
  it("ChannelController components 3", () => {
    const wrapper = mount(
      <ChannelController channelControl={channelController2} locale={"en-US"} />
    );

    wrapper
      .find("#p1")
      .at(0)
      .simulate("click");

    wrapper
      .find("#p1")
      .at(0)
      .simulate("keypress");

    wrapper
      .find("#p2")
      .at(0)
      .simulate("click");

    wrapper
      .find("#p2")
      .at(0)
      .simulate("keypress");

    wrapper
      .find("#p3")
      .at(0)
      .simulate("click");

    wrapper
      .find("#p3")
      .at(0)
      .simulate("keypress");

    wrapper
      .find("#p4")
      .at(0)
      .simulate("click");

    wrapper
      .find("#p4")
      .at(0)
      .simulate("keypress");
  });
});

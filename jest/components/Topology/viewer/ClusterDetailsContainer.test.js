// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import ClusterDetailsContainer from "../../../../../src-web/components/Topology/viewer/ClusterDetailsContainer";

const locale = "US-en";
window.open = () => {}; // provide an empty implementation for window.open

describe("ClusterDetailsContainer with no clusters", () => {
  const mockData = {
    clusters: [],
    clusterDetailsContainerControl: {
      clusterDetailsContainerData: {
        page: 1,
        startIdx: 0,
        clusterSearchToggle: false,
        isSelectOpen: false,
        expandSectionToggleMap: new Set()
      },
      handleClusterDetailsContainerUpdate: jest.fn()
    }
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <ClusterDetailsContainer
        clusterList={mockData.clusters}
        locale={locale}
        clusterDetailsContainerControl={mockData.clusterDetailsContainerControl}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("ClusterDetailsContainer with some clusters", () => {
  const mockData = {
    clusters: [
      {
        cpu: "12",
        memory: "23308Mi",
        name: "argo-fxiang-eks",
        namespace: "argo-fxiang-eks",
        status: "ok"
      },
      {
        allocatable: { cpu: "11580m", memory: "20056Mi" },
        capacity: { cpu: "12", memory: "23308Mi" },
        metadata: {
          name: "fxiang-eks",
          namespace: "fxiang-eks"
        },
        status: "ok"
      },
      {
        allocatable: { cpu: "33", memory: "137847Mi" },
        capacity: { cpu: "36", memory: "144591Mi" },
        consoleURL:
          "https://console-openshift-console.apps.vbirsan1-remote.dev06.red-chesterfield.com",
        metadata: {
          name: "vbirsan1-remote",
          namespace: "vbirsan1-remote"
        },
        status: "ok"
      }
    ],
    clusterDetailsContainerControl: {
      clusterDetailsContainerData: {
        page: 1,
        startIdx: 0,
        clusterSearchToggle: false,
        isSelectOpen: false,
        expandSectionToggleMap: new Set()
      },
      handleClusterDetailsContainerUpdate: jest.fn()
    }
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <ClusterDetailsContainer
        clusterList={mockData.clusters}
        clusterID="TestClusterID"
        locale={locale}
        clusterDetailsContainerControl={mockData.clusterDetailsContainerControl}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("ClusterDetailsContainer test functions", () => {
  const mockData = {
    clusters: [
      {
        allocatable: { cpu: "11580m", memory: "20056Mi" },
        capacity: { cpu: "12", memory: "23308Mi" },
        metadata: {
          name: "fxiang-eks",
          namespace: "fxiang-eks"
        },
        status: "ok"
      },
      {
        allocatable: { cpu: "33", memory: "137847Mi" },
        capacity: { cpu: "36", memory: "144591Mi" },
        consoleURL:
          "https://console-openshift-console.apps.vbirsan1-remote.dev06.red-chesterfield.com",
        metadata: {
          name: "vbirsan1-remote",
          namespace: "vbirsan1-remote"
        },
        status: "ok"
      }
    ],
    clusterDetailsContainerControl: {
      clusterDetailsContainerData: {
        page: 1,
        startIdx: 0,
        clusterSearchToggle: false,
        isSelectOpen: false,
        expandSectionToggleMap: new Set()
      },
      handleClusterDetailsContainerUpdate: jest.fn()
    }
  };

  let wrapper;
  beforeEach(
    () =>
      (wrapper = shallow(
        <ClusterDetailsContainer
          clusterList={mockData.clusters}
          locale={locale}
          clusterDetailsContainerControl={
            mockData.clusterDetailsContainerControl
          }
        />
      ))
  );

  it("work as expected", () => {
    const instance = wrapper.instance();
    instance.handleSelection({}, "vbirsan1-remote");
    instance.handleSelection({}, undefined);
    instance.handleSelectionClear();
    instance.handleFirstClick();
    instance.handleLastClick();
    instance.handleNextClick({}, 1);
    instance.handlePreviousClick({}, 1);
    instance.handlePageInput({}, 1);
    instance.handleKeyPress(
      {
        action: "open_link",
        targetLink: "https://test"
      },
      {
        key: "Enter"
      }
    );
    instance.handleKeyPress(
      {
        action: "open_link",
        targetLink: "https://test"
      },
      {
        key: "Any"
      }
    );
    instance.handleSelectToggle();
    instance.handleExpandSectionToggle(0);
  });
});

// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import ArgoAppDetailsContainer from "../../../../../src-web/components/Topology/viewer/ArgoAppDetailsContainer";

const locale = "US-en";
window.open = () => {}; // provide an empty implementation for window.open

describe("ArgoAppDetailsContainer with no apps", () => {
  const mockData = {
    argoAppList: [],
    argoAppDetailsContainerControl: {
      argoAppDetailsContainerData: {
        page: 1,
        startIdx: 0,
        argoAppSearchToggle: false,
        expandSectionToggleMap: new Set(),
        selected: undefined,
        selectedArgpAppList: [],
        isLoading: false
      },
      handleArgoAppDetailsContainerUpdate: jest.fn(),
      handleErrorMsg: jest.fn()
    }
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <ArgoAppDetailsContainer
        argoAppList={mockData.argoAppList}
        locale={locale}
        argoAppDetailsContainerControl={mockData.argoAppDetailsContainerControl}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("ArgoAppDetailsContainer with no apps", () => {
  const mockData = {
    argoAppList: [
      {
        name: "test1",
        cluster: "local-cluster",
        namespace: "ns1",
        destinationCluster: "cluster1",
        detinationNamespace: "test1-ns"
      },
      {
        name: "test2",
        cluster: "local-cluster",
        namespace: "ns2",
        destinationCluster: "cluster2",
        detinationNamespace: "test2-ns"
      }
    ],
    argoAppDetailsContainerControl: {
      argoAppDetailsContainerData: {
        page: 1,
        startIdx: 0,
        argoAppSearchToggle: false,
        expandSectionToggleMap: new Set(),
        selected: undefined,
        selectedArgpAppList: [],
        isLoading: false
      },
      handleArgoAppDetailsContainerUpdate: jest.fn(),
      handleErrorMsg: jest.fn()
    }
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <ArgoAppDetailsContainer
        argoAppList={mockData.argoAppList}
        locale={locale}
        argoAppDetailsContainerControl={mockData.argoAppDetailsContainerControl}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("ArgoAppDetailsContainer test functions", () => {
  const mockData = {
    argoAppList: [
      {
        name: "test1",
        cluster: "local-cluster",
        namespace: "ns1",
        destinationCluster: "cluster1",
        detinationNamespace: "test1-ns"
      },
      {
        name: "test2",
        cluster: "local-cluster",
        namespace: "ns2",
        destinationCluster: "cluster2",
        detinationNamespace: "test2-ns"
      }
    ],
    argoAppDetailsContainerControl: {
      argoAppDetailsContainerData: {
        page: 1,
        startIdx: 0,
        argoAppSearchToggle: false,
        expandSectionToggleMap: new Set(),
        selected: undefined,
        selectedArgpAppList: [],
        isLoading: false
      },
      handleArgoAppDetailsContainerUpdate: jest.fn(),
      handleErrorMsg: jest.fn()
    }
  };

  let wrapper;
  beforeEach(
    () =>
      (wrapper = shallow(
        <ArgoAppDetailsContainer
          argoAppList={mockData.argoAppList}
          locale={locale}
          argoAppDetailsContainerControl={
            mockData.argoAppDetailsContainerControl
          }
        />
      ))
  );

  it("works as expected", () => {
    const instance = wrapper.instance();
    instance.toggleLinkLoading();
    instance.handleExpandSectionToggle(0);
    instance.handleSelection({}, "test1");
    instance.handleSelection({}, undefined);
    instance.handleSelectToggle();
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
  });
});

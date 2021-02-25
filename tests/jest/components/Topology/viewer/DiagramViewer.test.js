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
import renderer from "react-test-renderer";

import DiagramViewer from "../../../../../src-web/components/Topology/viewer/DiagramViewer";

describe("DiagramViewer no components", () => {
  const mockData = {
    clusters: [],
    nodes: [],
    links: [],
    activeFilters: {},
    staticResourceData: {
      shapeTypeOrder: ["application", "appservice", "dependency"],
      getNodeDescription: jest.fn(),
      diagramOptions: {
        showHubs: false
      }
    }
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <DiagramViewer
        nodes={mockData.nodes}
        links={mockData.links}
        context={{ locale: "US-en" }}
        staticResourceData={mockData.staticResourceData}
        activeFilters={mockData.activeFilters}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

const mockData = {
  id: "5b57cb37d7f883001b15d7f9",
  name: "crucial-owl",
  nodes: [
    {
      id: "5b57cb3825f660891c811e11",
      uid: "b5c462ec-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-templatedb",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e20",
      uid: "792aab50-7a1b-11e8-bdf2-005056a0d11b",
      name: "etcd-service",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e32",
      uid: "8c479bdd-8ed6-11e8-bdf2-005056a0d11b",
      name: "justin-testing-jenkinsch",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e36",
      uid: "b5c0611e-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-instancedb",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e37",
      uid: "4545958f-5545-11e8-bdf2-005056a0d11b",
      name: "kubernetes",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e3c",
      uid: "545cb76d-7a1b-11e8-bdf2-005056a0d11b",
      name: "proxy-etcd-storage",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "service",
      namespace: "default",
      topology: "services",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e50",
      uid: "b5c61ea0-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-templatedb",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e57",
      uid: "8c486643-8ed6-11e8-bdf2-005056a0d11b",
      name: "justin-testing-jenkinsch",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e69",
      uid: "85621f1f-7a1b-11e8-bdf2-005056a0d11b",
      name: "etcd-operator",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e6e",
      uid: "7936fc03-7a1b-11e8-bdf2-005056a0d11b",
      name: "etcd-v1",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e71",
      uid: "b5c52eb4-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-instancedb",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811e73",
      uid: "54672c64-7a1b-11e8-bdf2-005056a0d11b",
      name: "proxy-etcd-storage-v1",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "deployment",
      namespace: "default",
      topology: "kube-controllers",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ea0",
      uid: "00018318-7bfe-11e8-bdf2-005056a0d11b",
      name: "selenium-acs-1530319117885-hcm-allinone-hcmm-9d478cff-8h4dj",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ea5",
      uid: "64c68f10-7c08-11e8-bdf2-005056a0d11b",
      name: "selenium-acs-1530323581078-hcm-allinone-hcmm-855cd86c9-2knmn",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811eb8",
      uid: "b5ce532c-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-instancedb-669d858557-v2p8b",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ebe",
      uid: "546e1b9d-7a1b-11e8-bdf2-005056a0d11b",
      name: "proxy-etcd-storage-v1-5656c79bbc-fgz5p",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ec1",
      uid: "79421b13-7a1b-11e8-bdf2-005056a0d11b",
      name: "etcd-v1-57f5bbfd4-fqzk9",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ec2",
      uid: "8c4eeaf7-8ed6-11e8-bdf2-005056a0d11b",
      name: "justin-testing-jenkinsch-594898c684-tgdsf",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811edb",
      uid: "b5cdd220-8389-11e8-bdf2-005056a0d11b",
      name: "reeling-lemur-hcm-demoaccessories-templatedb-86c5755c4b-hmxx2",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    },
    {
      id: "5b57cb3825f660891c811ee4",
      uid: "8563dd2a-7a1b-11e8-bdf2-005056a0d11b",
      name: "etcd-operator-7d5b777654-9cl5q",
      cluster: "5b57cb37d7f883001b15d7f9",
      type: "pod",
      namespace: "default",
      topology: "pods",
      __typename: "Resource"
    }
  ],
  links: [
    {
      source: "545cb76d-7a1b-11e8-bdf2-005056a0d11b",
      target: "792aab50-7a1b-11e8-bdf2-005056a0d11b",
      label: "calls",
      type: "calls",
      uid:
        "545cb76d-7a1b-11e8-bdf2-005056a0d11b792aab50-7a1b-11e8-bdf2-005056a0d11b"
    },
    {
      source: "54672c64-7a1b-11e8-bdf2-005056a0d11b",
      target: "7936fc03-7a1b-11e8-bdf2-005056a0d11b",
      label: "calls",
      type: "calls",
      uid:
        "54672c64-7a1b-11e8-bdf2-005056a0d11b7936fc03-7a1b-11e8-bdf2-005056a0d11b"
    },
    {
      source: "546e1b9d-7a1b-11e8-bdf2-005056a0d11b",
      target: "79421b13-7a1b-11e8-bdf2-005056a0d11b",
      label: "calls",
      type: "calls",
      uid:
        "546e1b9d-7a1b-11e8-bdf2-005056a0d11b79421b13-7a1b-11e8-bdf2-005056a0d11b"
    }
  ],
  activeFilters: {
    namespace: [
      {
        label: "default"
      }
    ]
  },
  staticResourceData: {
    shapeTypeOrder: ["pod"],
    diagramOptions: {
      showHubs: false
    }
  }
};

describe("DiagramViewer 3 components", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <DiagramViewer
        title={""}
        id={"test"}
        nodes={mockData.nodes}
        links={mockData.links}
        isMulticluster={false}
        context={{ locale: "US-en" }}
        secondaryLoad={false}
        staticResourceData={mockData.staticResourceData}
        activeFilters={{}}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

"use strict";

import {
  getAllFilters,
  getAvailableFilters,
  getSearchFilter,
  filterNodes,
  processResourceStatus,
  notDesignNode,
  isDesignOrCluster,
  nodeParentExists,
  filterRelationshipNodes
} from "../../../../../../src-web/components/Topology/viewer/defaults/filtering";

describe("filterRelationshipNodes", () => {
  const mockDataRelationshipNodes = {
    nodes: [
      {
        id:
          "member--deployable--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
        type: "deployment",
        namespace: "default",
        specs: {
          clustersNames: ["braveman"],
          isDesign: false,
          pulse: "green",
          parent: {
            parentId: "member-cluster"
          }
        }
      },
      {
        id:
          "member--replicaset--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
        type: "replicaset",
        namespace: "default",
        specs: {
          clustersNames: ["braveman"],
          isDesign: false,
          pulse: "green",
          parent: {
            parentId:
              "member--deployable--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
            type: "deployment",
            name: "deployment1"
          }
        }
      }
    ],
    activeFilters: {
      resourceStatuses: new Set(["green"]),
      clusterNames: new Set(["braveman"]),
      type: [
        "application",
        "deployment",
        "placements",
        "subscription",
        "replicaset"
      ]
    },
    availableFilters: {
      type: [
        "application",
        "deployment",
        "placements",
        "subscription",
        "replicaset"
      ]
    },
    mode: "application"
  };

  const expectedValue = [
    {
      id:
        "member--deployable--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
      namespace: "default",
      specs: {
        clustersNames: ["braveman"],
        isDesign: false,
        parent: {
          parentId: "member-cluster"
        },
        pulse: "green"
      },
      type: "deployment"
    },
    {
      id:
        "member--replicaset--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
      namespace: "default",
      specs: {
        clustersNames: ["braveman"],
        isDesign: false,
        parent: {
          name: "deployment1",
          parentId:
            "member--deployable--member--deployable--member--clusters--braveman--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
          type: "deployment"
        },
        pulse: "green"
      },
      type: "replicaset"
    }
  ];
  it("filter node by cluster name", () => {
    expect(
      filterRelationshipNodes(
        mockDataRelationshipNodes.nodes,
        mockDataRelationshipNodes.activeFilters,
        mockDataRelationshipNodes.availableFilters,
        mockDataRelationshipNodes.mode
      )
    ).toEqual(expectedValue);
  });
});

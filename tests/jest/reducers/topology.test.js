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

import { topology } from "../../../src-web/reducers/topology";
import { RESOURCE_TYPES } from "../../../lib/shared/constants";
import * as Actions from "../../../src-web/actions";

describe("topology reducer with topology name", () => {
  it("should return a state with IN_PROGRESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_REQUEST
    };
    expect(topology(state, action)).toMatchSnapshot();
  });

  it("should return a state with DONE status", () => {
    const state = {
      test: "test",
      activeFilters: "noApplication"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_RECEIVE_SUCCESS,
      fetchFilters: "receivedApplication"
    };
    expect(topology(state, action)).toMatchSnapshot();
  });

  it("should return a state with ERROR status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.RESOURCE_RECEIVE_FAILURE
    };
    expect(topology(state, action)).toMatchSnapshot();
  });
});

describe("topology reducer", () => {
  it("should return a state with IN_PROGRESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_REQUEST
    };
    expect(topology(state, action)).toMatchSnapshot();
  });

  it("should return a state without status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.REQUEST_STATUS.ERROR
    };
    expect(topology(state, action)).toMatchSnapshot();
  });

  it("should return a state with ERROR status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS,
      clusters: [
        {
          metadata: {
            name: "myminikube",
            labels: {
              clusterip: "9.42.23.217",
              location: "toronto",
              provider: "IBM",
              purpose: "test",
              runtime: "kubernetes"
            }
          },
          __typename: "Cluster"
        }
      ],
      namespaces: [
        {
          metadata: {
            name: "default"
          },
          __typename: "Namespace"
        }
      ],
      labels: [
        {
          name: "app",
          value: "loyalty-level",
          __typename: "Label"
        },
        {
          name: "solution",
          value: "stock-trader",
          __typename: "Label"
        }
      ],
      types: [
        "deployment",
        "host",
        "service",
        "pod",
        "container",
        "daemonset",
        "statefulset"
      ]
    };
    expect(topology(state, action)).toMatchSnapshot();
  });

  it("should return a state without status", () => {
    const state = {
      test: "test"
    };
    const action = {
      resourceType: {
        name: RESOURCE_TYPES.HCM_TOPOLOGY.name
      },
      type: Actions.TOPOLOGY_FILTERS_UPDATE
    };
    expect(topology(state, action)).toMatchSnapshot();
  });
});

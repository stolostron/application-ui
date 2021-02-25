// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { processPos } from "../../../../../../src-web/components/Topology/viewer/layouts/application";

describe("processPos", () => {
  const hadRule = {
    value: false
  };
  it("processPos subscription", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "subscription",
        "mysub",
        {
          hasRules: true,
          parent: {
            parentName: "myapp",
            parentType: "application"
          }
        },
        "mysub",
        hadRule,
        {
          value: "subscription"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos subscription hasRule false", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "subscription",
        "mysub",
        {
          hasRules: false,
          parent: {
            parentName: "myapp",
            parentType: "application"
          }
        },
        "mysub",
        hadRule,
        {
          value: "subscription"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos cluster", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "cluster",
        "mycluster",
        {
          hasRules: true,
          parent: {
            parentName: "mysub",
            parentType: "subscription"
          }
        },
        "mycluster",
        hadRule,
        {
          value: "cluster"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos ingress", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "ingress",
        "myingress",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "myingress",
        hadRule,
        {
          value: "ingress"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos route", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "route",
        "myroute",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "myroute",
        hadRule,
        {
          value: "route"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos daemonset", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "daemonset",
        "mydaemonset",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "mydaemonset",
        hadRule,
        {
          value: "daemonset"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos statefulset", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "statefulset",
        "mystatefulset",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "mystatefulset",
        hadRule,
        {
          value: "statefulset"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos deploymentconfig", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "deploymentconfig",
        "mydeploymentconfig",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "deploymentconfig",
        hadRule,
        {
          value: "deploymentconfig"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos deployment", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "deployment",
        "mydeployment",
        {
          hasRules: true,
          parent: {
            parentName: "mycluster",
            parentType: "cluster"
          }
        },
        "mydeployment",
        hadRule,
        {
          value: "deployment"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos replicationcontroller", () => {
    expect(
      processPos(
        { "deployment/myreplicationcontroller-braveman": { x: 4, y: 5 } },
        { x: 1, y: 2 },
        "replicationcontroller",
        "myreplicationcontroller",
        {
          hasRules: true,
          parent: {
            parentName: "mydeployment",
            parentType: "deployment"
          }
        },
        "myreplicationcontroller--cluster--braveman--",
        hadRule,
        {
          value: "replicationcontroller"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos service", () => {
    expect(
      processPos(
        { "deployment/myroute-braveman": { x: 4, y: 5 } },
        { x: 1, y: 2 },
        "service",
        "myservice",
        {
          hasRules: true,
          parent: {
            parentName: "myroute",
            parentType: "route"
          }
        },
        "myservice--cluster--braveman--",
        hadRule,
        {
          value: "service"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos replicaset", () => {
    expect(
      processPos(
        { "deployment/myreplicaset-braveman": { x: 4, y: 5 } },
        { x: 1, y: 2 },
        "replicaset",
        "myreplicaset",
        {
          hasRules: true,
          parent: {
            parentName: "mydeployment",
            parentType: "deployment"
          }
        },
        "myreplicaset--cluster--braveman--",
        hadRule,
        {
          value: "replicaset"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos replicaset no parent", () => {
    expect(
      processPos(
        { "deployment/myreplicaset-braveman": { x: 4, y: 5 } },
        { x: 1, y: 2 },
        "replicaset",
        "myreplicaset",
        {
          hasRules: true
        },
        "myreplicaset--cluster--braveman--",
        hadRule,
        {
          value: "replicaset"
        },
        1
      )
    ).toEqual(undefined);
  });

  it("processPos other type", () => {
    expect(
      processPos(
        {},
        { x: 1, y: 2 },
        "application",
        "myapp",
        {
          hasRules: true
        },
        "myapp--cluster--braveman--",
        hadRule,
        {
          value: "application"
        },
        1
      )
    ).toEqual(undefined);
  });
});

// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { removeMeta } from "../../../../lib/client/design-helper";

describe("removeMeta", () => {
  const resource = {
    annotations: {
      "apps.open-cluster-management.io/git-commit":
        "0e808e90d2d0f1877b8089e6303d041fc7be8584",
      "apps.open-cluster-management.io/github-branch": "master",
      "apps.open-cluster-management.io/github-path":
        "resources/application/demo-saude-digital",
      "apps.open-cluster-management.io/deployables": "a,b,c"
    },
    generation: 1,
    name: "demo-saude-digital",
    namespace: "demo-saude-digital",
    resourceVersion: "43426571",
    _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/demo-saude-digital/applications/demo-saude-digital",
    status: {
      lastUpdateTime: "2020-07-14T14:02:35Z",
      phase: "Propagated"
    }
  };

  const resourceNoGitInfo = {
    annotations: {
      "apps.open-cluster-management.io/deployables": "a,b,c"
    },
    generation: 1,
    name: "demo-saude-digital",
    namespace: "demo-saude-digital",
    resourceVersion: "43426571",
    _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/demo-saude-digital/applications/demo-saude-digital",
    status: {
      lastUpdateTime: "2020-07-14T14:02:35Z",
      phase: "Propagated"
    }
  };

  it("return removeMeta value show annotation with git info", () => {
    const output = removeMeta(resource);
    const expectedOutput = {
      _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
      annotations: {
        "apps.open-cluster-management.io/git-commit":
          "0e808e90d2d0f1877b8089e6303d041fc7be8584",
        "apps.open-cluster-management.io/github-branch": "master",
        "apps.open-cluster-management.io/github-path":
          "resources/application/demo-saude-digital"
      },
      generation: 1,
      name: "demo-saude-digital",
      namespace: "demo-saude-digital",
      resourceVersion: "43426571"
    };
    expect(output).toEqual(expectedOutput);
  });

  it("return removeMeta value delete annotation when no git info", () => {
    const output = removeMeta(resourceNoGitInfo);
    const expectedOutput = {
      _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
      generation: 1,
      name: "demo-saude-digital",
      namespace: "demo-saude-digital",
      resourceVersion: "43426571"
    };
    expect(output).toEqual(expectedOutput);
  });
});

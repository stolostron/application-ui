// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { getNodeTooltips } from "../../../../../../src-web/components/Topology/viewer/defaults/tooltips";

const locale = "en-US";
const searchUrl = "https://localhost/search";

describe("getNodeTooltips PV orange", () => {
  const pvNodeOrange = {
    name: "mynode",
    namespace: "default",
    type: "persistent_volume",
    specs: {
      pulse: "orange"
    }
  };

  const expectedResult = [
    { name: "Persistent Volume", value: "mynode" },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:default"}',
      name: "Namespace",
      value: "default"
    }
  ];
  it("should get PV node tooltips with no ref to search", () => {
    expect(getNodeTooltips(searchUrl, pvNodeOrange, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips PV", () => {
  const pvNode = {
    name: "mynode",
    namespace: "default",
    type: "persistent_volume"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:persistentvolume name:mynode namespace:default"}',
      name: "Persistent Volume",
      value: "mynode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:default"}',
      name: "Namespace",
      value: "default"
    }
  ];
  it("should get PV node tooltips", () => {
    expect(getNodeTooltips(searchUrl, pvNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeTooltips PVC", () => {
  const pvcNode = {
    name: "foonode",
    namespace: "microservice",
    type: "persistent_volume_claim"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:persistentvolumeclaim name:foonode namespace:microservice"}',
      name: "Persistent Volume Claim",
      value: "foonode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:microservice"}',
      name: "Namespace",
      value: "microservice"
    }
  ];
  it("should get PVC node tooltips", () => {
    expect(getNodeTooltips(searchUrl, pvcNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeTooltips placements", () => {
  const rulesNode = {
    name: "barnode",
    namespace: "bar",
    type: "placements"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:placementrule name:barnode namespace:bar"}',
      name: "Placements",
      value: "barnode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:bar"}',
      name: "Namespace",
      value: "bar"
    }
  ];
  it("should get rules node tooltips", () => {
    expect(getNodeTooltips(searchUrl, rulesNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips helmrelease", () => {
  const clusterNode = {
    name: "nginx-ingress",
    namespace: "",
    type: "helmrelease"
  };
  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:helmrelease nginx-ingress"}',
      name: "Helmrelease",
      value: "nginx-ingress"
    }
  ];

  it("should get cluster node tooltips helmrelease", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips cluster", () => {
  const clusterNode = {
    name: "foonode",
    namespace: "foo",
    type: "cluster",
    specs: {
      cluster: {
        consoleURL: "https://localhost"
      }
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:cluster name:foonode"}',
      name: "Cluster",
      value: "foonode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:foo"}',
      name: "Namespace",
      value: "foo"
    }
  ];
  it("should get cluster node tooltips cluster", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips clusterList", () => {
  const clusterNode = {
    name: "foonode, foonode2, foonode3",
    namespace: "foo",
    type: "cluster",
    specs: {
      cluster: {
        consoleURL: "https://localhost"
      }
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:cluster name:foonode,foonode2,foonode3"}',
      name: "Cluster",
      value: "foonode, foonode2, foonode3"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:foo"}',
      name: "Namespace",
      value: "foo"
    }
  ];
  it("should get cluster node tooltips clusterList", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips clusters", () => {
  const clusterNode = {
    name: "foonode",
    namespace: "foo",
    type: "cluster",
    specs: {
      clusters: [
        {
          metadata: {
            name: "ocpcluster1"
          },
          consoleURL: "https://localhost"
        },
        {
          metadata: {
            name: "ekscluster2"
          },
          consoleip: "111.11.11.11"
        }
      ]
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:cluster name:foonode"}',
      name: "Cluster",
      value: "foonode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:foo"}',
      name: "Namespace",
      value: "foo"
    }
  ];
  it("should get cluster node tooltips clusters", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips default", () => {
  const defaultNode = {
    name: "defaultnode",
    namespace: "defaultnode",
    type: "application"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:application name:defaultnode namespace:defaultnode"}',
      name: "Application",
      value: "defaultnode"
    },
    {
      href:
        'https://localhost/search?filters={"textsearch":"kind:namespace name:defaultnode"}',
      name: "Namespace",
      value: "defaultnode"
    }
  ];
  it("should get default node tooltips default", () => {
    expect(getNodeTooltips(searchUrl, defaultNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips package", () => {
  const defaultNode = {
    name: "defaultnode",
    namespace: "defaultnode",
    type: "package"
  };

  const expectedResult = [];
  it("should get nothing", () => {
    expect(getNodeTooltips(searchUrl, defaultNode, locale)).toEqual(
      expectedResult
    );
  });
});

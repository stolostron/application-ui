// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

"use strict";

import { updatePropagationPolicy } from "../../../../../src-web/components/ArgoCreationPage/controlData/controlData";
import {
  getGitBranches,
  getUniqueChannelName,
  setAvailableArgoServer,
  setAvailableRules,
  setAvailableChannelSpecs,
  updateChannelControls
} from "../../../../../src-web/components/ArgoCreationPage/controlData/utils";
import { updateDisplayForPlacementControls } from "../../../../../src-web/components/ArgoCreationPage/controlData/ControlDataPlacement";

const controlDataNS = [
  {
    id: "namespace",
    active: true,
    availableData: {}
  },
  { id: "userDefinedNamespace" },
  {
    id: "channels",
    controlMapArr: [
      {
        clusterSelector: {
          id: "clusterSelector",
          active: {
            mode: "",
            clusterLabelsList: [
              { id: 0, labelName: "", labelValue: "", validValue: true }
            ],
            clusterLabelsListID: 1
          }
        },
        available: []
      },
      {
        "local-cluster-checkbox": {
          active: false,
          id: "local-cluster-checkbox"
        }
      },
      {
        "online-cluster-only-checkbox": {
          active: false,
          id: "online-cluster-only-checkbox"
        }
      },
      {
        placementrulecombo: {
          active: false,
          id: "placementrulecombo",
          ns: "aa-ns"
        }
      },
      {
        selectedRuleName: {
          id: "selectedRuleName",
          actve: "result-pr"
        }
      }
    ]
  }
];

describe("Select updatePropagationPolicy should render propagationPolicy", () => {
  const urlControl = {
    id: "prunePropagationPolicy",
    active: true
  };
  const controlData = [
    {
      id: "propagationPolicy",
      type: "hidden"
    }
  ];
  const result = [
    {
      id: "propagationPolicy",
      type: "singleselect"
    }
  ];
  it("Should return propagationPolicy", () => {
    expect(updatePropagationPolicy(urlControl, controlData)).toEqual(result);
  });
});

describe("getGitBranches", () => {
  const groupControlData = [
    {
      id: "githubURL",
      active: "https://github.com/fxiang1/app-samples",
      available: ["urlPath"]
    },
    {
      id: "githubBranch",
      active: "aa",
      available: ["aa"]
    }
  ];

  it("getGitBranches valid url", () => {
    expect(getGitBranches(groupControlData)).toEqual(Promise.resolve({}));
  });
});

describe("getGitBranches", () => {
  const groupControlData = [
    {
      id: "githubURL",
      active: "",
      available: ["urlPath"]
    },
    {
      id: "githubBranch",
      active: "",
      available: ["aa"]
    }
  ];

  it("getGitBranches no url", () => {
    expect(getGitBranches(groupControlData)).toEqual(Promise.resolve({}));
  });
});

describe("setAvailableRules", () => {
  const urlControl = {
    id: "placementrulecombo",
    ns: "aa-ns",
    active: "placement-1",
    availableData: {}
  };
  const model = {
    data: {
      placements: [
        {
          metadata: {
            name: "dev-clusters",
            namespace: "aa-ns"
          }
        }
      ]
    }
  };
  const result = {
    active: "placement-1",
    available: ["dev-clusters"],
    availableData: {
      "dev-clusters": { metadata: { name: "dev-clusters", namespace: "aa-ns" } }
    },
    availableMap: {},
    exception:
      "Placement {0} does not exist in this environment. Choose another rule or create a new one.",
    id: "placementrulecombo",
    isLoading: false,
    ns: "aa-ns"
  };

  it("setAvailableRules no error", () => {
    expect(setAvailableRules(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableRules", () => {
  const urlControl = {
    id: "placementrulecombo",
    ns: "aa-ns",
    active: true,
    availableData: {}
  };
  const model = {
    error: "error msg",
    data: {}
  };
  const result = {
    active: true,
    available: [],
    availableData: {},
    availableMap: {},
    id: "placementrulecombo",
    isFailed: true,
    isLoading: false,
    ns: "aa-ns"
  };
  it("setAvailableRules with error", () => {
    expect(setAvailableRules(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableRules", () => {
  const urlControl = {
    id: "placementrulecombo",
    ns: "aa-ns",
    active: true,
    availableData: {
      loading: "loading message",
      data: {}
    }
  };
  const model = {
    loading: "data loading"
  };
  const result = {
    active: true,
    available: [],
    availableData: { data: {}, loading: "loading message" },
    availableMap: {},
    id: "placementrulecombo",
    isLoading: "data loading",
    ns: "aa-ns"
  };
  it("setAvailableRules loading", () => {
    expect(setAvailableRules(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableChannelSpecs", () => {
  const type = "git";
  const urlControl = {
    id: "channel",
    active: true,
    availableData: {}
  };
  const model = {
    data: {
      items: [
        {
          type: "git",
          metadata: {
            name: "aa-ns"
          },
          objectPath: "https://github.com/fxiang1/app-samples.git"
        }
      ]
    }
  };
  const result = {
    id: "channel",
    active: true,
    availableData: {
      "https://github.com/fxiang1/app-samples.git": {
        type: "git",
        metadata: { name: "aa-ns" },
        objectPath: "https://github.com/fxiang1/app-samples.git"
      }
    },
    available: ["https://github.com/fxiang1/app-samples.git"],
    availableMap: {},
    isLoaded: true,
    isLoading: false
  };
  it("setAvailableChannelSpecs no error", () => {
    expect(setAvailableChannelSpecs(type, urlControl, model)).toEqual(result);
  });
  const helmModel = {
    data: {
      items: [
        {
          type: "helm",
          metadata: {
            name: "aa-ns-1"
          },
          objectPath:
            "http://multiclusterhub-repo.open-cluster-management.svc.cluster.local:3000/charts"
        },
        {
          type: "helm",
          metadata: {
            name: "aa-ns-2"
          },
          objectPath: "https://charts.bitnami.com/bitnami"
        },
        {
          type: "helm",
          metadata: {
            name: "aa-ns-3"
          },
          objectPath: ""
        }
      ]
    }
  };
  const helmResult = {
    id: "channel",
    active: true,
    availableData: {
      "https://charts.bitnami.com/bitnami": {
        type: "helm",
        metadata: { name: "aa-ns-2" },
        objectPath: "https://charts.bitnami.com/bitnami"
      },
      "": {
        type: "helm",
        metadata: { name: "aa-ns-3" },
        objectPath: ""
      }
    },
    available: ["", "https://charts.bitnami.com/bitnami"],
    availableMap: {},
    isLoaded: true,
    isLoading: false
  };
  it("setAvailableChannelSpecs exclude MCH helm repo", () => {
    expect(setAvailableChannelSpecs("helm", urlControl, helmModel)).toEqual(
      helmResult
    );
  });
});

describe("setAvailableChannelSpecs", () => {
  const type = "git";
  const urlControl = {
    id: "channel",
    active: true,
    availableData: {}
  };
  const model = {
    error: "error msg",
    data: {}
  };
  const result = {
    active: true,
    available: [],
    availableData: {},
    availableMap: {},
    id: "channel",
    isFailed: true,
    isLoading: false
  };
  it("setAvailableChannelSpecs with error", () => {
    expect(setAvailableChannelSpecs(type, urlControl, model)).toEqual(result);
  });
});

describe("setAvailableChannelSpecs", () => {
  const type = "git";
  const urlControl = {
    id: "channel",
    active: true,
    availableData: {}
  };
  const model = {
    loading: "loading data",
    data: {}
  };
  const result = {
    active: true,
    available: [],
    availableData: {},
    availableMap: {},
    id: "channel",
    isLoading: "loading data"
  };
  it("setAvailableChannelSpecs loading", () => {
    expect(setAvailableChannelSpecs(type, urlControl, model)).toEqual(result);
  });
});

describe("setAvailableArgoServer", () => {
  const urlControl = {
    id: "argoServer",
    active: true,
    availableData: {}
  };
  const model = {
    loading: false,
    data: {
      data: {
        argoServers: {
          argoServerNS: [{ name: "openshift-gitops" }]
        }
      }
    }
  };
  const result = {
    id: "argoServer",
    active: true,
    available: ["openshift-gitops"],
    availableData: {
      "openshift-gitops": {
        name: "openshift-gitops"
      }
    },
    availableMap: {},
    isLoaded: true,
    isLoading: false
  };
  it("setAvailableArgoServer no error", () => {
    expect(setAvailableArgoServer(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableArgoServer", () => {
  const urlControl = {
    id: "argoServer",
    active: true,
    availableData: {}
  };
  const model = {
    loading: false,
    data: {},
    error: "failed to fetch"
  };
  const result = {
    id: "argoServer",
    active: true,
    available: [],
    availableData: {},
    availableMap: {},
    exception:
      "Failed to load the Argo server. Make sure the Argo server is installed and the GitOpsCluster resouce is created successfully.",
    isLoaded: true,
    isLoading: false,
    isFailed: true
  };
  it("setAvailableArgoServer error", () => {
    expect(setAvailableArgoServer(urlControl, model)).toEqual(result);
  });
});

describe("updateChannelControls", () => {
  const data = {
    id: "githubUrl",
    active: "",
    availableData: [],
    groupControlData: [
      {
        id: "channelName",
        type: "hidden",
        active: ""
      },
      {
        id: "channelNamespace",
        type: "hidden",
        active: ""
      },
      {
        id: "channelNamespaceExists",
        type: "hidden",
        active: true
      },
      {
        id: "githubURL",
        active: "",
        available: ["urlPath"]
      },
      {
        id: "githubBranch",
        active: "aaa",
        available: ["aa"]
      },
      {
        id: "githubUser",
        active: "user"
      },
      {
        id: "githubAccessId",
        active: "token"
      },
      {
        id: "prune",
        type: ""
      },
      {
        id: "pruneLast",
        type: ""
      },
      {
        id: "replace",
        type: ""
      }
    ]
  };

  const result = [
    { active: true, availableData: {}, id: "namespace" },
    { id: "userDefinedNamespace" },
    {
      controlMapArr: [
        {
          available: [],
          clusterSelector: {
            active: {
              clusterLabelsList: [
                { id: 0, labelName: "", labelValue: "", validValue: true }
              ],
              clusterLabelsListID: 1,
              mode: ""
            },
            id: "clusterSelector"
          }
        },
        {
          "local-cluster-checkbox": {
            active: false,
            id: "local-cluster-checkbox"
          }
        },
        {
          "online-cluster-only-checkbox": {
            active: false,
            id: "online-cluster-only-checkbox"
          }
        },
        {
          placementrulecombo: {
            active: false,
            id: "placementrulecombo",
            ns: "aa-ns"
          }
        },
        { selectedRuleName: { actve: "result-pr", id: "selectedRuleName" } }
      ],
      id: "channels"
    }
  ];
  it("updateChannelControls valid url", () => {
    expect(updateChannelControls(data, controlDataNS)).toEqual(result);
  });
});

describe("updateDisplayForPlacementControls", () => {
  const urlControl = {
    active: true
  };
  const globalControl = [
    {
      id: "decisionResourceName",
      type: ""
    },
    {
      id: "clusterSelector",
      type: ""
    }
  ];

  const result = [
    {
      id: "decisionResourceName",
      type: "combobox"
    },
    {
      id: "clusterSelector",
      type: "hidden"
    }
  ];
  it("getUniqueChannelName", () => {
    expect(
      updateDisplayForPlacementControls(urlControl, globalControl)
    ).toEqual(result);
  });
});

describe("getUniqueChannelName", () => {
  const channelUrl =
    "https://github.com/ianzhang366/ac11m-applifecycle-samples";
  const groupControlData = [
    {
      id: "channelType",
      active: ["github"]
    }
  ];

  const result = "ggithubcom-ianzhang366-ac11m-applifecycle-samples";
  it("getUniqueChannelName", () => {
    expect(getUniqueChannelName(channelUrl, groupControlData)).toEqual(result);
  });
});

describe("getUniqueChannelName", () => {
  const channelUrl =
    "https://github.com/ianzhang366/ac11m-applifecycle-samples/with/path/longer/than/60/characters/test/long";
  const groupControlData = [
    {
      id: "channelType",
      active: ["github"]
    }
  ];

  const result = "gle-samples-with-path-longer-than-60-characters-test-long";
  it("getUniqueChannelName shortens long URLs", () => {
    expect(getUniqueChannelName(channelUrl, groupControlData)).toEqual(result);
  });
});

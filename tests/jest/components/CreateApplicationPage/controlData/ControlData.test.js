/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

"use strict";

import { updateNSControls } from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlData";

import {
  updatePlacementControlsForLocal,
  reverseExistingRule,
  updateDisplayForPlacementControls
} from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlDataPlacement";

import { templateObject, placementControlData } from "./TestData";

import {
  updateGitCredentials,
  validateBranch
} from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlDataGit";

import {
  setAvailableRules,
  setAvailableNSSpecs,
  setAvailableChannelSpecs,
  getGitBranches,
  updateNewRuleControlsData,
  updateChannelControls,
  setAvailableSecrets,
  getUniqueChannelName
} from "../../../../../src-web/components/ApplicationCreationPage/controlData/utils";

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

describe("updateChannelControls", () => {
  const data = {
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

describe("validateBranch", () => {
  const validGitBranches = [
    "main",
    "release-2.1",
    "main/resource/abc",
    "main@abc"
  ];
  const invalidGitBranches = [
    "foo/bar.lock/hello",
    "main..123",
    "main.",
    "main/.abc",
    "/main",
    "main/",
    "main/.lock",
    "main:12",
    "abc~",
    "main:",
    "abc?a",
    "abc*a",
    "abc[a",
    "main@{",
    "main.",
    "abc//efg",
    "main^",
    "@"
  ];

  validGitBranches.forEach(branch => {
    it("verify valid Git branch", () => {
      expect(validateBranch(branch)).toEqual(true);
    });
  });

  invalidGitBranches.forEach(branch => {
    it("verify invalid Git branch", () => {
      expect(validateBranch(branch)).toEqual(false);
    });
  });
});

describe("updateGitCredentials", () => {
  const data = {
    active: "",
    availableData: [],
    groupControlData: [
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
      }
    ]
  };

  const result = [
    { active: "", available: ["urlPath"], id: "githubURL" },
    { active: "", available: [], id: "githubBranch" },
    { active: "user", id: "githubUser" },
    { active: "token", id: "githubAccessId" }
  ];

  it("updateGitCredentials valid url", () => {
    expect(updateGitCredentials(data)).toEqual(result);
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

describe("getGitBranches", () => {
  const groupControlData = [
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
    }
  ];

  it("getGitBranches with user and pwd", () => {
    expect(getGitBranches(groupControlData)).toEqual(Promise.resolve({}));
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
      "https://github.com/fxiang1/app-samples.git [ns/aa-ns]": {
        type: "git",
        metadata: { name: "aa-ns" },
        objectPath: "https://github.com/fxiang1/app-samples.git"
      }
    },
    available: ["https://github.com/fxiang1/app-samples.git [ns/aa-ns]"],
    availableMap: {},
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
      "https://charts.bitnami.com/bitnami [ns/aa-ns-2]": {
        type: "helm",
        metadata: { name: "aa-ns-2" },
        objectPath: "https://charts.bitnami.com/bitnami"
      },
      " [ns/aa-ns-3]": {
        type: "helm",
        metadata: { name: "aa-ns-3" },
        objectPath: ""
      }
    },
    available: [
      " [ns/aa-ns-3]",
      "https://charts.bitnami.com/bitnami [ns/aa-ns-2]"
    ],
    availableMap: {},
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

describe("setAvailableNSSpecs", () => {
  const urlControl = {
    id: "namespace",
    active: true,
    availableData: {}
  };
  const model = {
    data: {
      items: [
        {
          metadata: {
            name: "aa-ns"
          }
        }
      ]
    }
  };
  const result = {
    active: true,
    available: ["aa-ns"],
    availableData: { "aa-ns": { metadata: { name: "aa-ns" } } },
    availableMap: {},
    id: "namespace",
    isLoading: false
  };

  it("setAvailableNSSpecs no error", () => {
    expect(setAvailableNSSpecs(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableSecrets", () => {
  const urlControl = {
    id: "namespace",
    active: true,
    availableData: {}
  };
  const model = {
    data: {
      secrets: [
        {
          metadata: {
            name: "aa-ns"
          }
        }
      ]
    }
  };
  const result = {
    active: true,
    available: ["undefined"],
    availableData: { undefined: { metadata: { name: "aa-ns" } } },
    availableMap: {
      undefined: {
        replacements: {
          metadata: {
            name: "aa-ns"
          }
        }
      }
    },
    hasReplacements: true,
    id: "namespace",
    isLoading: false
  };

  it("setAvailableSecrets no error", () => {
    expect(setAvailableSecrets(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableSecrets", () => {
  const urlControl = {
    id: "namespace",
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
    hasReplacements: true,
    id: "namespace",
    isFailed: true,
    isLoading: false
  };
  it("setAvailableSecrets error", () => {
    expect(setAvailableSecrets(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableSecrets", () => {
  const urlControl = {
    id: "namespace",
    active: true,
    availableData: {}
  };
  const model = {
    loading: "loading message",
    data: {}
  };
  const result = {
    active: true,
    available: [],
    availableData: {},
    hasReplacements: true,
    id: "namespace",
    isLoading: "loading message"
  };
  it("setAvailableSecrets loading", () => {
    expect(setAvailableSecrets(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableNSSpecs", () => {
  const urlControl = {
    id: "namespace",
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
    id: "namespace",
    isFailed: true,
    isLoading: false
  };
  it("setAvailableNSSpecs with error", () => {
    expect(setAvailableNSSpecs(urlControl, model)).toEqual(result);
  });
});

describe("setAvailableNSSpecs", () => {
  const urlControl = {
    id: "namespace",
    active: true,
    availableData: {}
  };
  const model = {
    loading: "loading message",
    data: {}
  };
  const result = {
    active: true,
    available: [],
    availableData: {},
    availableMap: {},
    id: "namespace",
    isLoading: "loading message"
  };
  it("setAvailableNSSpecs loading", () => {
    expect(setAvailableNSSpecs(urlControl, model)).toEqual(result);
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
    data: {
      placementrules: [
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
    active: null,
    available: ["dev-clusters"],
    availableData: {
      "dev-clusters": { metadata: { name: "dev-clusters", namespace: "aa-ns" } }
    },
    availableMap: {},
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

describe("updateNSControls with existing NS and no channel selection", () => {
  const urlControl = {
    id: "namespace",
    active: "acmtest-helmrepo-ns-sub",
    availableData: { "acmtest-helmrepo-ns-sub": {} }
  };
  const controlData = [
    { id: "userDefinedNamespace" },
    {
      channels: {
        controlMapArr: []
      }
    }
  ];
  const result = [
    { active: "", id: "userDefinedNamespace" },
    { channels: { controlMapArr: [] } }
  ];
  it("should return no PR when no channel selection", () => {
    expect(updateNSControls(urlControl, controlData)).toEqual(result);
  });
});

describe("updateNSControls with new NS AND channel selection", () => {
  const urlControl = {
    active: "aa-ns",
    availableData: {
      "acmtest-helmrepo-ns-sub": {},
      "aa-ns": {
        metadata: {
          name: "aa-ns"
        }
      }
    }
  };

  const result = [
    { active: true, availableData: {}, id: "namespace" },
    { active: "", id: "userDefinedNamespace" },
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
  it("should return new user data", () => {
    expect(updateNSControls(urlControl, controlDataNS)).toEqual(result);
  });
});

describe("updateNewRuleControlsData without controls", () => {
  const selectedPR = {
    raw: {
      spec: {
        clusterConditions: [
          {
            type: "ManagedClusterConditionAvailable",
            status: "true"
          }
        ]
      }
    }
  };
  const placementControl = {
    "local-cluster-checkbox": {
      active: true,
      id: "local-cluster-checkbox"
    },
    "online-cluster-only-checkbox": {
      active: false,
      id: "online-cluster-only-checkbox"
    },
    placementrulecombo: {
      active: false,
      id: "placementrulecombo",
      ns: "aa-ns"
    },
    selectedRuleName: {
      id: "selectedRuleName",
      active: "result-pr"
    },
    clusterSelector: {
      id: "clusterSelector",
      type: "custom",
      available: [],
      active: {
        mode: false,
        clusterLabelsListID: 1,
        clusterLabelsList: [
          { id: 0, labelName: "", labelValue: "", validValue: true }
        ]
      }
    }
  };

  const result = {
    clusterSelector: {
      active: {
        clusterLabelsList: [
          { id: 0, labelName: "", labelValue: "", validValue: true }
        ],
        clusterLabelsListID: 1,
        mode: false
      },
      available: [],
      id: "clusterSelector",
      type: "hidden"
    },
    "local-cluster-checkbox": {
      active: true,
      id: "local-cluster-checkbox",
      type: "hidden"
    },
    "online-cluster-only-checkbox": {
      active: true,
      disabled: true,
      id: "online-cluster-only-checkbox",
      type: "checkbox"
    },
    placementrulecombo: {
      active: false,
      id: "placementrulecombo",
      ns: "aa-ns"
    },
    selectedRuleName: { active: "result-pr", id: "selectedRuleName" }
  };
  it("should return same data", () => {
    expect(updateNewRuleControlsData(selectedPR, placementControl)).toEqual(
      result
    );
  });
});

describe("updatePlacementControls without controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    groupControlData: [
      {
        "local-cluster-checkbox": {
          active: true,
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
          active: "result-pr"
        }
      }
    ]
  };
  const result = [
    {
      "local-cluster-checkbox": { active: true, id: "local-cluster-checkbox" }
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
    { selectedRuleName: { active: "result-pr", id: "selectedRuleName" } }
  ];
  it("should return same data", () => {
    expect(updatePlacementControlsForLocal(placementControl)).toEqual(result);
  });
});

describe("updatePlacementControls with controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    groupControlData: [
      {
        id: "local-cluster-checkbox",
        type: "checkbox"
      },
      {
        id: "online-cluster-only-checkbox",
        type: "checkbox"
      },
      {
        id: "clusterSelector",
        type: "custom"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    {
      id: "online-cluster-only-checkbox",
      type: "checkbox",
      disabled: false,
      active: false
    },
    { id: "clusterSelector", type: "custom" }
  ];
  it("should return all data", () => {
    expect(updatePlacementControlsForLocal(placementControl)).toEqual(result);
  });
});

describe("updatePlacementControls with controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    active: true,
    groupControlData: [
      {
        id: "local-cluster-checkbox",
        type: "checkbox"
      },
      {
        id: "online-cluster-only-checkbox",
        type: "checkbox"
      },
      {
        id: "clusterSelector",
        type: "custom"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    { id: "online-cluster-only-checkbox", type: "hidden", active: false },
    { id: "clusterSelector", type: "hidden" }
  ];
  it("should return local only", () => {
    expect(updatePlacementControlsForLocal(placementControl)).toEqual(result);
  });
});

describe("reverseExistingRule with template data", () => {
  const result = {
    active: "-placement-1",
    groupControlData: [
      {
        id: "selectedRuleName",
        type: "hidden"
      },
      {
        available: [],
        controlId: "existingrule-checkbox",
        groupControlData: [
          {
            id: "local-cluster-checkbox",
            type: "checkbox"
          },
          {
            id: "placementrulecombo",
            type: "singleselect"
          },
          {
            id: "online-cluster-only-checkbox",
            type: "checkbox"
          },
          {
            id: "selectedRuleName",
            type: "hidden"
          },
          {
            active: {},
            controlId: "clusterSelector",
            id: "clusterSelector",
            type: "hidden"
          }
        ],
        id: "existingrule-checkbox",
        type: "checkbox"
      }
    ],
    id: "placementrulecombo",
    type: "singleselect"
  };
  it("should return non null", () => {
    expect(reverseExistingRule(placementControlData, templateObject)).toEqual(
      result
    );
  });
});

describe("updateDisplayForPlacementControls", () => {
  const existingRuleCb = placementControlData.groupControlData.find(
    ({ id }) => id === "existingrule-checkbox"
  );
  const result = [
    {
      id: "selectedRuleName",
      type: "hidden"
    },
    {
      available: [],
      controlId: "existingrule-checkbox",
      groupControlData: [
        {
          active: false,
          id: "local-cluster-checkbox",
          type: "checkbox"
        },
        {
          active: "",
          id: "placementrulecombo",
          type: "hidden"
        },
        {
          active: false,
          disabled: false,
          id: "online-cluster-only-checkbox",
          type: "checkbox"
        },
        {
          active: "",
          id: "selectedRuleName",
          type: "hidden"
        },
        {
          active: {
            clusterLabelsList: [
              {
                id: 0,
                labelName: "",
                labelValue: "",
                validValue: false
              }
            ],
            clusterLabelsListID: 1,
            mode: true
          },
          controlId: "clusterSelector",
          id: "clusterSelector",
          type: "custom"
        }
      ],
      id: "existingrule-checkbox",
      type: "checkbox"
    }
  ];
  it("should return placement rule with selected placement rule combo hidden", () => {
    expect(
      updateDisplayForPlacementControls(
        existingRuleCb,
        placementControlData.groupControlData
      )
    ).toEqual(result);
  });
});

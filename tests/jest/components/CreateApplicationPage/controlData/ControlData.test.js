/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

"use strict";

import { updateNSControls } from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlData";

import { updatePlacementControlsForLocal } from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlDataPlacement";

import { updateGitCredentials } from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlDataGit";

import {
  setAvailableRules,
  setAvailableNSSpecs,
  setAvailableChannelSpecs,
  getGitBranches,
  updateNewRuleControlsData,
  updateChannelControls,
  updatePrePostControls,
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

describe("updatePrePostControls", () => {
  const data = {
    active: "secretName",
    availableData: [],
    groupControlData: [
      {
        id: "ansibleTowerHost",
        type: "hidden",
        active: ""
      },
      {
        id: "ansibleTowerToken",
        type: "hidden",
        active: ""
      }
    ]
  };

  const result = {
    active: "secretName",
    availableData: [],
    groupControlData: [
      { active: "", id: "ansibleTowerHost", type: "text" },
      { active: "", id: "ansibleTowerToken", type: "password" }
    ]
  };
  it("updatePrePostControls new secret", () => {
    expect(updatePrePostControls(data, controlDataNS)).toEqual(result);
  });
});

describe("updatePrePostControls", () => {
  const data = {
    active: "secretName",
    availableData: { secretName: {} },
    groupControlData: [
      {
        id: "ansibleTowerHost",
        type: "hidden",
        active: ""
      },
      {
        id: "ansibleTowerToken",
        type: "hidden",
        active: ""
      }
    ]
  };

  const result = {
    active: "secretName",
    availableData: { secretName: {} },
    groupControlData: [
      { active: "", id: "ansibleTowerHost", type: "hidden" },
      { active: "", id: "ansibleTowerToken", type: "hidden" }
    ]
  };
  it("updatePrePostControls existing secret", () => {
    expect(updatePrePostControls(data, controlDataNS)).toEqual(result);
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
          }
        }
      ]
    }
  };
  const result = {
    active: true,
    available: ["undefined"],
    availableData: { undefined: { metadata: { name: "aa-ns" }, type: "git" } },
    availableMap: {},
    id: "channel",
    isLoading: false
  };
  it("setAvailableChannelSpecs no error", () => {
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
    availableMap: {},
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
    availableMap: {},
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
    availableMap: {},
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
    active: true,
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
    { id: "online-cluster-only-checkbox", type: "hidden" },
    { id: "clusterSelector", type: "hidden" }
  ];
  it("should return local only", () => {
    expect(updatePlacementControlsForLocal(placementControl)).toEqual(result);
  });
});

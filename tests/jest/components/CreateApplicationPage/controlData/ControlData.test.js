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

import {
  updateNSControls,
  updatePlacementControls,
  updateDisplayForPlacementControls
} from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlData";

import { setAvailableRules } from "../../../../../src-web/components/ApplicationCreationPage/controlData/utils";

const controlDataNS = [
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
    active: "",
    available: ["dev-clusters"],
    availableData: {
      "dev-clusters": { metadata: { name: "dev-clusters", namespace: "aa-ns" } }
    },
    availableMap: {},
    id: "placementrulecombo",
    isLoading: false,
    ns: "aa-ns"
  };

  it("setAvailableRules", () => {
    expect(setAvailableRules(urlControl, model)).toEqual(result);
  });
});

describe("updateDisplayForPlacementControls", () => {
  const urlControl = {
    id: "existingrule-checkbox",
    active: true,
    availableData: { "acmtest-helmrepo-ns-sub": {} }
  };
  const result = {
    available: [],
    clusterSelector: {
      active: {
        clusterLabelsList: [
          { id: 0, labelName: "", labelValue: "", validValue: true }
        ],
        clusterLabelsListID: 1,
        mode: false
      },
      id: "clusterSelector",
      type: "hidden"
    }
  };
  it("updateDisplayForPlacementControls", () => {
    expect(
      updateDisplayForPlacementControls(urlControl, controlDataNS)
    ).toEqual(result);
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
  const result = { id: "userDefinedNamespace" };
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

  const result = { id: "userDefinedNamespace" };
  it("should return new user data", () => {
    expect(updateNSControls(urlControl, controlDataNS)).toEqual(result);
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
          actve: "result-pr"
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
    { selectedRuleName: { actve: "result-pr", id: "selectedRuleName" } }
  ];
  it("should return same data", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
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
      },
      {
        id: "clusterReplicas",
        type: "text"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    { id: "online-cluster-only-checkbox", type: "checkbox" },
    { id: "clusterSelector", type: "custom" },
    { id: "clusterReplicas", type: "text" }
  ];
  it("should return all data", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
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
      },
      {
        id: "clusterReplicas",
        type: "text"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    { id: "online-cluster-only-checkbox", type: "hidden" },
    { id: "clusterSelector", type: "hidden" },
    { id: "clusterReplicas", type: "hidden" }
  ];
  it("should return local only", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
  });
});

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getNumRemoteSubs,
  createApplicationLink,
  LabelWithOptionalTooltip
} from "../../../src-web/definitions/hcm-applications";

const query_data1 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2020-01-30T15:47:53Z",
  remoteSubscriptionStatusCount: {
    Subscribed: 4,
    Failed: 5,
    null: 3
  },
  podStatusCount: {
    Running: 4,
    Error: 5,
    ImagePullBackOff: 3,
    ContainerCreating: 6,
    Ready: 8
  },
  clusterCount: 4,
  hubSubscriptions: [
    {
      _uid: "local-cluster/66426f24-3bd3-11ea-a488-00000a100f99",
      status: "Propagated",
      channel: "dev1/dev1"
    },
    {
      _uid: "local-cluster/bdced01f-3bd4-11ea-a488-00000a100f99",
      status: null,
      channel: "dev1/dev1"
    },
    {
      _uid: "local-cluster/b218636d-3d5e-11ea-8ed1-00000a100f99",
      status: "Propagated",
      channel: "default/mortgage-channel"
    }
  ]
};

const query_data2 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2020-01-30T15:47:53Z",
  remoteSubscriptionStatusCount: {
    Subscribed: 4
  }
};

const result1 = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: [
      {
        _owner: null,
        _store: {},
        key: "1",
        props: { labelText: 12 },
        ref: null
      },
      {
        _owner: null,
        _store: {},
        key: null,
        props: { children: " | " },
        ref: null,
        type: "span"
      },
      {
        _owner: null,
        _store: {},
        key: "2",
        props: {
          description: "Failed",
          iconName: "failed-status",
          labelText: 5
        },
        ref: null
      },
      {
        _owner: null,
        _store: {},
        key: "3",
        props: {
          description: "No status",
          iconName: "no-status",
          labelText: 3
        },
        ref: null
      }
    ]
  },
  ref: null,
  type: "ul"
};
const result2 = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: [
      {
        _owner: null,
        _store: {},
        key: "1",
        props: { labelText: 4 },
        ref: null
      },
      false,
      {
        _owner: null,
        _store: {},
        key: "2",
        props: {
          description: "Failed",
          iconName: "failed-status",
          labelText: 0
        },
        ref: null
      },
      {
        _owner: null,
        _store: {},
        key: "3",
        props: {
          description: "No status",
          iconName: "no-status",
          labelText: 0
        },
        ref: null
      }
    ]
  },
  ref: null,
  type: "ul"
};
const noItem = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: [
      {
        _owner: null,
        _store: {},
        key: "1",
        props: { labelText: 0 },
        ref: null
      },
      false,
      {
        _owner: null,
        _store: {},
        key: "2",
        props: {
          description: "Failed",
          iconName: "failed-status",
          labelText: 0
        },
        ref: null
      },
      {
        _owner: null,
        _store: {},
        key: "3",
        props: {
          description: "No status",
          iconName: "no-status",
          labelText: 0
        },
        ref: null
      }
    ]
  },
  ref: null,
  type: "ul"
};

describe("getNumRemoteSubs", () => {
  it("should return remote subscriptions count", () => {
    expect(JSON.parse(JSON.stringify(getNumRemoteSubs(query_data1)))).toEqual(
      result1
    );
  });
  it("should return 4 subscribed, no errors", () => {
    expect(JSON.parse(JSON.stringify(getNumRemoteSubs(query_data2)))).toEqual(
      result2
    );
  });
  it("should return no data", () => {
    expect(JSON.parse(JSON.stringify(getNumRemoteSubs()))).toEqual(noItem);
  });
});

describe("createApplicationLink", () => {
  it("should return the app link ", () => {
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: { children: "val", replace: false, to: "undefined/default/val" },
      ref: null
    };
    expect(
      JSON.parse(JSON.stringify(createApplicationLink(query_data1)))
    ).toEqual(result);
  });
});

describe("LabelWithOptionalTooltip", () => {
  it("show failed tooltip ", () => {
    const props = {
      description: "Failed",
      iconName: "failed-status",
      labelText: 10
    };
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: {
        children: [
          {
            _owner: null,
            _store: {},
            key: null,
            props: {
              children: {
                _owner: null,
                _store: {},
                key: null,
                props: {
                  alt: "",
                  height: "10px",
                  src: "undefined/graphics/failed-status.svg",
                  style: { marginRight: "4px" },
                  width: "10px"
                },
                ref: null,
                type: "img"
              },
              direction: "top",
              tooltipText: "Failed"
            },
            ref: null
          },
          {
            _owner: null,
            _store: {},
            key: null,
            props: {
              children: 10,
              style: { fontSize: "14px", paddingRight: "8px" }
            },
            ref: null,
            type: "p"
          }
        ],
        style: { alignItems: "center", display: "inline-flex" }
      },
      ref: null,
      type: "div"
    };
    expect(JSON.parse(JSON.stringify(LabelWithOptionalTooltip(props)))).toEqual(
      result
    );
  });
  it("show failed tooltip, with label, no icon", () => {
    const props = { description: "Failed", labelText: 10 };
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: {
        children: [
          null,
          {
            _owner: null,
            _store: {},
            key: null,
            props: {
              children: 10,
              style: { fontSize: "14px", paddingRight: "8px" }
            },
            ref: null,
            type: "p"
          }
        ],
        style: { alignItems: "center", display: "inline-flex" }
      },
      ref: null,
      type: "div"
    };
    expect(JSON.parse(JSON.stringify(LabelWithOptionalTooltip(props)))).toEqual(
      result
    );
  });
  it("show no text and no icon, label ", () => {
    const props = { description: "Failed" };
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: { style: { fontSize: "14px" } },
      ref: null,
      type: "p"
    };
    expect(JSON.parse(JSON.stringify(LabelWithOptionalTooltip(props)))).toEqual(
      result
    );
  });
  it("show no text and icon ", () => {
    const props = { description: "Failed", iconName: "failed-status" };
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: {},
      ref: null,
      type: "span"
    };
    expect(JSON.parse(JSON.stringify(LabelWithOptionalTooltip(props)))).toEqual(
      result
    );
  });
  it("show no description ", () => {
    const props = {};
    const result = {
      _owner: null,
      _store: {},
      key: null,
      props: { style: { fontSize: "14px" } },
      ref: null,
      type: "p"
    };
    expect(JSON.parse(JSON.stringify(LabelWithOptionalTooltip(props)))).toEqual(
      result
    );
  });
});

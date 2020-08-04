/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import {
  getStandaloneSubsWithInvalidChannel,
  getStandaloneSubscriptions,
  getDataByKind
} from "../../../../../../src-web/components/ApplicationDeploymentPipeline/components/PipelineGrid/utils";

import {
  resultSubscriptionsWithChannel,
  resultNoApps
} from "../../../../components/ReducersTestingData";

describe("getDataByKind", () => {
  // basic test cases

  it("subscriptions empty", () => {
    expect(getDataByKind(undefined, "")).toEqual({});
  });
});

// filter out subscriptions that have an app
describe("getStandaloneSubscriptions", () => {
  // subscriptions empty
  const subEmpty = [];
  // subscriptions with related empty
  const subRelatedEmpty = [
    { name: "n1", related: [] },
    { name: "n2", related: [] }
  ];
  // subscriptions with related with app
  const subRelatedWithApp = [
    { related: [{ kind: "application", name: "app1" }] }
  ];
  // // subscriptions with related with no app
  const subRelatedWithNoApp = [
    { related: [{ kind: "channel", name: "channel1" }] }
  ];

  const subRelatedMixed = [
    { related: [{ kind: "channel", name: "channel1" }] },
    { related: [{ kind: "blah" }] },
    { related: [{ kind: "application", name: "app1" }] },
    { related: [{ kind: "application", name: "app2" }] },
    { related: [] }
  ];

  const subRelatedMixedResult = [
    { related: [{ kind: "channel", name: "channel1" }] },
    { related: [{ kind: "blah" }] },
    { related: [] }
  ];

  // basic test cases
  it("subscriptions empty", () => {
    expect(getStandaloneSubscriptions(subEmpty)).toEqual([]);
  });

  it("subscriptions with related empty", () => {
    expect(getStandaloneSubscriptions(subRelatedEmpty)).toEqual(
      subRelatedEmpty
    );
  });
  it("subscriptions with related with app", () => {
    expect(getStandaloneSubscriptions(subRelatedWithApp)).toEqual([]);
  });
  it("subscriptions with related with no app", () => {
    expect(getStandaloneSubscriptions(subRelatedWithNoApp)).toEqual(
      subRelatedWithNoApp
    );
  });
  it("subscriptions with mixed elements, two app", () => {
    expect(getStandaloneSubscriptions(subRelatedMixed)).toEqual(
      subRelatedMixedResult
    );
  });

  // test cases with sample data
  it("subscription sample data with channel", () => {
    expect(getStandaloneSubscriptions(resultSubscriptionsWithChannel)).toEqual(
      resultSubscriptionsWithChannel
    );
  });

  it("subscription sample data with no apps", () => {
    expect(getStandaloneSubscriptions(resultNoApps)).toEqual(resultNoApps);
  });
});

describe("getStandaloneSubsWithInvalidChannel", () => {
  const channels = [
    {
      id: "mortgageds-channel",
      name: "mortgageds-channel",
      namespace: "mortgageds-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "mortgagedc-ch/mortgagedc-channel",
                name: "mortgagedc-subscription",
                namespace: "default",
                _uid: "sharingpenguin/263279e0-6e73-41ff-a508-49a5d1f8db4d"
              },
              {
                channel: "mortgageds-ch/mortgageds-channel",
                name: "mortgageds-subscription",
                namespace: "default",
                _uid: "local-cluster/15c0a160-3a6e-4ad3-b8ca-768d0a3a2d4f"
              }
            ]
          }
        ]
      }
    },
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "gbapp-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "gbapp-ch/guestbook-app-latest",
                name: "guestbook-app",
                namespace: "default",
                _uid: "local-cluster/0da0a2a1-0677-44c5-8f45-8789d7b2ed33"
              }
            ]
          }
        ]
      }
    },
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "deploy-git",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "deploy-git/guestbook-app-latest",
                name: "guestbook-app",
                namespace: "app-guestbook-git-ns",
                _uid: "local-cluster/418fd062-58e4-4fe3-8428-de665dd5e4a4"
              }
            ]
          }
        ]
      }
    },
    {
      id: "cassandra-channel",
      name: "cassandra-channel",
      namespace: "cassandra-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "cassandra-ch/cassandra-channel",
                name: "cassandra-app-subscription",
                namespace: "default",
                _uid: "local-cluster/64511c0d-8ec5-4257-a318-79e8d04ad7ff"
              }
            ]
          }
        ]
      }
    },
    {
      id: "mortgage-channel",
      name: "mortgage-channel",
      namespace: "mortgage-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "mortgage-ch/mortgage-channel",
                name: "mortgage-app-subscription",
                namespace: "default",
                _uid: "local-cluster/d7166152-0d08-41c2-9de3-bfdee7f20c6f"
              }
            ]
          }
        ]
      }
    },
    {
      id: "predev-ch",
      name: "predev-ch",
      namespace: "ns-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "ns-ch/predev-ch",
                name: "nginx",
                namespace: "ns-sub-1",
                _uid: "local-cluster/4f527825-435b-403d-aaa7-14a84b2de34b"
              }
            ]
          }
        ]
      }
    },
    {
      id: "git-helm-ch",
      name: "git-helm-ch",
      namespace: "demo-ns-helm-git-ch",
      data: {
        related: [
          {
            kind: "subscription",
            items: [
              {
                channel: "demo-ns-helm-git-ch/git-helm-ch",
                name: "demo-subscription",
                namespace: "demo-ns-helm-git",
                _uid: "local-cluster/cd5e6048-6d85-4851-97d6-348ce929f3dc"
              }
            ]
          }
        ]
      }
    }
  ];

  const subscriptions = [
    {
      name: "val1",
      namespace: "default",
      _uid: "local-cluster/681fbe7e-a960-4b04-96eb-de67e33df82d",
      channel: "aa/bb",
      kind: "subscription",
      status: "PropagationFailed"
    },
    {
      name: "harry-sub-1",
      namespace: "default",
      _uid: "local-cluster/908288fc-ac88-40e5-9006-ef9ac42deaa3",
      channel: "mortgagedc-channel",
      kind: "subscription",
      status: "PropagationFailed"
    },
    {
      name: "obj-sub2",
      namespace: "obj-sub2-ns",
      _uid: "local-cluster/15c0a160-3a6e-4ad3-b8ca-768d0a3a2d4f",
      channel: "ch-obj2/dev2",
      kind: "subscription",
      status: "Propagated"
    },
    {
      name: "demo-subscription",
      namespace: "demo-ns",
      _uid: "local-cluster/cd5e6048-6d85-4851-97d6-348ce929f3dc",
      channel: "demo-ns/somechannel",
      kind: "subscription",
      status: "Propagated"
    }
  ];

  const validSubscriptions = [
    {
      name: "val1",
      namespace: "default",
      _uid: "local-cluster/4f527825-435b-403d-aaa7-14a84b2de34b",
      channel: "aa/bb",
      kind: "subscription",
      status: "PropagationFailed"
    },
    {
      name: "harry-sub-1",
      namespace: "default",
      _uid: "local-cluster/64511c0d-8ec5-4257-a318-79e8d04ad7ff",
      channel: "mortgagedc-channel",
      kind: "subscription",
      status: "PropagationFailed"
    },
    {
      name: "obj-sub2",
      namespace: "obj-sub2-ns",
      _uid: "local-cluster/15c0a160-3a6e-4ad3-b8ca-768d0a3a2d4f",
      channel: "ch-obj2/dev2",
      kind: "subscription",
      status: "Propagated"
    },
    {
      name: "demo-subscription",
      namespace: "demo-ns",
      _uid: "local-cluster/cd5e6048-6d85-4851-97d6-348ce929f3dc",
      channel: "demo-ns/somechannel",
      kind: "subscription",
      status: "Propagated"
    }
  ];

  const subsWithInvalidChannel = [
    {
      _uid: "local-cluster/681fbe7e-a960-4b04-96eb-de67e33df82d",
      channel: "aa/bb",
      kind: "subscription",
      name: "val1",
      namespace: "default",
      status: "PropagationFailed"
    },
    {
      _uid: "local-cluster/908288fc-ac88-40e5-9006-ef9ac42deaa3",
      channel: "mortgagedc-channel",
      kind: "subscription",
      name: "harry-sub-1",
      namespace: "default",
      status: "PropagationFailed"
    }
  ];

  it("return subscriptions for some subscriptions with invalid channel", () => {
    expect(
      getStandaloneSubsWithInvalidChannel(channels, subscriptions)
    ).toEqual(subsWithInvalidChannel);
  });

  it("return empty list for subscriptions with valid channels", () => {
    expect(
      getStandaloneSubsWithInvalidChannel(channels, validSubscriptions)
    ).toEqual([]);
  });
});

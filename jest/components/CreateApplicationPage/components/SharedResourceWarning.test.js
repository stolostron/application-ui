// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

jest.mock("../../../../../lib/client/apollo-client", () => ({
  search: jest.fn((_, { input: [query] }) => {
    const response = (item, relatedApps, relatedSubs) => ({
      data: {
        searchResult: [
          {
            items: [item],
            related: [
              {
                kind: "application",
                items: [
                  {
                    name: "app-1",
                    namespace: "foo"
                  },
                  ...relatedApps
                ]
              },
              {
                kind: "subscription",
                items: relatedSubs
              }
            ]
          }
        ]
      }
    });

    const { filters } = query;
    const name = filters.find(f => f.property === "name").values[0];
    let item = {};
    let relatedApps = [];
    let relatedSubs = [];
    switch (name) {
      case "sub-1":
        relatedApps = [
          { name: "shared-sub-app-1" },
          { name: "shared-sub-app-2" },
          { name: "shared-sub-app-3", _hostingSubscription: "bar/sub-1" },
          { name: "app-1", namespace: "bar" }
        ];
        break;
      case "sub-2":
        relatedApps = [
          {
            name: "child-app-1",
            _hostingSubscription: "foo/sub-2",
            cluster: "local-cluster"
          },
          {
            name: "child-app-2",
            _hostingSubscription: "foo/sub-2-local",
            cluster: "local-cluster"
          },
          {
            name: "child-app-3",
            _hostingSubscription: "bar/sub-2-local",
            cluster: "local-cluster"
          }, // exclude - namespace
          {
            name: "child-app-4",
            _hostingSubscription: "foo/sub-2-local",
            cluster: "other"
          } // exclude - cluster
        ];
        relatedSubs = [
          {
            name: "sub-2-local",
            namespace: "foo",
            _hostingSubscription: "foo/sub-2",
            cluster: "local-cluster"
          },
          {
            name: "sub-2-local",
            namespace: "bar",
            _hostingSubscription: "foo/sub-2",
            cluster: "local-cluster"
          }, // exclude - namespace
          {
            name: "child-sub-1",
            namespace: "foo",
            _hostingSubscription: "foo/sub-2",
            cluster: "local-cluster"
          },
          {
            name: "child-sub-2-local",
            namespace: "foo",
            _hostingSubscription: "foo/sub-2",
            cluster: "local-cluster"
          },
          {
            name: "child-sub-3",
            namespace: "foo",
            _hostingSubscription: "foo/sub-2",
            cluster: "other"
          } // exclude - cluster
        ];
        break;
      case "sub-3":
        item = { _hostingSubscription: "bar/some-other-sub" };
        break;
      case "sub-4":
        relatedApps = [
          { name: "shared-sub-app-1" },
          { name: "shared-sub-app-2" },
          {
            name: "child-app-1",
            _hostingSubscription: "foo/sub-4",
            cluster: "local-cluster"
          },
          {
            name: "child-app-2",
            _hostingSubscription: "foo/sub-4-local",
            cluster: "local-cluster"
          }
        ];
        break;
      case "pr-1":
        relatedApps = [
          { name: "shared-pr-app-1" },
          { name: "shared-pr-app-2" }
        ];
        break;
      case "pr-3":
        item = { _hostingSubscription: "bar/some-other-sub" };
        break;
    }
    return Promise.resolve(response(item, relatedApps, relatedSubs));
  })
}));

import React from "react";
import { act, create } from "react-test-renderer";
import SharedResourceWarning from "../../../../../src-web/components/ApplicationCreationPage/components/SharedResourceWarning";
import { RESOURCE_TYPES } from "../../../../../lib/shared/constants";

const creationControl = {};

const editingControl = (sub, pr) => ({
  editMode: true,
  groupControlData: [
    {
      id: "channel",
      content: [
        {
          id: "selfLinks",
          active: {
            Application:
              "/apis/app.k8s.io/v1beta1/namespaces/foo/applications/app-1",
            Subscription: `/apis/apps.open-cluster-management.io/v1/namespaces/foo/subscriptions/${sub}`,
            PlacementRule: `/apis/apps.open-cluster-management.io/v1/namespaces/foo/placementrules/${pr}`
          }
        }
      ]
    }
  ]
});

let creationMode;
act(() => {
  creationMode = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_SUBSCRIPTIONS}
      control={creationControl}
    />
  );
});

let sharedSubscription;
act(() => {
  sharedSubscription = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_SUBSCRIPTIONS}
      control={editingControl("sub-1", "pr-1")}
    />
  );
});

let subscriptionWithChildren;
act(() => {
  subscriptionWithChildren = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_SUBSCRIPTIONS}
      control={editingControl("sub-2", "pr-1")}
    />
  );
});

let deployedSubscription;
act(() => {
  deployedSubscription = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_SUBSCRIPTIONS}
      control={editingControl("sub-3", "pr-1")}
    />
  );
});

let sharedSubscriptionWithChildren;
act(() => {
  sharedSubscriptionWithChildren = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_SUBSCRIPTIONS}
      control={editingControl("sub-4", "pr-1")}
    />
  );
});

let sharedPR;
act(() => {
  sharedPR = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_PLACEMENT_RULES}
      control={editingControl("sub-1", "pr-1")}
    />
  );
});

let exclusivePR;
act(() => {
  exclusivePR = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_PLACEMENT_RULES}
      control={editingControl("sub-1", "pr-2")}
    />
  );
});

let deployedPR;
act(() => {
  deployedPR = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_PLACEMENT_RULES}
      control={editingControl("sub-1", "pr-3")}
    />
  );
});

const sharedMessage = /This application uses a shared/;
const childMessage = /This subscription deploys the following resources/;
const deployedMessage = /This application uses a .* resource that is deployed by the subscription/;

describe("SharedResourceWarning", () => {
  it("renders empty for creation mode", () => {
    expect(creationMode.toJSON()).toBeNull();
  });

  it("renders correctly for a shared subscription", () => {
    const json = JSON.stringify(sharedSubscription.toJSON());
    expect(json).toMatch(sharedMessage);
    expect(json).not.toMatch(childMessage);
    expect(json).toMatch(/app-1, shared-sub-app-1, shared-sub-app-2/);
    expect(json).not.toMatch(/shared-sub-app-3/);
  });

  it("renders correctly for a subscription with children", () => {
    const json = JSON.stringify(subscriptionWithChildren.toJSON());
    expect(json).not.toMatch(sharedMessage);
    expect(json).toMatch(childMessage);
    expect(json).toMatch(
      /child-app-1 \[Application\], child-app-2 \[Application\], child-sub-1 \[Subscription\], child-sub-2-local \[Subscription\], sub-2-local \[Subscription\]/
    );
    expect(json).not.toMatch(/child-app-3/);
    expect(json).not.toMatch(/child-app-4/);
    expect(json).not.toMatch(/child-sub-3/);
  });

  it("renders correctly for a subscription deployed by another subscription", () => {
    const json = JSON.stringify(deployedSubscription.toJSON());
    expect(json).not.toMatch(sharedMessage);
    expect(json).not.toMatch(childMessage);
    expect(json).toMatch(deployedMessage);
  });

  it("renders correctly for a shared subscription with children", () => {
    const json = JSON.stringify(sharedSubscriptionWithChildren.toJSON());
    expect(json).toMatch(sharedMessage);
    expect(json).toMatch(childMessage);
    expect(json).toMatch(/shared-sub-app-1, shared-sub-app-2/);
    expect(json).toMatch(
      /child-app-1 \[Application\], child-app-2 \[Application\]/
    );
  });

  it("renders correctly for a shared placement rule", () => {
    const json = JSON.stringify(sharedPR.toJSON());
    expect(json).toMatch(sharedMessage);
    expect(json).not.toMatch(childMessage);
    expect(json).toMatch(/shared-pr-app-1, shared-pr-app-2/);
  });

  it("renders correctly for a exclusive placement rule", () => {
    expect(exclusivePR.toJSON()).toBeNull();
  });

  it("renders correctly for a placement rule deployed by another subscription", () => {
    const json = JSON.stringify(deployedPR.toJSON());
    expect(json).not.toMatch(sharedMessage);
    expect(json).not.toMatch(childMessage);
    expect(json).toMatch(deployedMessage);
  });
});

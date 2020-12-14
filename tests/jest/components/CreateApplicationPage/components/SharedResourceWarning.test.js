// Copyright (c) 2020 Red Hat, Inc.
"use strict";

jest.mock("../../../../../lib/client/apollo-client", () => ({
  search: jest.fn((_, { input: [query] }) => {
    const response = relatedApps => ({
      data: {
        searchResult: [
          {
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
              }
            ]
          }
        ]
      }
    });

    const { filters } = query;
    const name = filters.find(f => f.property === "name").values[0];
    let relatedApps;
    switch (name) {
      case "sub-1":
        relatedApps = [
          { name: "shared-sub-app-1" },
          { name: "shared-sub-app-2" },
          { name: "shared-sub-app-3", _hostingSubscription: "bar/sub-1" },
          { name: "app-1", namespace: "bar" }
        ];
        break;
      case "pr-1":
        relatedApps = [
          { name: "shared-pr-app-1" },
          { name: "shared-pr-app-2" }
        ];
        break;
      case "pr-2":
        relatedApps = [];
        break;
    }
    return Promise.resolve(response(relatedApps));
  })
}));

import React from "react";
import { act, create } from "react-test-renderer";
import SharedResourceWarning from "../../../../../src-web/components/ApplicationCreationPage/components/SharedResourceWarning";
import { RESOURCE_TYPES } from "../../../../../lib/shared/constants";

const creationControl = {};

const editingControl = pr => ({
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
            Subscription:
              "/apis/apps.open-cluster-management.io/v1/namespaces/foo/subscriptions/sub-1",
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
      control={editingControl("pr-1")}
    />
  );
});

let sharedPR;
act(() => {
  sharedPR = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_PLACEMENT_RULES}
      control={editingControl("pr-1")}
    />
  );
});

let exclusivePR;
act(() => {
  exclusivePR = create(
    <SharedResourceWarning
      resourceType={RESOURCE_TYPES.HCM_PLACEMENT_RULES}
      control={editingControl("pr-2")}
    />
  );
});

describe("SharedResourceWarning", () => {
  it("renders empty for creation mode", () => {
    expect(creationMode.toJSON()).toBeNull();
  });

  it("renders correctly for a shared subscription", () => {
    expect(sharedSubscription.toJSON()).toMatchSnapshot();
  });

  it("renders correctly for a shared placement rule", () => {
    expect(sharedPR.toJSON()).toMatchSnapshot();
  });

  it("renders correctly for a exclusive placement rule", () => {
    expect(exclusivePR.toJSON()).toBeNull();
  });
});

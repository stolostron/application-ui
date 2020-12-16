/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";

jest.mock("../../../../lib/client/access-helper", () => ({
  canCallAction: jest.fn(() => {
    const data = {
      data: {
        userAccess: {
          allowed: true
        }
      }
    };
    return Promise.resolve(data);
  })
}));

jest.mock("../../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  remove: jest.fn(() => {
    const data = {
      error: ""
    };
    return Promise.resolve(data);
  }),
  getUserAccess: jest.fn(() => {
    const data = {
      userAccess: {
        allowed: true
      }
    };
    return Promise.resolve(data);
  }),
  getApplication: jest.fn(({ name, namespace }) => {
    if (name === "childApp") {
      const childAppData = {
        data: {
          application: {
            metadata: {
              annotations: {
                "apps.open-cluster-management.io/deployables": "",
                "apps.open-cluster-management.io/hosting-subscription":
                  "default/test-subscription-6-local"
              }
            }
          }
        }
      };
      return Promise.resolve(childAppData);
    }
    if (name === "multiLevelApp") {
      const multiLevelAppData = {
        data: {
          application: {
            metadata: {
              annotations: {
                "apps.open-cluster-management.io/deployables": ""
              },
              labels: null,
              name: "sahar-multilevel-app",
              namespace: "sahar-multilevel-app-ns"
            },
            name: "sahar-multilevel-app",
            namespace: "sahar-multilevel-app-ns",
            app: {
              apiVersion: "app.k8s.io/v1beta1",
              kind: "Application",
              metadata: {
                name: "sahar-multilevel-app",
                namespace: "sahar-multilevel-app-ns"
              }
            },
            subscriptions: [
              {
                apiVersion: "apps.open-cluster-management.io/v1",
                kind: "Subscription",
                metadata: {
                  name: "sahar-multilevel-app-subscription-1",
                  namespace: "sahar-multilevel-app-ns"
                },
                channels: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "Channel",
                    metadata: {
                      name: "kevin-multilevel-channel",
                      namespace: "kevin-multilevel-channel"
                    }
                  }
                ],
                rules: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "PlacementRule",
                    metadata: {
                      name: "sahar-multilevel-app-placement-1",
                      namespace: "sahar-multilevel-app-ns"
                    }
                  }
                ]
              },
              {
                apiVersion: "apps.open-cluster-management.io/v1",
                kind: "Subscription",
                metadata: {
                  name: "sahar-multilevel-app-subscription-2",
                  namespace: "sahar-multilevel-app-ns"
                },
                channels: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "Channel",
                    metadata: {
                      name: "mortgagers-channel",
                      namespace: "mortgagers-ch"
                    }
                  }
                ],
                rules: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "PlacementRule",
                    metadata: {
                      name: "sahar-helloworld-app-placement-2",
                      namespace: "sahar-multilevel-app-ns"
                    }
                  }
                ]
              }
            ]
          }
        }
      };
      return Promise.resolve(multiLevelAppData);
    }
    const data = {
      data: {
        application: {
          metadata: {
            labels: null,
            name: "nginx-placement",
            namespace: "a--ns"
          },
          name: "nginx-placement",
          namespace: "a--ns",
          app: {
            apiVersion: "app.k8s.io/v1beta1",
            kind: "Application",
            metadata: {
              name: "nginx-placement",
              namespace: "a--ns"
            },
            spec: {
              componentKinds: [
                {
                  group: "app.ibm.com/v1alpha1",
                  kind: "Subscription"
                }
              ]
            }
          },
          subscriptions: []
        }
      },
      loading: false,
      networkStatus: 7,
      stale: false
    };

    return Promise.resolve(data);
  }),
  search: jest.fn((q, variables = {}) => {
    const resourceName = variables.input[0].filters.filter(
      f => f.property === "name"
    )[0].values[0];
    if (resourceName.includes("subscription-1")) {
      const subRelated1 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  name: "sahar-multilevel-app-subscription-1",
                  cluster: "local-cluster",
                  _hubClusterResource: "true",
                  kind: "subscription",
                  localPlacement: "false",
                  namespace: "sahar-multilevel-app-ns",
                  channel: "kevin-multilevel-channel/kevin-multilevel-channel"
                }
              ],
              related: [
                {
                  kind: "application",
                  items: [
                    {
                      namespace: "sahar-multilevel-app-ns",
                      cluster: "local-cluster",
                      name: "sahar-multilevel-app",
                      _hubClusterResource: "true",
                      kind: "application"
                    },
                    {
                      _hubClusterResource: "true",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      kind: "application",
                      cluster: "local-cluster",
                      name: "kevin-helloworld-app",
                      namespace: "sahar-multilevel-app-ns"
                    }
                  ]
                },
                {
                  kind: "subscription",
                  items: [
                    {
                      name: "sahar-multilevel-app-subscription-1-local",
                      kind: "subscription",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel",
                      localPlacement: "true",
                      cluster: "local-cluster",
                      _hubClusterResource: "true",
                      namespace: "sahar-multilevel-app-ns"
                    },
                    {
                      _hubClusterResource: "true",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      localPlacement: "false",
                      cluster: "local-cluster",
                      namespace: "sahar-multilevel-app-ns",
                      kind: "subscription",
                      name: "kevin-helloworld-app-subscription"
                    }
                  ]
                },
                {
                  kind: "placementrule",
                  items: [
                    {
                      cluster: "local-cluster",
                      kind: "placementrule",
                      label: "app=sahar-multilevel-app",
                      namespace: "sahar-multilevel-app-ns",
                      name: "sahar-multilevel-app-placement-1",
                      _hubClusterResource: "true"
                    },
                    {
                      cluster: "local-cluster",
                      namespace: "sahar-multilevel-app-ns",
                      _hubClusterResource: "true",
                      kind: "placementrule",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      name: "sahar-helloworld-app-placement-2"
                    }
                  ]
                },
                {
                  kind: "channel",
                  items: [
                    {
                      name: "kevin-multilevel-channel",
                      kind: "channel",
                      namespace: "kevin-multilevel-channel",
                      cluster: "local-cluster",
                      _hubClusterResource: "true"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(subRelated1);
    }
    if (resourceName.includes("subscription-2")) {
      const subRelated2 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  localPlacement: "false",
                  name: "sahar-multilevel-app-subscription-2",
                  cluster: "local-cluster",
                  channel: "mortgagers-ch/mortgagers-channel",
                  _hubClusterResource: "true",
                  namespace: "sahar-multilevel-app-ns",
                  kind: "subscription"
                }
              ],
              related: [
                {
                  kind: "application",
                  items: [
                    {
                      _uid:
                        "local-cluster/560b5be3-790a-4701-b485-2b2174ae687c",
                      namespace: "sahar-multilevel-app-ns",
                      cluster: "local-cluster",
                      name: "sahar-multilevel-app",
                      apiversion: "v1beta1",
                      apigroup: "app.k8s.io",
                      _hubClusterResource: "true",
                      kind: "application"
                    }
                  ]
                },
                {
                  kind: "placementrule",
                  items: [
                    {
                      cluster: "local-cluster",
                      namespace: "sahar-multilevel-app-ns",
                      _hostingDeployable:
                        "kevin-multilevel-channel/kevin-multilevel-channel-PlacementRule-sahar-helloworld-app-placement-2",
                      _hubClusterResource: "true",
                      kind: "placementrule",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      name: "sahar-helloworld-app-placement-2"
                    }
                  ]
                },
                {
                  kind: "channel",
                  items: [
                    {
                      name: "mortgagers-channel",
                      cluster: "local-cluster",
                      kind: "channel",
                      namespace: "mortgagers-ch",
                      _hubClusterResource: "true"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(subRelated2);
    }
    if (resourceName.includes("placement-1")) {
      const prRelated1 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  cluster: "local-cluster",
                  kind: "placementrule",
                  label: "app=sahar-multilevel-app",
                  namespace: "sahar-multilevel-app-ns",
                  name: "sahar-multilevel-app-placement-1",
                  _hubClusterResource: "true"
                }
              ],
              related: [
                {
                  kind: "subscription",
                  items: [
                    {
                      name: "sahar-multilevel-app-subscription-1",
                      cluster: "local-cluster",
                      _hubClusterResource: "true",
                      kind: "subscription",
                      localPlacement: "false",
                      namespace: "sahar-multilevel-app-ns",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(prRelated1);
    }
    if (resourceName.includes("placement-2")) {
      const prRelated2 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  cluster: "local-cluster",
                  namespace: "sahar-multilevel-app-ns",
                  _hubClusterResource: "true",
                  kind: "placementrule",
                  _hostingSubscription:
                    "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                  name: "sahar-helloworld-app-placement-2"
                }
              ],
              related: [
                {
                  kind: "subscription",
                  items: [
                    {
                      localPlacement: "false",
                      name: "sahar-multilevel-app-subscription-2",
                      cluster: "local-cluster",
                      channel: "mortgagers-ch/mortgagers-channel",
                      _hubClusterResource: "true",
                      namespace: "sahar-multilevel-app-ns",
                      kind: "subscription"
                    },
                    {
                      _hubClusterResource: "true",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      localPlacement: "false",
                      cluster: "local-cluster",
                      namespace: "sahar-multilevel-app-ns",
                      kind: "subscription",
                      name: "kevin-helloworld-app-subscription"
                    },
                    {
                      name: "sahar-multilevel-app-subscription-1-local",
                      kind: "subscription",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel",
                      localPlacement: "true",
                      cluster: "local-cluster",
                      _hubClusterResource: "true",
                      namespace: "sahar-multilevel-app-ns"
                    },
                    {
                      name: "sahar-multilevel-app-subscription-1",
                      cluster: "local-cluster",
                      _hubClusterResource: "true",
                      kind: "subscription",
                      localPlacement: "false",
                      namespace: "sahar-multilevel-app-ns",
                      channel:
                        "kevin-multilevel-channel/kevin-multilevel-channel"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(prRelated2);
    }
    const subRelated = {
      error: ""
    };
    return Promise.resolve(subRelated);
  })
}));

import React from "react";
import RemoveResourceModal, {
  fetchRelated,
  usedByOtherApps,
  usedByOtherSubs,
  getSubsChildResources
} from "../../../../src-web/components/modals/RemoveResourceModal";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  resourceModalData,
  resourceModalDataDel2,
  resourceModalDataChildApp,
  resourceModalDataMultiLevelApp,
  resourceModalLabels,
  resourceModalLabelsDummy
} from "./ModalsTestingData";
import { RESOURCE_TYPES } from "../../../../lib/shared/constants";
import toJson from "enzyme-to-json";
import { BrowserRouter } from "react-router-dom";

describe("RemoveResourceModal test", () => {
  const handleModalClose = jest.fn();
  const handleModalSubmit = jest.fn();
  const resourceType = { name: "HCMApplication", list: "HCMApplicationList" };
  const preloadedState = window.__PRELOADED_STATE__;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [thunkMiddleware];
  const store = createStore(
    combineReducers(reducers),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  it("renders as expected with mocked apollo client data", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalData}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component)).toMatchSnapshot();

    component
      .find(".pf-c-modal-box")
      .at(0)
      .simulate("click");
    component
      .find(".pf-c-modal-box")
      .at(0)
      .simulate("keydown");

    component
      .find(".pf-m-plain")
      .at(0)
      .simulate("click");

    component
      .find(".pf-m-secondary")
      .at(0)
      .simulate("click");

    component
      .find(".pf-m-danger")
      .at(0)
      .simulate("click");
  });

  it("renders as expected 2", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalDataDel2}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component)).toMatchSnapshot();

    component
      .find(".pf-c-modal-box")
      .at(0)
      .simulate("click");
    component
      .find(".pf-c-modal-box")
      .at(0)
      .simulate("keydown");

    component
      .find(".pf-m-plain")
      .at(0)
      .simulate("click");

    component
      .find(".pf-m-secondary")
      .at(0)
      .simulate("click");

    component
      .find(".pf-m-danger")
      .at(0)
      .simulate("click");
  });

  it("renders as expected dummy", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalData}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabelsDummy}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it("renders as expected child application with warning", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalDataChildApp}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it("renders as expected multi level application", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalDataMultiLevelApp}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should return subscription 1 related resources", async () => {
    const result1 = [
      {
        items: [
          {
            _hubClusterResource: "true",
            cluster: "local-cluster",
            kind: "application",
            name: "sahar-multilevel-app",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            cluster: "local-cluster",
            kind: "application",
            name: "kevin-helloworld-app",
            namespace: "sahar-multilevel-app-ns"
          }
        ],
        kind: "application"
      },
      {
        items: [
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1",
            _hubClusterResource: "true",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "true",
            name: "sahar-multilevel-app-subscription-1-local",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "false",
            name: "kevin-helloworld-app-subscription",
            namespace: "sahar-multilevel-app-ns"
          }
        ],
        kind: "subscription"
      },
      {
        items: [
          {
            _hubClusterResource: "true",
            cluster: "local-cluster",
            kind: "placementrule",
            label: "app=sahar-multilevel-app",
            name: "sahar-multilevel-app-placement-1",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            cluster: "local-cluster",
            kind: "placementrule",
            name: "sahar-helloworld-app-placement-2",
            namespace: "sahar-multilevel-app-ns"
          }
        ],
        kind: "placementrule"
      },
      {
        items: [
          {
            _hubClusterResource: "true",
            cluster: "local-cluster",
            kind: "channel",
            name: "kevin-multilevel-channel",
            namespace: "kevin-multilevel-channel"
          }
        ],
        kind: "channel"
      }
    ];
    const result2 = [
      "kevin-helloworld-app [Application]",
      "kevin-helloworld-app-subscription [Subscription]",
      "sahar-helloworld-app-placement-2 [PlacementRule]"
    ];
    const subName = "sahar-multilevel-app-subscription-1";
    const subNamespace = "sahar-multilevel-app-ns";
    const related = await fetchRelated(
      RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
      subName,
      subNamespace
    );
    expect(related).toEqual(result1);
    expect(usedByOtherApps(related)).toEqual(false);
    expect(getSubsChildResources(subName, subNamespace, related)).toEqual(
      result2
    );
  });

  it("should return placementrule 2 related resources", async () => {
    const result = [
      {
        items: [
          {
            _hubClusterResource: "true",
            channel: "mortgagers-ch/mortgagers-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "false",
            name: "sahar-multilevel-app-subscription-2",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "false",
            name: "kevin-helloworld-app-subscription",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1",
            _hubClusterResource: "true",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "true",
            name: "sahar-multilevel-app-subscription-1-local",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hubClusterResource: "true",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "false",
            name: "sahar-multilevel-app-subscription-1",
            namespace: "sahar-multilevel-app-ns"
          }
        ],
        kind: "subscription"
      }
    ];
    const related = await fetchRelated(
      RESOURCE_TYPES.HCM_PLACEMENT_RULES,
      "sahar-helloworld-app-placement-2",
      "sahar-multilevel-app-ns"
    );
    expect(related).toEqual(result);
    expect(
      usedByOtherSubs(
        related,
        [
          "sahar-multilevel-app-subscription-1",
          "sahar-multilevel-app-subscription-2"
        ],
        "sahar-multilevel-app-ns"
      )
    ).toEqual(true);
  });
});

/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
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
    if (name === "helloworld-simple") {
      const simpleAppData = {
        data: {
          application: {
            metadata: {
              annotations: {},
              name: "helloworld-simple",
              namespace: "helloworld-simple-ns",
              uid: "7e2f0485-9109-4d39-b25b-529c57c20b0a",
              __typename: "Metadata"
            },
            name: "helloworld-simple",
            namespace: "helloworld-simple-ns",
            app: {
              apiVersion: "app.k8s.io/v1beta1",
              kind: "Application",
              metadata: {
                annotations: {},
                name: "helloworld-simple",
                namespace: "helloworld-simple-ns",
                uid: "7e2f0485-9109-4d39-b25b-529c57c20b0a"
              }
            },
            subscriptions: [
              {
                apiVersion: "apps.open-cluster-management.io/v1",
                kind: "Subscription",
                metadata: {
                  name: "helloworld-simple-subscription-1",
                  namespace: "helloworld-simple-ns",
                  uid: "fd3dfc08-5d41-4449-b450-527bebc2509d"
                },
                spec: {
                  channel:
                    "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples",
                  placement: {
                    placementRef: {
                      kind: "PlacementRule",
                      name: "helloworld-simple-placement-1"
                    }
                  }
                },
                channels: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "Channel",
                    metadata: {
                      name: "ggithubcom-fxiang1-app-samples",
                      namespace: "ggithubcom-fxiang1-app-samples-ns",
                      uid: "5ffea57f-a6a0-4a05-9606-3f1bb75ccdab"
                    }
                  }
                ],
                rules: [
                  {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "PlacementRule",
                    metadata: {
                      name: "helloworld-simple-placement-1",
                      namespace: "helloworld-simple-ns",
                      uid: "7cf37292-8c27-4231-89da-f04c5ed78b8c"
                    }
                  }
                ]
              }
            ],
            __typename: "Application"
          }
        }
      };
      return Promise.resolve(simpleAppData);
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
          }
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
    if (resourceName.includes("helloworld-simple-subscription-1")) {
      const simpleSubRelated1 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  _uid: "local-cluster/fd3dfc08-5d41-4449-b450-527bebc2509d",
                  apigroup: "apps.open-cluster-management.io",
                  namespace: "helloworld-simple-ns",
                  _rbac:
                    "helloworld-simple-ns_apps.open-cluster-management.io_subscriptions",
                  channel:
                    "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples",
                  _gitbranch: "main",
                  localPlacement: "false",
                  _hubClusterResource: "true",
                  label: "app=helloworld-simple",
                  cluster: "local-cluster",
                  kind: "subscription",
                  name: "helloworld-simple-subscription-1",
                  _gitpath: "helloworld",
                  apiversion: "v1"
                }
              ],
              related: [
                {
                  kind: "application",
                  items: [
                    {
                      _uid:
                        "local-cluster/7e2f0485-9109-4d39-b25b-529c57c20b0a",
                      namespace: "helloworld-simple-ns",
                      cluster: "local-cluster",
                      apigroup: "app.k8s.io",
                      kind: "application",
                      name: "helloworld-simple",
                      _rbac: "helloworld-simple-ns_app.k8s.io_applications",
                      apiversion: "v1beta1",
                      _hubClusterResource: "true"
                    },
                    {
                      _uid:
                        "local-cluster/7e2f0485-9109-4d39-b25b-529c57c20b0a",
                      namespace: "helloworld-simple-ns",
                      cluster: "local-cluster",
                      apigroup: "app.k8s.io",
                      kind: "application",
                      name: "helloworld-simple",
                      _rbac: "helloworld-simple-ns_app.k8s.io_applications",
                      apiversion: "v1beta1",
                      _hubClusterResource: "true"
                    }
                  ],
                  __typename: "SearchRelatedResult"
                },
                {
                  kind: "subscription",
                  items: [
                    {
                      _uid:
                        "local-cluster/ad656683-b320-424a-aaf7-acaf2b64ba44",
                      channel:
                        "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples",
                      _gitpath: "helloworld",
                      _hostingDeployable:
                        "local-cluster/helloworld-simple-subscription-1-deployable-kkgkh",
                      _hubClusterResource: "true",
                      _gitbranch: "main",
                      _hostingSubscription:
                        "helloworld-simple-ns/helloworld-simple-subscription-1",
                      timeWindow: "none",
                      _rbac:
                        "helloworld-simple-ns_apps.open-cluster-management.io_subscriptions",
                      apigroup: "apps.open-cluster-management.io",
                      label:
                        "app=helloworld-simple; hosting-deployable-name=helloworld-simple-subscription-1-deployable; subscription-pause=false",
                      namespace: "helloworld-simple-ns",
                      name: "helloworld-simple-subscription-1-local",
                      apiversion: "v1",
                      kind: "subscription",
                      localPlacement: "true",
                      cluster: "local-cluster"
                    }
                  ],
                  __typename: "SearchRelatedResult"
                },
                {
                  kind: "placementrule",
                  items: [
                    {
                      _uid:
                        "local-cluster/7cf37292-8c27-4231-89da-f04c5ed78b8c",
                      _hubClusterResource: "true",
                      kind: "placementrule",
                      name: "helloworld-simple-placement-1",
                      apigroup: "apps.open-cluster-management.io",
                      namespace: "helloworld-simple-ns",
                      cluster: "local-cluster",
                      apiversion: "v1",
                      label: "app=helloworld-simple",
                      _rbac:
                        "helloworld-simple-ns_apps.open-cluster-management.io_placementrules"
                    }
                  ],
                  __typename: "SearchRelatedResult"
                },
                {
                  kind: "channel",
                  items: [
                    {
                      _uid:
                        "local-cluster/5ffea57f-a6a0-4a05-9606-3f1bb75ccdab",
                      type: "Git",
                      _hubClusterResource: "true",
                      apigroup: "apps.open-cluster-management.io",
                      namespace: "ggithubcom-fxiang1-app-samples-ns",
                      pathname: "https://github.com/fxiang1/app-samples.git",
                      cluster: "local-cluster",
                      kind: "channel",
                      name: "ggithubcom-fxiang1-app-samples",
                      _rbac:
                        "ggithubcom-fxiang1-app-samples-ns_apps.open-cluster-management.io_channels",
                      apiversion: "v1"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(simpleSubRelated1);
    }
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d36",
                      kind: "application"
                    },
                    {
                      _hubClusterResource: "true",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d37",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d46",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d47",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d56",
                      _hubClusterResource: "true"
                    },
                    {
                      cluster: "local-cluster",
                      namespace: "sahar-multilevel-app-ns",
                      _hubClusterResource: "true",
                      kind: "placementrule",
                      _hostingSubscription:
                        "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d57",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d66",
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
    if (resourceName.includes("helloworld-simple-placement-1")) {
      const simplePRRelated1 = {
        data: {
          searchResult: [
            {
              items: [
                {
                  _uid: "local-cluster/7cf37292-8c27-4231-89da-f04c5ed78b8c",
                  _hubClusterResource: "true",
                  kind: "placementrule",
                  name: "helloworld-simple-placement-1",
                  apigroup: "apps.open-cluster-management.io",
                  namespace: "helloworld-simple-ns",
                  cluster: "local-cluster",
                  apiversion: "v1",
                  _rbac:
                    "helloworld-simple-ns_apps.open-cluster-management.io_placementrules"
                }
              ],
              related: [
                {
                  kind: "subscription",
                  items: [
                    {
                      _uid:
                        "local-cluster/fd3dfc08-5d41-4449-b450-527bebc2509d",
                      apigroup: "apps.open-cluster-management.io",
                      namespace: "helloworld-simple-ns",
                      _rbac:
                        "helloworld-simple-ns_apps.open-cluster-management.io_subscriptions",
                      channel:
                        "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples",
                      _gitbranch: "main",
                      localPlacement: "false",
                      _hubClusterResource: "true",
                      cluster: "local-cluster",
                      kind: "subscription",
                      name: "helloworld-simple-subscription-1",
                      _gitpath: "helloworld",
                      apiversion: "v1"
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(simplePRRelated1);
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
                      localPlacement: "false",
                      name: "sahar-multilevel-app-subscription-2",
                      cluster: "local-cluster",
                      channel: "mortgagers-ch/mortgagers-channel",
                      _hubClusterResource: "true",
                      namespace: "sahar-multilevel-app-ns",
                      kind: "subscription"
                    },
                    {
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d27",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d29",
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
                      _uid:
                        "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d28",
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
  getSubChildResources
} from "../../../../src-web/components/modals/RemoveResourceModal";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  resourceModalData,
  resourceModalDataDel2,
  resourceModalDataChildApp,
  resourceModalDataSimpleApp,
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
  const resourceType = {
    name: "QueryApplications",
    list: "QueryApplicationList"
  };
  const preloadedState = window.__PRELOADED_STATE__;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [thunkMiddleware];
  const store = createStore(
    combineReducers(reducers),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  it("renders as expected without data", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
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
      .find(".pf-m-link")
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
      .find(".pf-m-link")
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

  it("renders as expected for simple application with removable subscription and placementrule", () => {
    const component = mount(
      <BrowserRouter>
        <RemoveResourceModal
          data={resourceModalDataSimpleApp}
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d36",
            cluster: "local-cluster",
            kind: "application",
            name: "sahar-multilevel-app",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d37",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d46",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d47",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d56",
            label: "app=sahar-multilevel-app",
            name: "sahar-multilevel-app-placement-1",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hostingSubscription:
              "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
            _hubClusterResource: "true",
            cluster: "local-cluster",
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d57",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d66",
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
    expect(
      usedByOtherApps(
        related,
        "sahar-multilevel-app",
        "sahar-multilevel-app-ns"
      ).length
    ).toEqual(0);
    expect(getSubChildResources(subName, subNamespace, related)).toEqual(
      result2
    );
  });

  it("should return placementrule 2 related resources", async () => {
    const result = [
      {
        items: [
          {
            _hubClusterResource: "true",
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d27",
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
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d29",
            channel: "kevin-multilevel-channel/kevin-multilevel-channel",
            cluster: "local-cluster",
            kind: "subscription",
            localPlacement: "true",
            name: "sahar-multilevel-app-subscription-1-local",
            namespace: "sahar-multilevel-app-ns"
          },
          {
            _hubClusterResource: "true",
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d28",
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
      ).length
    ).toEqual(2);
  });
});

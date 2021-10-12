/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import {
  createApplicationLink,
  createTypeCell,
  createTypeText
} from "../../../src-web/definitions/hcm-applications";

const locale = "en-US";

const query_data1 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2020-01-30T15:47:53Z",
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
  ],
  apiVersion: "app.k8s.io/v1beta1"
};

const query_data2 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2020-01-30T15:47:53Z"
};

const result1 = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: {
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
      type: "li"
    }
  },
  ref: null,
  type: "ul"
};

const result2 = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: {
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
      type: "li"
    }
  },
  ref: null,
  type: "ul"
};

const noItem = {
  _owner: null,
  _store: {},
  key: null,
  props: {
    children: {
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
      type: "li"
    }
  },
  ref: null,
  type: "ul"
};

describe("createApplicationLink", () => {
  it("should return the app link ", () => {
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
              align: "baseline",
              children: {
                _owner: null,
                _store: {},
                key: null,
                props: {
                  children: "val",
                  replace: false,
                  to: "undefined/default/val?apiVersion=app.k8s.io%2Fv1beta1"
                },
                ref: null
              }
            },
            ref: null
          },
          false
        ],
        hasGutter: true,
        style: {
          alignItems: "baseline"
        }
      },
      ref: null
    };
    expect(
      JSON.parse(JSON.stringify(createApplicationLink(query_data1)))
    ).toEqual(result);
  });
});

describe("createTypeCell", () => {
  it("should return the type cell contents ", () => {
    const data = {
      apiVersion: "argoproj.io/v1alpha1",
      applicationSet: "appset-syncpolicies",
      chart: null,
      cluster: "local-cluster",
      clusterCount: { localCount: 0, remoteCount: 0 },
      created: "2021-08-24T15:03:02Z",
      dashboard: null,
      destinationCluster: "console-managed",
      destinationNamespace: "appset-syncpolicies",
      hubChannels: [],
      hubSubscriptions: [],
      kind: "Application",
      name: "appset-syncpolicies-console-managed",
      namespace: "openshift-gitops",
      path: "helloworld",
      repoURL: "https://github.com/fxiang1/app-samples.git",
      targetRevision: "main",
      __typename: "Application",
      _uid: "local-cluster/533f9acb-b361-4b57-b338-a1389aac0844"
    };

    let result = {
      _owner: null,
      _store: {},
      key: null,
      props: {
        children: {
          _owner: null,
          _store: {},
          key: null,
          props: {
            children: {
              _owner: null,
              _store: {},
              key: null,
              props: {
                children: {
                  _owner: null,
                  _store: {},
                  key: null,
                  props: {
                    bodyContent:
                      "A sub-project of Argo CD that adds multi-cluster support for Argo CD applications.",
                    children: {
                      _owner: null,
                      _store: {},
                      key: null,
                      props: {
                        children: {
                          _owner: null,
                          _store: {},
                          key: null,
                          props: {
                            children: "Argo CD ApplicationSet",
                            style: {
                              color: "#6A6E73",
                              fontWeight: "normal"
                            }
                          },
                          ref: null,
                          type: "span"
                        }
                      },
                      ref: null
                    },
                    headerContent: "Argo CD ApplicationSet"
                  },
                  ref: null
                }
              },
              ref: null
            }
          },
          ref: null
        }
      },
      ref: null
    };

    expect(
      JSON.parse(JSON.stringify(createTypeCell(data, locale, true)))
    ).toEqual(result);
  });
});

describe("createTypeText", () => {
  it("should return the type cell text for search ", () => {
    const data = {
      apiVersion: "argoproj.io/v1alpha1",
      applicationSet: "appset-syncpolicies",
      chart: null,
      cluster: "local-cluster",
      clusterCount: { localCount: 0, remoteCount: 0 },
      created: "2021-08-24T15:03:02Z",
      dashboard: null,
      destinationCluster: "console-managed",
      destinationNamespace: "appset-syncpolicies",
      hubChannels: [],
      hubSubscriptions: [],
      kind: "Application",
      name: "appset-syncpolicies-console-managed",
      namespace: "openshift-gitops",
      path: "helloworld",
      repoURL: "https://github.com/fxiang1/app-samples.git",
      targetRevision: "main",
      __typename: "Application",
      _uid: "local-cluster/533f9acb-b361-4b57-b338-a1389aac0844"
    };

    const result = "Argo CD ApplicationSet";
    expect(createTypeText(data, locale)).toEqual(result);
  });
});

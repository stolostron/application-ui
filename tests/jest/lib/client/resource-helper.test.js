/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import lodash from "lodash";
import moment from "moment";
import {
  transform,
  getLabelsToList,
  getTabs,
  getAge,
  getResourceType
} from "../../../../lib/client/resource-helper";

describe("transform", () => {
  const resource = {
    _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
    name: "guestbook-app",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
    namespace: "default",
    dashboard: null,
    clusterCount: 1,
    remoteSubscriptionStatusCount: { Failed: 1 },
    podStatusCount: {},
    hubSubscriptions: [
      {
        _uid: "local-cluster/42e926fd-7275-4fae-820b-e9148d2e7cd2",
        status: "Propagated",
        channel: "gbapp-ch/guestbook-app-latest",
        __typename: "Subscription"
      }
    ],
    created: "1586279606",
    __typename: "Application",
    custom: {
      name: {
        key: null,
        ref: null,
        props: {
          to: "/multicloud/applications/default/guestbook-app",
          children: "guestbook-app",
          replace: false
        },
        _owner: null,
        _store: {}
      },
      clusters: 1,
      subscriptions: {
        type: "ul",
        key: null,
        ref: null,
        props: {
          children: [
            {
              key: "1",
              ref: null,
              props: { labelText: 1 },
              _owner: null,
              _store: {}
            },
            {
              type: "span",
              key: null,
              ref: null,
              props: { children: " | " },
              _owner: null,
              _store: {}
            },
            {
              key: "2",
              ref: null,
              props: {
                labelText: 1,
                iconName: "failed-status",
                description: "Failed"
              },
              _owner: null,
              _store: {}
            },
            {
              key: "3",
              ref: null,
              props: {
                labelText: 0,
                iconName: "no-status",
                description: "No status"
              },
              _owner: null,
              _store: {}
            }
          ]
        },
        _owner: null,
        _store: {}
      },
      created: "17 hours ago"
    }
  };
  const locale = "en-US";

  it("return resourceKey value", () => {
    const key = { msgKey: "table.header.applicationName", resourceKey: "name" };
    const output = transform(resource, key, locale, undefined);
    expect(output).toEqual("guestbook-app");
  });

  it("return resourceKey value", () => {
    const key = { msgKey: "table.header.namespace", resourceKey: "namespace" };
    const output = transform(resource, key, locale, undefined);
    expect(output).toEqual("default");
  });

  it("return undefined value", () => {
    const key = {
      msgKey: "table.header.managedClusters",
      resourceKey: "clusters"
    };
    const output = transform(resource, key, locale, undefined);
    expect(output).toEqual("-");
  });

  it("return timestamp value", () => {
    const key = {
      msgKey: "table.header.created",
      resourceKey: "created",
      type: "timestamp"
    };
    const output = transform(resource, key, locale, undefined);
    expect(output).toEqual("Apr 7th 2020 at 1:13 PM");
  });

  it("return transformFunction value", () => {
    const transformFun = (resource, locale, key, isSearch) => {
      let value = lodash.get(resource, key);
      return "transfomred " + value;
    };
    const key = {
      msgKey: "table.header.namespace",
      resourceKey: "namespace",
      transformFunction: transformFun
    };
    const output = transform(resource, key, locale, undefined);
    expect(output).toEqual("transfomred default");
  });
});

describe("getLabelsToList", () => {
  const item = {
    name: "guestbook-app",
    namespace: "default",
    dashboard: "",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
    _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
    created: "2020-04-06T22:27:05Z",
    apigroup: "app.k8s.io",
    cluster: "local-cluster",
    kind: "application",
    label: "",
    _hubClusterResource: "true",
    _rbac: "default_app.k8s.io_applications",
    related: [
      {
        kind: "placementrule",
        items: [
          {
            kind: "placementrule",
            name: "dev-clusters",
            namespace: "default",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/default/placementrules/dev-clusters",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            _hubClusterResource: "true",
            _rbac: "default_apps.open-cluster-management.io_placementrules",
            _uid: "local-cluster/a4d4460d-5a08-4594-9161-6fb3c8b3efea",
            created: "2020-04-06T22:26:46Z",
            cluster: "local-cluster"
          }
        ],
        __typename: "SearchRelatedResult"
      }
    ],
    custom: {
      name: {
        key: null,
        ref: null,
        props: {
          to: "/multicloud/applications/default/guestbook-app",
          children: "guestbook-app",
          replace: false
        },
        _owner: null,
        _store: {}
      },
      clusters: 0,
      subscriptions: {
        type: "ul",
        key: null,
        ref: null,
        props: {
          children: [
            {
              key: "1",
              ref: null,
              props: { labelText: 0 },
              _owner: null,
              _store: {}
            },
            false,
            {
              key: "2",
              ref: null,
              props: {
                labelText: 0,
                iconName: "failed-status",
                description: "Failed"
              },
              _owner: null,
              _store: {}
            },
            {
              key: "3",
              ref: null,
              props: {
                labelText: 0,
                iconName: "no-status",
                description: "No status"
              },
              _owner: null,
              _store: {}
            }
          ]
        },
        _owner: null,
        _store: {}
      },
      created: "20 hours ago"
    }
  };
  const locale = "en-US";

  it("return resourceKey value", () => {
    const labelsKey = "selector";
    const output = getLabelsToList(item, locale, labelsKey);
    expect(output).toEqual("-");
  });

  it("return undefined value", () => {
    const labelsKey = "annotations";
    const output = getLabelsToList(item, locale, labelsKey);
    expect(output).toEqual("-");
  });
});

describe("getTabs", () => {
  const match = { url: "/multicloud/applications" };
  const getUrl = (tab, index) =>
    index === 0 ? match.url : `${match.url}/${tab}`;

  it("return no tab", () => {
    const tabs = [];
    const output = getTabs(tabs, getUrl);
    expect(output).toEqual([]);
  });

  it("return tabs url", () => {
    const tabs = ["overview", "resources"];
    const output = getTabs(tabs, getUrl);
    const result = [
      {
        id: "overview-tab",
        label: "tabs.overview",
        url: "/multicloud/applications"
      },
      {
        id: "resources-tab",
        label: "tabs.resources",
        url: "/multicloud/applications/resources"
      }
    ];
    expect(output).toEqual(result);
  });
});

describe("getAge", () => {
  const item = {
    name: "guestbook-app",
    namespace: "default",
    dashboard: "",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
    _uid: "local-cluster/0221dae9-b6b9-40cb-8cba-473011a750e0",
    created: `${moment().format()}`,
    apigroup: "app.k8s.io",
    cluster: "local-cluster",
    kind: "application",
    label: "",
    _hubClusterResource: "true",
    _rbac: "default_app.k8s.io_applications",
    related: [
      {
        kind: "placementrule",
        items: [
          {
            kind: "placementrule",
            name: "dev-clusters",
            namespace: "default",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/default/placementrules/dev-clusters",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            _hubClusterResource: "true",
            _rbac: "default_apps.open-cluster-management.io_placementrules",
            _uid: "local-cluster/a4d4460d-5a08-4594-9161-6fb3c8b3efea",
            created: "2020-04-06T22:26:46Z",
            cluster: "local-cluster"
          }
        ],
        __typename: "SearchRelatedResult"
      }
    ],
    custom: {
      name: {
        key: null,
        ref: null,
        props: {
          to: "/multicloud/applications/default/guestbook-app",
          children: "guestbook-app",
          replace: false
        },
        _owner: null,
        _store: {}
      },
      clusters: 0,
      subscriptions: {
        type: "ul",
        key: null,
        ref: null,
        props: {
          children: [
            {
              key: "1",
              ref: null,
              props: { labelText: 0 },
              _owner: null,
              _store: {}
            },
            false,
            {
              key: "2",
              ref: null,
              props: {
                labelText: 0,
                iconName: "failed-status",
                description: "Failed"
              },
              _owner: null,
              _store: {}
            },
            {
              key: "3",
              ref: null,
              props: {
                labelText: 0,
                iconName: "no-status",
                description: "No status"
              },
              _owner: null,
              _store: {}
            }
          ]
        },
        _owner: null,
        _store: {}
      },
      created: "21 hours ago"
    }
  };
  const locale = "en-US";

  it("return age", () => {
    const timestampKey = "created";
    const output = getAge(item, locale, timestampKey);
    expect(output).toEqual("a few seconds ago");
  });

  it("return age", () => {
    const output = getAge(item, locale);
    expect(output).toEqual("a few seconds ago");
  });

  it("return age", () => {
    const timestampKey = "unknown";
    const output = getAge(item, locale, timestampKey);
    expect(output).toEqual("-");
  });
});

describe("getResourceType", () => {
  const item = {
    name: "guestbook-app",
    customType: "app",
    resourceType: "HCMApplication"
  };
  const locale = "en-US";

  it("return value by key", () => {
    const key = "customType";
    const output = getResourceType(item, locale, key);
    expect(output).toEqual("app");
  });

  it("return value by resourceType ", () => {
    const output = getResourceType(item, locale);
    expect(output).toEqual("HCMApplication");
  });
});

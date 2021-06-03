// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import _ from "lodash";
import moment from "moment";
import {
  RESOURCE_TYPES,
  transform,
  createEditLink,
  getAge,
  getResourceType,
  getClusterCount,
  getClusterCountString,
  getEditLink,
  getSearchLink,
  getShortDateTime
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

  it("return transformFunction value", () => {
    const transformFun = (resource, locale, key, isSearch) => {
      let value = _.get(resource, key);
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

describe("getShortDateTime", () => {
  const sampleDate = "2020-08-26T13:21:04Z";
  const sameDay = sampleDate;
  const sameYear = "2020-06-21T09:21:04Z";
  const futureYear = "2021-12-13T23:21:04Z";
  const locale = "en-US";

  it("omits date and year for timestamps today", () => {
    expect(getShortDateTime(sampleDate, locale, moment(sameDay))).toEqual(
      "9:21 am"
    );
  });

  it("omits year for timestamps from this year", () => {
    expect(getShortDateTime(sampleDate, locale, moment(sameYear))).toEqual(
      "Aug 26, 9:21 am"
    );
  });

  it("includes all elements for timestamps from a different year", () => {
    expect(getShortDateTime(sampleDate, locale, moment(futureYear))).toEqual(
      "Aug 26 2020, 9:21 am"
    );
  });
});

describe("getClusterCount", () => {
  it("returns 'None' when there are no remote or local clusters", () => {
    expect(
      getClusterCount({
        locale: "",
        remoteCount: 0,
        localPlacement: false,
        name: "app",
        namespace: "thenamespace",
        kind: "application",
        apigroup: "app.k8s.io"
      })
    ).toMatchSnapshot();
  });

  it("returns a string that does not include 'local' when localDeployment is false, with link", () => {
    expect(
      getClusterCount({
        locale: "",
        remoteCount: 5,
        localPlacement: false,
        name: "app",
        namespace: "thenamespace",
        kind: "application",
        apigroup: "app.k8s.io"
      })
    ).toMatchSnapshot();
  });

  it("returns a string that does not include 'remote' when there are no remote clusters, no link", () => {
    expect(
      getClusterCount({
        locale: "",
        remoteCount: 0,
        localPlacement: true,
        name: "app",
        namespace: "thenamespace",
        kind: "application",
        apigroup: "app.k8s.io"
      })
    ).toMatchSnapshot();
  });

  it("returns a string that includes both remote and local clusters when applicable, with link", () => {
    expect(
      getClusterCount({
        locale: "",
        remoteCount: 3,
        localPlacement: true,
        name: "app",
        namespace: "thenamespace",
        kind: "application",
        apigroup: "app.k8s.io"
      })
    ).toMatchSnapshot();
  });
  it("handles Argo app properties", () => {
    expect(
      getClusterCount({
        locale: "",
        remoteCount: 1,
        localPlacement: true,
        name: "app",
        namespace: "thenamespace",
        kind: "application",
        apigroup: "argoproj.io",
        clusterNames: ["local-cluster", "ui-dev-remote"]
      })
    ).toMatchSnapshot();
  });
});

describe("getClusterCountString", () => {
  it("returns 'None' when there are no remote or local clusters", () => {
    expect(getClusterCountString("", 0, false)).toEqual("None");
  });

  it("returns a string that does not include 'local' when localDeployment is false", () => {
    const result = getClusterCountString("", 5, false).toLowerCase();
    expect(result).toEqual(expect.not.stringContaining("local"));
    expect(result).toEqual(expect.stringContaining("remote"));
  });

  it("returns a string that does not include 'remote' when there are no remote clusters", () => {
    const result = getClusterCountString("", 0, true).toLowerCase();
    expect(result).toEqual(expect.stringContaining("local"));
    expect(result).toEqual(expect.not.stringContaining("remote"));
  });

  it("returns a string that includes both remote and local clusters when applicable", () => {
    const result = getClusterCountString("", 3, true).toLowerCase();
    expect(result).toEqual(expect.stringContaining("local"));
    expect(result).toEqual(expect.stringContaining("remote"));
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

describe("getSearchLink", () => {
  it("returns a bare link to search with no properties", () => {
    expect(getSearchLink()).toEqual("/search");
  });

  it("handles multiple properties", () => {
    expect(
      getSearchLink({ properties: { name: "testing", kind: "resource" } })
    ).toEqual(
      '/search?filters={"textsearch":"name%3Atesting%20kind%3Aresource"}'
    );
  });

  it("can include related resources", () => {
    expect(
      getSearchLink({
        properties: { name: "testing" },
        showRelated: "subscriptions"
      })
    ).toEqual(
      '/search?filters={"textsearch":"name%3Atesting"}&showrelated=subscriptions'
    );
  });

  it("handles array properties", () => {
    expect(
      getSearchLink({
        properties: {
          name: ["helloworld-local", "helloworld-remote"],
          namespace: ["argocd", "openshift-gitops"],
          kind: "application",
          apigroup: "argoproj.io"
        },
        showRelated: "cluster"
      })
    ).toEqual(
      '/search?filters={"textsearch":"name%3Ahelloworld-local%2Chelloworld-remote%20namespace%3Aargocd%2Copenshift-gitops%20kind%3Aapplication%20apigroup%3Aargoproj.io"}&showrelated=cluster'
    );
  });
});

describe("getEditLink should return editLink", () => {
  it("returns a url endpoint", () => {
    expect(
      getEditLink({
        name: "test-1",
        namespace: "test-1-ns",
        kind: "Application",
        cluster: "magchen-test",
        apiVersion: "v1"
      })
    ).toEqual(
      "/resources?apiversion=v1&cluster=magchen-test&kind=Application&name=test-1&namespace=test-1-ns"
    );
  });
});

describe("createEditLink", () => {
  it("returns an a tag using the item.name and item.selfLink", () => {
    expect(
      createEditLink({
        name: "foo",
        selfLink: "/api/bar",
        namespace: "boo",
        apiVersion: "app.k8s.io/v1beta1",
        kind: "Application",
        id: "id"
      })
    ).toMatchSnapshot();
  });
});

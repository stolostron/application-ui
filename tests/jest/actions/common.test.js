/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import * as actions from "../../../src-web/actions/common";

const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

const item = {
  _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
  name: "mortgage-app",
  namespace: "default",
  dashboard:
    "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
  clusterCount: 1,
  hubSubscriptions: [
    {
      _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
      status: "Propagated",
      channel: "default/mortgage-channel",
      __typename: "Subscription"
    }
  ],
  created: "2020-02-18T23:57:04Z",
  __typename: "Application"
};

const item1 = {
  _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
  kind: "application",
  name: "mortgage-app",
  namespace: "default",
  cluster: "local-cluster",
  dashboard:
    "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
  clusterCount: 1,
  hubSubscriptions: [
    {
      _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
      status: "Propagated",
      channel: "default/mortgage-channel",
      __typename: "Subscription"
    }
  ],
  created: "2020-02-18T23:57:04Z",
  __typename: "Application"
};

const err = { err: { msg: "err" } };
const ns = "default-ns";

const title = "sometitle";
const tabs = [];
const breadcrumbItems = [];
const links = [];
const resource = {};

describe("common actions ", () => {
  it("should return changeTablePage", () => {
    const page = undefined;
    const input = { page: page, pageSize: 5 };
    const expectedValue = {
      page: undefined,
      pageSize: 5,
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "TABLE_PAGE_CHANGE"
    };
    expect(actions.changeTablePage(input, resourceType)).toEqual(expectedValue);
  });

  it("should return searchTable", () => {
    const search = "test";
    const expectedValue = {
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      search: "test",
      type: "TABLE_SEARCH"
    };

    expect(actions.searchTable(search, resourceType)).toEqual(expectedValue);
  });

  it("should return sortTable", () => {
    const expectedValue = {
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      sortColumn: 0,
      sortDirection: "ASC",
      type: "TABLE_SORT"
    };

    expect(actions.sortTable("ASC", 0, resourceType)).toEqual(expectedValue);
  });

  it("should return receiveResourceSuccess", () => {
    const response = { items: [] };
    const expectedValue = {
      items: [],
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      resourceVersion: undefined,
      status: "DONE",
      type: "RESOURCE_RECEIVE_SUCCESS"
    };

    expect(actions.receiveResourceSuccess(response, resourceType)).toEqual(
      expectedValue
    );
  });

  it("should return receiveResourceError", () => {
    const expectedValue = {
      err: {
        err: {
          msg: "err"
        }
      },
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      status: "ERROR",
      type: "RESOURCE_RECEIVE_FAILURE"
    };

    expect(actions.receiveResourceError(err, resourceType)).toEqual(
      expectedValue
    );
  });

  it("should return requestResource", () => {
    const expectedValue = {
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      status: "IN_PROGRESS",
      type: "RESOURCE_REQUEST"
    };

    expect(actions.requestResource(resourceType)).toEqual(expectedValue);
  });

  it("should return addResource", () => {
    const expectedValue = {
      item: item,
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "RESOURCE_ADD"
    };

    expect(actions.addResource(item, resourceType)).toEqual(expectedValue);
  });

  it("should return modifyResource", () => {
    const expectedValue = {
      item: item,
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "RESOURCE_MODIFY"
    };

    expect(actions.modifyResource(item, resourceType)).toEqual(expectedValue);
  });

  it("should return deleteResource", () => {
    const expectedValue = {
      item: item,
      resourceType: resourceType,
      type: "RESOURCE_DELETE"
    };

    expect(actions.deleteResource(item, resourceType)).toEqual(expectedValue);
  });

  it("should return deleteResource 1", () => {
    const expectedValue = {
      item: item1,
      resourceType: "application",
      type: "RESOURCE_DELETE"
    };

    expect(actions.deleteResource(item1, resourceType)).toEqual(expectedValue);
  });

  it("should return mutateResource", () => {
    const expectedValue = {
      resourceName: "resNameTest",
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "RESOURCE_MUTATE"
    };

    expect(actions.mutateResource(resourceType, "resNameTest")).toEqual(
      expectedValue
    );
  });

  it("should return mutateResourceSuccess", () => {
    const expectedValue = {
      resourceName: "resNameTest",
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "RESOURCE_MUTATE_SUCCESS"
    };

    expect(actions.mutateResourceSuccess(resourceType, "resNameTest")).toEqual(
      expectedValue
    );
  });

  it("should return mutateResourceFailure", () => {
    const expectedValue = {
      err: {
        error: {
          err: {
            msg: "err"
          }
        }
      },
      postStatus: "ERROR",
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "RESOURCE_MUTATE_FAILURE"
    };

    expect(actions.mutateResourceFailure(resourceType, err)).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResources default app", () => {
    const expectedValue = {
      filters: [{ property: "kind", values: ["application"] }],
      keywords: [],
      relatedKinds: []
    };

    expect(actions.getQueryStringForResources("somevalue")).toEqual(
      expectedValue
    );
  });
  it("should return getQueryStringForResources channel", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["channel"]
        }
      ],
      keywords: [],
      relatedKinds: ["subscription"]
    };

    expect(actions.getQueryStringForResources("HCMChannel")).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResources subscription", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["subscription"]
        }
      ],
      keywords: [],
      relatedKinds: [
        "placementrule",
        "deployable",
        "application",
        "subscription",
        "channel"
      ]
    };

    expect(actions.getQueryStringForResources("HCMSubscription")).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResources app", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["application"]
        }
      ],
      keywords: [],
      relatedKinds: []
    };

    expect(actions.getQueryStringForResources("HCMApplication")).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResources PR", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["placementrule"]
        }
      ],
      keywords: [],
      relatedKinds: ["subscription"]
    };

    expect(actions.getQueryStringForResources("HCMPlacementRule")).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResource channel", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["channel"]
        },
        {
          property: "name",
          values: ["name"]
        },
        {
          property: "namespace",
          values: ["default-ns"]
        }
      ],
      keywords: [],
      relatedKinds: ["subscription"]
    };

    expect(actions.getQueryStringForResource("HCMChannel", "name", ns)).toEqual(
      expectedValue
    );
  });

  it("should return getQueryStringForResource app", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["application"]
        },
        {
          property: "name",
          values: ["name"]
        },
        {
          property: "namespace",
          values: ["default-ns"]
        }
      ],
      keywords: [],
      relatedKinds: []
    };

    expect(
      actions.getQueryStringForResource("HCMApplication", "name", ns)
    ).toEqual(expectedValue);
  });

  it("should return getQueryStringForResource subscription", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["subscription"]
        },
        {
          property: "name",
          values: ["name"]
        },
        {
          property: "namespace",
          values: ["default-ns"]
        }
      ],
      keywords: [],
      relatedKinds: [
        "placementrule",
        "deployable",
        "application",
        "subscription",
        "channel"
      ]
    };

    expect(
      actions.getQueryStringForResource("HCMSubscription", "name", ns)
    ).toEqual(expectedValue);
  });

  it("should return getQueryStringForResource PR", () => {
    const expectedValue = {
      filters: [
        {
          property: "kind",
          values: ["placementrule"]
        },
        {
          property: "name",
          values: ["name"]
        },
        {
          property: "namespace",
          values: ["default-ns"]
        }
      ],
      keywords: [],
      relatedKinds: ["subscription"]
    };

    expect(
      actions.getQueryStringForResource("HCMPlacementRule", "name", ns)
    ).toEqual(expectedValue);
  });

  it("should return getQueryStringForResource app 1", () => {
    const expectedValue = {
      filters: [
        { property: "kind", values: ["somename"] },
        { property: "name", values: ["name"] },
        { property: "namespace", values: ["default-ns"] }
      ],
      keywords: [],
      relatedKinds: []
    };
    expect(actions.getQueryStringForResource("somename", "name", ns)).toEqual(
      expectedValue
    );
  });

  it("should return updateSecondaryHeader", () => {
    const expectedValue = {
      breadcrumbItems: [],
      links: [],
      tabs: [],
      title: "sometitle",
      type: "SECONDARY_HEADER_UPDATE"
    };

    expect(
      actions.updateSecondaryHeader(title, tabs, breadcrumbItems, links)
    ).toEqual(expectedValue);
  });

  it("should return updateModal", () => {
    const expectedValue = {
      data: {
        __typename: "Application",
        _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
        clusterCount: 1,
        created: "2020-02-18T23:57:04Z",
        dashboard:
          "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
        hubSubscriptions: [
          {
            __typename: "Subscription",
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            channel: "default/mortgage-channel",
            status: "Propagated"
          }
        ],
        name: "mortgage-app",
        namespace: "default"
      },
      type: "MODAL_UPDATE"
    };

    expect(actions.updateModal(item)).toEqual(expectedValue);
  });

  it("should return postResource", () => {
    const expectedValue = {
      postStatus: "IN_PROGRESS",
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "POST_REQUEST"
    };

    expect(actions.postResource(resourceType)).toEqual(expectedValue);
  });

  it("should return receivePostResource", () => {
    const expectedValue = {
      item: {
        __typename: "Application",
        _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
        clusterCount: 1,
        created: "2020-02-18T23:57:04Z",
        dashboard:
          "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
        hubSubscriptions: [
          {
            __typename: "Subscription",
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            channel: "default/mortgage-channel",
            status: "Propagated"
          }
        ],
        name: "mortgage-app",
        namespace: "default"
      },
      postStatus: "DONE",
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "POST_RECEIVE_SUCCESS"
    };

    expect(actions.receivePostResource(item, resourceType)).toEqual(
      expectedValue
    );
  });

  it("should return receivePostError", () => {
    const expectedValue = {
      postStatus: "IN_PROGRESS",
      resourceType: { err: { msg: "err" } },
      type: "POST_REQUEST"
    };
    expect(actions.postResource(err, resourceType)).toEqual(expectedValue);
  });

  it("should return putResource", () => {
    const expectedValue = {
      putStatus: "IN_PROGRESS",
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "PUT_REQUEST"
    };
    expect(actions.putResource(resourceType)).toEqual(expectedValue);
  });

  it("should return receivePutResource", () => {
    const expectedValue = {
      item: {
        __typename: "Application",
        _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
        clusterCount: 1,
        created: "2020-02-18T23:57:04Z",
        dashboard:
          "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
        hubSubscriptions: [
          {
            __typename: "Subscription",
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            channel: "default/mortgage-channel",
            status: "Propagated"
          }
        ],
        name: "mortgage-app",
        namespace: "default"
      },
      putStatus: "DONE",
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "PUT_RECEIVE_SUCCESS"
    };

    expect(actions.receivePutResource(item, resourceType)).toEqual(
      expectedValue
    );
  });

  it("should return receivePutError", () => {
    const expectedValue = {
      err: { err: { msg: "err" } },
      putStatus: "ERROR",
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "PUT_RECEIVE_FAILURE"
    };
    expect(actions.receivePutError(err, resourceType)).toEqual(expectedValue);
  });

  it("should return delResource", () => {
    const expectedValue = {
      delStatus: "IN_PROGRESS",
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "DEL_REQUEST"
    };
    expect(actions.delResource(resourceType)).toEqual(expectedValue);
  });

  it("should return receiveDelResource", () => {
    const expectedValue = {
      delStatus: "DONE",
      item: {
        __typename: "Application",
        _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
        clusterCount: 1,
        created: "2020-02-18T23:57:04Z",
        dashboard:
          "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
        hubSubscriptions: [
          {
            __typename: "Subscription",
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            channel: "default/mortgage-channel",
            status: "Propagated"
          }
        ],
        name: "mortgage-app",
        namespace: "default"
      },
      resource: {},
      resourceType: {
        list: "QueryApplicationList",
        name: "QueryApplications"
      },
      type: "DEL_RECEIVE_SUCCESS"
    };
    expect(actions.receiveDelResource(item, resourceType, resource)).toEqual(
      expectedValue
    );
  });

  it("should return receiveDelError", () => {
    const expectedValue = {
      delStatus: "ERROR",
      err: { err: { msg: "err" } },
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "DEL_RECEIVE_FAILURE"
    };
    expect(actions.receiveDelError(err, resourceType)).toEqual(expectedValue);
  });

  it("should return clearRequestStatus", () => {
    const expectedValue = {
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "CLEAR_REQUEST_STATUS"
    };
    expect(actions.clearRequestStatus(resourceType)).toEqual(expectedValue);
  });

  it("should return resetResource", () => {
    const expectedValue = {
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      type: "RESOURCE_RESET"
    };
    expect(actions.resetResource(resourceType)).toEqual(expectedValue);
  });
});

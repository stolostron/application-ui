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
  secondaryHeader,
  resourceReducerFunction,
  getItems,
  getPage,
  INITIAL_STATE
} from "../../../src-web/reducers/common";

import { QueryApplicationList } from "../components/TestingData";

const dateNowStub = jest.fn(() => 1530518207007);
global.Date.now = dateNowStub;

describe("secondaryHeader creation", () => {
  it("should return a default state", () => {
    const action = {};
    const expectedValue = {
      title: "",
      tabs: [],
      breadcrumbItems: [],
      links: []
    };
    expect(secondaryHeader(undefined, action)).toEqual(expectedValue);
  });
  it("should return a state with title", () => {
    const state = {};
    const action = {
      title: "Clusters",
      tabs: "",
      breadcrumbItems: "",
      links: "",
      type: "SECONDARY_HEADER_UPDATE"
    };
    const expectedValue = {
      title: "Clusters",
      tabs: "",
      breadcrumbItems: "",
      links: ""
    };
    expect(secondaryHeader(state, action)).toEqual(expectedValue);
  });
});

describe("resourceReducerFunction", () => {
  it("should return the initial state", () => {
    const action = {
      type: "unit-test"
    };
    expect(resourceReducerFunction(undefined, action)).toEqual(INITIAL_STATE);
  });
  it("should return a state with IN_PROGRESS status", () => {
    const state = {
      test: "test",
      status: "INCEPTION"
    };
    const action = {
      status: "IN_PROGRESS",
      type: "RESOURCE_REQUEST"
    };
    const expectedValue = {
      test: "test",
      status: "IN_PROGRESS"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with DONE status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "RESOURCE_RECEIVE_SUCCESS",
      items: [],
      resourceVersion: 0
    };
    const expectedValue = {
      test: "test",
      status: "DONE",
      responseTime: 1530518207007,
      items: [],
      resourceVersion: 0
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with ERROR status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "RESOURCE_RECEIVE_FAILURE",
      err: "error"
    };
    const expectedValue = {
      test: "test",
      status: "ERROR",
      err: "error",
      responseTime: 1530518207007
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with post:IN_PROGRESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "POST_REQUEST"
    };
    const expectedValue = {
      test: "test",
      postStatus: "IN_PROGRESS"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with post:DONE status", () => {
    const state = {
      test: "test",
      items: ["test"]
    };
    const action = {
      type: "POST_RECEIVE_SUCCESS",
      item: ["test1"]
    };
    const expectedValue = {
      test: "test",
      items: ["test", "test1"],
      postStatus: "DONE"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with post:ERROR status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "POST_RECEIVE_FAILURE",
      err: {
        error: {
          response: {
            status: 404
          },
          message: "error"
        }
      }
    };
    const expectedValue = {
      test: "test",
      postStatusCode: 404,
      postErrorMsg: "error",
      postStatus: "ERROR"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with put:IN_PROGRESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "PUT_REQUEST"
    };
    const expectedValue = {
      test: "test",
      putStatus: "IN_PROGRESS"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with put:DONE status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "PUT_RECEIVE_SUCCESS"
    };
    const expectedValue = {
      test: "test",
      putStatus: "DONE"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with put:ERROR status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "PUT_RECEIVE_FAILURE",
      err: {
        error: {
          message: "error"
        }
      }
    };
    const expectedValue = {
      test: "test",
      putErrorMsg: "error",
      putStatus: "ERROR"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state with clear action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "CLEAR_REQUEST_STATUS"
    };
    const expectedValue = {
      test: "test",
      postStatus: undefined,
      postStatusCode: undefined,
      postErrorMsg: undefined,
      putStatus: undefined,
      putErrorMsg: undefined
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for table search action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "TABLE_SEARCH",
      search: "search"
    };
    const expectedValue = {
      test: "test",
      search: "search",
      page: 1
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for table sort action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "TABLE_SORT",
      sortDirection: "desc",
      sortColumn: 1
    };
    const expectedValue = {
      test: "test",
      sortDirection: "desc",
      sortColumn: 1
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for table page change action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "TABLE_PAGE_CHANGE",
      page: 1,
      pageSize: 10
    };
    const expectedValue = {
      test: "test",
      page: 1
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for a RESOURCE_FORCE_RELOAD action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "RESOURCE_FORCE_RELOAD"
    };
    const expectedValue = { forceReload: true, test: "test" };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for a RESOURCE_FORCE_RELOAD_FINISHED action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "RESOURCE_FORCE_RELOAD_FINISHED"
    };
    const expectedValue = { forceReload: false, test: "test" };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for resource delete action", () => {
    const state = {
      test: "test",
      items: ["test"]
    };
    const action = {
      type: "RESOURCE_DELETE"
    };
    const expectedValue = {
      deleteMsg: null,
      deleteStatus: "IN_PROGRESS",
      items: [],
      test: "test"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for resource delete action, no items", () => {
    const state = {
      test: "test",
      items: []
    };
    const action = {
      type: "RESOURCE_DELETE"
    };
    const expectedValue = { items: [], test: "test" };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for delete receive success action", () => {
    const state = {
      test: "test",
      items: [{ name: "test", namespace: "testns" }]
    };
    const action = {
      type: "DEL_RECEIVE_SUCCESS",
      item: {
        name: "test",
        namespace: "testns"
      }
    };
    const expectedValue = {
      deleteMsg: "test",
      deleteStatus: "DONE",
      items: [],
      test: "test"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);

    state.items = [
      { name: "test1", namespace: "testns1" },
      { name: "test", namespace: "testns" },
      { name: "test2", namespace: "testns2" }
    ];
    expectedValue.items = [
      { name: "test1", namespace: "testns1" },
      { name: "test2", namespace: "testns2" }
    ];
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);

    state.items = [
      { name: "test1", namespace: "testns1" },
      { name: "test2", namespace: "testns2" },
      { name: "test", namespace: "testns" }
    ];
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
  it("should return a state for non-existing action", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "unit-test"
    };
    const expectedValue = {
      test: "test"
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });

  it("should return a state for RESOURCE_MUTATE_FAILURE action", () => {
    const state = {
      pendingActions: {
        filter: jest.fn(resourceType => {
          const testData = {
            data: {
              globalAppData: {
                clusterCount: 1
              }
            }
          };

          return testData;
        })
      }
    };
    const action = {
      type: "RESOURCE_MUTATE_FAILURE",
      err: {
        error: {
          message: "message"
        }
      },
      item: {
        name: "test"
      }
    };
    const expectedValue = {
      mutateErrorMsg: "message",
      mutateStatus: "ERROR",
      pendingActions: { data: { globalAppData: { clusterCount: 1 } } }
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });

  it("should return a state for RESOURCE_MUTATE_SUCCESS action", () => {
    const state = {
      pendingActions: {
        filter: jest.fn(resourceType => {
          const testData = {
            data: {
              globalAppData: {
                clusterCount: 1
              }
            }
          };

          return testData;
        })
      }
    };
    const action = {
      type: "RESOURCE_MUTATE_SUCCESS",
      err: {
        error: {
          message: "message"
        }
      },
      item: {
        name: "test"
      }
    };
    const expectedValue = {
      mutateStatus: "DONE",
      pendingActions: { data: { globalAppData: { clusterCount: 1 } } }
    };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });

  it("should return a state for DEL_RECEIVE_SUCCESS_FINISHED action", () => {
    const state = {};
    const action = {
      type: "DEL_RECEIVE_SUCCESS_FINISHED"
    };
    const expectedValue = { deleteMsg: null, deleteStatus: undefined };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });

  it("should return a state for RESOURCE_MUTATE_FINISHED action", () => {
    const state = {};
    const action = {
      type: "RESOURCE_MUTATE_FINISHED"
    };
    const expectedValue = { mutateStatus: undefined };
    expect(resourceReducerFunction(state, action)).toEqual(expectedValue);
  });
});

const state = { QueryApplicationList: QueryApplicationList };
const props = {
  storeRoot: "QueryApplicationList"
};

describe("getItems", () => {
  it("should return getItems for resource type", () => {
    const expectedValue = QueryApplicationList.items;
    expect(getItems(state, props, "items")).toEqual(expectedValue);
  });
});

describe("getPage", () => {
  it("should return getPage for resource type", () => {
    const expectedValue = 1;
    expect(getPage(state, props, "page")).toEqual(expectedValue);
  });
});

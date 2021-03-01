/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
/* eslint-disable no-unused-vars */

import React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import renderer from "react-test-renderer";
import ActionModalApollo from "../../../../src-web/components/common-apollo/ActionModalApollo";
import { GET_ACTION_MODAL_STATE } from "../../../../src-web/apollo-client/queries/StateQueries";

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const mocks = {
  invalidMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "invalid",
          __typename: "actionModal",
          resourceType: {
            _uid: "invalid",
            name: "invalid",
            list: "invalid"
          },
          data: {
            _uid: "invalid",
            name: "invalid",
            namespace: "invalid",
            clusterName: "invalid",
            selfLink: "invalid",
            kind: "invalid"
          }
        }
      }
    }
  },
  editMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.edit",
          __typename: "actionModal",
          resourceType: {
            name: "HCMPod",
            list: "HCMPodList"
          },
          data: {
            _uid: "icp-mongodb-0",
            name: "icp-mongodb-0",
            namespace: "kube-system",
            clusterName: "local-cluster",
            selfLink: "/api/v1/namespaces/kube-system/pods/icp-mongodb-0",
            kind: "pods"
          }
        }
      }
    }
  },
  editAppMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.applications.edit",
          __typename: "actionModal",
          resourceType: {
            name: "HCMApplication",
            list: "HCMApplicationList"
          },
          data: {
            _uid: "icp-mongodb-0",
            name: "icp-mongodb-0",
            namespace: "kube-system",
            clusterName: "local-cluster",
            selfLink: "/api/v1/namespaces/kube-system/pods/icp-mongodb-0",
            kind: "applications"
          }
        }
      }
    }
  },
  removeMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.remove",
          __typename: "actionModal",
          resourceType: {
            name: "HCMApplication",
            list: "HCMApplicationList"
          },
          data: {
            _uid: "icp-mongodb-0",
            name: "icp-mongodb-0",
            namespace: "kube-system",
            clusterName: "local-cluster",
            selfLink: "/api/v1/namespaces/kube-system/pods/icp-mongodb-0",
            kind: "applications"
          }
        }
      }
    }
  },
  removeAppMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.applications.remove",
          __typename: "actionModal",
          resourceType: {
            name: "HCMApplication",
            list: "HCMApplicationList"
          },
          data: {
            _uid: "icp-mongodb-0",
            name: "icp-mongodb-0",
            namespace: "kube-system",
            clusterName: "local-cluster",
            selfLink: "/api/v1/namespaces/kube-system/pods/icp-mongodb-0",
            kind: "applications"
          }
        }
      }
    }
  }
};

window.open = () => {}; // provide an empty implementation for window.open
describe("ActionModalApollo Testing", () => {
  it("To Return Null For Invalid Table Action", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.invalidMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(component.toJSON()).toEqual(null);
  });

  it("Changes Apollo Client Cache For Edit Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });

  it("Changes Apollo Client Cache For Edit App Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editAppMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });

  it("Changes Apollo Client Cache For Remove Resource Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.removeMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });

  it("Changes Apollo Client Cache For Remove App Resource Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.removeAppMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });
});

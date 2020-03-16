/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
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
  editAppICAMMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.applications.icam",
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
  editAppGrafanaMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.applications.grafana",
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
  podLogsMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.pod.logs",
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
  removeMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.remove",
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

  icamMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: "table.actions.applications.icam",
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
  }
};

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

  it("Changes Apollo Client Cache For Edit App ICAM Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editAppICAMMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });

  it("Changes Apollo Client Cache For Edit App Grafana Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editAppGrafanaMock]} addTypename={false}>
        <ActionModalApollo locale={"en-US"} />
      </MockedProvider>
    );
    await delay(0);
    expect(
      component.getInstance().state.client.cache.data.data
    ).toMatchSnapshot();
  });

  it("Changes Apollo Client Cache For Pod Logs Modal", async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.podLogsMock]} addTypename={false}>
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

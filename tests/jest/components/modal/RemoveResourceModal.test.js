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
              labels: null,
              name: "nginx-placement",
              namespace: "a--ns",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/a--ns/applications/nginx-placement",
              uid: "959af3d2-fd39-4d05-ab37-8f117d4d4d6f",
              __typename: "Metadata",
              annotations: {
                "apps.open-cluster-management.io/hosting-subscription":
                  "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local"
              }
            },
            name: "nginx-placement",
            namespace: "a--ns"
          }
        },
        loading: false,
        networkStatus: 7,
        stale: false
      };

      return Promise.resolve(childAppData);
    }
    const data = {
      data: {
        application: {
          metadata: {
            labels: null,
            name: "nginx-placement",
            namespace: "a--ns",
            selfLink:
              "/apis/app.k8s.io/v1beta1/namespaces/a--ns/applications/nginx-placement",
            uid: "959af3d2-fd39-4d05-ab37-8f117d4d4d6f",
            __typename: "Metadata"
          },
          name: "nginx-placement",
          namespace: "a--ns",
          app: {
            apiVersion: "app.k8s.io/v1beta1",
            kind: "Application",
            metadata: {
              name: "nginx-placement",
              namespace: "a--ns",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/a--ns/applications/nginx-placement",
              uid: "959af3d2-fd39-4d05-ab37-8f117d4d4d6f"
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
          subscriptions: {
            apiVersion: "apps.open-cluster-management.io/v1",
            kind: "Subscription",
            metadata: {
              annotations: {
                "apps.open-cluster-management.io/deployables":
                  "sahar-multilevel-app-ns/kevin-helloworld-app-subscription-helloworld-helloworld-app-deploy-deployment,sahar-multilevel-app-ns/kevin-helloworld-app-subscription-helloworld-password-secret,sahar-multilevel-app-ns/kevin-helloworld-app-subscription-helloworld-helloworld-app-svc-service",
                "apps.open-cluster-management.io/git-commit":
                  "ca55d903421cfd624abca5b9f18e82d27a476c05",
                "apps.open-cluster-management.io/github-branch": "master",
                "apps.open-cluster-management.io/github-path": "helloworld",
                "apps.open-cluster-management.io/hosting-deployable":
                  "kevin-multilevel-channel/kevin-multilevel-channel-Subscription-kevin-helloworld-app-subscription",
                "apps.open-cluster-management.io/hosting-subscription":
                  "sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                "apps.open-cluster-management.io/sync-source":
                  "subgbk8s-sahar-multilevel-app-ns/sahar-multilevel-app-subscription-1-local",
                "apps.open-cluster-management.io/topo":
                  "deployable//Service//helloworld-app-svc/0,deployable//Deployment//helloworld-app-deploy/1,deployable//Secret//Password/0"
              },
              creationTimestamp: "2020-12-09T16:12:09Z",
              generation: 11446,
              labels: {
                app: "kevin-helloworld-app"
              },
              name: "kevin-helloworld-app-subscription",
              namespace: "sahar-multilevel-app-ns",
              resourceVersion: "124422248",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/sahar-multilevel-app-ns/subscriptions/kevin-helloworld-app-subscription",
              uid: "f5b3b96e-fbf1-41aa-b356-a55fa8e2e9aa"
            },
            __typename: "Application"
          }
        }
      },
      loading: false,
      networkStatus: 7,
      stale: false
    };

    return Promise.resolve(data);
  })
}));

import React from "react";
import RemoveResourceModal from "../../../../src-web/components/modals/RemoveResourceModal";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  resourceModalData,
  resourceModalDataDel2,
  resourceModalDataChildApp,
  resourceModalLabels,
  resourceModalLabelsDummy
} from "./ModalsTestingData";
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
    expect(toJson(component.instance())).toMatchSnapshot();
    expect(toJson(component.update())).toMatchSnapshot();
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
    expect(toJson(component.instance())).toMatchSnapshot();
    expect(toJson(component.update())).toMatchSnapshot();
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
    expect(toJson(component.instance())).toMatchSnapshot();
    expect(toJson(component.update())).toMatchSnapshot();
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
});

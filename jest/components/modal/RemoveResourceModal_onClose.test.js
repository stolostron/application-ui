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
jest.mock("../../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  remove: jest.fn(() => {
    const data = {
      userAccess: {
        allowed: true
      }
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
  getApplication: jest.fn(() => {
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
          subscriptions: null,
          __typename: "Application"
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
import { resourceModalData, resourceModalLabels } from "./ModalsTestingData";
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

  it("renders as expected without mocked data, to cover this.client onClose", () => {
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
          type={"actionModal"}
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
      .find(".pf-m-link")
      .at(0)
      .simulate("click");

    component
      .find(".pf-m-danger")
      .at(0)
      .simulate("click");
  });
});

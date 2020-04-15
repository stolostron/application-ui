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
  getResource: jest.fn(() => {
    const data = {
      data: {
        items: [
          {
            metadata: {
              creationTimestamp: "2020-04-06T22:27:05Z",
              generation: 2,
              name: "guestbook-app",
              namespace: "default",
              resourceVersion: "840144",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
              uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
            },
            deployables: [
              {
                metadata: {
                  name: "dep1",
                  selfLink: "dep1SelfLink",
                  id: "id"
                }
              }
            ],
            raw: {
              apiVersion: "app.k8s.io/v1beta1",
              kind: "Application",
              metadata: {
                creationTimestamp: "2020-04-06T22:27:05Z",
                generation: 2,
                name: "guestbook-app",
                namespace: "default",
                resourceVersion: "840144",
                selfLink:
                  "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
                uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
              }
            }
          }
        ]
      }
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
  resourceModalLabels,
  resourceModalLabelsDummy
} from "./ModalsTestingData";
import toJson from "enzyme-to-json";
import { BrowserRouter } from "react-router-dom";

describe("RemoveResourceModal test", () => {
  const handleModalClose = jest.fn();
  const handleModalSubmit = jest.fn(() => {
    const data = {
      userAccess: {
        allowed: true
      }
    };
    console.log("handleModalSubmit !!!!!!!");
  });
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

  it("renders as expected 1", () => {
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
      .find(".bx--modal--danger")
      .at(0)
      .simulate("click");
    component
      .find(".bx--modal--danger")
      .at(0)
      .simulate("keydown");

    component
      .find(".bx--modal-close")
      .at(0)
      .simulate("click");

    component
      .find(".bx--btn--tertiary")
      .at(0)
      .simulate("click");

    component
      .find(".bx--btn--danger--primary")
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
      .find(".bx--modal--danger")
      .at(0)
      .simulate("click");
    component
      .find(".bx--modal--danger")
      .at(0)
      .simulate("keydown");

    component
      .find(".bx--modal-close")
      .at(0)
      .simulate("click");

    component
      .find(".bx--btn--tertiary")
      .at(0)
      .simulate("click");

    component
      .find(".bx--btn--danger--primary")
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
});

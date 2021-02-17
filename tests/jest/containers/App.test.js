/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../node_modules/react");

import App from "../../../src-web/containers/App";

import { shallow } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import toJson from "enzyme-to-json";

import configureMockStore from "redux-mock-store";

import { reduxStoreAppPipeline, serverProps } from "../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);

const props = {
  className: "hcmapplication",
  content: "test",
  serverProps: serverProps
};

describe("App", () => {
  it("App renders correctly with data on single app.", () => {
    const match = {
      path: "/multicloud",
      url: "/multicloud",
      isExact: false,
      params: {}
    };
    const staticContext = {
      title: "Multicloud Manager",
      context: {
        locale: "en"
      },
      xsrfToken: "abc"
    };

    const component = shallow(
      <Provider store={storeApp}>
        <BrowserRouter>
          <App match={match} staticContext={staticContext} {...props} />
        </BrowserRouter>
      </Provider>
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});

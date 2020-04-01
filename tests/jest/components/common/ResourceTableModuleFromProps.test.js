/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import ResourceTableModuleFromProps from "../../../../src-web/components/common/ResourceTableModuleFromProps";

import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";

import {
  reduxStoreAppPipeline,
  staticResourceData,
  QueryApplicationList
} from "../../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);
const definitionsKey = "applicationName";
describe("ResourceTableModuleFromProps", () => {
  it("ResourceTableModuleFromProps renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ResourceTableModuleFromProps
              staticResourceData={staticResourceData}
              definitionsKey={definitionsKey}
              resourceData={QueryApplicationList}
              loading={false}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ResourceTableModuleFromProps renders correctly with data on single app, on click.", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeApp}>
          <ResourceTableModuleFromProps
            staticResourceData={staticResourceData}
            definitionsKey={definitionsKey}
            resourceData={QueryApplicationList}
            loading={false}
          />
        </Provider>
      </BrowserRouter>
    );
    /*
    wrapper
      .find(".bx--search-input")
      .simulate("change");

    wrapper
      .find(".bx--table-sort-v2")
      .find(".bx--table-sort-v2--ascending").at(0)
      .simulate("click");
*/
  });
});

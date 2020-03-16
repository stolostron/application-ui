/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
const React = require("../../../../node_modules/react");

import FilterableMultiSelect from "../../../../src-web/components/common/FilterableMultiSelect";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

describe("FilterableMultiSelect", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <FilterableMultiSelect
            title={"app1"}
            availableFilters={["label"]}
            activeFilters={[]}
            fetching={false}
            failure={false}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <FilterableMultiSelect
            title={"app1"}
            availableFilters={[]}
            activeFilters={[]}
            fetching={false}
            failure={false}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <FilterableMultiSelect
            title={"app1"}
            availableFilters={[]}
            activeFilters={[]}
            fetching={true}
            failure={false}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <FilterableMultiSelect
            title={"app1"}
            availableFilters={[]}
            activeFilters={[]}
            fetching={false}
            failure={true}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <FilterableMultiSelect />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

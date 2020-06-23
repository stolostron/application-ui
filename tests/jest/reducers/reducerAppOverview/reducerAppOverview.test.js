/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { AppOverview } from "../../../../src-web/reducers/reducerAppOverview";

const initialStateOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  showGrafanaAction: false,
  showCEMAction: false
};

describe("AppOverview reducer", () => {
  it("handles SET_SELECTED_APP_TAB", () => {
    expect(
      AppOverview(initialStateOverview, {
        type: "SET_SELECTED_APP_TAB",
        payload: "tab1"
      })
    ).toEqual({
      ...initialStateOverview,
      selectedAppTab: "tab1"
    });
  });

  it("handles SET_SHOW_APP_DETAILS", () => {
    expect(
      AppOverview(initialStateOverview, {
        type: "SET_SHOW_APP_DETAILS",
        payload: "tab1"
      })
    ).toEqual({
      ...initialStateOverview,
      showAppDetails: "tab1"
    });
  });

  it("handles SET_SHOW_EXANDED_TOPOLOGY", () => {
    expect(
      AppOverview(initialStateOverview, {
        type: "SET_SHOW_EXANDED_TOPOLOGY",
        payload: {
          selectedNodeId: "node1",
          showExpandedTopology: true
        }
      })
    ).toEqual({
      ...initialStateOverview,
      selectedNodeId: "node1",
      showExpandedTopology: true
    });
  });

  it("handles SET_ENABLE_GRAFANA_ACTION", () => {
    expect(
      AppOverview(initialStateOverview, {
        type: "SET_ENABLE_GRAFANA_ACTION",
        payload: true
      })
    ).toEqual({
      ...initialStateOverview,
      showGrafanaAction: true
    });
  });

  it("handles SET_ENABLE_CEM_ACTION", () => {
    expect(
      AppOverview(initialStateOverview, {
        type: "SET_ENABLE_CEM_ACTION",
        payload: true
      })
    ).toEqual({
      ...initialStateOverview,
      showCEMAction: true
    });
  });
});

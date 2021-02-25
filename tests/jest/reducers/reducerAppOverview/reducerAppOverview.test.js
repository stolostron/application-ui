/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { AppOverview } from "../../../../src-web/reducers/reducerAppOverview";

const initialStateOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false
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
});

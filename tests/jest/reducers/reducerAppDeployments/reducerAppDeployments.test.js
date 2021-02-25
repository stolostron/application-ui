/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import reducerAppDeployments, {
  initialStateDeployments
} from "../../../../src-web/reducers/reducerAppDeployments";

describe("AppDeployments reducer", () => {
  it("handles CLEAR_APP_DROPDOWN_LIST", () => {
    const payload = { data: "data" };
    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.appDropDownList = [];

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "CLEAR_APP_DROPDOWN_LIST"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles UPDATE_APP_DROPDOWN_LIST", () => {
    const payload = { data: "data" };
    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.appDropDownList = [payload];

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "UPDATE_APP_DROPDOWN_LIST"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles UPDATE_APP_DROPDOWN_LIST 2", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone1 = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone1.appDropDownList = [payload];

    const initialStateDeploymentsClone2 = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone2.loading = false;
    initialStateDeploymentsClone2.appDropDownList = [];

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeploymentsClone1,
          loading: false
        },
        {
          payload,
          type: "UPDATE_APP_DROPDOWN_LIST"
        }
      )
    ).toEqual(initialStateDeploymentsClone2);
  });
});

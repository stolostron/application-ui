/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import reducerAppDeployments, {
  initialStateDeployments
} from "../../../../src-web/reducers/reducerAppDeployments";

// const SET_SUBSCRIPTION_MODAL_HEADERS = 'SET_SUBSCRIPTION_MODAL_HEADERS'

describe("AppDeployments reducer", () => {
  it("handles OPEN_DISPLAY_SUBSCRIPTION_MODAL", () => {
    expect(
      reducerAppDeployments(initialStateDeployments, {
        type: "OPEN_DISPLAY_SUBSCRIPTION_MODAL"
      })
    ).toEqual({
      ...initialStateDeployments,
      displaySubscriptionModal: true
    });
  });
  it("handles CLOSE_MODALS", () => {
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          displaySubscriptionModal: true
        },
        {
          type: "CLOSE_MODALS"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      currentSubscriptionInfo: {},
      displaySubscriptionModal: false
    });
  });
  it("handles SET_DEPLOYMENT_SEARCH", () => {
    const payload = "legendofthedragoon";
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deploymentPipelineSearch: ""
        },
        {
          payload,
          type: "SET_DEPLOYMENT_SEARCH"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deploymentPipelineSearch: payload
    });
  });

  it("handles SET_DEPLOYMENT_SEARCH no payload", () => {
    const payload = undefined;
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          deploymentPipelineSearch: ""
        },
        {
          payload,
          type: "SET_DEPLOYMENT_SEARCH"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      deploymentPipelineSearch: ""
    });
  });

  it("handles SET_SUBSCRIPTION_MODAL_HEADERS", () => {
    const payload = {
      application: "dart",
      subscription: "feld"
    };
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: "",
            subscription: ""
          }
        },
        {
          payload,
          type: "SET_SUBSCRIPTION_MODAL_HEADERS"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: payload
    });
  });
  it("handles SET_SUBSCRIPTION_MODAL_HEADERS undefined", () => {
    const payload = {
      applicationnnnn: "dart",
      deployablesssss: "feld"
    };
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: "",
            subscription: ""
          }
        },
        {
          payload,
          type: "SET_SUBSCRIPTION_MODAL_HEADERS"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: {
        application: "",
        subscription: ""
      }
    });
  });
  it("handles SET_SUBSCRIPTION_MODAL_HEADERS undefined 2", () => {
    const payload = "";
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          subscriptionModalHeaderInfo: {
            application: "shanna",
            subscription: "lavitz"
          }
        },
        {
          payload,
          type: "SET_SUBSCRIPTION_MODAL_HEADERS"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      subscriptionModalHeaderInfo: {
        application: "",
        subscription: ""
      }
    });
  });
  it("handles SET_LOADING", () => {
    const payload = false;
    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: true
        },
        {
          payload,
          type: "SET_LOADING"
        }
      )
    ).toEqual({
      ...initialStateDeployments,
      loading: false
    });
  });
  it("handles SET_CURRENT_CHANNEL_INFO", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.openEditChannelModal = true;
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.currentChannelInfo = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_CURRENT_CHANNEL_INFO"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_CURRENT_APPLICATION_INFO", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.openEditApplicationModal = true;
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.currentApplicationInfo = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_CURRENT_APPLICATION_INFO"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_CURRENT_SUBSCRIPTION_INFO", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.openEditSubscriptionModal = true;
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.currentSubscriptionInfo = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_CURRENT_SUBSCRIPTION_INFO"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_CURRENT_PLACEMENT_RULE_INFO", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.openEditPlacementRuleModal = true;
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.currentPlacementRuleInfo = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_CURRENT_PLACEMENT_RULE_INFO"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_BULK_SUBSCRIPTION_LIST", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.bulkSubscriptionList = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_BULK_SUBSCRIPTION_LIST"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_BULK_SUBSCRIPTION_ERROR", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.bulkSubscriptionError = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_BULK_SUBSCRIPTION_ERROR"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_DEPLOYABLE_SUBSCRIPTION_INFO", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.subscriptionModalSubscriptionInfo = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_DEPLOYABLE_SUBSCRIPTION_INFO"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

  it("handles SET_SUBSCRIPTION_MODAL_DATA", () => {
    const payload = { data: "data" };

    const initialStateDeploymentsClone = JSON.parse(
      JSON.stringify(initialStateDeployments)
    );
    initialStateDeploymentsClone.loading = false;
    initialStateDeploymentsClone.subscriptionModalData = payload;

    expect(
      reducerAppDeployments(
        {
          ...initialStateDeployments,
          loading: false
        },
        {
          payload,
          type: "SET_SUBSCRIPTION_MODAL_DATA"
        }
      )
    ).toEqual(initialStateDeploymentsClone);
  });

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

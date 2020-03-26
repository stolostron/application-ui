/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const React = require("../../../../../../node_modules/react");
const renderer = require("../../../../../../node_modules/react-test-renderer");
const PipelineGrid = require("../../../../../../src-web/components/ApplicationDeploymentPipeline/components/PipelineGrid")
  .default;
import * as actions from "../../../../../../src-web/actions";

const mockStore = configureStore([]);

describe("PipelineGrid", () => {
  let store;
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      actions: null
    });
  });

  const breadcrumbItems = "a/b/sample-ns/sample-app";
  const applications = [
    {
      _uid: "local-cluster/ea63866d-1bb4-11ea-8ede-00000a100f0f",
      name: "jorge-test",
      namespace: "default",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [],
      created: "2019-12-11T01:24:02Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/8eaf6f3e-1bc1-11ea-8ede-00000a100f0f",
      name: "jorge-test-2",
      namespace: "default",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [],
      created: "2019-12-11T02:54:32Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/e26bfe8a-49e7-11ea-826a-00000a100f0f",
      name: "nginx-app",
      namespace: "dev",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [
        {
          _uid: "local-cluster/ded7b4f0-49e7-11ea-826a-00000a100f0f",
          status: "Propagated",
          channel: "ibmcom/ibm-developer-edition-charts",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-07T20:24:47Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/fb5c6a02-49c3-11ea-beb3-00000a100f0f",
      name: "samplebook-gbapp",
      namespace: "sample",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [
        {
          _uid: "local-cluster/fb74ffdc-49c3-11ea-beb3-00000a100f0f",
          status: "Propagated",
          channel: "gbook-ch/guestbook",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-07T16:07:47Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/e1023975-49c1-11ea-beb3-00000a100f0f",
      name: "stocktrader-app",
      namespace: "stock-trader",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [
        {
          _uid: "local-cluster/dab2af61-49c1-11ea-beb3-00000a100f0f",
          status: "Propagated",
          channel: "stock-trader/stocktrader-ns",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-07T15:52:44Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/209446d5-49c3-11ea-beb3-00000a100f0f",
      name: "subscribed-guestbook-application",
      namespace: "stock-trader",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [
        {
          _uid: "local-cluster/2086cd00-49c3-11ea-beb3-00000a100f0f",
          status: "Propagated",
          channel: "default/hub-local-helm-repo",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-07T16:01:40Z",
      __typename: "Application"
    }
  ];
  const channels = [
    {
      kind: "channel",
      name: "charts-v1",
      namespace: "default",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/charts-v1",
      _hubClusterResource: "true",
      _rbac: "default_app.ibm.com_channels",
      _uid: "local-cluster/67356e9c-55c0-11ea-beb3-00000a100f0f",
      cluster: "local-cluster",
      created: "2020-03-17T15:00:10Z",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      type: "Namespace",
      pathname: "default"
    },
    {
      kind: "channel",
      name: "stocktrader-ns",
      namespace: "stock-trader",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/channels/stocktrader-ns",
      _hubClusterResource: "true",
      _rbac: "stock-trader_app.ibm.com_channels",
      _uid: "local-cluster/67356e9c-49c0-11ea-beb3-00000a100f0f",
      cluster: "local-cluster",
      created: "2020-02-07T15:42:10Z",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      type: "Namespace",
      pathname: "stock-trader"
    },
    {
      kind: "channel",
      name: "guestbook",
      namespace: "gbook-ch",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/channels/guestbook",
      _hubClusterResource: "true",
      _rbac: "gbook-ch_app.ibm.com_channels",
      _uid: "local-cluster/eed9d453-49c3-11ea-beb3-00000a100f0f",
      cluster: "local-cluster",
      created: "2020-02-07T16:07:26Z",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      type: "Namespace",
      pathname: "gbook-ch",
      label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
    },
    {
      kind: "channel",
      name: "hub-local-helm-repo",
      namespace: "default",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/hub-local-helm-repo",
      _hubClusterResource: "true",
      _rbac: "default_app.ibm.com_channels",
      _uid: "local-cluster/fd751da0-49c2-11ea-beb3-00000a100f0f",
      cluster: "local-cluster",
      created: "2020-02-07T16:00:41Z",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      type: "HelmRepo",
      pathname: "https://localhost/helm-repo/charts"
    },
    {
      kind: "channel",
      name: "ibm-developer-edition-charts",
      namespace: "ibmcom",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/ibmcom/channels/ibm-developer-edition-charts",
      _hubClusterResource: "true",
      _rbac: "ibmcom_app.ibm.com_channels",
      _uid: "local-cluster/92687e47-49e7-11ea-826a-00000a100f0f",
      cluster: "local-cluster",
      created: "2020-02-07T20:22:33Z",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      type: "HelmRepo",
      pathname:
        "https://raw.githubusercontent.com/IBM/charts/master/repo/stable/"
    }
  ];
  const appSubscriptions = {
    data: {
      searchResult: [
        {
          items: [
            {
              kind: "subscription",
              name: "nginx-sub",
              namespace: "dev",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/dev/subscriptions/nginx-sub",
              _hubClusterResource: "true",
              _rbac: "dev_app.ibm.com_subscriptions",
              _uid: "local-cluster/ded7b4f0-49e7-11ea-826a-00000a100f0f",
              cluster: "local-cluster",
              created: "2020-02-07T20:24:41Z",
              channel: "ibmcom/ibm-developer-edition-charts",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              package: "ibm-nginx-dev",
              packageFilterVersion: "1.0.0",
              label: "app=nginx-app"
            }
          ],
          related: [
            {
              kind: "deployable",
              items: [
                {
                  kind: "deployable",
                  name: "nginx-sub-deployable",
                  namespace: "dev",
                  status: "Propagated",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/dev/deployables/nginx-sub-deployable",
                  _hubClusterResource: "true",
                  _rbac: "dev_app.ibm.com_deployables",
                  _uid: "local-cluster/dedc081a-49e7-11ea-826a-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T20:24:41Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1"
                }
              ],
              __typename: "SearchRelatedResult"
            },
            {
              kind: "placementrule",
              items: [
                {
                  kind: "placementrule",
                  name: "nginxrule",
                  namespace: "dev",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/dev/placementrules/nginxrule",
                  _hubClusterResource: "true",
                  _rbac: "dev_app.ibm.com_placementrules",
                  _uid: "local-cluster/db0fb892-49e7-11ea-826a-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T20:24:34Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label: "app=nginx-app; name=nginxrule"
                }
              ],
              __typename: "SearchRelatedResult"
            }
          ],
          __typename: "SearchResult"
        },
        {
          items: [
            {
              kind: "subscription",
              name: "guestbook-subscription",
              namespace: "stock-trader",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/subscriptions/guestbook-subscription",
              _hubClusterResource: "true",
              _rbac: "stock-trader_app.ibm.com_subscriptions",
              _uid: "local-cluster/2086cd00-49c3-11ea-beb3-00000a100f0f",
              cluster: "local-cluster",
              created: "2020-02-07T16:01:40Z",
              channel: "default/hub-local-helm-repo",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              package: "gbapp",
              packageFilterVersion: "0.1.0",
              label: "app=subscribed-guestbook-application"
            }
          ],
          related: [
            {
              kind: "deployable",
              items: [
                {
                  kind: "deployable",
                  name: "guestbook-subscription-deployable",
                  namespace: "stock-trader",
                  status: "Propagated",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/deployables/guestbook-subscription-deployable",
                  _hubClusterResource: "true",
                  _rbac: "stock-trader_app.ibm.com_deployables",
                  _uid: "local-cluster/208b040d-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:01:40Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1"
                }
              ],
              __typename: "SearchRelatedResult"
            },
            {
              kind: "placementrule",
              items: [
                {
                  kind: "placementrule",
                  name: "guestbook-placementrule",
                  namespace: "stock-trader",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/placementrules/guestbook-placementrule",
                  _hubClusterResource: "true",
                  _rbac: "stock-trader_app.ibm.com_placementrules",
                  _uid: "local-cluster/2090a313-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:01:40Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label: "app=subscribed-guestbook-application"
                }
              ],
              __typename: "SearchRelatedResult"
            }
          ],
          __typename: "SearchResult"
        },
        {
          items: [
            {
              kind: "subscription",
              name: "stocktrader-sub",
              namespace: "stock-trader",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/subscriptions/stocktrader-sub",
              _hubClusterResource: "true",
              _rbac: "stock-trader_app.ibm.com_subscriptions",
              _uid: "local-cluster/dab2af61-49c1-11ea-beb3-00000a100f0f",
              cluster: "local-cluster",
              created: "2020-02-07T15:52:33Z",
              channel: "stock-trader/stocktrader-ns",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              label: "app=stocktrader-app"
            }
          ],
          related: [
            {
              kind: "deployable",
              items: [
                {
                  kind: "deployable",
                  name: "stocktrader-sub-deployable",
                  namespace: "stock-trader",
                  status: "Propagated",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/deployables/stocktrader-sub-deployable",
                  _hubClusterResource: "true",
                  _rbac: "stock-trader_app.ibm.com_deployables",
                  _uid: "local-cluster/dacd4a65-49c1-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T15:52:33Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1"
                }
              ],
              __typename: "SearchRelatedResult"
            },
            {
              kind: "placementrule",
              items: [
                {
                  kind: "placementrule",
                  name: "stocktraderrule",
                  namespace: "stock-trader",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/stock-trader/placementrules/stocktraderrule",
                  _hubClusterResource: "true",
                  _rbac: "stock-trader_app.ibm.com_placementrules",
                  _uid: "local-cluster/d5d58d3c-49c1-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T15:52:25Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label: "app=stocktrader-app; name=stocktraderrule"
                }
              ],
              __typename: "SearchRelatedResult"
            }
          ],
          __typename: "SearchResult"
        },
        {
          items: [
            {
              kind: "subscription",
              name: "samplebook-gbapp-guestbook",
              namespace: "sample",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
              _hubClusterResource: "true",
              _rbac: "sample_app.ibm.com_subscriptions",
              _uid: "local-cluster/fb74ffdc-49c3-11ea-beb3-00000a100f0f",
              cluster: "local-cluster",
              created: "2020-02-07T16:07:47Z",
              channel: "gbook-ch/guestbook",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              label:
                "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook"
            }
          ],
          related: [
            {
              kind: "deployable",
              items: [
                {
                  kind: "deployable",
                  name: "samplebook-gbapp-guestbook-deployable",
                  namespace: "sample",
                  status: "Propagated",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/sample/deployables/samplebook-gbapp-guestbook-deployable",
                  _hubClusterResource: "true",
                  _rbac: "sample_app.ibm.com_deployables",
                  _uid: "local-cluster/fb92ff52-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:47Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-redismaster",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismaster",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/eef1f3b4-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-service",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-service",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/eeebaa01-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-frontend",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-frontend",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/eee41054-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-redisslaveservice",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslaveservice",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/ef047388-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-redisslave",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslave",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/ef006e11-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                },
                {
                  kind: "deployable",
                  name: "guestbook-gbchn-redismasterservice",
                  namespace: "gbook-ch",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismasterservice",
                  _hubClusterResource: "true",
                  _rbac: "gbook-ch_app.ibm.com_deployables",
                  _uid: "local-cluster/eefa209a-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:26Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
                }
              ],
              __typename: "SearchRelatedResult"
            },
            {
              kind: "placementrule",
              items: [
                {
                  kind: "placementrule",
                  name: "samplebook-gbapp",
                  namespace: "sample",
                  selfLink:
                    "/apis/app.ibm.com/v1alpha1/namespaces/sample/placementrules/samplebook-gbapp",
                  _hubClusterResource: "true",
                  _rbac: "sample_app.ibm.com_placementrules",
                  _uid: "local-cluster/fb69fb92-49c3-11ea-beb3-00000a100f0f",
                  cluster: "local-cluster",
                  created: "2020-02-07T16:07:47Z",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  label:
                    "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook"
                }
              ],
              __typename: "SearchRelatedResult"
            }
          ],
          __typename: "SearchResult"
        },
        {
          items: [
            {
              kind: "subscription",
              name: "prometheus",
              namespace: "thanos",
              selfLink:
                "/apis/operators.coreos.com/v1alpha1/namespaces/thanos/subscriptions/prometheus",
              _hubClusterResource: "true",
              _rbac: "thanos_operators.coreos.com_subscriptions",
              _uid: "local-cluster/a17ee141-46be-11ea-ba3a-00000a100f0f",
              cluster: "local-cluster",
              created: "2020-02-03T19:51:55Z",
              apigroup: "operators.coreos.com",
              apiversion: "v1alpha1"
            }
          ],
          related: [],
          __typename: "SearchResult"
        }
      ]
    }
  };
  const getChannelResource = [];
  const getSubscriptionResource = [];
  const getPlacementRuleResource = [];
  const editResource = [];
  const appDropDownList = [];
  const bulkSubscriptionList = [];

  it("PipelineGrid renders correctly.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PipelineGrid
            applications={applications}
            channels={channels}
            appSubscriptions={appSubscriptions}
            getChannelResource={getChannelResource}
            getSubscriptionResource={getSubscriptionResource}
            getPlacementRuleResource={getPlacementRuleResource}
            openSubscriptionModal={actions.openDisplaySubscriptionModal}
            setSubscriptionModalHeaderInfo={
              actions.setSubscriptionModalHeaderInfo
            }
            setCurrentDeployableSubscriptionData={
              actions.setCurrentDeployableSubscriptionData
            }
            setCurrentsubscriptionModalData={
              actions.setCurrentsubscriptionModalData
            }
            updateAppDropDownList={actions.updateAppDropDownList}
            appDropDownList={appDropDownList}
            bulkSubscriptionList={bulkSubscriptionList}
            editResource={editResource}
            breadcrumbItems={breadcrumbItems}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

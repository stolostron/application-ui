/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import ApplicationDeploymentPipeline from "../../../../src-web/components/ApplicationDeploymentPipeline";
import AppDeployments from "../../../../src-web/reducers/reducerAppDeployments";

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

const breadcrumbItems = "/multicloud/applications/sample/samplebook-gbapp";
const serverProps1 = {
  isKibanaRunning: true,
  isICAMRunning: true,
  isCEMRunning: true,
  isGrafanaRunning: true
};

const applications = {
  data: {
    applications: [
      {
        _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
        name: "mortgage-app",
        namespace: "default",
        dashboard:
          "https://icp-console.apps.appmgmt.os.fyre.ibm.com:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
        clusterCount: 1,
        remoteSubscriptionStatusCount: {
          Subscribed: 1
        },
        podStatusCount: {
          Running: 1
        },
        hubSubscriptions: [
          {
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            status: "Propagated",
            channel: "default/mortgage-channel",
            __typename: "Subscription"
          }
        ],
        created: "2020-02-18T23:57:04Z",
        __typename: "Application"
      },
      {
        _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
        name: "samplebook-gbapp",
        namespace: "sample",
        dashboard:
          "https://icp-console.apps.appmgmt.os.fyre.ibm.com:443/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
        clusterCount: 1,
        remoteSubscriptionStatusCount: {
          Subscribed: 1
        },
        podStatusCount: {
          Running: 3
        },
        hubSubscriptions: [
          {
            _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
            status: "Propagated",
            channel: "gbook-ch/guestbook",
            __typename: "Subscription"
          }
        ],
        created: "2020-02-19T01:43:43Z",
        __typename: "Application"
      },
      {
        _uid: "local-cluster/8f4799db-4cf4-11ea-a229-00000a102d26",
        name: "stocktrader-app",
        namespace: "stock-trader",
        dashboard: null,
        clusterCount: 0,
        remoteSubscriptionStatusCount: {},
        podStatusCount: {},
        hubSubscriptions: [],
        created: "2020-02-11T17:33:04Z",
        __typename: "Application"
      },
      {
        _uid: "local-cluster/e77e69a7-4d25-11ea-a229-00000a102d26",
        name: "subscribed-guestbook-application",
        namespace: "kube-system",
        dashboard: null,
        clusterCount: 2,
        remoteSubscriptionStatusCount: {
          Failed: 1,
          Subscribed: 1
        },
        podStatusCount: {
          Running: 3
        },
        hubSubscriptions: [
          {
            _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
            status: "Propagated",
            channel: "default/hub-local-helm-repo",
            __typename: "Subscription"
          }
        ],
        created: "2020-02-11T23:26:18Z",
        __typename: "Application"
      }
    ]
  }
};

const channels = {
  data: {
    searchResult: [
      {
        items: [
          {
            kind: "channel",
            name: "mortgage-channel",
            namespace: "default",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
            created: "2020-02-18T23:56:15Z",
            cluster: "local-cluster",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "default_app.ibm.com_channels",
            _hubClusterResource: "true",
            _uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
            pathname: "default",
            label:
              "app=mortgage-channel-mortgage; chart=mortgage-channel-1.0.0; heritage=Tiller; release=mortgage-channel",
            type: "Namespace"
          }
        ],
        related: [
          {
            kind: "subscription",
            items: [
              {
                kind: "subscription",
                name: "mortgage-app-subscription",
                namespace: "default",
                status: "Propagated",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
                created: "2020-02-18T23:57:04Z",
                cluster: "local-cluster",
                channel: "default/mortgage-channel",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "default_app.ibm.com_subscriptions",
                _hubClusterResource: "true",
                _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
                packageFilterVersion: ">=1.x",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app"
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
            kind: "channel",
            name: "hub-local-helm-repo",
            namespace: "default",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/hub-local-helm-repo",
            created: "2020-02-19T01:38:29Z",
            cluster: "local-cluster",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "default_app.ibm.com_channels",
            _hubClusterResource: "true",
            _uid: "local-cluster/87f95c96-52b8-11ea-bf05-00000a102d26",
            pathname:
              "https://icp-console.apps.appmgmt.os.fyre.ibm.com:8443/helm-repo/charts",
            type: "HelmRepo"
          }
        ],
        related: [
          {
            kind: "subscription",
            items: [
              {
                kind: "subscription",
                name: "guestbook-subscription",
                namespace: "kube-system",
                status: "Propagated",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
                created: "2020-02-19T01:38:58Z",
                cluster: "local-cluster",
                channel: "default/hub-local-helm-repo",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "kube-system_app.ibm.com_subscriptions",
                _hubClusterResource: "true",
                _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
                package: "gbapp",
                packageFilterVersion: "0.1.0",
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
            kind: "channel",
            name: "guestbook",
            namespace: "gbook-ch",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/channels/guestbook",
            created: "2020-02-19T01:43:38Z",
            cluster: "local-cluster",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "gbook-ch_app.ibm.com_channels",
            _hubClusterResource: "true",
            _uid: "local-cluster/4019f8d8-52b9-11ea-bf05-00000a102d26",
            pathname: "gbook-ch",
            label:
              "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
            type: "Namespace"
          }
        ],
        related: [
          {
            kind: "subscription",
            items: [
              {
                kind: "subscription",
                name: "samplebook-gbapp-guestbook",
                namespace: "sample",
                status: "Propagated",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
                created: "2020-02-19T01:43:43Z",
                cluster: "local-cluster",
                channel: "gbook-ch/guestbook",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "sample_app.ibm.com_subscriptions",
                _hubClusterResource: "true",
                _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook"
              }
            ],
            __typename: "SearchRelatedResult"
          }
        ],
        __typename: "SearchResult"
      }
    ]
  }
};

const appSubscriptions = {
  data: {
    searchResult: [
      {
        items: [
          {
            kind: "subscription",
            name: "mortgage-app-subscription",
            namespace: "default",
            status: "Propagated",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
            created: "2020-02-18T23:57:04Z",
            cluster: "local-cluster",
            channel: "default/mortgage-channel",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "default_app.ibm.com_subscriptions",
            _hubClusterResource: "true",
            _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
            packageFilterVersion: ">=1.x",
            label:
              "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app"
          },
          {
            kind: "subscription",
            name: "mortgage-app-subscription",
            namespace: "default",
            status: "Subscribed",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
            created: "2020-02-18T23:57:57Z",
            cluster: "feng",
            channel: "default/mortgage-channel",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "feng-ns_app.ibm.com_subscriptions",
            _hostingSubscription: "default/mortgage-app-subscription",
            _hostingDeployable:
              "feng-ns/mortgage-app-subscription-deployable-bmgrz",
            _uid: "feng/7c837f32-52aa-11ea-8143-00000a102c71",
            _clusterNamespace: "feng-ns",
            packageFilterVersion: ">=1.x",
            label:
              "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; hosting-deployable-name=mortgage-app-subscription-deployable; release=mortgage-app"
          }
        ],
        related: [
          {
            kind: "deployable",
            items: [
              {
                kind: "deployable",
                name: "mortgage-app-subscription-deployable",
                namespace: "default",
                status: "Propagated",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
                created: "2020-02-18T23:57:04Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "default_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/5cf2709a-52aa-11ea-bf05-00000a102d26"
              },
              {
                kind: "deployable",
                name: "mortgage-app-svc",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-svc",
                created: "2020-02-18T23:57:04Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "default_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/5cd8930f-52aa-11ea-bf05-00000a102d26",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; component=main; heritage=Tiller; package=mortgage-app-mortgage; release=mortgage-app"
              },
              {
                kind: "deployable",
                name: "mortgage-app-deployable",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-deployable",
                created: "2020-02-18T23:57:04Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "default_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/5cd5a33c-52aa-11ea-bf05-00000a102d26",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; component=main; heritage=Tiller; package=mortgage-app-mortgage; release=mortgage-app"
              }
            ],
            __typename: "SearchRelatedResult"
          },
          {
            kind: "placementrule",
            items: [
              {
                kind: "placementrule",
                name: "mortgage-app-placement",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement",
                created: "2020-02-18T23:57:04Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "default_app.ibm.com_placementrules",
                _hubClusterResource: "true",
                _uid: "local-cluster/5cdaa081-52aa-11ea-bf05-00000a102d26",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app"
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
            namespace: "kube-system",
            status: "Propagated",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
            created: "2020-02-19T01:38:58Z",
            cluster: "local-cluster",
            channel: "default/hub-local-helm-repo",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "kube-system_app.ibm.com_subscriptions",
            _hubClusterResource: "true",
            _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
            package: "gbapp",
            packageFilterVersion: "0.1.0",
            label: "app=subscribed-guestbook-application"
          },
          {
            kind: "subscription",
            name: "guestbook-subscription",
            namespace: "kube-system",
            status: "Failed",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
            created: "2020-02-13T21:09:08Z",
            cluster: "val-cls",
            channel: "kube-system/hub-local-helm-repo",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "val-cls-ns_app.ibm.com_subscriptions",
            _hostingSubscription: "kube-system/guestbook-subscription",
            _hostingDeployable:
              "val-cls-ns/guestbook-subscription-deployable-c2rzz",
            _uid: "val-cls/134738e1-4ea5-11ea-9840-00000a1a06e2",
            _clusterNamespace: "val-cls-ns",
            package: "gbapp",
            packageFilterVersion: "0.1.0",
            label:
              "app=subscribed-guestbook-application; hosting-deployable-name=guestbook-subscription-deployable"
          },
          {
            kind: "subscription",
            name: "guestbook-subscription",
            namespace: "kube-system",
            status: "Subscribed",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
            created: "2020-02-19T01:39:34Z",
            cluster: "feng",
            channel: "default/hub-local-helm-repo",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "feng-ns_app.ibm.com_subscriptions",
            _hostingSubscription: "kube-system/guestbook-subscription",
            _hostingDeployable:
              "feng-ns/guestbook-subscription-deployable-k84fh",
            _uid: "feng/aed04268-52b8-11ea-8143-00000a102c71",
            _clusterNamespace: "feng-ns",
            package: "gbapp",
            packageFilterVersion: "0.1.0",
            label:
              "app=subscribed-guestbook-application; hosting-deployable-name=guestbook-subscription-deployable"
          }
        ],
        related: [
          {
            kind: "deployable",
            items: [
              {
                kind: "deployable",
                name: "guestbook-subscription-deployable",
                namespace: "kube-system",
                status: "Propagated",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/deployables/guestbook-subscription-deployable",
                created: "2020-02-19T01:38:58Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "kube-system_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/98df502a-52b8-11ea-bf05-00000a102d26"
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
                namespace: "kube-system",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/placementrules/guestbook-placementrule",
                created: "2020-02-11T23:26:17Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "kube-system_app.ibm.com_placementrules",
                _hubClusterResource: "true",
                _uid: "local-cluster/e72e6c06-4d25-11ea-a229-00000a102d26",
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
            name: "samplebook-gbapp-guestbook",
            namespace: "sample",
            status: "Propagated",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
            created: "2020-02-19T01:43:43Z",
            cluster: "local-cluster",
            channel: "gbook-ch/guestbook",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "sample_app.ibm.com_subscriptions",
            _hubClusterResource: "true",
            _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
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
                created: "2020-02-19T01:43:43Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "sample_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/42e14325-52b9-11ea-bf05-00000a102d26"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-redisslave",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslave",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/402dbef0-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-redismasterservice",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismasterservice",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/40296f32-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-frontend",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-frontend",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/40200be3-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-service",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-service",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/4023bd40-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-redismaster",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismaster",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/40264123-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook"
              },
              {
                kind: "deployable",
                name: "guestbook-gbchn-redisslaveservice",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslaveservice",
                created: "2020-02-19T01:43:38Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _hubClusterResource: "true",
                _uid: "local-cluster/402bbd94-52b9-11ea-bf05-00000a102d26",
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
                created: "2020-02-19T01:43:43Z",
                cluster: "local-cluster",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                _rbac: "sample_app.ibm.com_placementrules",
                _hubClusterResource: "true",
                _uid: "local-cluster/42d7a271-52b9-11ea-bf05-00000a102d26",
                label:
                  "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook"
              }
            ],
            __typename: "SearchRelatedResult"
          }
        ],
        __typename: "SearchResult"
      }
    ]
  }
};

describe("ApplicationDeploymentPipeline", () => {
  it("ApplicationDeploymentPipeline renders correctly with data.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentPipeline
            breadcrumbItems={breadcrumbItems}
            serverProps={serverProps1}
            QueryApplicationList={applications}
            HCMChannelList={channels}
            HCMSubscriptionList={appSubscriptions}
            AppDeployments={AppDeployments}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with actions.", () => {
    const serverProps = {
      isKibanaRunning: true,
      isICAMRunning: true,
      isCEMRunning: true,
      isGrafanaRunning: true
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentPipeline
            serverProps={serverProps}
            AppDeployments={AppDeployments}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with actions 2.", () => {
    const serverProps = {
      isKibanaRunning: true,
      isICAMRunning: true,
      isCEMRunning: false,
      isGrafanaRunning: false
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with actions 3.", () => {
    const serverProps = {
      isKibanaRunning: false,
      isICAMRunning: false,
      isCEMRunning: false,
      isGrafanaRunning: false
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { mapBulkSubscriptions } from "../../../../src-web/reducers/data-mappers/mapSubscriptionsBulk";

describe("data-mappers testing for mapBulkSubscriptions", () => {
  it("should mold the data properly", () => {
    const subscriptions = [
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
    ];

    const result = [
      {
        _hubClusterResource: "true",
        _rbac: "default_app.ibm.com_subscriptions",
        _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        channel: "default/mortgage-channel",
        cluster: "local-cluster",
        created: "2020-02-18T23:57:04Z",
        kind: "subscription",
        label:
          "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
        name: "mortgage-app-subscription",
        namespace: "default",
        pathname: "",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_deployables",
                _uid: "local-cluster/5cf2709a-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "deployable",
                name: "mortgage-app-subscription-deployable",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
                status: "Propagated"
              },
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_deployables",
                _uid: "local-cluster/5cd8930f-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "deployable",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; component=main; heritage=Tiller; package=mortgage-app-mortgage; release=mortgage-app",
                name: "mortgage-app-svc",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-svc"
              },
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_deployables",
                _uid: "local-cluster/5cd5a33c-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "deployable",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; component=main; heritage=Tiller; package=mortgage-app-mortgage; release=mortgage-app",
                name: "mortgage-app-deployable",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-deployable"
              }
            ],
            kind: "deployable"
          },
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_placementrules",
                _uid: "local-cluster/5cdaa081-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "placementrule",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                name: "mortgage-app-placement",
                namespace: "default",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement"
              }
            ],
            kind: "placementrule"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
        status: "Propagated",
        type: ""
      },
      {
        _hubClusterResource: "true",
        _rbac: "kube-system_app.ibm.com_subscriptions",
        _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        channel: "default/hub-local-helm-repo",
        cluster: "local-cluster",
        created: "2020-02-19T01:38:58Z",
        kind: "subscription",
        label: "app=subscribed-guestbook-application",
        name: "guestbook-subscription",
        namespace: "kube-system",
        pathname: "",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "kube-system_app.ibm.com_deployables",
                _uid: "local-cluster/98df502a-52b8-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:38:58Z",
                kind: "deployable",
                name: "guestbook-subscription-deployable",
                namespace: "kube-system",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/deployables/guestbook-subscription-deployable",
                status: "Propagated"
              }
            ],
            kind: "deployable"
          },
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "kube-system_app.ibm.com_placementrules",
                _uid: "local-cluster/e72e6c06-4d25-11ea-a229-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-11T23:26:17Z",
                kind: "placementrule",
                label: "app=subscribed-guestbook-application",
                name: "guestbook-placementrule",
                namespace: "kube-system",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/placementrules/guestbook-placementrule"
              }
            ],
            kind: "placementrule"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
        status: "Propagated",
        type: ""
      },
      {
        _hubClusterResource: "true",
        _rbac: "sample_app.ibm.com_subscriptions",
        _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        channel: "gbook-ch/guestbook",
        cluster: "local-cluster",
        created: "2020-02-19T01:43:43Z",
        kind: "subscription",
        label:
          "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
        name: "samplebook-gbapp-guestbook",
        namespace: "sample",
        pathname: "",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "sample_app.ibm.com_deployables",
                _uid: "local-cluster/42e14325-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:43Z",
                kind: "deployable",
                name: "samplebook-gbapp-guestbook-deployable",
                namespace: "sample",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/sample/deployables/samplebook-gbapp-guestbook-deployable",
                status: "Propagated"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/402dbef0-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-redisslave",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslave"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/40296f32-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-redismasterservice",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismasterservice"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/40200be3-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-frontend",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-frontend"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/4023bd40-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-service",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-service"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/40264123-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-redismaster",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redismaster"
              },
              {
                _hubClusterResource: "true",
                _rbac: "gbook-ch_app.ibm.com_deployables",
                _uid: "local-cluster/402bbd94-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:38Z",
                kind: "deployable",
                label:
                  "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
                name: "guestbook-gbchn-redisslaveservice",
                namespace: "gbook-ch",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/deployables/guestbook-gbchn-redisslaveservice"
              }
            ],
            kind: "deployable"
          },
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "sample_app.ibm.com_placementrules",
                _uid: "local-cluster/42d7a271-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:43Z",
                kind: "placementrule",
                label:
                  "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
                name: "samplebook-gbapp",
                namespace: "sample",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/sample/placementrules/samplebook-gbapp"
              }
            ],
            kind: "placementrule"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
        status: "Propagated",
        type: ""
      }
    ];

    expect(mapBulkSubscriptions(subscriptions)).toEqual(result);
  });

  it("should not break on empty response", () => {
    const apiResponse = [];

    expect(mapBulkSubscriptions(apiResponse)).toEqual([]);
  });

  it("should not break on undefined response", () => {
    const result = [
      {
        name: "",
        namespace: "",
        selfLink: "",
        _uid: "",
        created: "",
        pathname: "",
        apigroup: "",
        cluster: "",
        kind: "",
        label: "",
        type: "",
        _hubClusterResource: "",
        _rbac: "",
        related: []
      }
    ];

    expect(mapBulkSubscriptions(undefined)).toEqual(result);
  });
});

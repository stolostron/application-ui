/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { mapBulkChannels } from "../../../../src-web/reducers/data-mappers/mapChannelsBulk";

describe("data-mappers testing for mapChannelsBulk", () => {
  it("should mold the data properly", () => {
    const channels = [
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
            pathname: "https://localhost:8443/helm-repo/charts",
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
    ];

    const result = [
      {
        _hubClusterResource: "true",
        _rbac: "default_app.ibm.com_channels",
        _uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        cluster: "local-cluster",
        created: "2020-02-18T23:56:15Z",
        kind: "channel",
        label:
          "app=mortgage-channel-mortgage; chart=mortgage-channel-1.0.0; heritage=Tiller; release=mortgage-channel",
        name: "mortgage-channel",
        namespace: "default",
        pathname: "default",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_subscriptions",
                _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                channel: "default/mortgage-channel",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "subscription",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                name: "mortgage-app-subscription",
                namespace: "default",
                packageFilterVersion: ">=1.x",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
                status: "Propagated"
              }
            ],
            kind: "subscription"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
        type: "Namespace"
      },
      {
        _hubClusterResource: "true",
        _rbac: "default_app.ibm.com_channels",
        _uid: "local-cluster/87f95c96-52b8-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        cluster: "local-cluster",
        created: "2020-02-19T01:38:29Z",
        kind: "channel",
        label: "",
        name: "hub-local-helm-repo",
        namespace: "default",
        pathname: "https://localhost:8443/helm-repo/charts",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "kube-system_app.ibm.com_subscriptions",
                _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                channel: "default/hub-local-helm-repo",
                cluster: "local-cluster",
                created: "2020-02-19T01:38:58Z",
                kind: "subscription",
                label: "app=subscribed-guestbook-application",
                name: "guestbook-subscription",
                namespace: "kube-system",
                package: "gbapp",
                packageFilterVersion: "0.1.0",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
                status: "Propagated"
              }
            ],
            kind: "subscription"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/hub-local-helm-repo",
        type: "HelmRepo"
      },
      {
        _hubClusterResource: "true",
        _rbac: "gbook-ch_app.ibm.com_channels",
        _uid: "local-cluster/4019f8d8-52b9-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        cluster: "local-cluster",
        created: "2020-02-19T01:43:38Z",
        kind: "channel",
        label:
          "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
        name: "guestbook",
        namespace: "gbook-ch",
        pathname: "gbook-ch",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "sample_app.ibm.com_subscriptions",
                _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                channel: "gbook-ch/guestbook",
                cluster: "local-cluster",
                created: "2020-02-19T01:43:43Z",
                kind: "subscription",
                label:
                  "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
                name: "samplebook-gbapp-guestbook",
                namespace: "sample",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
                status: "Propagated"
              }
            ],
            kind: "subscription"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/channels/guestbook",
        type: "Namespace"
      }
    ];

    expect(mapBulkChannels(channels)).toEqual(result);
  });

  it("should mold the data properly with charts-v1 channel - _hubClusterResource = true and status = Subscribed", () => {
    const channels = [
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
            name: "charts-v1",
            namespace: "default",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/charts-v1",
            created: "2020-02-19T01:38:29Z",
            cluster: "local-cluster",
            apigroup: "app.ibm.com",
            apiversion: "v1alpha1",
            _rbac: "default_app.ibm.com_channels",
            _hubClusterResource: "true",
            _uid: "local-cluster/87f95c96-52b8-11ea-bf05-00000a102d26",
            pathname: "https://localhost:8443/helm-repo/charts",
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
                status: "Subscribed",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
                created: "2020-02-19T01:38:58Z",
                cluster: "local-cluster",
                channel: "default/charts-v1",
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
      }
    ];

    const result = [
      {
        _hubClusterResource: "true",
        _rbac: "default_app.ibm.com_channels",
        _uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        cluster: "local-cluster",
        created: "2020-02-18T23:56:15Z",
        kind: "channel",
        label:
          "app=mortgage-channel-mortgage; chart=mortgage-channel-1.0.0; heritage=Tiller; release=mortgage-channel",
        name: "mortgage-channel",
        namespace: "default",
        pathname: "default",
        related: [
          {
            __typename: "SearchRelatedResult",
            items: [
              {
                _hubClusterResource: "true",
                _rbac: "default_app.ibm.com_subscriptions",
                _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
                apigroup: "app.ibm.com",
                apiversion: "v1alpha1",
                channel: "default/mortgage-channel",
                cluster: "local-cluster",
                created: "2020-02-18T23:57:04Z",
                kind: "subscription",
                label:
                  "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                name: "mortgage-app-subscription",
                namespace: "default",
                packageFilterVersion: ">=1.x",
                selfLink:
                  "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
                status: "Propagated"
              }
            ],
            kind: "subscription"
          }
        ],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
        type: "Namespace"
      }
    ];
    expect(mapBulkChannels(channels)).toEqual(result);
  });

  it("should not break on empty response", () => {
    const apiResponse = [
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
        __typename: "SearchResult"
      }
    ];

    expect(mapBulkChannels(apiResponse)).toEqual([]);
  });

  it("should always return channel that has no related subscription data", () => {
    const channels = [
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
        related: []
      }
    ];

    const result = [
      {
        _hubClusterResource: "true",
        _rbac: "default_app.ibm.com_channels",
        _uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
        apigroup: "app.ibm.com",
        cluster: "local-cluster",
        created: "2020-02-18T23:56:15Z",
        kind: "channel",
        label:
          "app=mortgage-channel-mortgage; chart=mortgage-channel-1.0.0; heritage=Tiller; release=mortgage-channel",
        name: "mortgage-channel",
        namespace: "default",
        pathname: "default",
        related: [],
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
        type: "Namespace"
      }
    ];

    expect(mapBulkChannels(channels)).toEqual(result);
  });

  it("should not break on empty response", () => {
    const apiResponse = [];

    expect(mapBulkChannels(apiResponse)).toEqual([]);
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
    expect(mapBulkChannels(undefined)).toEqual(result);
  });
});

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getApplicationsList,
  getSubscriptionsList,
  getSubscribedChannels,
  getChannelsList,
  getPlacementRuleFromBulkSubscription,
  filterSingleApp,
  filterApps
} from "../../../../src-web/components/ApplicationDeploymentPipeline/utils";

describe("getApplicationsList", () => {
  const applicationList = { items: [{ josh: "hi" }, { dart: "hi" }] };
  const applicationDud = { itteemmss: [{ josh: "hi" }, { dart: "hi" }] };
  it("should return application list of 2", () => {
    const result = [{ josh: "hi" }, { dart: "hi" }];
    expect(getApplicationsList(applicationList)).toEqual(result);
  });
  it("should return blank array", () => {
    expect(getApplicationsList(applicationDud)).toEqual([]);
  });
});

describe("getSubscriptionsList", () => {
  const subscriptionList = {
    items: [
      {
        metadata: {
          name: "dev-subscription",
          namespace: "default",
          creationTimestamp: "2019-07-16T20:58:03Z",
          __typename: "Metadata"
        },
        raw: {
          apiVersion: "app.ibm.com/v1alpha1",
          kind: "Subscription",
          metadata: {
            annotations: {
              "app.ibm.com/hosting-deployable":
                "default/dev-subscription-deployable",
              "app.ibm.com/managed-cluster": "/",
              "app.ibm.com/syncid": "default/dev-subscription-deployable",
              "app.ibm.com/syncsource": "deployable"
            },
            creationTimestamp: "2019-07-16T20:58:03Z",
            generation: 3,
            name: "dev-subscription",
            namespace: "default",
            resourceVersion: "11171507",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/dev-subscription",
            uid: "66ee106e-a80c-11e9-914a-0e59e642c7ac"
          },
          spec: {
            channel: "dev/dev",
            name: "",
            packageFilter: {
              version: "1.x"
            },
            source: "",
            sourceNamespace: ""
          }
        },
        __typename: "Subscription"
      },
      {
        metadata: {
          name: "mydevsub",
          namespace: "default",
          creationTimestamp: "2019-06-26T19:26:37Z",
          __typename: "Metadata"
        },
        raw: {
          apiVersion: "app.ibm.com/v1alpha1",
          kind: "Subscription",
          metadata: {
            annotations: {
              "app.ibm.com/hosting-deployable": "default/mydevsub-deployable",
              "app.ibm.com/managed-cluster": "/",
              "app.ibm.com/syncid": "default/mydevsub-deployable",
              "app.ibm.com/syncsource": "deployable"
            },
            creationTimestamp: "2019-06-26T19:26:37Z",
            generation: 2,
            name: "mydevsub",
            namespace: "default",
            resourceVersion: "11171499",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mydevsub",
            uid: "50fc328d-9848-11e9-a05f-0e59e642c7ac"
          },
          spec: {
            channel: "default/dev",
            name: "",
            packageFilter: {
              version: "1.x"
            },
            source: "",
            sourceNamespace: ""
          }
        },
        __typename: "Subscription"
      }
    ],
    itemsPerPage: 20,
    page: 1,
    search: "",
    sortDirection: "asc",
    status: "DONE",
    putErrorMsg: "",
    postErrorMsg: "",
    pendingActions: []
  };
  const subscriptionDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  };
  it("should return deployable list of 3", () => {
    const result = [
      {
        channel: "",
        creationTimestamp: "",
        name: "",
        namespace: "",
        raw: {
          __typename: "Subscription",
          metadata: {
            __typename: "Metadata",
            creationTimestamp: "2019-07-16T20:58:03Z",
            name: "dev-subscription",
            namespace: "default"
          },
          raw: {
            apiVersion: "app.ibm.com/v1alpha1",
            kind: "Subscription",
            metadata: {
              annotations: {
                "app.ibm.com/hosting-deployable":
                  "default/dev-subscription-deployable",
                "app.ibm.com/managed-cluster": "/",
                "app.ibm.com/syncid": "default/dev-subscription-deployable",
                "app.ibm.com/syncsource": "deployable"
              },
              creationTimestamp: "2019-07-16T20:58:03Z",
              generation: 3,
              name: "dev-subscription",
              namespace: "default",
              resourceVersion: "11171507",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/dev-subscription",
              uid: "66ee106e-a80c-11e9-914a-0e59e642c7ac"
            },
            spec: {
              channel: "dev/dev",
              name: "",
              packageFilter: { version: "1.x" },
              source: "",
              sourceNamespace: ""
            }
          }
        },
        resourceVersion: ""
      },
      {
        channel: "",
        creationTimestamp: "",
        name: "",
        namespace: "",
        raw: {
          __typename: "Subscription",
          metadata: {
            __typename: "Metadata",
            creationTimestamp: "2019-06-26T19:26:37Z",
            name: "mydevsub",
            namespace: "default"
          },
          raw: {
            apiVersion: "app.ibm.com/v1alpha1",
            kind: "Subscription",
            metadata: {
              annotations: {
                "app.ibm.com/hosting-deployable": "default/mydevsub-deployable",
                "app.ibm.com/managed-cluster": "/",
                "app.ibm.com/syncid": "default/mydevsub-deployable",
                "app.ibm.com/syncsource": "deployable"
              },
              creationTimestamp: "2019-06-26T19:26:37Z",
              generation: 2,
              name: "mydevsub",
              namespace: "default",
              resourceVersion: "11171499",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mydevsub",
              uid: "50fc328d-9848-11e9-a05f-0e59e642c7ac"
            },
            spec: {
              channel: "default/dev",
              name: "",
              packageFilter: { version: "1.x" },
              source: "",
              sourceNamespace: ""
            }
          }
        },
        resourceVersion: ""
      }
    ];
    expect(getSubscriptionsList(subscriptionList)).toEqual(result);
  });
  it("should return blank array", () => {
    expect(getSubscriptionsList(subscriptionDud)).toEqual([]);
  });
});

describe("filterSingleApp", () => {
  const applicationList = {
    items: [
      { name: "dart", namespace: "default" },
      { name: "shanna", namespace: "default" },
      { name: "sheee", namespace: "default" },
      { name: "sheee", namespace: "ocm" }
    ]
  };
  const applicationDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  };
  it("should return applicationList list of 2", () => {
    const result = {
      items: [
        { name: "shanna", namespace: "default" },
        { name: "sheee", namespace: "default" }
      ]
    };
    expect(filterSingleApp(applicationList, "sh", "default")).toEqual(result);
  });
  it("should return applicationList list of 1", () => {
    const result = {
      items: [{ name: "sheee", namespace: "ocm" }]
    };
    expect(filterSingleApp(applicationList, "sheee", "ocm")).toEqual(result);
  });
  it("should return applicationList list of 0", () => {
    const result = {
      items: []
    };
    expect(filterSingleApp(applicationList, "haschel", "default")).toEqual(
      result
    );
  });
  it("should return what was inputed", () => {
    expect(filterSingleApp(applicationDud)).toEqual(applicationDud);
  });
});

describe("filterApps", () => {
  const applicationList = {
    items: [
      { name: "dart", namespace: "default" },
      { name: "shanna", namespace: "default" },
      { name: "sheee", namespace: "default" },
      { name: "sheee", namespace: "ocm" }
    ]
  };
  const applicationDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  };
  it("should return applicationList list of 3", () => {
    const result = {
      items: [
        { name: "shanna", namespace: "default" },
        { name: "sheee", namespace: "default" },
        { name: "sheee", namespace: "ocm" }
      ]
    };
    expect(filterApps(applicationList, "sh")).toEqual(result);
  });
  it("should return applicationList list of 2", () => {
    const result = {
      items: [
        { name: "sheee", namespace: "default" },
        { name: "sheee", namespace: "ocm" }
      ]
    };
    expect(filterApps(applicationList, "she")).toEqual(result);
  });
  it("should return applicationList list of 1", () => {
    const result = {
      items: [{ name: "dart", namespace: "default" }]
    };
    expect(filterApps(applicationList, "d")).toEqual(result);
  });
  it("should return applicationList list of 0", () => {
    const result = {
      items: []
    };
    expect(filterApps(applicationList, "mortgage-app")).toEqual(result);
  });
  it("should return what was inputed", () => {
    expect(filterApps(applicationDud)).toEqual(applicationDud);
  });
});

describe("getChannelsList", () => {
  it("return list of channels", () => {
    const channels = getChannelsList(channelsSample);
    expect(channels[0].name).toEqual("channel1");
    expect(channels[1].name).toEqual("channel2");
    expect(channels[2].name).toEqual("channel3");
  });

  it("no channels", () => {
    const channels = getChannelsList({});
    expect(channels).toHaveLength(0);
  });
});

describe("getSubscribedChannels", () => {
  const channels = [
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "open-cluster-management",
      type: "Git"
    },
    {
      id: "mortgage-channel",
      name: "mortgage-channel",
      namespace: "mortgage-ch",
      type: "GitHub"
    },
    {
      id: "mortgagedc-channel",
      name: "mortgagedc-channel",
      namespace: "mortgagedc-ch",
      type: "GitHub"
    },
    {
      id: "dev",
      name: "dev",
      namespace: "ch-obj",
      type: "ObjectBucket"
    },
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "gbapp-ch",
      type: "GitHub"
    }
  ];
  const applications = [
    {
      name: "app-obj",
      namespace: "obj-sub-ns",
      dashboard: null,
      clusterCount: 3,
      hubSubscriptions: [
        {
          status: "Propagated",
          channel: "ch-obj/dev"
        },
        {
          status: "Propagated",
          channel: "ch-obj/dev"
        },
        {
          status: "Propagated",
          channel: "ch-obj/dev"
        }
      ]
    }
  ];
  const selectedApp = {
    isSingleApplicationView: true,
    selectedAppName: "app-obj",
    selectedAppNamespace: "obj-sub-ns"
  };
  const allAppbreadcrumbs = [
    {
      label: "Applications",
      url: "/multicloud/applications"
    }
  ];
  const hideAppDeployments = {
    showAllChannels: false
  };
  const showAppDeployments = {
    showAllChannels: true
  };

  const allChannelsResult = [
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "open-cluster-management",
      type: "Git"
    },
    {
      id: "mortgage-channel",
      name: "mortgage-channel",
      namespace: "mortgage-ch",
      type: "GitHub"
    },
    {
      id: "mortgagedc-channel",
      name: "mortgagedc-channel",
      namespace: "mortgagedc-ch",
      type: "GitHub"
    },
    { id: "dev", name: "dev", namespace: "ch-obj", type: "ObjectBucket" },
    {
      id: "guestbook-app-latest",
      name: "guestbook-app-latest",
      namespace: "gbapp-ch",
      type: "GitHub"
    }
  ];

  it("all applications view returns all channels", () => {
    expect(
      getSubscribedChannels(
        channels,
        applications,
        allAppbreadcrumbs,
        hideAppDeployments
      )
    ).toEqual(allChannelsResult);
  });

  it("all applications view returns all channels", () => {
    expect(
      getSubscribedChannels(
        channels,
        applications,
        allAppbreadcrumbs,
        showAppDeployments
      )
    ).toEqual(allChannelsResult);
  });

  it("single applications view returns all channels", () => {
    expect(
      getSubscribedChannels(
        channels,
        applications,
        selectedApp,
        showAppDeployments
      )
    ).toEqual(allChannelsResult);
  });

  it("multiple applications returns all channels", () => {
    const apps = [
      {
        name: "app-obj",
        namespace: "obj-sub-ns",
        dashboard: null,
        clusterCount: 3,
        hubSubscriptions: [
          {
            status: "Propagated",
            channel: "ch-obj/dev"
          }
        ]
      },
      {
        name: "app-obj2",
        namespace: "obj-sub-ns2",
        dashboard: null,
        clusterCount: 3,
        hubSubscriptions: [
          {
            status: "Propagated",
            channel: "ch-obj2/dev2"
          }
        ]
      }
    ];
    expect(
      getSubscribedChannels(channels, apps, selectedApp, showAppDeployments)
    ).toEqual(allChannelsResult);
  });

  it("single applications view returns subscribed channels", () => {
    const result = [
      { id: "dev", name: "dev", namespace: "ch-obj", type: "ObjectBucket" }
    ];
    expect(
      getSubscribedChannels(
        channels,
        applications,
        selectedApp,
        hideAppDeployments
      )
    ).toEqual(result);
  });

  it("single applications view returns subscribed channels", () => {
    const breadcrumbs = [
      {
        label: "Applications",
        url: "/multicloud/applications"
      },
      {
        label: "guestbook-app",
        url: "/multicloud/applications/open-cluster-management/guestbook-app"
      }
    ];
    const apps = [
      {
        name: "guestbook-app",
        namespace: "open-cluster-management",
        dashboard: null,
        clusterCount: 3,
        hubSubscriptions: [
          {
            status: "Propagated",
            channel: "open-cluster-management/guestbook-app-latest"
          },
          {
            status: "Propagated",
            channel: "open-cluster-management/guestbook-app-latest"
          },
          {
            status: "Propagated",
            channel: "open-cluster-management/guestbook-app-latest"
          }
        ]
      }
    ];
    const result = [
      {
        id: "guestbook-app-latest",
        name: "guestbook-app-latest",
        namespace: "open-cluster-management",
        type: "Git"
      }
    ];
    expect(
      getSubscribedChannels(channels, apps, selectedApp, hideAppDeployments)
    ).toEqual(result);
  });
});

describe("getPlacementRuleFromBulkSubscription", () => {
  it("has placement rule", () => {
    const placementRules = getPlacementRuleFromBulkSubscription(
      placementRuleSampleData
    );

    expect(placementRules.name).toEqual("pr1");
    expect(placementRules.namespace).toEqual("default");
  });

  it("no placement rule", () => {
    const placementRules = getPlacementRuleFromBulkSubscription({});
    expect(placementRules).toBeUndefined;
  });
});

const subscriptionInApplicationSample = [
  {
    name: "app1",
    namespace: "default",
    related: [
      {
        kind: "subscription",
        items: [
          { name: "sub1", namespace: "default", status: "propagated" },
          { name: "sub2", namespace: "default", status: "" },
          { name: "sub3", namespace: "default", status: "propagated" }
        ]
      }
    ]
  }
];

const channelsSample = {
  items: [
    { name: "channel1", namespace: "default" },
    { name: "channel2", namespace: "default" },
    { name: "channel3", namespace: "default" }
  ]
};

const placementRuleSampleData = {
  name: "app1",
  namespace: "default",
  related: [
    {
      kind: "placementrule",
      items: [
        { name: "pr1", namespace: "default" },
        { name: "pr2", namespace: "default" },
        { name: "pr3", namespace: "default" },
        { name: "pr4", namespace: "default" },
        { name: "pr5", namespace: "default" },
        { name: "pr6", namespace: "default" }
      ]
    }
  ]
};

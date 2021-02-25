// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { getUpdates } from "../../../../../src-web/components/ApplicationTopologyModule/deployers/hcm-application-deployer";
import { parse } from "../../../../../lib/client/design-helper";

const prevParsed = `
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  creationTimestamp: "2020-02-18T23:57:04Z"
  generation: 2
  labels:
    app: mortgage-app-mortgage
    chart: mortgage-1.0.3
    heritage: Tiller
    release: mortgage-app
  name: mortgage-app-placement
  namespace: default
  resourceVersion: "6230878"
  selfLink: /apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement
  uid: 5cdaa081-52aa-11ea-bf05-00000a102d26
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
status:
  decisions:
  - clusterName: localcluster
    clusterNamespace: localcluster-ns
`;

const curParsed = `
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  creationTimestamp: "2020-02-18T23:57:04Z"
  generation: 2
  labels:
    app: mortgage-app-mortgage
    chart: mortgage-1.0.3
    heritage: Tiller
    release: mortgage-app
  name: mortgage-app-placement
  namespace: default
  resourceVersion: "6230878"
  selfLink: /apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement
  uid: 5cdaa081-52aa-11ea-bf05-00000a102d26
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 3
status:
  decisions:
  - clusterName: localcluster
    clusterNamespace: localcluster-ns
`;

const origRaw = `
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  creationTimestamp: "2020-02-18T23:57:04Z"
  generation: 2
  labels:
    app: mortgage-app-mortgage
    chart: mortgage-1.0.3
    heritage: Tiller
    release: mortgage-app
  name: mortgage-app-placement
  namespace: default
  resourceVersion: "6230878"
  selfLink: /apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement
  uid: 5cdaa081-52aa-11ea-bf05-00000a102d26
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
status:
  decisions:
  - clusterName: localcluster
    clusterNamespace: localcluster-ns
`;
describe("hcm-application-deployer one resource", () => {
  const expected = {
    cantUpdate: false,
    updates: [
      {
        name: "mortgage-app-placement",
        namespace: "default",
        resource: {
          apiVersion: "app.ibm.com/v1alpha1",
          kind: "PlacementRule",
          metadata: {
            creationTimestamp: "2020-02-18T23:57:04Z",
            generation: 2,
            labels: {
              app: "mortgage-app-mortgage",
              chart: "mortgage-1.0.3",
              heritage: "Tiller",
              release: "mortgage-app"
            },
            name: "mortgage-app-placement",
            namespace: "default",
            resourceVersion: undefined,
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/default/placementrules/mortgage-app-placement",
            uid: "5cdaa081-52aa-11ea-bf05-00000a102d26"
          },
          spec: {
            clusterSelector: {
              matchLabels: {
                environment: "Dev"
              }
            },
            clusterReplicas: 3
          },
          status: {
            decisions: [
              {
                clusterName: "localcluster",
                clusterNamespace: "localcluster-ns"
              }
            ]
          }
        },
        resourceType: {
          list: "HCMPlacementRuleList",
          name: "HCMPlacementRule"
        },
        selfLink: undefined
      }
    ]
  };

  it("parses as expected", () => {
    const updates = getUpdates(
      parse(prevParsed).parsed,
      parse(curParsed).parsed,
      parse(origRaw).parsed
    );

    expect(updates.updates).toEqual(expected.updates);
  });
});

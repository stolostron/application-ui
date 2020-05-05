/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { validator } from "../../../../../src-web/components/ApplicationTopologyModule/validators/hcm-application-validator";
import { parse } from "../../../../../lib/client/design-helper";

const app = `apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: mortgage-app
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  componentKinds:
  - group: app.ibm.com
    kind: Subscription
  descriptor: {}
  selector:
    matchExpressions:
    - key: release
      operator: In
      values:
      - mortgage-app
---
apiVersion: app.ibm.com/v1alpha1
kind: Subscription
metadata:
  name: mortgage-app-subscription
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  channel: default/mortgage-channel
  placement:
    placementRef:
      kind: PlacementRule
      name: mortgage-app-placement
---
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  name: mortgage-app-placement
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
---
apiVersion: app.ibm.com/v1alpha1
kind: Deployable
metadata:
  name: mortgage-app-deployable
  namespace: default
spec:
  template:
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: mortgage-app-mortgage
      name: mortgage-app-deploy
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mortgage-app-mortgage
---
apiVersion: app.ibm.com/v1alpha1
kind: Service
metadata:
  name: mortgage-app-svc
spec:
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 6443
  selector:
    matchLabels:
      app: mortgage-app-mortgage
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mcm-application-ui-app
spec:
  selector:
    matchLabels:
      app: mcm-application-ui-app
`;
const missingKind = `apiVersion: app.ibm.com/v1alpha1
kind: Subscription
metadata:
  name: mortgage-app-subscription
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  channel: default/mortgage-channel
  placement:
    placementRef:
      kind: PlacementRule
      name: mortgage-app-placement
---
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  name: mortgage-app-placement
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
---
apiVersion: app.ibm.com/v1alpha1
kind: Deployable
metadata:
  name: mortgage-app-deployable
  namespace: default
spec:
  template:
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: mortgage-app-mortgage
      name: mortgage-app-deploy
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mortgage-app-mortgage
---
apiVersion: app.ibm.com/v1alpha1
kind: Service
metadata:
  name: mortgage-app-svc
spec:
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 6443
  selector:
    matchLabels:
      app: mortgage-app-mortgage
`;

const missingKey = `apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  componentKinds:
  - group: app.ibm.com
    kind: Subscription
  descriptor: {}
  selector:
    matchExpressions:
    - key: release
      operator: In
      values:
      - mortgage-app
---
apiVersion: app.ibm.com/v1alpha1
kind: Subscription
metadata:
  name: mortgage-app-subscription
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  channel: default/mortgage-channel
  placement:
    placementRef:
      kind: PlacementRule
      name: mortgage-app-placement
---
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  name: mortgage-app-placement
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
---
apiVersion: app.ibm.com/v1alpha1
kind: Deployable
metadata:
  name: mortgage-app-deployable
  namespace: default
spec:
  template:
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: mortgage-app-mortgage
      name: mortgage-app-deploy
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mortgage-app-mortgage
---
apiVersion: app.ibm.com/v1alpha1
kind: Service
metadata:
  name: mortgage-app-svc
spec:
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 6443
  selector:
    matchLabels:
      app: mortgage-app-mortgage
`;

const badValue = `apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name:
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  componentKinds:
  - group: app.ibm.com
    kind: Subscription
  descriptor: {}
  selector:
    matchExpressions:
    - key: release
      operator: In
      values:
      - mortgage-app
---
apiVersion: app.ibm.com/v1alpha1
kind: Subscription
metadata:
  name: mortgage-app-subscription
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  channel: default/mortgage-channel
  placement:
    placementRef:
      kind: PlacementRule
      name: mortgage-app-placement
---
apiVersion: app.ibm.com/v1alpha1
kind: PlacementRule
metadata:
  name: mortgage-app-placement
  namespace: default
  labels:
    app: mortgage-app-mortgage
spec:
  clusterSelector:
    matchLabels:
      environment: Dev
  clusterReplicas: 2
---
apiVersion: app.ibm.com/v1alpha1
kind: Deployable
metadata:
  name: mortgage-app-deployable
  namespace: default
spec:
  template:
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      labels:
        app: mortgage-app-mortgage
      name: mortgage-app-deploy
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mortgage-app-mortgage
---
apiVersion: app.ibm.com/v1alpha1
kind: Service
metadata:
  name: mortgage-app-svc
spec:
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 6443
  selector:
    matchLabels:
      app: mortgage-app-mortgage
`;

describe("hcm-application-validator one resource", () => {
  it("validates as expected", () => {
    const validated = parse(app, validator, "en-US");

    expect(validated.exceptions).toEqual([]);
  });
});

describe("hcm-application-validator missing kind", () => {
  it("validates as expected", () => {
    const validated = parse(missingKind, validator, "en-US");

    expect(validated.exceptions.length).toEqual(1);
    expect(validated.exceptions[0].text).toEqual("Missing resource kind: {0}");
  });
});

describe("hcm-application-validator missing key", () => {
  it("validates as expected", () => {
    const validated = parse(missingKey, validator, "en-US");

    expect(validated.exceptions.length).toEqual(1);
    expect(validated.exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });
});

describe("hcm-application-validator bad value", () => {
  it("validates as expected", () => {
    const validated = parse(badValue, validator, "en-US");

    expect(validated.exceptions.length).toEqual(1);
    expect(validated.exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });
});

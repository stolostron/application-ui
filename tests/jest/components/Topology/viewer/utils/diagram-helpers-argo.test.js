// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { showArgoApplicationSetLink } from "../../../../../../src-web/components/Topology/utils/diagram-helpers-argo";

describe("showArgoApplicationSetLink", () => {
  const argoAppsWithAppSet = {
    id: "application--nginx-in-cluster",
    type: "application",
    name: "nginx-in-cluster",
    namespace: "openshift-gitops",
    specs: {
      raw: {
        apiVersion: "argoproj.io/v1alpha1",
        kind: "Application",
        metadata: {
          ownerReferences: [
            {
              kind: "ApplicationSet",
              name: "nginx-sample"
            }
          ]
        }
      }
    }
  };
  const argoAppsNoAppSet = {
    id: "application--nginx-in-cluster",
    type: "application",
    name: "nginx-in-cluster",
    namespace: "openshift-gitops",
    specs: {
      raw: {
        apiVersion: "argoproj.io/v1alpha1",
        kind: "Application",
        metadata: {
          ownerReferences: []
        }
      }
    }
  };

  const argoAppsNoAppSet2 = {
    id: "application--nginx-in-cluster",
    type: "application",
    name: "nginx-in-cluster",
    namespace: "openshift-gitops",
    specs: {
      raw: {
        apiVersion: "argoproj.io/v1alpha1",
        kind: "Application",
        metadata: {}
      }
    }
  };

  const result = [
    {
      type: "spacer"
    },
    {
      labelValue: "Application set",
      value: "nginx-sample"
    },
    {
      type: "link",
      value: {
        label: "View application set YAML",
        data: {
          action: "show_resource_yaml",
          cluster: "local-cluster",
          editLink:
            "/resources?apiversion=argoproj.io%2Fv1alpha1&cluster=local-cluster&kind=applicationset&name=nginx-sample&namespace=openshift-gitops"
        }
      },
      indent: true
    },
    {
      type: "spacer"
    }
  ];
  it("returns application set ", () => {
    expect(showArgoApplicationSetLink(argoAppsWithAppSet, [])).toEqual(result);
  });

  it("returns no application set ", () => {
    expect(showArgoApplicationSetLink(argoAppsNoAppSet, [])).toEqual([]);
  });

  it("returns no application set, no owner ref set", () => {
    expect(showArgoApplicationSetLink(argoAppsNoAppSet2, [])).toEqual([]);
  });
});

// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { getLegendTitle } from "../../../../../../src-web/components/Topology/viewer/defaults/titles";

const locale = "en-US";

describe("getLegendTitle", () => {
  const titleMap = new Map([
    ["deploymentconfig", "DeploymentConfig"],
    ["replicationcontroller", "ReplicationController"],
    ["daemonset", "DaemonSet"],
    ["replicaset", "ReplicaSet"],
    ["configmap", "ConfigMap"],
    ["customresource", "CustomResource"],
    ["statefulset", "StatefulSet"],
    ["storageclass", "StorageClass"],
    ["serviceaccount", "ServiceAccount"],
    ["securitycontextconstraints", "SecurityContextConstraints"],
    ["inmemorychannel", "InMemoryChannel"],
    ["integrationplatform", "IntegrationPlatform"],
    ["persistentvolumeclaim", "PersistentVolumeClaim"],
    ["application", "Application"],
    ["placements", "Placements"],
    ["unknown", "Unknown"],
    ["", ""],
    [undefined, ""]
  ]);

  it("should get the correct title", () => {
    titleMap.forEach((value, key) => {
      expect(getLegendTitle(key, locale)).toEqual(value);
    });
  });
});

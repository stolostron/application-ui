/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { getLegendTitle } from "../../../../../../src-web/components/Topology/viewer/defaults/titles";

const locale = "en-US";

describe("getLegendTitle", () => {
  const titleMap = new Map([
    ["deploymentconfig", "Deployment Config"],
    ["replicationcontroller", "Replication Controller"],
    ["daemonset", "DaemonSet"],
    ["replicaset", "ReplicaSet"],
    ["configmap", "ConfigMap"],
    ["customresource", "Custom Resource"],
    ["statefulset", "StatefulSet"],
    ["storageclass", "Storage Class"],
    ["serviceaccount", "Service Account"],
    ["securitycontextconstraints", "Security Context Constraints"],
    ["inmemorychannel", "In Memory Channel"],
    ["integrationplatform", "Integration Platform"],
    ["persistentvolumeclaim", "Persistent Volume Claim"],
    ["application", "Application"],
    ["rules", "Rules"],
    ["unknown", "Unknown"],
    ["", ""]
  ]);

  it("should get the correct title", () => {
    titleMap.forEach((value, key) => {
      expect(getLegendTitle(key, locale)).toEqual(value);
    });
  });
});

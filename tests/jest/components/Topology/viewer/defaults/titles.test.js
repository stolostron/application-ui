/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { getLegendTitle } from "../../../../../../src-web/components/Topology/viewer/defaults/titles";

const locale = "en-US";

describe("getLegendTitle", () => {
  const titleMap = new Map([
    ["deploymentconfig", "Deployment config"],
    ["replicationcontroller", "Replication controller"],
    ["daemonset", "DaemonSet"],
    ["replicaset", "ReplicaSet"],
    ["configmap", "ConfigMap"],
    ["customresource", "Custom resource"],
    ["statefulset", "StatefulSet"],
    ["storageclass", "Storage class"],
    ["serviceaccount", "Service account"],
    ["securitycontextconstraints", "Security Context Constraints"],
    ["inmemorychannel", "In memory channel"],
    ["integrationplatform", "Integration platform"],
    ["persistentvolumeclaim", "Persistent Volume Claim"],
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

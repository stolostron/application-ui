/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { parse } from "../../../../lib/client/design-helper";
import { validator } from "../../../../src-web/definitions/validators/hcm-placementrule-validator";

const placementRuleSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  name: ____________________________createPlacementRule-metadata-name\n  namespace: _______________________createPlacementRule-metadata-namespace\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const noAPIVersionSample =
  "kind: PlacementRule\nmetadata:\n  name: ____________________________createPlacementRule-metadata-name\n  namespace: _______________________createPlacementRule-metadata-namespace\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const noPlacementruleKindSample =
  "apiVersion: apps.open-cluster-management.io/v1\nmetadata:\n  name: ____________________________createPlacementRule-metadata-name\n  namespace: _______________________createPlacementRule-metadata-namespace\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const noNameKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  namespace: ns1\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const noNamespaceKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  name: n1\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const noRequiredValuesSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  name:\n  namespace:\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

const unknownKeySample =
  "bbbb\napiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  name: ____________________________createPlacementRule-metadata-name\n  namespace: _______________________createPlacementRule-metadata-namespace\nspec:\n  clusterLabels:\n    matchLabels: ___________________createPlacementRule-spec-clusterLabels-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas";

describe("validator testing for hcm-placementrule", () => {
  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without Application kind", () => {
    const { exceptions } = parse(noPlacementruleKindSample, validator, "en-un");
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual("Missing resource kind: {0}");
    expect(exceptions[1].text).toEqual(
      "Resource is missing a kind declaration, such as kind: {0}"
    );
  });

  it("validation failure without name and namespace values", () => {
    const { exceptions } = parse(noRequiredValuesSample, validator, "en-un");
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
    expect(exceptions[1].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure without name key", () => {
    const { exceptions } = parse(noNameKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without namespace key", () => {
    const { exceptions } = parse(noNamespaceKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure with unknown key", () => {
    const { exceptions } = parse(unknownKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "End of the stream or a document separator is expected"
    );
  });

  it("yaml sample should be validated successfully", () => {
    const { exceptions } = parse(placementRuleSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });
});

/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { parse } from "../../../../lib/client/design-helper";
import { validator } from "../../../../src-web/definitions/validators/hcm-application-validator";

const validSample =
  "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: n1\n  namespace: ns1\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const noAPIVersionSample =
  "kind: Application\nmetadata:\n  name: n1\n  namespace: ns1\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const noApplicationKindSample =
  "apiVersion: app.k8s.io/v1beta1\nmetadata:\n  namespace: _____________________createApplication-metadata-namespace\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const noNameKeySample =
  "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  namespace: ns1\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const noNamespaceKeySample =
  "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: n1\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const noRequiredValuesSample =
  "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name:\n  namespace:\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

const unknownKeySample =
  "bbbb \napiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: n1\n  namespace: ns1\nspec:\n  componentKinds:\n  - group: app.ibm.com\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values";

describe("validator testing for hcm-application", () => {
  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without Application kind", () => {
    const { exceptions } = parse(noApplicationKindSample, validator, "en-un");
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
    const { exceptions } = parse(validSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });
});

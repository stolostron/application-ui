/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { parse } from "../../../../lib/client/design-helper";
import { validator } from "../../../../src-web/definitions/validators/hcm-channel-validator";

const validNamespaceSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n gates:\n annotations: foo\n pathname: foo\n sourceNamespaces: foo\n type: Namespace";
const validHelmRepoSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n configRef:\n name: foo\n type: HelmRepo\n---\napiVersion: v1\nkind: ConfigMap\nmetadata:\n name: cf1\n namespace: ns1";
const validObjectStoreSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n type: ObjectBucket\n pathname: foo\n secretRef:\n name: sr1\n gates:\n annotations: foo";
const validGitHubRepoSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n type: GitHub\n pathname: foo";
const validGitRepoSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n type: Git\n pathname: foo";

const requiredNamespaceSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: Namespace";
const requiredHelmRepoSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: HelmRepo";
const requiredObjectStoreSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: ObjectBucket";
const requiredGitHubRepoSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: GitHub";
const requiredGitRepoSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: Git";

const noPathnameKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n type: Namespace";
const noPathnameValueSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname:\n type: Namespace";

const noAPIVersionKeySample =
  "kind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: HelmRepo";
const noAPIVersionValueSample =
  "apiVersion:\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: HelmRepo";

const noKindKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: ObjectBucket";
const noKindValueSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind:\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type: ObjectBucket";

const noNameKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n namespace: ns1\nspec:\n pathname: foo\n type: GitHub";
const noNamespaceKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\nspec:\n pathname: foo\n type: GitHub";
const noNameNamespaceValueSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name:\n namespace:\nspec:\n pathname: foo\n type: GitHub";

const noTypeKeySample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo";
const noTypeValueSample =
  "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n pathname: foo\n type:";

const unknownTypeValueSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: unknown";

describe("validator testing for hcm-channel", () => {
  it("validation failure without pathname key", () => {
    const { exceptions } = parse(noPathnameKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without pathname value", () => {
    const { exceptions } = parse(noPathnameValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure without Channel kind", () => {
    const { exceptions } = parse(noKindKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual("Missing resource kind: {0}");
    expect(exceptions[1].text).toEqual(
      "Resource is missing a kind declaration, such as kind: {0}"
    );
  });

  it("validation failure without Channel kind value", () => {
    const { exceptions } = parse(noKindValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual("Missing resource kind: {0}");
    expect(exceptions[1].text).toEqual("Unexpected resource kind: {0}");
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

  it("validation failure without name and namespace values", () => {
    const { exceptions } = parse(
      noNameNamespaceValueSample,
      validator,
      "en-un"
    );
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
    expect(exceptions[1].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure without type key", () => {
    const { exceptions } = parse(noTypeKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without type value", () => {
    const { exceptions } = parse(noTypeValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure with unknown type value", () => {
    const { exceptions } = parse(unknownTypeValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to one of these values: {1}"
    );
  });

  it("validNamespaceSample should be validated successfully", () => {
    const { exceptions } = parse(validNamespaceSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("validHelmRepoSample should be validated successfully", () => {
    const { exceptions } = parse(validHelmRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("validObjectStoreSample should be validated successfully", () => {
    const { exceptions } = parse(validObjectStoreSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("validGitHubRepoSample should be validated successfully", () => {
    const { exceptions } = parse(validGitHubRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("validGitRepoSample should be validated successfully", () => {
    const { exceptions } = parse(validGitRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("requiredNamespaceSample should be validated successfully", () => {
    const { exceptions } = parse(requiredNamespaceSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("requiredHelmRepoSample should be validated successfully", () => {
    const { exceptions } = parse(requiredHelmRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("requiredObjectStoreSample should be validated successfully", () => {
    const { exceptions } = parse(requiredObjectStoreSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("requiredGitHubRepoSample should be validated successfully", () => {
    const { exceptions } = parse(requiredGitHubRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("requiredGitRepoSample should be validated successfully", () => {
    const { exceptions } = parse(requiredGitRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });
});

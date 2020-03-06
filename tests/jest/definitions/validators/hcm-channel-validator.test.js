/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { parse } from "../../../../lib/client/design-helper";
import { validator } from "../../../../src-web/definitions/validators/hcm-channel-validator";

const validNamespaceSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";
const validHelmRepoSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  pathname: ________________________createChannel-specHelmRepo-pathname\n  configRef:\n    name: __________________________createChannel-specHelmRepo-configRef-name\n  type: HelmRepo\n---\napiVersion: v1______________________createChannel-configMap-apiVersion\nkind: ConfigMap\nmetadata:\n  name: ____________________________createChannel-configMap-metadata-name\n  namespace: ns1";
const validObjectBucketSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n name: ch1\n namespace: ns1\nspec:\n type: ObjectBucket\n pathname: _________________________createChannel-specObjectBucket-pathname\n secretRef:\n   name: ___________________________createChannel-specObjectBucket-secretRef-name\n gates:\n   annotations: ____________________createChannel-specObjectBucket-gate-annotations";
const validGitRepoSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  type: GitHub\n  pathname: ________________________createChannel-specGitRepo-pathname";

const noAPIVersionSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";

const noChannelKindSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";

const noNameKeySample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";

const noNamespaceKeySample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";

const noRequiredValuesSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name:\n  namespace:\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace";

const noTypeKeySample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces";

const noTypeValueSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type:";

const unknownTypeValueSample =
  "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: ns1\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Channel\nmetadata:\n  name: ch1\n  namespace: ns1\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: ________________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: unknown";

describe("validator testing for hcm-channel", () => {
  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without Channel kind", () => {
    const { exceptions } = parse(noChannelKindSample, validator, "en-un");
    expect(exceptions.length).toEqual(2);
    expect(exceptions[0].text).toEqual("Missing resource kind: {0}");
    expect(exceptions[1].text).toEqual(
      "Resource is missing a kind declaration, such as kind: {0}"
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

  it("validObjectBucketSample should be validated successfully", () => {
    const { exceptions } = parse(validObjectBucketSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });

  it("validGitRepoSample should be validated successfully", () => {
    const { exceptions } = parse(validGitRepoSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });
});

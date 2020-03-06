/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { parse } from "../../../../lib/client/design-helper";
import { validator } from "../../../../src-web/definitions/validators/hcm-subscription-validator";

const subscriptionSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noAPIVersionSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSubscriptionKindSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noNameKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  namespace: ns1\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noNamespaceKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: n1\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noRequiredValuesSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name:\n  namespace:\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecChannelKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecChannelValueSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: \n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecPlacementKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecPlacementRefKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecKindKeySample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const noSpecKindValueSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: \n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const unknownSpecKindValueSample =
  "apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: unknown\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

const unknownKeySample =
  "bbbb\napiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: app.ibm.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: '\"active\"'\n  location: '\"America/Toronto\"'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours";

describe("validator testing for hcm-subscription", () => {
  it("validation failure without API version", () => {
    const { exceptions } = parse(noAPIVersionSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without Application kind", () => {
    const { exceptions } = parse(noSubscriptionKindSample, validator, "en-un");
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

  it("validation failure without spec channel key", () => {
    const { exceptions } = parse(noSpecChannelKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without spec channel value", () => {
    const { exceptions } = parse(noSpecChannelValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure without spec placement key", () => {
    const { exceptions } = parse(noSpecPlacementKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without spec placementRef key", () => {
    const { exceptions } = parse(
      noSpecPlacementRefKeySample,
      validator,
      "en-un"
    );
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without spec placement kind key", () => {
    const { exceptions } = parse(noSpecKindKeySample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' resource is missing these keys: {1}"
    );
  });

  it("validation failure without spec placement kind value", () => {
    const { exceptions } = parse(noSpecKindValueSample, validator, "en-un");
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to this value type: {1}"
    );
  });

  it("validation failure with unknown spec placement kind value", () => {
    const { exceptions } = parse(
      unknownSpecKindValueSample,
      validator,
      "en-un"
    );
    expect(exceptions.length).toEqual(1);
    expect(exceptions[0].text).toEqual(
      "The '{0}' key must point to one of these values: {1}"
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
    const { exceptions } = parse(subscriptionSample, validator, "en-un");
    expect(exceptions).toEqual([]);
  });
});

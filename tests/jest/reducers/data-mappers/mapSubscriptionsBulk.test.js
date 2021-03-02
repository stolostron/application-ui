/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
import { mapBulkSubscriptions } from "../../../../src-web/reducers/data-mappers/mapSubscriptionsBulk";
import {
  subscriptions,
  resultSubscriptionsWithChannel
} from "../../components/ReducersTestingData";

describe("data-mappers testing for mapBulkSubscriptions", () => {
  it("mapBulkSubscriptions should return all subscriptions with channels", () => {
    expect(mapBulkSubscriptions(subscriptions.searchResult)).toEqual(
      resultSubscriptionsWithChannel
    );
  });

  it("should not break on empty response", () => {
    const apiResponse = [];

    expect(mapBulkSubscriptions(apiResponse)).toEqual([]);
  });

  it("should not break on undefined response", () => {
    const result = [
      {
        name: "",
        namespace: "",
        selfLink: "",
        _uid: "",
        created: "",
        pathname: "",
        apigroup: "",
        cluster: "",
        kind: "",
        label: "",
        type: "",
        _hubClusterResource: "",
        _rbac: "",
        related: []
      }
    ];

    expect(mapBulkSubscriptions(undefined)).toEqual(result);
  });
});

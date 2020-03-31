/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getLabelsListClass,
  getCsvListClass,
  getSearchUrlDeployable,
  getSearchUrlCluster,
  getClusterCountForSub
} from "../../../../../../src-web/components/ApplicationDeploymentPipeline/components/SubscriptionModal/utils";
import { HCMSubscriptionList } from "../../../TestingData";

describe("getLabelsListClass", () => {
  const input1 = ["a", "b", "c", "d"];
  const input2 = ["a", "b", "c", "d", "e"];
  const input3 = ["a"];

  const output1 = { data: ["a", "b", "+2"], hover: "cd" };
  const output2 = { data: ["a", "b", "+3"], hover: "cde" };
  const output3 = { data: ["a"], hover: "" };

  it("test case 1", () => {
    expect(getLabelsListClass(input1)).toEqual(output1);
  });

  it("test case 2", () => {
    expect(getLabelsListClass(input2)).toEqual(output2);
  });

  it("test case 3, one element in the list", () => {
    expect(getLabelsListClass(input3)).toEqual(output3);
  });
});

describe("getCsvListClass", () => {
  const noData = { data: [], hover: "" };
  const output1 = { data: [" guestbook-subscription-deployable"], hover: "" };
  const output2 = {
    data: [
      " mortgage-app-subscription-deployable",
      " mortgage-app-subscription-deployable2",
      " mortgage-app-subscription-deployable3",
      " mortgage-app-subscription-deployable4",
      " mortgage-app-subscription-deployable5",
      " mortgage-app-subscription-deployable6..."
    ],
    hover: " mortgage-app-subscription-deployable7"
  };

  it("csv list length of undefined", () => {
    // should have no changes
    expect(getCsvListClass(undefined)).toEqual(noData);
  });
  it("csv list length of no related", () => {
    // should have no changes
    expect(getCsvListClass(HCMSubscriptionList.items[0].related)).toEqual(
      noData
    );
  });

  it("csv list length of 3", () => {
    // should have no changes
    expect(getCsvListClass(HCMSubscriptionList.items[2].related)).toEqual(
      output1
    );
  });
  it("csv list length of 7", () => {
    // returns first 5 and ...
    expect(getCsvListClass(HCMSubscriptionList.items[1].related)).toEqual(
      output2
    );
  });
});

describe("getSearchUrlDeployable", () => {
  it("pass value for search url", () => {
    expect(getSearchUrlDeployable("abcdef")).toEqual(
      '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3Aabcdef"}&showrelated=deployable'
    );
  });
});

describe("getSearchUrlCluster", () => {
  it("pass value for search url", () => {
    expect(getSearchUrlCluster("abcdef")).toEqual(
      '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3Aabcdef"}&showrelated=cluster'
    );
  });
});

describe("getClusterCountForSub", () => {
  const id_1 = "local-cluster/xyz123";
  const id_2 = "local-cluster/abc123";
  const data = {
    items: [
      {
        clusterCount: 1,
        hubSubscriptions: [
          {
            _uid: "local-cluster/xyz123"
          }
        ]
      },
      {
        clusterCount: 2,
        hubSubscriptions: [
          {
            _uid: "local-cluster/abc123"
          }
        ]
      }
    ]
  };

  const data_nosubs = {
    items: [
      {
        clusterCount: 1
      }
    ]
  };

  it("finds 1 cluster", () => {
    expect(getClusterCountForSub(id_1, data)).toEqual(1);
  });
  it("finds 2 clusters", () => {
    expect(getClusterCountForSub(id_2, data)).toEqual(2);
  });
  it("finds 0 clusters", () => {
    expect(getClusterCountForSub("", data)).toEqual(0);
  });

  it("finds 0 clusters when no subscriptions", () => {
    expect(getClusterCountForSub("", data_nosubs)).toEqual(0);
  });

  it("finds 0 clusters when app is undefined", () => {
    expect(getClusterCountForSub("", undefined)).toEqual(0);
  });
});

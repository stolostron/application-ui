/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import { shallow } from "enzyme";

import TagInput from "../../../../src-web/components/common/TagInput";

describe("TagInput component 1", () => {
  const fn = jest.fn();
  const tagFilterProps = {
    tags: [
      {
        name: "cloud=IBM",
        id: "cloud=IBM",
        key: "cloud",
        value: "IBM",
        type: "clusterLabel"
      }
    ],
    availableFilters: {
      clusterLabels: [
        {
          name: "cloud=IBM",
          id: "cloud=IBM",
          key: "cloud",
          value: "IBM",
          type: "clusterLabel"
        },
        {
          name: "clusterip=9.42.23.230",
          id: "clusterip=9.42.23.230",
          key: "clusterip",
          value: "9.42.23.230",
          type: "clusterLabel"
        }
      ],
      clusterNames: [
        {
          name: "cluster=crucial-owl",
          id: "crucial-owl",
          value: "crucial-owl",
          type: "clusterName"
        }
      ]
    }
  };
  it("renders as expected", () => {
    const component = shallow(
      <TagInput
        {...tagFilterProps}
        hideModalButton={false}
        onSelectedFilterChange={fn}
      />
    );
    expect(component).toMatchSnapshot();
    //clear all out button
    component
      .find(".tagInput-filterButton")
      .at(0)
      .simulate("click");
    component
      .find(".tagInput-cleanButton")
      .at(0)
      .simulate("click");
    component
      .find(".tagInput-copyButton")
      .at(0)
      .simulate("click");

    component.find(".icon--close--outline").simulate("click");
  });
});

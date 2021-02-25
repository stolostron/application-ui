/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import Tag from "../../../../src-web/components/common/FilterTag";
import renderer from "react-test-renderer";

describe("FilterTag component", () => {
  it("renders as expected", () => {
    const props = {
      classNames: {
        selectedTag: "selectedTag1",
        selectedTagName: "selectedTagName1"
      },
      tag: { classType: "FilterTag" },
      name: "TestingFilterTag1",
      onDelete() {}
    };
    const component = renderer.create(<Tag {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders as expected", () => {
    const props = {
      classNames: {
        selectedTag: "selectedTag2",
        selectedTagName: "selectedTagName2"
      },
      tag: { classType: "keyword" },
      name: "TestingFilterTag2",
      onDelete() {}
    };
    const component = renderer.create(<Tag {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

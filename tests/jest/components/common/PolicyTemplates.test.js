/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import { shallow } from "enzyme";

import PolicyTemplates from "../../../../src-web/components/common/PolicyTemplates";

describe("PolicyTemplates components", () => {
  it("empty", () => {
    const component = shallow(<PolicyTemplates />);
    expect(component).toMatchSnapshot();
  });

  it("default", () => {
    const props = {
      editResource() {},
      resourceType: { name: "policy" },
      resourceData: { __typename: "Compliance" },
      resourcePath: "default/path"
    };
    const component = shallow(<PolicyTemplates {...props} />);
    expect(component).toMatchSnapshot();
  });

  it("default", () => {
    const props = {
      editResource() {},
      resourceType: { name: "policy" },
      resourceData: { __typename: "CompliancePolicyDetail" },
      resourcePath: "default/path"
    };
    const component = shallow(<PolicyTemplates {...props} />);
    expect(component).toMatchSnapshot();
  });
});

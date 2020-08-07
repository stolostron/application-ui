/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/
"use strict";

import React from "react";
import EditorHeader from "../../../../../src-web/components/TemplateEditor/components/EditorHeader";
import renderer from "react-test-renderer";

const type = "application";
const otherYAMLTabs = [];
const handleTabChange = jest.fn;

describe("EditorHeader component", () => {
  it("renders as expected", () => {
    const fn = jest.fn();
    const exceptions = [{ text: "bad", row: 0 }];
    const component = renderer.create(
      <EditorHeader
        otherYAMLTabs={otherYAMLTabs}
        handleTabChange={handleTabChange}
        type={type}
        locale={"en-US"}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

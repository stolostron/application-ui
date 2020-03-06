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

import EditorBar from "../../../../../src-web/components/ApplicationTopologyModule/components/EditorBar";

describe("EditorBar components", () => {
  it("empty", () => {
    const component = shallow(<EditorBar />);
    expect(component).toMatchSnapshot();
  });

  it("default", () => {
    const component = shallow(
      <EditorBar
        hasUndo={false}
        hasRedo={false}
        exceptions={[]}
        gotoEditorLine={jest.fn()}
        handleEditorCommand={jest.fn()}
        handleSearchChange={jest.fn()}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it("has exception", () => {
    const component = shallow(
      <EditorBar
        hasUndo={true}
        hasRedo={true}
        exceptions={[
          {
            type: "error",
            text:
              "testing with a very long message with 64 characters weeeeeeeeeeeee"
          }
        ]}
        gotoEditorLine={jest.fn()}
        handleEditorCommand={jest.fn()}
        handleSearchChange={jest.fn()}
      />
    );
    expect(component).toMatchSnapshot();
  });
});

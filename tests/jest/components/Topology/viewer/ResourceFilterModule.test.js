/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { ResourceFilterView } from "../../../../../src-web/components/Topology/viewer/ResourceFilterModule";

describe("Test ResourceFilterView renderView", () => {
  it("should render the html", () => {
    const rfv = new ResourceFilterView();

    rfv.renderView({ style: {}, props: {} });
  });
});

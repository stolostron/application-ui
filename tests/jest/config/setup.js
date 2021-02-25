/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "cross-fetch/polyfill";
require("jest-canvas-mock");

configure({ adapter: new Adapter() });

document.queryCommandSupported = () => {
  return true;
};

jest.mock("../../../nls/platform.properties", () => ({
  get: jest.fn(key => {
    const msgs = require("./platform-properties.json");
    return msgs[key];
  })
}));

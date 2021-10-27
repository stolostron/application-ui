/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
const React = require("react");
const renderer = require("react-test-renderer");
const ApplicationDeploymentHighlightsTerminology = require("../../../../../src-web/components/ApplicationDeploymentHighlights/ApplicationDeploymentHighlightsTerminology")
  .default;

describe("ApplicationDeploymentHighlightsTerminology", () => {
  it("ApplicationDeploymentHighlightsTerminology renders correctly.", () => {
    const tree = renderer
      .create(<ApplicationDeploymentHighlightsTerminology />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

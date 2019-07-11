/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const React = require('react');
const renderer = require('react-test-renderer');
const CountsCardModule = require('../CountsCardModule')
  .default;

describe('CountsCardModule', () => {
  const countsCardData = [
    {
      msgKey: 'table.header.deployables',
      count: 3,
    },
    {
      msgKey: 'table.header.deployments',
      count: 1,
    },
    {
      msgKey: 'table.header.failedDeployments',
      count: 0,
    },
  ];

  it('CountsCardModule renders correctly.', () => {
    const tree = renderer.create(<CountsCardModule data={countsCardData} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

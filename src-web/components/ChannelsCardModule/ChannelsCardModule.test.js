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
const ChannelsCardModule = require('../ChannelsCardModule')
  .default;

describe('ChannelsCardModule', () => {
  const channelsCardData = [
    {
      name: 'Development',
      counts: {
        pending: {
          total: 2,
        },
        'in progress': {
          total: 3,
        },
        failed: {
          total: 4,
        },
      }
    },
    {
      name: 'QA',
      counts: {
        pending: {
          total: 2,
        },
        'in progress': {
          total: 3,
        },
        failed: {
          total: 4,
        },
      }
    },
    {
      name: 'Dev',
      counts: {
        pending: {
          total: 2,
        },
        'in progress': {
          total: 3,
        },
        failed: {
          total: 4,
        },
      }
    }
  ]

  it('ChannelsCardModule renders correctly.', () => {
    const tree = renderer.create(<ChannelsCardModule data={channelsCardData} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

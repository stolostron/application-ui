/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getChannelChartData } from './utils';

describe('getChannelChartData', () => {
  const channel1 = 'channel1Name';
  const channel2 = 'channel2Name';

  const channelList = {
    items: [{ metadata: { name: channel1 } }, { metadata: { name: channel2 } }],
  };
  const channelListDummy = {
    itteemmss: [
      { metadata: { name: channel1 } },
      { metadata: { name: channel2 } },
    ],
  };

  it('should return channels list of 2', () => {
    const result = [
      {
        name: channel1,
        cm: channel1.length * 20,
        pr: channel1.length * 30,
        fl: channel1.length * 50,
      },
      {
        name: channel2,
        cm: channel2.length * 20,
        pr: channel2.length * 30,
        fl: channel2.length * 50,
      },
    ];
    expect(getChannelChartData(channelList)).toEqual(result);
  });
  it('should return blank array', () => {
    expect(getChannelChartData(channelListDummy)).toEqual([]);
  });
});

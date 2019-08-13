/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getChannelChartData, getDeployedResourcesChartData } from './utils'

describe('getChannelChartData', () => {
  const channel1 = 'channel1Name'
  const channel2 = 'channel2Name'

  const channelList = {
    items: [
      {
        name: channel1,
        related: [
          {
            kind: 'release',
            items: [
              {
                kind: 'release',
                status: 'DEPLOYED'
              },

              {
                kind: 'release',
                status: 'FAILED'
              },
              {
                kind: 'release',
                status: 'SOMETHING ELSE'
              },
              {
                kind: 'release',
                status: 'PROGRESS'
              }
            ]
          }
        ]
      },
      {
        name: channel2,
        related: [
          {
            kind: 'release',
            items: [
              {
                kind: 'release'
              }
            ]
          }
        ]
      }
    ]
  }
  const channelListDummy = {
    itteemmss: [{ name: channel1 }, { name: channel2 }]
  }

  it('should return channels list of 2', () => {
    const result = [
      { cm: 1, fl: 1, name: channel1, pr: 2 },
      { cm: 1, fl: 0, name: channel2, pr: 0 }
    ]
    expect(getChannelChartData(channelList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getChannelChartData(channelListDummy)).toEqual([])
  })
})

describe('getDeployedResourcesChartData', () => {
  const app1 = 'appName1'
  const app2 = 'appName2'

  const appList = {
    items: [
      {
        name: app1,
        related: [
          {
            kind: 'release',
            items: [
              {
                kind: 'release',
                status: 'DEPLOYED'
              },

              {
                kind: 'release',
                status: 'FAILED'
              }
            ]
          }
        ]
      },
      {
        name: app2,
        related: []
      }
    ]
  }
  const appListDummy = {
    itemss: [
      {
        name: app1,
        related: [
          {
            kind: 'release',
            items: [
              {
                kind: 'release',
                status: 'DEPLOYED'
              },

              {
                kind: 'release',
                status: 'FAILED'
              }
            ]
          }
        ]
      },
      {
        name: app2,
        related: []
      }
    ]
  }

  it('should return app resource list of 2', () => {
    const result = [{ name: app1, counter: 2 }, { name: app2, counter: 0 }]

    expect(getDeployedResourcesChartData(appList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getDeployedResourcesChartData(appListDummy)).toEqual([])
  })
})

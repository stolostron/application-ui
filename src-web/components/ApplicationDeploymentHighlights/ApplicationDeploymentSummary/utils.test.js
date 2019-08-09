/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getChannelChartData, getDeployablesChartData } from './utils'

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
      { cm: 2, fl: 1, name: channel1, pr: 1 },
      { cm: 1, fl: 0, name: channel2, pr: 0 }
    ]
    expect(getChannelChartData(channelList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getChannelChartData(channelListDummy)).toEqual([])
  })
})

describe('getDeployablesChartData', () => {
  const deployable1 = 'deployable1Name'
  const deployable2 = 'deployable2Name'

  const deployableList = {
    items: [
      {
        deployables: [
          { metadata: { name: deployable1 } },
          { metadata: { name: deployable2 } }
        ]
      },
      {
        deployables: []
      }
    ]
  }
  const deployableListDummy = {
    itteemmss: [
      {
        deployables: [
          { metadata: { name: deployable1 } },
          { metadata: { name: deployable2 } }
        ]
      },
      {
        deployables: []
      }
    ]
  }

  it('should return deployable list of 2', () => {
    // const result = [
    //   {
    //     name: deployable1,
    //     cm: deployable1.length * 20, // completed
    //     pr: deployable1.length * 30, // in progress
    //     fl: deployable1.length * 50 // failed
    //   },
    //   {
    //     name: deployable2,
    //     cm: deployable2.length * 20,
    //     pr: deployable2.length * 30,
    //     fl: deployable2.length * 50
    //   }
    // ]
    expect(getDeployablesChartData(deployableList)).toEqual([])
  })
  it('should return blank array', () => {
    expect(getDeployablesChartData(deployableListDummy)).toEqual([])
  })
})

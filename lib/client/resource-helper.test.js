/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import { getDeploymentSummary } from './resource-helper'

// return the failed, completed, in progress resources related to these list of items
//the items can be HCMChannelList, HCMApplicationList
describe('getDeploymentSummary', () => {
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
    expect(getDeploymentSummary(channelList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getDeploymentSummary(channelListDummy)).toEqual([])
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { getAllDeployablesStatus } from './utils'

// return the failed, completed, in progress resources related to these list of items
//the items can be HCMChannelList, HCMApplicationList
describe('getAllDeployablesStatus', () => {
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

  it('should return a list of 3 completed, 1 failed, 1 in progress', () => {
    const result = [3, 1, 1]

    expect(getAllDeployablesStatus(channelList)).toEqual(result)
  })
  it('should return an array with 0 completed, 0 failed, 0 in progress', () => {
    const result = [0, 0, 0]
    expect(getAllDeployablesStatus(channelListDummy)).toEqual(result)
  })
})

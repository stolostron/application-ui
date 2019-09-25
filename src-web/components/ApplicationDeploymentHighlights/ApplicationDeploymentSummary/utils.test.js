/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getDeployedResourcesChartData } from './utils'

describe('getDeployedResourcesChartData', () => {
  const app1 = 'appName1'
  const app2 = 'appName2'
  const longName = 'acme-railways-ticketing-myapp'

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
        name: longName,
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

  it('should return app resource list of 2, name truncated for the long name', () => {
    const result = [
      {
        completed: 1,
        name: 'appName1',
        not_completed: 1,
        tooltip_name: 'appName1'
      },
      {
        completed: 1,
        name: longName.substring(0, 20) + '...',
        not_completed: 1,
        tooltip_name: longName
      }
    ]

    expect(getDeployedResourcesChartData(appList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getDeployedResourcesChartData(appListDummy)).toEqual([])
  })
})

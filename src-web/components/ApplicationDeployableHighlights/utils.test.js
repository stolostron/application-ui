/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getDeployableSummary } from './utils'

describe('getDeployableSummary', () => {
  const deplList = {
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
            status: 'In Progress'
          }
        ]
      }
    ]
  }
  const deplListNoStatus = {
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
            kind: 'release'
          }
        ]
      }
    ]
  }
  const deplListDummy = {}

  it('should return depl resource 1 failed, 1 completed', () => {
    const result = [
      {
        msgKey: 'dashboard.card.deployable.versions',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.completed',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        alert: true,
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.pending',
        count: 0
      }
    ]

    expect(getDeployableSummary(deplList)).toEqual(result)
  })
  it('should return depl resource 1 failed, 2 completed because the one with no status goes here, and 1 in progress,  the one with SOMETHING ELSE goes here too', () => {
    const result = [
      {
        msgKey: 'dashboard.card.deployable.versions',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.completed',
        count: 2
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        alert: true,
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.pending',
        count: 0
      }
    ]

    expect(getDeployableSummary(deplListNoStatus)).toEqual(result)
  })
  it('should return blank array', () => {
    const result = [
      {
        msgKey: 'dashboard.card.deployable.versions',
        count: '-'
      },
      {
        msgKey: 'dashboard.card.deployable.completed',
        count: '-'
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        count: '-'
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: '-'
      },
      {
        msgKey: 'dashboard.card.deployable.pending',
        count: '-'
      }
    ]
    expect(getDeployableSummary(deplListDummy)).toEqual(result)
  })
})

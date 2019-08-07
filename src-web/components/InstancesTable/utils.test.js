/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { updatePendingActions } from './utils'

describe('updatePendingActions', () => {
  const items = {
    key1: {
      Name: 'name1'
    },
    key2: {
      Name: 'name2'
    }
  }
  const pendingActions = [
    {
      name: 'name1'
    }
  ]
  it('should handle when items is null', () => {
    expect(updatePendingActions(null, pendingActions)).toEqual(null)
  })
  it('should handle when pendingActions is null', () => {
    expect(updatePendingActions(items, null)).toEqual(items)
  })
  it('should update pending actions and return new items', () => {
    const result = {
      key1: {
        Name: 'name1',
        hasPendingActions: true
      },
      key2: {
        Name: 'name2'
      }
    }
    expect(updatePendingActions(items, pendingActions)).toEqual(result)
  })
})

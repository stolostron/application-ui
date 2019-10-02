/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getChartKeyName, getModuleData, getMaxStringWidth } from './utils'

describe('getChartKeyName', () => {
  const value1 = 'test'

  it('should return Completed', () => {
    expect(getChartKeyName(value1)).toEqual('Completed')
  })
})

describe('getModuleData', () => {
  const name1 = 'firstName'
  const name2 = 'secondName'

  const list = [
    {
      name: name1,
      completed: 1,
      not_completed: 3,
      tooltip_name: name1
    },
    {
      name: name2,
      completed: 1,
      not_completed: 0,
      tooltip_name: name2
    }
  ]
  const listDummy = []

  it('should return line chart data', () => {
    const result = {
      chartCardItems: [
        {
          completed: 1,
          name: 'firstName',
          tooltip_name: 'firstName',
          percent_completed: 0.25,
          percent_not_completed: 0.75,
          total: 4
        },
        {
          completed: 1,
          name: 'secondName',
          tooltip_name: 'secondName',
          percent_completed: 1,
          percent_not_completed: 0,
          total: 1
        }
      ]
    }
    expect(getModuleData(list)).toEqual(result)
  })
  it('should return blank array', () => {
    const result = { chartCardItems: [] }
    expect(getModuleData(listDummy)).toEqual(result)
  })
})

describe('getMaxStringWidth', () => {
  const name1 = 'firstName'
  const name2 = 'secondName'

  const list = [
    {
      name: name1,
      completed: 1,
      not_completed: 0,
      tooltip_name: name1
    },
    {
      name: name2,
      completed: 1,
      not_completed: 1,
      tooltip_name: name2
    }
  ]
  const listDummy = []

  it('should return 10', () => {
    const result = 10
    expect(getMaxStringWidth(list)).toEqual(result)
  })
  it('should return 0', () => {
    const result = 0
    expect(getMaxStringWidth(listDummy)).toEqual(result)
  })
})

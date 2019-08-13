/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import {
  getChartKeyColor,
  getChartKeyName,
  getModuleData,
  getMaxStringWidth
} from './utils'

describe('getChartKeyColor', () => {
  const value = 'counter'

  it('should return #2de3bb', () => {
    const result = '#2de3bb'
    expect(getChartKeyColor(value)).toEqual(result)
  })
})

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
      counter: 1
    },
    {
      name: name2,
      counter: 0
    }
  ]
  const listDummy = []

  it('should return data list of 1', () => {
    const result = {
      chartCardItems: [
        {
          name: name1,
          counter: 1
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
      counter: 1
    },
    {
      name: name2,
      counter: 0
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

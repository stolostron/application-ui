/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getIncidentCount, getIncidentList } from './utils'

describe('getIncidentCount', () => {
  const incidentList = {
    items: [{ one: 'incidentOne' }, { two: 'incidentTwo' }]
  }
  const incidentListBad1 = {
    itteemmss: [{ one: 'incidentOne' }, { two: 'incidentTwo' }]
  }
  const incidentListBad2 = { items: { key: 'value' } }
  it('should return incident count of 2', () => {
    const result = 2
    expect(getIncidentCount(incidentList)).toEqual(result)
  })
  it('should return "-" if items is undefined', () => {
    expect(getIncidentCount(incidentListBad1)).toEqual('-')
  })
  it('should return "-" if items is not an array', () => {
    expect(getIncidentCount(incidentListBad2)).toEqual('-')
  })
})

describe('getIncidentList', () => {
  const incidentList = {
    items: [{ one: 'incidentOne' }, { two: 'incidentTwo' }]
  }
  const incidentListBad = {
    itteemmss: [{ one: 'incidentOne' }, { two: 'incidentTwo' }]
  }
  it('should return incident list of 2', () => {
    const result = [{ one: 'incidentOne' }, { two: 'incidentTwo' }]
    expect(getIncidentList(incidentList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getIncidentList(incidentListBad)).toEqual([])
  })
})

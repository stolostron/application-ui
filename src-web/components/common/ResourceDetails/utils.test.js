/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getIncidentCount,
  getIncidentList,
  getNamespaceAccountId
} from './utils'

const namespaceSingleList = {
  items: [
    {
      metadata: {
        annotations: {
          'mcm.ibm.com/accountID': '2b78-3304',
          'mcm.ibm.com/type': 'Custom',
          'openshift.io/sa.scc.mcs': 's0:c23,c17',
          'openshift.io/sa.scc.supplemental-groups': '1000540000/10000',
          'openshift.io/sa.scc.uid-range': '1000540000/10000'
        },
        name: 'rbac-test',
        __typename: 'Metadata'
      },
      __typename: 'ApplicationNamespace'
    }
  ]
}

const namespaceMultiList = {
  items: [
    {
      metadata: {
        annotations: {
          'mcm.ibm.com/accountID': '2b78-3304',
          'mcm.ibm.com/type': 'Custom',
          'openshift.io/sa.scc.mcs': 's0:c23,c17',
          'openshift.io/sa.scc.supplemental-groups': '1000540000/10000',
          'openshift.io/sa.scc.uid-range': '1000540000/10000'
        },
        name: 'rbac-test',
        __typename: 'Metadata'
      },
      __typename: 'ApplicationNamespace'
    },
    {
      metadata: {
        annotations: {
          'mcm.ibm.com/accountID': '2b78-3308',
          'mcm.ibm.com/type': 'Custom',
          'openshift.io/sa.scc.mcs': 's0:c23,c17',
          'openshift.io/sa.scc.supplemental-groups': '1000540000/10000',
          'openshift.io/sa.scc.uid-range': '1000540000/10000'
        },
        name: 'rbac-test2',
        __typename: 'Metadata'
      },
      __typename: 'ApplicationNamespace'
    }
  ]
}

describe('getNamespaceAccountId', () => {
  it('should return 2b78-3304', () => {
    const result = '2b78-3304'
    const nsname = 'rbac-test'
    expect(getNamespaceAccountId(namespaceSingleList, nsname)).toEqual(result)
  })
  it('should return 2b78-3304 since there is only one object in the list', () => {
    const result = '2b78-3304'
    expect(getNamespaceAccountId(namespaceSingleList)).toEqual(result)
  })
  it('should return 2b78-3308 from namespaceMultiList', () => {
    const result = '2b78-3308'
    const nsname = 'rbac-test2'
    expect(getNamespaceAccountId(namespaceMultiList, nsname)).toEqual(result)
  })
  it('should return undefined', () => {
    expect(getNamespaceAccountId([])).toEqual(undefined)
  })
})

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

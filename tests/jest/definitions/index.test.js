/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import getResourceData, {
//getPrimaryKey,
//getSecondaryKey,
//getURIKey,
  getDefaultSearchField,
  getDefaultSortField,
  //getTableKeys,
  getLink
} from '../../../src-web/definitions/index'

// regular properties/selector/reducer testing
// compare the received and expect values
describe('definitions/index tests', () => {
  it('should return the resource data for specified resource', () => {
    const item = {
      list: 'HCMClusterList',
      name: 'HCMCluster'
    }
    expect(getResourceData(item)).toMatchSnapshot()
  })

  // it('should return the primary key of node', () => {
  //   const item = {
  //     list: 'HCMClusterList',
  //     name: 'HCMCluster'
  //   }
  //   expect(getPrimaryKey(item)).toMatchSnapshot()
  // })
  //
  // it('should return the secondary key', () => {
  //   const item = {
  //     list: 'HCMClusterList',
  //     name: 'HCMCluster'
  //   }
  //   expect(getSecondaryKey(item)).toMatchSnapshot()
  // })
  //
  // it('should return the URI key', () => {
  //   const item = {
  //     list: 'HCMClusterList',
  //     name: 'HCMCluster'
  //   }
  //   expect(getURIKey(item)).toMatchSnapshot()
  // })

  it('should return the default search field of node', () => {
    const item = {
      list: 'HCMClusterList',
      name: 'HCMCluster'
    }
    expect(getDefaultSearchField(item)).toMatchSnapshot()
  })

  it('should return the default sort field of node', () => {
    const item = {
      list: 'HCMClusterList',
      name: 'HCMCluster'
    }
    expect(getDefaultSortField(item)).toMatchSnapshot()
  })

  // it('should return the table keys', () => {
  //   const item = {
  //     list: 'HCMClusterList',
  //     name: 'HCMCluster'
  //   }
  //   expect(getTableKeys(item)).toMatchSnapshot()
  // })

  it('should return the link of node as /namespace/name', () => {
    const link = true
    const resource = {
      metadata: {
        namespace: 'namespace',
        name: 'name'
      }
    }
    expect(getLink(link, resource)).toMatchSnapshot()
  })

  it('should return the link of node as /domain/host', () => {
    const link = 'domain/host'
    const resource = {
      domain: 'domain',
      host: 'host',
      metadata: {
        namespace: 'namespace',
        name: 'name'
      }
    }
    expect(getLink(link, resource)).toMatchSnapshot()
  })
})

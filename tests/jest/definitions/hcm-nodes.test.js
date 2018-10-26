/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {
  getRole,
  getNodeLink,
} from '../../../src-web/definitions/hcm-nodes'

describe('hcm-nodes - getRole', () => {
  it('should return vaild link', () => {
    const item = {
      roles: [
        'proxy', 'management', 'master', 'va'
      ]
    }
    expect(getRole(item)).toMatchSnapshot()
  })
  it('should return "worker" by default', () => {
    const item = {
      roles: null
    }
    expect(getRole(item)).toBe('worker')
  })
})

describe('hcm-nodes - getNodeLink', () => {
  it('should return vaild link', () => {
    const item = {
      cluster: {
        consoleURL: 'https://9.10.11.12:8443'
      },
      metadata: {
        name: 'TestLink'
      }
    }
    expect(getNodeLink(item)).toMatchSnapshot()
  })
})

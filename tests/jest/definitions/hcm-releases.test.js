/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getStatus } from '../../../src-web/definitions/hcm-releases'

describe('hcm-releases - getStatus', () => {
  it('should return deployed', () => {
    const item = {
      Status: 'DEPLOYED'
    }
    expect(getStatus(item)).toBe('Deployed')
  })
  it('should return deleted', () => {
    const item = {
      Status: 'DELETED'
    }
    expect(getStatus(item)).toBe('Deleted')
  })
  it('should return Superseded', () => {
    const item = {
      Status: 'SUPERSEDED'
    }
    expect(getStatus(item)).toBe('Superseded')
  })
  it('should return failed', () => {
    const item = {
      Status: 'FAILED'
    }
    expect(getStatus(item)).toBe('Failed')
  })
  it('should return deleting', () => {
    const item = {
      Status: 'DELETING'
    }
    expect(getStatus(item)).toBe('Deleting')
  })
  it('should return unknown', () => {
    const item = {
      Status: 'Unknown'
    }
    expect(getStatus(item)).toBe('Unknown')
  })
})

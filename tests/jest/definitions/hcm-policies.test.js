/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {getStatus,getEnforcement} from '../../../src-web/definitions/hcm-policies'

describe('hcm-policies', () => {
  describe('#getStatus', () => {
    it('should return "-"', () => {
      const item = {
      }
      expect(getStatus(item)).toBe('-')
    })
  })
})

describe('hcm-policies', () => {
  describe('#getEnforcement', () => {
    it('should return the enforcement of policy', () => {
      const item = {
        enforcement:'Inform'
      }
      expect(getEnforcement(item)).toBe('inform')
    })
    it('should return "-"', () => {
      const item = {
      }
      expect(getEnforcement(item)).toBe('-')
    })
  })
})

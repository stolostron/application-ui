/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getListWithTruncatedValues, getStatus } from '../../../src-web/definitions/hcm-pods'

describe('hcm-pods', () => {
  describe('#getStatus', () => {
    it('should return "Running"', () => {
      const item = {
        status: 'Failed'
      }
      expect(getStatus(item, 'en-US')).toBe('Failed')
    })
  })

  describe('#getListWithTruncatedValues', () => {
    it('should return "-" when no images found', () => {
      const item = {
      }
      expect(getListWithTruncatedValues(item)).toBe('-')
    })
  })
})


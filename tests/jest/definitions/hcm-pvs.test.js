/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { getClaim } from '../../../src-web/definitions/hcm-pvs'

describe('hcm-pvs - getClaim', () => {
  it('should return a vaild string', () => {
    const item = {
      claimRef: {
        name: 'claimName',
        namespace: 'claimNamespace'
      }
    }
    expect(getClaim(item)).toBe('claimNamespace/claimName')
  })
  it('should return "-"', () => {
    const item = {
      claimRef: {
        name: 'claimName',
        namespace: null
      }
    }
    expect(getClaim(item)).toBe('-')
  })
})

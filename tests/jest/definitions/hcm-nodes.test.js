/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {getRole} from '../../../src-web/definitions/hcm-nodes'

describe('hcm-nodes', () => {
  describe('#getRole', () => {
    it('should return the role of node', () => {
      const item = {
        NodeDetails: {
          Labels: {
            management: 'true',
            role: 'master'
          }
        }
      }
      expect(getRole(item)).toBe('management, master')
    })
    it('should return worker', () => {
      const item = {
      }
      expect(getRole(item)).toBe('worker')
    })
  })
})

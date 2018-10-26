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
  getTruncatedText,
  getListWithTruncatedValues,
  getStatus,
  getLabels
} from '../../../src-web/definitions/hcm-pods'

describe('hcm-pods', () => {
  describe('#getStatus', () => {
    it('should return "Running"', () => {
      const item = {
        status: 'Running'
      }
      expect(getStatus(item, 'en-US')).toBe('Running')
    })
    it('should return "Succeeded"', () => {
      const item = {
        status: 'Succeeded'
      }
      expect(getStatus(item, 'en-US')).toBe('Succeeded')
    })
    it('should return "Pending"', () => {
      const item = {
        status: 'Pending'
      }
      expect(getStatus(item, 'en-US')).toBe('Pending')
    })
    it('should return "Failed"', () => {
      const item = {
        status: 'Failed'
      }
      expect(getStatus(item, 'en-US')).toBe('Failed')
    })
    it('should return "Not running"', () => {
      const item = {
      }
      expect(getStatus(item, 'en-US')).toBe('Not running')
    })
  })

  describe('#getLabels', () => {
    it('should return list of labels', () => {
      const item = {
        metadata: {
          labels: {
            chart: 'ibm-mcm-klusterlet-3.1.0',
            'controller-uid': 'd1e17240-c589-11e8-9d53-fa163e704fa7',
            heritage: 'Tiller',
            'job-name': 'aaa',
            release: 'aaa',
          }
        }
      }
      expect(getLabels(item)).toMatchSnapshot()
    })
  })

  describe('#getTruncatedText', () => {
    it('should return a truncated version of the pod name', () => {
      const item = {
        metadata: {
          name: 'custom-pod-name-too-long-67fd8c7f5b-96jqf-lakjh34ljh'
        }
      }
      expect(getTruncatedText(item)).toMatchSnapshot()
    })
  })

  describe('#getListWithTruncatedValues', () => {
    it('should return list of images', () => {
      const item = {
        images: [
          'mycluster.icp:8500/kube-system/hcmv2:3.1.0'
        ]
      }
      expect(getListWithTruncatedValues(item)).toMatchSnapshot()
    })
    it('should return "-" when no images found', () => {
      const item = {
      }
      expect(getListWithTruncatedValues(item)).toBe('-')
    })
  })
})


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
  getExternalLink,
  getLabels,
  getStatusIcon,
  getCPU,
  getMemory,
  getStorage,
} from '../../../src-web/definitions/hcm-clusters'

describe('hcm-clusters - getExternalLink', () => {
  it('should return vaild link', () => {
    const item = {
      consoleURL: 'https://9.10.11.12:8443'
    }
    expect(getExternalLink(item)).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getExternalLink(item)).toBe('-')
  })
})

describe('hcm-clusters - getLabels', () => {
  it('should return vaild link', () => {
    const item = {
      metadata: {
        labels: {
          cloud: 'IBM',
          datacenter: 'toronto',
          environment: 'Dev',
          name: 'liked-parrot',
          owner: 'marketing',
          region: 'US',
          vendor: 'ICP',
        }
      }
    }
    expect(getLabels(item)).toMatchSnapshot()
  })
})

describe('hcm-clusters - getStatusIcon', () => {
  it('should return ready status', () => {
    const item = {
      status: 'ok'
    }
    expect(getStatusIcon(item)).toMatchSnapshot()
  })
  it('should return offline status', () => {
    const item = {
      status: 'offline'
    }
    expect(getStatusIcon(item)).toMatchSnapshot()
  })
  it('should return unknown status', () => {
    const item = {
      status: 'unknown'
    }
    expect(getStatusIcon(item)).toMatchSnapshot()
  })
})

describe('hcm-clusters - get cluster untilization info', () => {
  const item = {
    totalCPU: '99',
    totalMemory: '99',
    totalStorage: '99'
  }
  it('should return cluster util data (CPU, Memory & Storage)', () => {
    expect(getCPU(item)).toEqual('99%')
    expect(getMemory(item)).toEqual('99%')
    expect(getStorage(item)).toEqual('99%')
  })
})

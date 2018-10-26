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
  createPolicyLink,
  createCompliancePolicyLink,
  getStatus,
  getStatusIcon,
  getStatusIconForPolicy,
} from '../../../src-web/definitions/hcm-compliances'

describe('hcm-compliances - createPolicyLink', () => {
  it('should return valid policy link', () => {
    const item = {
      metadata: {
        name: 'testName',
        namespace: 'testNamespace'
      }
    }
    expect(createPolicyLink(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - createCompliancePolicyLink', () => {
  it('should return valid compliance policy link', () => {
    const item = {
      cluster: 'clusterName',
      complianceName: 'testComplianceName',
      complianceNamespace: 'testComplianceNamespace',
      metadata: {
        name: 'testName',
      }
    }
    expect(createCompliancePolicyLink(item)).toMatchSnapshot()
  })
})

describe('hcm-compliances - getStatus', () => {
  it('should return compliant status', () => {
    const item = {
      status: 'compliant'
    }
    expect(getStatus(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatus(item, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getStatusIcon', () => {
  it('should return compliant status', () => {
    const item = {
      compliant: 'compliant'
    }
    expect(getStatusIcon(item, 'en-US')).toMatchSnapshot()
  })
  it('should return noncompliant status', () => {
    const item = {
      compliant: 'noncompliant'
    }
    expect(getStatusIcon(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatusIcon(item, 'en-US')).toBe('-')
  })
})

describe('hcm-compliances - getStatusIconForPolicy', () => {
  it('should return compliant status', () => {
    const item = {
      status: 'compliant'
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toMatchSnapshot()
  })
  it('should return noncompliant status', () => {
    const item = {
      status: 'noncompliant'
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toMatchSnapshot()
  })
  it('should return "-"', () => {
    const item = {
    }
    expect(getStatusIconForPolicy(item, 'en-US')).toBe('-')
  })
})

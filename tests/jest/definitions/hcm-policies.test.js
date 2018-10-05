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
  getStatus,
  getEnforcement,
  getExcludeNamespace,
  getIncludeNamespace,
  getAPIGroups,
  getRuleVerbs
} from '../../../src-web/definitions/hcm-policies'

describe('hcm-policies - createPolicyLink', () => {
  it('Should return vaild Link obj', () => {
    const item = {
      metadata: {
        name: 'TestPolicyName',
        namespace: 'TestPolicyNamespace'
      }
    }
    expect(createPolicyLink(item)).toMatchSnapshot()
  })
})

describe('hcm-policies', () => {
  describe('#getStatus', () => {
    it('Should return healthy status', () => {
      const item = {
        status: 'compliant'
      }
      expect(getStatus(item)).toMatchSnapshot()
    })
    it('Should return critical status', () => {
      const item = {
        status: 'noncompliant'
      }
      expect(getStatus(item)).toMatchSnapshot()
    })
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

describe('hcm-policies - getExcludedNamespace', () => {
  it('Should return string of namespaces', () => {
    const item = {
      detail: {
        exclude_namespace: [
          'default',
          'kube-system'
        ]
      }
    }
    expect(getExcludeNamespace(item)).toBe('default, kube-system')
  })
  it('Should return -', () => {
    const item = {
      detail: {
        exclude_namespace: null
      }
    }
    expect(getExcludeNamespace(item)).toBe('-')
  })
})

describe('hcm-policies - getIncludeNamespace', () => {
  it('Should return string of namespaces', () => {
    const item = {
      detail: {
        include_namespace: [
          'default',
          'kube-system'
        ]
      }
    }
    expect(getIncludeNamespace(item)).toBe('default, kube-system')
  })
  it('Should return -', () => {
    const item = {
      detail: {
        include_namespace: null
      }
    }
    expect(getIncludeNamespace(item)).toBe('-')
  })
})

describe('hcm-policies - getAPIGroups', () => {
  it('Should return string of groups', () => {
    const item = {
      apiGroups: [
        'core'
      ]
    }
    expect(getAPIGroups(item)).toBe('core')
  })
  it('Should return -', () => {
    const item = {
      apiGroups: null
    }
    expect(getAPIGroups(item)).toBe('-')
  })
})

describe('hcm-policies - getRuleVerbs', () => {
  it('Should return string of rule verbs', () => {
    const item = {
      verbs: [
        'get', 'watch', 'list', 'create', 'delete', 'update', 'patch'
      ]
    }
    expect(getRuleVerbs(item)).toBe('get, watch, list, create, delete, update, patch')
  })
  it('Should return -', () => {
    const item = {
      verbs: null
    }
    expect(getRuleVerbs(item)).toBe('-')
  })
})

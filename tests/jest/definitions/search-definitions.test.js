/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {
  getPolicyStatusIcon
} from '../../../src-web/definitions/search-definitions'

describe('search-definitions - getPolicyStatusIcon', () => {
  it('should return compliant status', () => {
    const item = {
      compliant: 'Compliant'
    }
    expect(getPolicyStatusIcon(item)).toMatchSnapshot()
  })
  it('should return NON-compliant status', () => {
    const item = {
      compliant: 'Non-compliant'
    }
    expect(getPolicyStatusIcon(item)).toMatchSnapshot()
  })
  it('should return blank status', () => {
    const item = { }
    expect(getPolicyStatusIcon(item)).toMatchSnapshot()
  })
})

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const React = require('react')
const renderer = require('react-test-renderer')
const DeployableModal = require('../DeployableModal').default

describe('DeployableModal', () => {
  it('DeployableModal renders correctly.', () => {
    const tree = renderer.create(<DeployableModal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

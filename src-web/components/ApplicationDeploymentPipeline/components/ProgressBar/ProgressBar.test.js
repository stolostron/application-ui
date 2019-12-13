/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from '../../../src-web/index';
//
const React = require('react')
const renderer = require('react-test-renderer')
const ProgressBar = require('../ProgressBar').default

describe('ProgressBar', () => {
  it('ProgressBar renders correctly.', () => {
    const tree = renderer
      .create(<ProgressBar status={[1, 2, 3, 4, 5]} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

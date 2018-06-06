/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import resources from '../../../lib/shared/resources'
import { Icon, Slider } from 'carbon-components-react'

resources(() => {
  require('../../../scss/dashboard.scss')
})
// TODO: add dialog for settings and scale button
/* eslint-disable react/prop-types,react/no-unused-state, react/jsx-no-bind */

class TagInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 50
    }
  }

  render() {
    return (
      <div className='dashboard-settings'>
        <div className='dashboard-settingsButton'>
          <Icon
            className='icon--settings--glyph'
            name='icon--settings--glyph'
            description={'settings'} />
        </div>
        <div className='dashboard-slider'>
          <Slider
            id="slider"
            value={50}
            min={0}
            max={100}
            hideTextInput
          />
        </div>
      </div>
    )
  }
}

export default TagInput

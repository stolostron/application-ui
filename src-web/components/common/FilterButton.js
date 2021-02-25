/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.

import React from 'react'
import resources from '../../../lib/shared/resources'
import { Icon } from 'carbon-components-react'

resources(() => {
  require('../../../scss/dashboard.scss')
})

class FilterButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="dashboard-filter">
        <div className="dashboard-filterButton">
          <Icon
            className="icon--filter--glyph"
            name="icon--filter--glyph"
            description={'filter'}
          />
        </div>
      </div>
    )
  }
}

export default FilterButton

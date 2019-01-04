/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import GridCard from '../GridCard'

class HeatCard extends React.Component {

  static propTypes = {
    item: PropTypes.object,
  }

  render() {
    const { item } = this.props
    //const { overview: {applications=[], clusters = []} } = item

    // gather data

    return (
      <GridCard item={item}>
        <div className='heat-card'>
          HEATMAP
        </div>
      </GridCard>
    )
  }
}

export default HeatCard

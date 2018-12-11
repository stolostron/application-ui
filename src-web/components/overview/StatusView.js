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
import StatusCellCompliance from './StatusCellCompliance'
import StatusCellPods from './StatusCellPods'
import StatusCellClusters from './StatusCellClusters'
import StatusCellCPU from './StatusCellCPU'
import StatusCellMemory from './StatusCellMemory'
import StatusCellStorage from './StatusCellStorage'

class StatusView extends React.Component {

  static propTypes = {
    overview: PropTypes.object,
  }

  render() {
    const { overview } = this.props
    return (
      <div className='status-view'>
        <div className='status-row'>
          <StatusCellCompliance overview={overview} />
          <StatusCellPods overview={overview} />
          <StatusCellClusters overview={overview} />
        </div>
        <div className='status-row'>
          <StatusCellCPU overview={overview} />
          <StatusCellMemory overview={overview} />
          <StatusCellStorage overview={overview} />
        </div>
      </div>
    )
  }
}

export default StatusView

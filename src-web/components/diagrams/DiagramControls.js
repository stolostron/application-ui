/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import '../../../graphics/diagramIcons.svg'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/topology-controls.scss')
})

const MAX_ZOOM = 2
const MIN_ZOOM = .1

export default class DiagramControls extends React.PureComponent {

  setZoomInRef = ref => {this.zoomInRef = ref}
  setZoomOutRef = ref => {this.zoomOutRef = ref}

  render() {
    const {locale} = this.context
    const zoomIn = msgs.get('topology.zoom.in', locale)
    const zoomOut = msgs.get('topology.zoom.out', locale)
    const zoomFit = msgs.get('topology.zoom.fit', locale)
    return (
      <div className='topology-controls'>
        <div className='zoom-buttons'>
          {/* zoom target */}
          <div className='zoom-target-button' tabIndex='0' role={'button'}
            title={zoomFit} aria-label={zoomFit}
            onClick={this.handleZoomToTarget} onKeyPress={this.handleZoomToTarget}>
            <svg className='icon'>
              <use href={'#diagramIcons_zoomTarget'} ></use>
            </svg>
          </div>
          {/* zoom in */}
          <div className='zoom-in-button' tabIndex='0' role={'button'} ref={this.setZoomInRef}
            title={zoomIn} aria-label={zoomIn}
            onClick={this.handleZoomIn} onKeyPress={this.handleZoomIn}>
            <svg className='icon'>
              <use href={'#diagramIcons_zoomIn'} ></use>
            </svg>
          </div>
          {/* zoom out */}
          <div className='zoom-out-button' tabIndex='0' role={'button'} ref={this.setZoomOutRef}
            title={zoomOut} aria-label={zoomOut}
            onClick={this.handleZoomOut} onKeyPress={this.handleZoomOut}>
            <svg className='icon'>
              <use href={'#diagramIcons_zoomOut'} ></use>
            </svg>
          </div>
        </div>
      </div>)
  }

  handleZoomIn = (e) => {
    if ( e.type==='click' || e.key === 'Enter') {
      this.props.getZoomHelper().buttonZoom(1.3, this.updateZoomButtons)
    }
  }

  handleZoomOut = (e) => {
    if ( e.type==='click' || e.key === 'Enter') {
      this.props.getZoomHelper().buttonZoom(1 / 1.3, this.updateZoomButtons)
    }
  }

  handleZoomToTarget = (e) => {
    if ( e.type==='click' || e.key === 'Enter') {
      const {getViewContainer, getZoomHelper} = this.props
      getViewContainer().scrollTo(0, 0)
      getZoomHelper().zoomFit(true, false, this.updateZoomButtons)
    }
  }

  updateZoomButtons = (zoom) => {
    this.zoomInRef.disabled = zoom.k>=MAX_ZOOM
    this.zoomInRef.classList.toggle('disabled', zoom.k>=MAX_ZOOM)
    this.zoomOutRef.disabled = zoom.k<=MIN_ZOOM
    this.zoomOutRef.classList.toggle('disabled', zoom.k<=MIN_ZOOM)
  }
}

DiagramControls.propTypes = {
  getViewContainer: PropTypes.func,
  getZoomHelper: PropTypes.func,
}

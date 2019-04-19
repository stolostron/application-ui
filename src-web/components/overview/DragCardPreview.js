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

export default class DragCardPreview extends React.Component {

  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    // insert clone of dragged card into preview
    const clone = this.props.dragInfo.cardRef.cloneNode(true)
    clone.style.top = 0
    clone.style.left = 0
    this.previewRef.insertBefore(clone, null)
    this.props.dragInfo.cardRef.firstChild.classList.add('drag-place-holder')
  }

  componentWillUnmount () {
    this.props.dragInfo.cardRef.firstChild.classList.remove('drag-place-holder')
  }

  setPreviewRef = ref => {this.previewRef = ref}

  render () {
    return (
      <div ref={this.setPreviewRef} />
    )
  }
}

DragCardPreview.propTypes = {
  dragInfo: PropTypes.object.isRequired
}

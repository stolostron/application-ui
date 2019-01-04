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
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

class DragCard extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    getCardRef: PropTypes.func,
    item: PropTypes.object,
  }

  componentDidMount () {
    const {connectDragPreview, getCardRef, item} = this.props
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    })

    this.cardRef = getCardRef()
    this.cardRef.item = item
  }

  render() {
    const {connectDropTarget, connectDragSource, children} = this.props
    return connectDropTarget(connectDragSource(<div>{children}</div>))
  }
}


const dragSource = {
  beginDrag ({item, getCardRef}) {
    item.beginDrag(getCardRef())
    return {
      dragInfo: item.getDragInfo()
    }
  },

  canDrag ({item}) {
    return item.canDrag()
  },

  endDrag ({item}) {
    item.endDrag()
  }
}

const dropTarget = {
  canDrop () {
    return true
  }
}

const collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag(),
    dragInfo: monitor.getItem() ? monitor.getItem().dragInfo : null
  }
}

const collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

export default DropTarget('card', dropTarget, collectDrop)(DragSource('card', dragSource, collectDrag)(DragCard))

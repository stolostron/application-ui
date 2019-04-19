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
import { DragLayer } from 'react-dnd'
import DragCardPreview from './DragCardPreview'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

const DRAG_THRESHOLD = 30
const SWAP_THRESHOLD = 30

class DragCardLayer extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isDragging: false,
      isLayingout: false,
      item: null,
    }
  }

  componentDidMount() {
    const {getMasonry} = this.props
    this.handleLayoutComplete = this.handleLayoutComplete.bind(this)
    getMasonry().masonry.on('layoutComplete', this.handleLayoutComplete)
  }

  componentWillUnmount() {
    const {getMasonry} = this.props
    if (getMasonry()) {
      getMasonry().masonry.off('layoutComplete', this.handleLayoutComplete)
    }
  }

  handleLayoutComplete = () => {
    this.setState({isLayingout:false})
  }

  componentWillReceiveProps(){
    this.setState((prevState, props) => {
      return {
        item: prevState.item || props.item,
        isDragging: prevState.isDragging || props.isDragging
      }
    })
  }

  componentDidUpdate() {
    this.reorderCards()
  }

  getItemStyles() {
    const { item, initialOffset, currentOffset, isDragging } = this.props
    if (initialOffset && currentOffset) {
      this.currentOffset = currentOffset
      this.dragCardRef = item.dragInfo.cardRef
      this.dragCardRef.parentNode.classList.add('dragging')
    } else if (!isDragging) {
      // animate place holder back to initial offset
      this.animate()
    }
    const { x, y } = this.currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
      transform: transform,
      WebkitTransform: transform
    }
  }

  setPreviewRef = ref => {this.previewRef = ref}

  render () {
    const { item, isDragging } = this.state
    if (isDragging) {
      return (
        <div style={layerStyles}>
          <div style={this.getItemStyles()} ref={this.setPreviewRef} >
            <DragCardPreview dragInfo={item.dragInfo} />
          </div>
        </div>
      )
    }
    return null
  }

  intersectRect(r1, r2) {
    return Math.max(r1.left, r2.left) < Math.min(r1.right, r2.right) &&
           Math.max(r1.top, r2.top) < Math.min(r1.bottom, r2.bottom)
  }

  reorderCards() {
    const {isDragging, currentOffset, item, getMasonry} = this.props
    const {isLayingout} = this.state
    if (isDragging && !isLayingout) {
      if (this.lastPreviewOffset && currentOffset) {
        const dx = currentOffset.x - this.lastPreviewOffset.x
        const dy = currentOffset.y - this.lastPreviewOffset.y
        const xt = Math.abs(dx)>DRAG_THRESHOLD
        const yt = Math.abs(dy)>DRAG_THRESHOLD
        const up = dy<0 && yt
        const down = dy>0 && yt
        const left = dx<0 && xt
        const right = dx>0 && xt
        if (xt || yt) {
          const draggedCard = item.dragInfo.cardRef
          const draggedRect = draggedCard.getBoundingClientRect()
          const previewRect = {
            left: currentOffset.x,
            top: currentOffset.y,
            right: currentOffset.x + draggedRect.width,
            bottom: currentOffset.y + draggedRect.height,
          }
          let i, child, testRect, doLayout = false
          const parentNode = draggedCard.parentNode
          const children = Array.from(parentNode.childNodes)
          const draggedIdx = children.findIndex(child => draggedCard.isSameNode(child))
          if (up && currentOffset.y<draggedRect.y) {
            //if (draggedRect.top > previewRect.top) {
            for (i=0; i < draggedIdx && !doLayout; i++) {
              child = children[i]
              testRect = child.getBoundingClientRect()
              // find first child that overlaps preview rect
              if (this.intersectRect(testRect, previewRect)) {
                const prev1 = draggedCard.previousSibling
                const prev2 = child.previousSibling
                // swap with child?
                if (prev1 && prev2 && Math.abs(testRect.left-previewRect.left)<SWAP_THRESHOLD
                    && Math.abs(testRect.right-previewRect.right)<SWAP_THRESHOLD) {
                  prev1.after(child)
                  prev2.after(draggedCard)

                } else {
                  // insert dragged node before here
                  parentNode.insertBefore(draggedCard, child)
                }
                doLayout = true
              }
            }
            //}

          } else if (down && currentOffset.y>draggedRect.y) {
            //if (draggedRect.bottom < previewRect.bottom) {
            for (i=draggedIdx+1; i<children.length && !doLayout; i++) {
              child = children[i]
              testRect = child.getBoundingClientRect()
              if (this.intersectRect(testRect, previewRect)) {
                // swap with child?
                const prev1 = draggedCard.previousSibling
                const prev2 = child.previousSibling
                if (prev1 && prev2 && Math.abs(testRect.left-previewRect.left)<SWAP_THRESHOLD
                      && Math.abs(testRect.right-previewRect.right)<SWAP_THRESHOLD) {
                  prev1.after(child)
                  prev2.after(draggedCard)
                  doLayout = true
                } else {
                  if (i<children.length-1) {
                    for (i=i+1; i<children.length && !doLayout; i++) {
                      child = children[i]
                      testRect = child.getBoundingClientRect()
                      if (!this.intersectRect(testRect, previewRect)) {
                        // insert dragged node before here
                        parentNode.insertBefore(draggedCard, child)
                        doLayout = true
                      }
                    }
                  } else {
                    parentNode.appendChild(draggedCard)
                    doLayout = true
                  }
                }
              }
            }
            //}
          }

          if (doLayout) {
            this.lastPreviewOffset.y = currentOffset.y
            this.setState({isLayingout:true})
            getMasonry().performLayout()
          } else {
            if (left && currentOffset.x<draggedRect.x) {
              for (i=0; i < draggedIdx && !doLayout; i++) {
                child = children[i]
                testRect = child.getBoundingClientRect()
                // find first child that overlaps preview rect
                if (testRect.right < draggedRect.right && this.intersectRect(testRect, previewRect)) {
                  parentNode.insertBefore(draggedCard, child)
                  doLayout = true
                }
              }

            } else if (right && currentOffset.x>draggedRect.x) {
              for (i=draggedIdx+1; i<children.length && !doLayout; i++) {
                child = children[i]
                testRect = child.getBoundingClientRect()
                if (testRect.left > draggedRect.left && this.intersectRect(testRect, previewRect)) {
                  parentNode.insertBefore(draggedCard, child.nextSibling)
                  doLayout = true
                }
              }
            }
            if (doLayout) {
              this.lastPreviewOffset.x = currentOffset.x
              this.setState({isLayingout:true})
              getMasonry().performLayout()
            }
          }
        }
      } else {
        this.lastPreviewOffset = currentOffset
      }
    } else if (!isLayingout){
      delete this.lastPreviewOffset
    }
  }

  animate () {
    var maxStep = 20
    var step = 0
    var delay = 5
    let x = this.currentOffset.x
    let y = this.currentOffset.y
    const dragCardRect = this.dragCardRef.getBoundingClientRect()
    const animate = () => {
      if (this.previewRef) {
        var dx = dragCardRect.x - x
        var dy = dragCardRect.y - y
        if (step>0) {
          x += dx / maxStep
          y += dy / maxStep
        }

        // set preview position
        this.previewRef.style.transform = `translate(${x}px, ${y}px)`

        if (step < maxStep) {
          step++
          this.timer = window.setTimeout(animate, delay)
        } else {
          // set final preview position
          this.previewRef.style.transform = `translate(${dragCardRect.x}px, ${dragCardRect.y}px)`
          this.props.updateCardOrder()
          this.dragCardRef.parentNode.classList.remove('dragging')
          this.setState({
            item: null,
            isDragging: false,
          })
          delete this.timer
        }
      }
    }
    animate()
  }
}

DragCardLayer.propTypes = {
  currentOffset: PropTypes.object,
  getMasonry: PropTypes.func,
  initialOffset: PropTypes.object,
  isDragging: PropTypes.bool.isRequired,
  item: PropTypes.object,
  updateCardOrder: PropTypes.func,
}

const collect = (monitor) => {
  return {
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

export default DragLayer(collect)(DragCardLayer)

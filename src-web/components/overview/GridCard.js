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
import DragCard from './DragCard'
import GridMenu from './GridMenu'
import { Tag } from 'carbon-components-react'

class GridCard extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    header: PropTypes.string,
    item: PropTypes.object,
    tagValue: PropTypes.string,
  }

  setCardRef = ref => {this.cardRef = ref}
  getCardRef = () => {return this.cardRef}

  render() {
    const {header, tagValue, children, item} = this.props
    const {cardData: {actions}} = item
    return (
      <div className='grid-item' ref={this.setCardRef}>
        <DragCard item={item} getCardRef={this.getCardRef}>
          <div className='grid-view'>
            {actions.length!==0 && <GridMenu item={item} />}
            {header && <div className='title'>
              {header}
              {tagValue && <Tag type='beta'>{tagValue}</Tag>}
            </div>}
            <div className='content'>
              {children}
            </div>
          </div>
        </DragCard>
      </div>
    )
  }
}

export default GridCard

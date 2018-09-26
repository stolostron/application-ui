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
import { Icon } from 'carbon-components-react'
import { DetailsViewDecorator } from './DetailsViewDecorator'
import msgs from '../../../nls/platform.properties'

class DetailsView extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { context, onClose, getLayoutNodes, staticResourceData, selectedNodeId} = this.props
    const {topologyShapes, topologyNodeDetails} = staticResourceData
    const currentNode = getLayoutNodes().find((n) => n.uid === selectedNodeId) || {}
    const { layout={} } = currentNode
    const resourceType = layout.type || currentNode.type
    const {shape='circle', className='default'} =  topologyShapes[resourceType]||{}
    const details = topologyNodeDetails(currentNode, context)
    const name = layout.hasService ? layout.services[0].name : currentNode.name
    return (
      <section className={`topologyDetails ${className}`}>
        <h3 className='detailsHeader'>
          <DetailsViewDecorator
            showDot={layout.showDot}
            shape={shape}
            className={className}
          />
          <span className='titleText'>
            {name}
          </span>
          <Icon
            className='closeIcon'
            description={msgs.get('topology.details.close', context.locale)}
            name="icon--close"
            onClick={onClose}
          />
        </h3>
        <hr />
        {details.map(({type, labelKey, value, reactKey}) =>
        {return (type==='spacer' ?
          <div className='sectionContent' key={reactKey}>
            <div className='spacer'></div>
          </div> :
          <div className='sectionContent' key={labelKey+value}>
            {labelKey && <span className='label'>{msgs.get(labelKey, context.locale)}: </span>}
            <span className='value'>{value}</span>
          </div>)}
        )}
      </section>)
  }
}

DetailsView.propTypes = {
  context: PropTypes.object,
  getLayoutNodes: PropTypes.func,
  onClose: PropTypes.func,
  selectedNodeId: PropTypes.string,
  staticResourceData: PropTypes.object,
}

export default DetailsView


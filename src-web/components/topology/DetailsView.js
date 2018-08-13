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
    const { context, onClose, nodes, staticResourceData, selectedNodeId} = this.props
    const currentNode = nodes.find((n) => n.uid === selectedNodeId) || {}
    const title = currentNode && currentNode.name
    const resourceType = currentNode.type
    const details = staticResourceData.topologyNodeDetails(currentNode)
    return (
      <section className={`topologyDetails ${resourceType}`}>
        <h3 className='detailsHeader'>
          <DetailsViewDecorator resourceType={resourceType} />
          <span className='titleText'>
            {title}
          </span>
          <Icon
            className='closeIcon'
            description={msgs.get('topology.details.close', context.locale)}
            name="icon--close"
            onClick={onClose}
          />
        </h3>
        <hr />
        {details.map((d) =>
          <div className='sectionContent' key={d.labelKey}>
            <span className='label'>{msgs.get(d.labelKey, context.locale)}: </span>
            <span className='value'>{d.value}</span>
          </div>
        )}
      </section>)
  }
}

DetailsView.propTypes = {
  context: PropTypes.object,
  nodes: PropTypes.array,
  onClose: PropTypes.func,
  selectedNodeId: PropTypes.string,
  staticResourceData: PropTypes.object,
}

export default DetailsView


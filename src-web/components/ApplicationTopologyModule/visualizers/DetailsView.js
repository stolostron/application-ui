/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'carbon-components-react'
import { DetailsViewDecorator } from './DetailsViewDecorator'
import { Scrollbars } from 'react-custom-scrollbars'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'

resources(() => {
  require('../scss/topology-details.scss')
})

class DetailsView extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick(value) {
    this.fetchLogs(value)
  }

  handleKeyPress(value, e) {
    if (e.key === 'Enter') {
      this.fetchLogs(value)
    }
  }

  fetchLogs(value) {
    const { fetchLogs, onClose } = this.props
    const { resourceType, data } = value
    fetchLogs(resourceType, data)
    onClose()
  }

  render() {
    const {
      context,
      onClose,
      getLayoutNodes,
      getViewContainer,
      staticResourceData,
      selectedNodeId
    } = this.props
    const { typeToShapeMap, getNodeDetails } = staticResourceData
    const currentNode =
      getLayoutNodes().find(n => n.uid === selectedNodeId) || {}
    const { layout = {} } = currentNode
    const resourceType = layout.type || currentNode.type
    const { shape = 'circle', className = 'default' } =
      typeToShapeMap[resourceType] || {}
    const details = getNodeDetails(currentNode, context)
    const name = currentNode.name
    const height = getViewContainer().getBoundingClientRect().height
    const scrollHeight = height * 0.75
    return (
      <section className={`topologyDetails ${className}`}>
        <h3 className="detailsHeader">
          <DetailsViewDecorator shape={shape} className={className} />
          <span className="titleText">{name}</span>
          <Icon
            className="closeIcon"
            description={msgs.get('topology.details.close', context.locale)}
            name="icon--close"
            onClick={onClose}
          />
        </h3>
        <hr />
        <Scrollbars
          style={{ width: 310, height: scrollHeight }}
          renderView={this.renderView}
          renderThumbVertical={this.renderThumbVertical}
          className="details-view-container"
        >
          {details.map(({ type, labelKey, value }) => {
            let handleClick, handleKeyPress
            if (type === 'logs') {
              handleClick = this.handleClick.bind(this, value)
              handleKeyPress = this.handleKeyPress.bind(this, value)
            } else {
              handleClick = handleKeyPress = null
            }
            return type === 'spacer' ? (
              <div className="sectionContent" key={Math.random()}>
                <div className="spacer" />
              </div>
            ) : type !== 'logs' ? (
              <div className="sectionContent" key={Math.random()}>
                {labelKey && (
                  <span className="label">
                    {msgs.get(labelKey, context.locale)}:{' '}
                  </span>
                )}
                <span className="value">{value}</span>
              </div>
            ) : (
              <div className="sectionContent" key={Math.random()}>
                <div
                  className="logs"
                  tabIndex="0"
                  role={'button'}
                  onClick={handleClick}
                  onKeyPress={handleKeyPress}
                >
                  {msgs.get('topology.view.logs', context.locale)}
                </div>
              </div>
            )
          })}
        </Scrollbars>
      </section>
    )
  }

  renderView({ style, ...props }) {
    style.marginBottom = -17
    return <div {...props} style={{ ...style }} />
  }

  renderThumbVertical({ style, ...props }) {
    const finalStyle = {
      ...style,
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(0,0,0,.2)'
    }
    return (
      <div className={'details-view-scrollbar'} style={finalStyle} {...props} />
    )
  }
}

DetailsView.propTypes = {
  context: PropTypes.object,
  fetchLogs: PropTypes.func,
  getLayoutNodes: PropTypes.func,
  getViewContainer: PropTypes.func,
  onClose: PropTypes.func,
  selectedNodeId: PropTypes.string,
  staticResourceData: PropTypes.object
}

export default DetailsView

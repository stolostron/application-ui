/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'
import { Icon } from 'carbon-components-react'
import { defaultShapes } from './defaults/shapes'
import { getLegendTitle } from './defaults/titles'
import '../../../../graphics/diagramShapes.svg'
import '../../../../graphics/diagramIcons.svg'
import msgs from '../../../../nls/platform.properties'

class LegendView extends React.Component {
  render() {
    const { locale, onClose, getViewContainer } = this.props
    const height = getViewContainer().getBoundingClientRect().height
    const scrollHeight = height * 0.4

    return (
      <section className="topologyDetails">
        <div className="legendHeader">
          <div>
            <div className="titleText">
              {msgs.get('topology.legend.header.title', locale)}
            </div>
            <div className="bodyText">
              {msgs.get('topology.legend.header.text', locale)}
            </div>
            <div style={{ textAlign: 'center' }}>
              <svg>
                <use href={'#diagramShapes_legend'} className="label-icon" />
              </svg>
            </div>
          </div>
          <Icon
            className="closeIcon"
            description={msgs.get('topology.legend.close', locale)}
            name="icon--close"
            onClick={onClose}
          />
        </div>
        <hr />
        <Scrollbars
          style={{ height: scrollHeight }}
          className="details-view-container"
        >
          <div className="legendBody">
            <div>
              <div className="titleText">
                {msgs.get('topology.legend.body.status.title', locale)}
              </div>
              {this.renderStatusDescriptions()}
            </div>
            <div className="bodyResourcesDiv">
              <div className="titleResourcesText">
                {msgs.get('topology.legend.body.resource.title', locale)}
              </div>
              <div className="bodyIconsDiv">{this.renderResourceIcons()}</div>
            </div>
          </div>
        </Scrollbars>
      </section>
    )
  }

  renderStatusDescriptions = () => {
    const { locale } = this.props
    const statusList = ['success', 'warning', 'failure', 'pending']
    const iconColorMap = new Map([
      ['success', '#3E8635'],
      ['warning', '#F0AB00'],
      ['failure', '#C9190B'],
      ['pending', '#878D96']
    ])
    const descriptionMap = new Map([
      ['success', 'topology.legend.body.text.success'],
      ['warning', 'topology.legend.body.text.warning'],
      ['failure', 'topology.legend.body.text.failure'],
      ['pending', 'topology.legend.body.text.pending']
    ])
    return statusList.map(status => {
      return (
        <div key={status} className="bodyText">
          <div>
            <svg className="statusSvg" fill={iconColorMap.get(status)}>
              <use href={`#diagramIcons_${status}`} className="label-icon" />
            </svg>
          </div>
          <div>{msgs.get(descriptionMap.get(status), locale)}</div>
        </div>
      )
    })
  };

  renderResourceIcons = () => {
    const { locale } = this.props
    const nodeTypes = new Set()
    const nodes = this.props.getLayoutNodes()
    if (nodes && nodes.length > 0) {
      nodes.forEach(node => {
        const { type } = node
        if (type) {
          nodeTypes.add(type)
        }
      })
    }
    return Array.from(nodeTypes).map(type => {
      const { shape = 'other' } = defaultShapes[type] || {}
      return (
        <div key={type} className="bodyIconsTextDiv">
          <div>{getLegendTitle(type, locale)}</div>
          <div>
            <svg className="iconSvg">
              <use href={`#diagramShapes_${shape}`} className="label-icon" />
            </svg>
          </div>
        </div>
      )
    })
  };
}

LegendView.propTypes = {
  getLayoutNodes: PropTypes.func,
  getViewContainer: PropTypes.func,
  locale: PropTypes.string,
  onClose: PropTypes.func
}

export default LegendView

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  Icon,
  NumberInput,
  MultiSelect,
  Button
} from 'carbon-components-react'
import jsYaml from 'js-yaml'
import '../../../../graphics/diagramShapes.svg'
import '../../../../graphics/diagramIcons.svg'
import msgs from '../../../../nls/platform.properties'
import { createResourceSearchLink } from '../utils/diagram-helpers'
import { getLegendTitle } from './defaults/titles'
import ClusterDetailsContainer from './ClusterDetailsContainer'

const DetailsViewDecorator = ({ shape, className }) => {
  return (
    <div className="detailsIconContainer">
      <svg width="58px" height="58px" viewBox="0 0 58 58">
        <use
          href={`#diagramShapes_${shape}`}
          className={`${className} detailsIcon`}
        />
      </svg>
    </div>
  )
}

DetailsViewDecorator.propTypes = {
  className: PropTypes.string,
  shape: PropTypes.string
}

class DetailsView extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick(value) {
    this.processActionLink(value)
  }

  handleKeyPress(value, e) {
    if (e.key === 'Enter') {
      this.processActionLink(value)
    }
  }

  processActionLink(value) {
    const { processActionLink } = this.props
    const { data } = value
    processActionLink(data)
  }

  render() {
    const {
      locale,
      onClose,
      getLayoutNodes,
      staticResourceData,
      selectedNodeId,
      nodes
    } = this.props
    const { typeToShapeMap, getNodeDetails } = staticResourceData
    const currentUpdatedNode = nodes.find(n => n.uid === selectedNodeId)
    const currentNode =
      getLayoutNodes().find(n => n.uid === selectedNodeId) || {}
    const { layout = {} } = currentNode
    const resourceType =
      layout.type || currentNode.type || currentUpdatedNode.type
    const { shape = 'other', className = 'default' } =
      typeToShapeMap[resourceType] || {}
    const details = getNodeDetails(currentNode, currentUpdatedNode, locale)
    const name = currentNode.type === 'cluster' ? '' : currentNode.name
    const legend = getLegendTitle(resourceType, locale)

    const searchLink = createResourceSearchLink(currentNode)
    return (
      <section className="topologyDetails">
        <div className="detailsHeader">
          <DetailsViewDecorator shape={shape} className={className} />
          <div>
            <div className="sectionContent">
              <span className="label">{legend}</span>
            </div>
            <div className="sectionContent">
              <span className="titleNameText">{name}</span>
            </div>
            <div className="openSearchLink">{this.renderLink(searchLink)}</div>
          </div>
          <Icon
            className="closeIcon"
            description={msgs.get('topology.details.close', locale)}
            name="icon--close"
            onClick={onClose}
          />
        </div>
        <hr />
        <Scrollbars
          renderView={this.renderView}
          renderThumbVertical={this.renderThumbVertical}
          className="details-view-container"
        >
          {details.map(detail => this.renderDetail(detail, locale))}
        </Scrollbars>
      </section>
    )
  }

  renderDetail(detail, locale) {
    switch (detail.type) {
    case 'spacer':
      return this.renderSpacer()
    case 'link':
      return this.renderLink(detail, true)
    case 'number':
      return this.renderNumber(detail, locale)
    case 'selector':
      return this.renderSelector(detail, locale)
    case 'submit':
      return this.renderSubmit(detail, locale)
    case 'snippet':
      return this.renderSnippet(detail, locale)
    case 'clusterdetailcombobox':
      return this.renderClusterDetailComboBox(detail, locale)
    default:
      return this.renderLabel(detail, locale)
    }
  }

  renderLabel({ labelKey, labelValue, value, indent, status }, locale) {
    let label = labelValue
    const fillMap = new Map([
      ['checkmark', '#3E8635'],
      ['failure', '#C9190B'],
      ['warning', '#F0AB00'],
      ['pending', '#878D96']
    ])
    if (labelKey) {
      label = labelValue
        ? msgs.get(labelKey, [labelValue], locale)
        : msgs.get(labelKey, locale)
    }
    label = value !== undefined ? `${label}:` : label //add : for 0 values
    const mainSectionClasses = classNames({
      sectionContent: true,
      borderLeft: value !== undefined ? true : false
    })
    const labelClass = classNames({
      label: true,
      sectionLabel: value ? true : false
    })
    const valueClass = classNames({
      value: true,
      ksLabelBackground:
        label && label === `${msgs.get('resource.labels')}:` ? true : false
    })
    const statusIcon = status ? status : undefined
    const iconFill = statusIcon ? fillMap.get(statusIcon) : '#FFFFFF'
    return (
      <div className={mainSectionClasses} key={Math.random()}>
        {(labelKey || labelValue) && statusIcon ? (
          <span className="label sectionLabel">
            <svg
              width="10px"
              height="10px"
              fill={iconFill}
              style={{ marginRight: '8px' }}
            >
              <use
                href={`#diagramIcons_${statusIcon}`}
                className="label-icon"
              />
            </svg>
            <span>{label} </span>
          </span>
        ) : (
          <span className={labelClass}>{label} </span>
        )}
        {indent && <span className="indent" />}
        <span className={valueClass}>{value}</span>
      </div>
    )
  }

  renderSnippet({ value }) {
    if (value) {
      const yaml = jsYaml.safeDump(value).split('\n')
      return (
        <div className="sectionContent snippet">
          {yaml.map(line => {
            return <code key={Math.random()}>{line}</code>
          })}
        </div>
      )
    }
    return null
  }

  renderLink({ value, indent }) {
    if (!value) {
      return <div />
    }
    const handleClick = this.handleClick.bind(this, value)
    const handleKeyPress = this.handleKeyPress.bind(this, value)
    const showLaunchOutIcon = !R.pathOr(false, ['data', 'specs', 'isDesign'])(
      value
    ) //if not show yaml

    let iconName = 'arrowRight'
    if (_.get(value, 'data.targetLink', '').startsWith('http')) {
      iconName = 'carbonLaunch'
    }
    const mainSectionClasses = classNames({
      sectionContent: true,
      borderLeft: indent ? true : false
    })

    const linkLabelClasses = classNames({
      link: true,
      sectionLabel: indent ? true : false
    })

    return (
      <div className={mainSectionClasses} key={Math.random()}>
        <span
          className={linkLabelClasses}
          id="linkForNodeAction"
          tabIndex="0"
          role={'button'}
          onClick={handleClick}
          onKeyPress={handleKeyPress}
        >
          {value.label}
          {showLaunchOutIcon && (
            <svg width="11px" height="8px" style={{ marginLeft: '9px' }}>
              <use href={`#diagramIcons_${iconName}`} className="label-icon" />
            </svg>
          )}
        </span>
      </div>
    )
  }

  renderNumber({ labelKey, value }, locale) {
    return (
      <div className="sectionContent form" key={Math.random()}>
        {labelKey && (
          <span className="label">{msgs.get(labelKey, locale)}: </span>
        )}
        <NumberInput
          id={labelKey}
          label={''}
          value={value}
          min={1}
          max={10}
          step={1}
          onChange={this.enableSubmitBtn.bind(this)}
        />
      </div>
    )
  }

  renderSelector({ labelKey, value, other }, locale) {
    return (
      <div className="sectionContent form" key={Math.random()}>
        {labelKey && (
          <span className="label">{msgs.get(labelKey, locale)}: </span>
        )}
        <MultiSelect.Filterable
          items={other}
          initialSelectedItems={value}
          placeholder={value.join(', ')}
          itemToString={item => item}
          onChange={this.enableSubmitBtn.bind(this)}
        />
      </div>
    )
  }

  setSubmitBtn = ref => {
    this.submitBtn = ref
  };
  renderSubmit() {
    return (
      <div className="sectionContent submit" key={Math.random()}>
        <Button
          small
          id="edit-button"
          disabled
          ref={this.setSubmitBtn}
          onClick={this.onSubmit}
        >
          {msgs.get('modal.button.submit', this.props.locale)}
        </Button>
      </div>
    )
  }

  enableSubmitBtn() {
    this.submitBtn.disabled = false
  }

  onSubmit() {
    this.props.onClose()
  }

  renderSpacer() {
    return (
      <div className="sectionContent" key={Math.random()}>
        <div className="spacer" />
      </div>
    )
  }

  renderView({ style, ...props }) {
    style.height = 'calc(100vh - 370px)'
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

  renderClusterDetailComboBox({ comboboxdata }, locale) {
    const { clusterDetailsContainerControl } = this.props
    return (
      <div className="sectionContent" key={Math.random()}>
        <ClusterDetailsContainer
          clusterList={comboboxdata}
          locale={locale}
          clusterDetailsContainerControl={clusterDetailsContainerControl}
        />
      </div>
    )
  }
}

DetailsView.propTypes = {
  clusterDetailsContainerControl: PropTypes.shape({
    clusterDetailsContainerData: PropTypes.object,
    handleClusterDetailsContainerUpdate: PropTypes.func
  }),
  getLayoutNodes: PropTypes.func,
  getViewContainer: PropTypes.func,
  locale: PropTypes.string,
  nodes: PropTypes.array,
  onClose: PropTypes.func,
  processActionLink: PropTypes.func,
  selectedNodeId: PropTypes.string,
  staticResourceData: PropTypes.object
}

export default DetailsView

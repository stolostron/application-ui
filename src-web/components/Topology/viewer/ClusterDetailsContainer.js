/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../../nls/platform.properties'
import {
  Select,
  SelectOption,
  SelectVariant,
  Pagination,
  ExpandableSection
} from '@patternfly/react-core'
import {
  processResourceActionLink,
  getPercentage,
  inflateKubeValue,
  getAge
} from '../utils/diagram-helpers'

class ClusterDetailsContainer extends React.Component {
  static propTypes = {
    clusterDetailsContainerControl: PropTypes.shape({
      clusterDetailsContainerData: PropTypes.object,
      handleClusterDetailsContainerUpdate: PropTypes.func
    }),
    clusterList: PropTypes.array,
    locale: PropTypes.string
  };
  constructor(props) {
    super()
    this.state = {
      clusterList: props.clusterList,
      locale: props.locale,
      selected: null,
      page:
        props.clusterDetailsContainerControl.clusterDetailsContainerData.page,
      perPage: 5,
      startIdx:
        props.clusterDetailsContainerControl.clusterDetailsContainerData
          .startIdx,
      clusterSearchToggle:
        props.clusterDetailsContainerControl.clusterDetailsContainerData
          .clusterSearchToggle,
      expandSectionToggleMap:
        props.clusterDetailsContainerControl.clusterDetailsContainerData
          .expandSectionToggleMap
    }

    this.handleFirstClick = this.handleFirstClick.bind(this)
    this.handleLastClick = this.handleLastClick.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
    this.handlePreviousClick = this.handlePreviousClick.bind(this)
    this.handlePageInput = this.handlePageInput.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSelectToggle = this.handleSelectToggle.bind(this)
    this.handleExpandSectionToggle = this.handleExpandSectionToggle.bind(this)
    this.handleSelectionClear = this.handleSelectionClear.bind(this)
  }

  processActionLink = resource => {
    processResourceActionLink(resource)
  };

  handleSelection = (_event, selection) => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate },
      clusterList
    } = this.props
    let selectedCluster, newClusterList
    if (selection) {
      selectedCluster = clusterList.find(
        cls => cls.metadata.name === selection
      )
      newClusterList = [selectedCluster]
    } else {
      newClusterList = clusterList
    }

    handleClusterDetailsContainerUpdate(1, 0, false, new Set())
    this.setState({
      selected: selection,
      clusterList: newClusterList,
      startIdx: 0,
      page: 1,
      expandSectionToggleMap: new Set(),
      clusterSearchToggle: false
    })
  };

  handleSelectionClear = () => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props

    handleClusterDetailsContainerUpdate(1, 0, false, new Set())
    this.setState({
      selected: undefined,
      startIdx: 0,
      page: 1,
      expandSectionToggleMap: new Set(),
      clusterList: this.props.clusterList
    })
  };

  handleFirstClick = () => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props

    handleClusterDetailsContainerUpdate(1, 0, false, new Set())
    this.setState({
      startIdx: 0,
      page: 1,
      expandSectionToggleMap: new Set()
    })
  };

  handleLastClick = () => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const { clusterList, perPage } = this.state

    let divResult = Math.floor(clusterList.length / perPage)
    let lastPage = divResult
    const modResult = clusterList.length % perPage
    if (modResult === 0) {
      divResult = divResult - 1
    } else {
      lastPage = lastPage + 1
    }
    const newStartIdx = perPage * divResult

    handleClusterDetailsContainerUpdate(
      lastPage,
      newStartIdx,
      false,
      new Set()
    )
    this.setState({
      startIdx: newStartIdx,
      page: lastPage,
      expandSectionToggleMap: new Set()
    })
  };

  handleNextClick = (_event, currentPage) => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const { perPage, startIdx } = this.state
    const newStartIdx = startIdx + perPage

    handleClusterDetailsContainerUpdate(
      currentPage,
      newStartIdx,
      false,
      new Set()
    )
    this.setState({
      startIdx: newStartIdx,
      page: currentPage,
      expandSectionToggleMap: new Set()
    })
  };

  handlePreviousClick = (_event, currentPage) => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const { perPage, startIdx } = this.state
    const newStartIdx = startIdx - perPage

    handleClusterDetailsContainerUpdate(
      currentPage,
      newStartIdx,
      false,
      new Set()
    )
    this.setState({
      startIdx: newStartIdx,
      page: currentPage,
      expandSectionToggleMap: new Set()
    })
  };

  handlePageInput = (_event, newPage) => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const { perPage } = this.state
    const newStartIdx = (newPage - 1) * perPage

    handleClusterDetailsContainerUpdate(newPage, newStartIdx, false, new Set())
    this.setState({
      startIdx: newStartIdx,
      page: newPage,
      expandSectionToggleMap: new Set()
    })
  };

  handleKeyPress = (resource, _event) => {
    if (_event.key === 'Enter') {
      this.processActionLink(resource)
    }
  };

  handleSelectToggle = () => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const {
      page,
      startIdx,
      clusterSearchToggle,
      expandSectionToggleMap
    } = this.state
    const newClusterSearchToggle = !clusterSearchToggle

    handleClusterDetailsContainerUpdate(
      page,
      startIdx,
      newClusterSearchToggle,
      expandSectionToggleMap
    )
    this.setState({
      clusterSearchToggle: newClusterSearchToggle
    })
  };

  handleExpandSectionToggle = itemNum => {
    const {
      clusterDetailsContainerControl: { handleClusterDetailsContainerUpdate }
    } = this.props
    const {
      page,
      startIdx,
      clusterSearchToggle,
      expandSectionToggleMap
    } = this.state

    if (!expandSectionToggleMap.has(itemNum)) {
      expandSectionToggleMap.add(itemNum)
    } else {
      expandSectionToggleMap.delete(itemNum)
    }

    handleClusterDetailsContainerUpdate(
      page,
      startIdx,
      clusterSearchToggle,
      expandSectionToggleMap
    )
    this.setState({
      expandSectionToggleMap: expandSectionToggleMap
    })
  };

  renderConsoleURLLink = (consoleURL, resource, locale) => {
    return (
      consoleURL && (
        <div className="sectionContent borderLeft">
          <span
            className="link sectionLabel"
            id="linkForNodeAction"
            tabIndex="0"
            role="button"
            onClick={this.processActionLink.bind(this, resource)}
            onKeyDown={this.handleKeyPress.bind(this, resource)}
          >
            {msgs.get('details.cluster.console', locale)}
            <svg width="11px" height="8px" style={{ marginLeft: '9px' }}>
              <use href="#diagramIcons_carbonLaunch" className="label-icon" />
            </svg>
          </span>
        </div>
      )
    )
  };

  render() {
    const {
      selected,
      clusterList,
      page,
      perPage,
      startIdx,
      locale,
      clusterSearchToggle,
      expandSectionToggleMap
    } = this.state
    const titleId = 'cluster-select-id-1'
    const findClusterMsg = 'Find cluster'
    const clusterItems = []
    const divClass = 'sectionContent borderLeft'
    const labelClass = 'label sectionLabel'
    const valueClass = 'value'

    for (let i = startIdx; i < clusterList.length && i < page * perPage; i++) {
      const {
        metadata = {},
        capacity = {},
        allocatable = {},
        status,
        consoleURL
      } = clusterList[i]
      const {
        name: clusterName,
        namespace: clusterNamespace,
        creationTimestamp
      } = metadata
      const { cpu: cc, memory: cm } = capacity
      const { cpu: ac, memory: am } = allocatable
      const resource = {
        action: 'open_link',
        targetLink: consoleURL
      }
      const namespaceLabel = `${msgs.get(
        'resource.namespace',
        locale
      )}: ${clusterNamespace}`
      const parentDivStyle =
        i === startIdx
          ? {
            'border-top': '1px solid #D2D2D2',
            'border-bottom': '1px solid #D2D2D2'
          }
          : { 'border-bottom': '1px solid #D2D2D2' }
      const toggleItemNum = i % perPage
      const namespaceStyle = {
        color: '#5A6872',
        'font-family': 'RedHatText',
        'font-size': '12px',
        'line-height': '21px',
        'text-align': 'left',
        display: 'block'
      }
      const outerNamespaceStyle = expandSectionToggleMap.has(toggleItemNum)
        ? { display: 'none' }
        : namespaceStyle

      clusterItems.push(
        <div className="clusterDetailItem" style={parentDivStyle}>
          <ExpandableSection
            toggleText={clusterName}
            onToggle={() => this.handleExpandSectionToggle(toggleItemNum)}
            isExpanded={expandSectionToggleMap.has(toggleItemNum)}
          >
            <span style={namespaceStyle}>{namespaceLabel}</span>
            <span
              className={labelClass}
              style={{
                'padding-left': '1rem',
                'font-size': '1rem'
              }}
            >
              {msgs.get('prop.details.section', locale)}
            </span>
            <div className="spacer" />
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.name', locale)}:{' '}
              </span>
              <span className={valueClass}>{clusterName}</span>
            </div>
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.namespace', locale)}:{' '}
              </span>
              <span className={valueClass}>{clusterNamespace}</span>
            </div>
            {this.renderConsoleURLLink(consoleURL, resource, locale)}
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.status', locale)}:{' '}
              </span>
              <span className={valueClass}>{status}</span>
            </div>
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.cpu', locale)}:{' '}
              </span>
              <span className={valueClass}>
                {getPercentage(inflateKubeValue(ac), inflateKubeValue(cc))}%
              </span>
            </div>
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.memory', locale)}:{' '}
              </span>
              <span className={valueClass}>
                {getPercentage(inflateKubeValue(am), inflateKubeValue(cm))}%
              </span>
            </div>
            <div className={divClass}>
              <span className={labelClass}>
                {msgs.get('resource.created', locale)}:{' '}
              </span>
              <span className={valueClass}>{getAge(creationTimestamp)}</span>
            </div>
            <div className="spacer" />
          </ExpandableSection>
          <span style={outerNamespaceStyle}>{namespaceLabel}</span>
        </div>
      )
    }

    return (
      <div className="clusterDetails">
        <Select
          variant={SelectVariant.typeahead}
          typeAheadAriaLabel={findClusterMsg}
          onSelect={this.handleSelection}
          selections={selected}
          aria-labelledby={titleId}
          placeholderText={findClusterMsg}
          onToggle={this.handleSelectToggle}
          isOpen={clusterSearchToggle}
          onClear={this.handleSelectionClear}
        >
          {this.props.clusterList.map(cluster => (
            <SelectOption
              key={cluster.metadata.name}
              value={cluster.metadata.name}
            />
          ))}
        </Select>
        <div className="spacer" />
        <Pagination
          itemCount={clusterList.length}
          perPage={perPage}
          page={page}
          widgetId="pagination-options-menu-top"
          onFirstClick={this.handleFirstClick}
          onLastClick={this.handleLastClick}
          onNextClick={this.handleNextClick}
          onPreviousClick={this.handlePreviousClick}
          onPageInput={this.handlePageInput}
        />
        <div className="spacer" />
        {clusterItems}
        <Pagination
          itemCount={clusterList.length}
          perPage={perPage}
          page={page}
          widgetId="pagination-options-menu-bottom"
          onFirstClick={this.handleFirstClick}
          onLastClick={this.handleLastClick}
          onNextClick={this.handleNextClick}
          onPreviousClick={this.handlePreviousClick}
          onPageInput={this.handlePageInput}
        />
      </div>
    )
  }
}

export default ClusterDetailsContainer

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import R from 'ramda'
import React from 'react'
import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withLocale } from '../../providers/LocaleProvider'
import { validator } from './validators/hcm-application-validator'
import { getUpdates } from './deployers/hcm-application-deployer'
import {
  getActiveChannel,
  getDiagramElements
} from './definitions/hcm-application-diagram'
import { editResource, fetchResource } from '../../actions/common'
import { fetchTopology } from '../../actions/topology'
import { parse } from '../../../lib/client/design-helper'
import {
  MCM_DESIGN_SPLITTER_SIZE_COOKIE,
  DIAGRAM_QUERY_COOKIE,
  RESOURCE_TYPES
} from '../../../lib/shared/constants'
import { InlineNotification } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import {
  TOPOLOGY_SET_ACTIVE_FILTERS,
  DIAGRAM_RESTORE_FILTERS,
  DIAGRAM_SAVE_FILTERS
} from '../../actions'
import resources from '../../../lib/shared/resources'
import { Topology } from '../Topology'
import { getPollInterval } from '../Topology/viewer/RefreshTimeSelect'
import EditorBar from './components/EditorBar'
import YamlEditor from '../common/YamlEditor'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'
import {
  DEFAULT_REFRESH_TIME,
  TOPOLOGY_REFRESH_INTERVAL_COOKIE
} from '../Topology/viewer/constants'

resources(() => {
  require('./style.scss')
  require('../Topology/scss/topology-controls.scss')
  require('../Topology/scss/resource-toolbar.scss')
})

// set up Topology component
const portals = {
  assortedFilterOpenBtn: 'assorted-filter-open-portal-id',
  assortedFilterCloseBtns: 'assorted-filter-close-portal-id',
  refreshTimeSelectorPortal: 'refresh-time-selector-portal-id',
  typeFilterBar: 'type-filter-bar-portal-id',
  searchTextbox: 'search-textbox-portal-id'
}

const options = {
  filtering: 'application',
  layout: 'application',
  showLineLabels: true, // show labels on lines
  showGroupTitles: false // show titles over sections
}

class ApplicationTopologyModule extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    activeChannel: PropTypes.string,
    channels: PropTypes.array,
    clusters: PropTypes.array,
    detailsLoaded: PropTypes.bool,
    detailsReloading: PropTypes.bool,
    diagramFilters: PropTypes.array,
    fetchAppTopology: PropTypes.func,
    fetchError: PropTypes.object,
    fetchHCMApplicationResource: PropTypes.func,
    links: PropTypes.array,
    locale: PropTypes.string,
    nodes: PropTypes.array,
    originalMap: PropTypes.object,
    params: PropTypes.object,
    pods: PropTypes.array,
    putResource: PropTypes.func,
    resetFilters: PropTypes.func,
    restoreSavedDiagramFilters: PropTypes.func,
    showExpandedTopology: PropTypes.bool,
    storedVersion: PropTypes.bool,
    topologyLoadError: PropTypes.bool,
    topologyLoaded: PropTypes.bool,
    topologyReloading: PropTypes.bool,
    willLoadDetails: PropTypes.bool,
    yaml: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {
      links: [],
      nodes: [],
      pods: [],
      activeChannel: undefined,
      showSpinner: false,
      lastTimeUpdate: undefined,
      currentYaml: props.yaml || '',
      userChanges: false /* eslint-disable-line react/no-unused-state */,
      exceptions: [],
      updateMessage: '',
      topologyLoaded: false,
      selectedNode: undefined,
      hasUndo: false,
      hasRedo: false
    }
    this.layoutEditorsDebounced = _.debounce(() => {
      this.layoutEditors()
    }, 150)
    this.parseDebounced = _.debounce(() => {
      this.handleParse()
    }, 500)
    this.startPolling = this.startPolling.bind(this)
    this.stopPolling = this.stopPolling.bind(this)
    this.refetch = this.refetch.bind(this)
    this.handleEditorCommand = this.handleEditorCommand.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleToggleSize = this.handleToggleSize.bind(this)
    this.gotoEditorLine = this.gotoEditorLine.bind(this)
  }

  componentWillMount() {
    const { restoreSavedDiagramFilters, resetFilters, params } = this.props
    restoreSavedDiagramFilters()
    resetFilters()
    const name = decodeURIComponent(params.name)
    const namespace = decodeURIComponent(params.namespace)
    const localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${namespace}\\${name}`
    const activeChannel = getActiveChannel(localStoreKey)
    this.props.fetchAppTopology(activeChannel)
    this.props.fetchHCMApplicationResource(namespace, name)
    this.setState({ activeChannel })
    this.startPolling(DEFAULT_REFRESH_TIME * 1000)
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  }

  componentWillUnmount() {
    if (this.state) {
      this.stopPolling()
    }

    const { actions, showExpandedTopology } = this.props
    if (actions && showExpandedTopology) {
      actions.setShowExpandedTopology({ showExpandedTopology: false })
    }

    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  startPolling(newInterval) {
    this.stopPolling()
    let intervalId = undefined
    const interval =
      getPollInterval(TOPOLOGY_REFRESH_INTERVAL_COOKIE) || newInterval
    if (interval) {
      intervalId = setInterval(this.refetch, Math.max(interval, 5 * 1000))
    }
    this.setState({ intervalId })
  }

  stopPolling() {
    const { intervalId } = this.state
    if (intervalId) {
      clearInterval(intervalId)
    }
    this.setState({ intervalId: undefined })
  }

  onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.startPolling()
    } else {
      this.stopPolling()
    }
  }

  refetch() {
    const {
      fetchAppTopology,
      fetchHCMApplicationResource,
      activeChannel,
      params
    } = this.props
    fetchAppTopology(activeChannel, true)

    if (params && params.name && params.namespace) {
      fetchHCMApplicationResource(params.namespace, params.name)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      const { locale } = this.context
      const links = _.cloneDeep(nextProps.links || [])
      const nodes = _.cloneDeep(nextProps.nodes || [])
      const pods = _.cloneDeep(nextProps.pods || [])
      const clusters = _.cloneDeep(nextProps.clusters || [])
      const diagramFilters = _.cloneDeep(nextProps.diagramFilters || [])

      // update loading spinner
      const {
        topologyReloading,
        willLoadDetails,
        detailsLoaded,
        detailsReloading,
        storedVersion,
        fetchError
      } = nextProps
      const showSpinner =
        !fetchError &&
        (topologyReloading ||
          willLoadDetails ||
          !detailsLoaded ||
          detailsReloading ||
          storedVersion)

      // update last time refreshed
      const { changingChannel } = prevState
      let lastTimeUpdate = prevState.lastTimeUpdate
      if (
        changingChannel ||
        (!showSpinner && prevState.showSpinner) ||
        (!lastTimeUpdate && nextProps.topologyLoaded)
      ) {
        const time = new Date().toLocaleTimeString(locale)
        lastTimeUpdate = msgs.get(
          'application.diagram.view.last.time',
          [time],
          locale
        )
      }
      const { userChanges } = prevState
      let { currentYaml, currentParsed } = prevState
      if (!userChanges && (currentYaml !== nextProps.yaml || changingChannel)) {
        currentYaml = nextProps.yaml
        const { parsed } = parse(currentYaml, validator, locale)
        currentParsed = parsed
        this.resetEditor(currentYaml)
      }

      return {
        clusters,
        links,
        nodes,
        pods,
        currentYaml,
        currentParsed,
        diagramFilters,
        changingChannel: false,
        showSpinner,
        lastTimeUpdate,
        topologyLoaded: nextProps.topologyLoaded,
        topologyLoadError: nextProps.topologyLoadError
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.activeChannel !== undefined &&
      nextState.activeChannel !== undefined &&
      nextProps.activeChannel !== nextState.activeChannel
    ) {
      return false
    }
    return (
      !_.isEqual(
        this.state.nodes.map(n => n.uid),
        nextState.nodes.map(n => n.uid)
      ) ||
      !_.isEqual(
        this.state.links.map(n => n.uid),
        nextState.links.map(n => n.uid)
      ) ||
      !_.isEqual(
        this.state.pods.map(n => `${n._uid}/${n.status}`),
        nextState.pods.map(n => `${n._uid}/${n.status}`)
      ) ||
      !_.isEqual(this.state.diagramFilters, nextState.diagramFilters) ||
      !_.isEqual(this.state.exceptions, nextState.exceptions) ||
      this.state.activeChannel !== nextState.activeChannel ||
      this.props.storedVersion !== nextProps.storedVersion ||
      !_.isEqual(this.props.channels, nextProps.channels) ||
      this.state.updateMessage !== nextState.updateMessage ||
      this.props.showExpandedTopology !== nextProps.showExpandedTopology ||
      this.state.showSpinner !== nextState.showSpinner ||
      this.state.lastTimeUpdate !== nextState.lastTimeUpdate ||
      this.props.topologyLoaded !== nextProps.topologyLoaded ||
      this.props.detailsLoaded !== nextProps.detailsLoaded ||
      this.props.detailsReloading !== nextProps.detailsReloading ||
      this.state.topologyLoadError !== nextState.topologyLoadError ||
      this.props.yaml.localeCompare(nextProps.yaml) !== 0 ||
      this.state.currentYaml.localeCompare(nextState.currentYaml) !== 0 ||
      this.state.hasUndo !== nextState.hasUndo ||
      this.state.hasRedo !== nextState.hasRedo
    )
  }

  handleSplitterDefault = () => {
    const cookie = localStorage.getItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`)
    let size = cookie ? parseInt(cookie) : 1000
    const page = document.getElementById('page')
    if (page) {
      const width = page.getBoundingClientRect().width
      if (!cookie) {
        size = width * 2 / 3
      } else if (size > width * 9 / 10) {
        size = width * 9 / 10
      }
    }
    return size
  };

  handleSplitterChange = size => {
    localStorage.setItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`, size)
    this.layoutEditorsDebounced()
  };

  setContainerRef = container => {
    this.containerRef = container
    this.layoutEditors()
  };

  setEditor = editor => {
    this.editor = editor
    this.layoutEditors()
    this.selectTextLine = this.selectTextLine.bind(this)
    this.selectAfterRender = true
    this.editor.renderer.on('afterRender', this.selectTextLine)
    this.editor.on('input', () => {
      const undoManager = this.editor.session.getUndoManager()
      if (this.resetUndoManager) {
        delete this.resetUndoManager
        undoManager.reset()
      }
      const hasUndo = undoManager.hasUndo()
      const hasRedo = undoManager.hasRedo()
      this.setState({ hasUndo, hasRedo })
    })
  };

  setViewer = viewer => {
    this.viewer = viewer
    this.layoutEditors()
  };

  layoutEditors() {
    if (this.containerRef && this.viewer && this.editor) {
      const diagramSize = localStorage.getItem(
        `${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`
      )
      const editorSize =
        this.containerRef.getBoundingClientRect().width - diagramSize
      // change editor font size based on how much horiozontal space it has
      const less400 = editorSize <= 400 ? 10 : 12
      const fontSize = editorSize <= 250 ? 6 : less400
      this.viewer.resize()
      this.editor.setFontSize(fontSize)
      this.editor.renderer.setShowGutter(editorSize > 250)
      this.editor.resize()
      this.editor.setAnimatedScroll(false)
      const cursor = this.editor.selection.getCursor()
      this.editor.scrollToLine(cursor.row, true)
    }
  }

  setContainerEditor = container => (this.containerEditor = container);
  setSplitPaneRef = splitPane => (this.splitPane = splitPane);
  getViewer = () => this.viewer;
  getEditor = () => this.editor;
  setCopyAreaRef = ref => (this.copyArea = ref);
  handleTopologyErrorClosed = () => this.setState({ topologyLoadError: false });
  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' });

  render() {
    const { showExpandedTopology, channels } = this.props
    const {
      nodes,
      links,
      selectedNode,
      topologyLoadError,
      activeChannel
    } = this.state
    const { topologyLoaded, showSpinner, changingChannel } = this.state
    const {
      currentYaml,
      hasUndo,
      hasRedo,
      exceptions,
      updateMessage,
      updateMsgKind
    } = this.state
    const { locale } = this.props

    const typeFilterTitle = msgs.get('type', locale)
    const diagramTitle = msgs.get('application.diagram', locale)
    const viewFullMsg = showExpandedTopology
      ? msgs.get('application.diagram.view.collapsed', locale)
      : msgs.get('application.diagram.view.full', locale)

    const diagramClasses = classNames({
      resourceDiagramSourceContainer: true,
      showExpandedTopology,
      split: showExpandedTopology
    })

    const renderTopology = () => {
      const fetchControl = {
        isLoaded: topologyLoaded,
        isFailed: topologyLoadError,
        isReloading: showSpinner,
        refetch: this.refetch
      }
      const channelControl = {
        allChannels: channels,
        activeChannel: activeChannel,
        isChangingChannel: changingChannel,
        changeTheChannel: this.changeTheChannel.bind(this)
      }
      const selectionControl = {
        selectedNode
      }
      options.scrollOnScroll = !showExpandedTopology
      return (
        <Topology
          links={links}
          nodes={nodes}
          options={options}
          portals={portals}
          selectionControl={selectionControl}
          processActionLink={this.processActionLink.bind(this)}
          fetchControl={fetchControl}
          channelControl={channelControl}
          searchUrl={
            config.contextPath
              ? config.contextPath.replace(
                new RegExp('/applications$'),
                '/search'
              )
              : ''
          }
          locale={locale}
          startPolling={this.startPolling}
          stopPolling={this.stopPolling}
        />
      )
    }

    const renderDiagramView = () => {
      return (
        <React.Fragment>
          {!showExpandedTopology && (
            <React.Fragment>
              <div className="topology-controls">
                <div className="topology-control-container">
                  <div id={portals.searchTextbox} />
                </div>
              </div>
              <div id="resource-toolbar" className="resource-toolbar">
                <div className="resource-toolbar-container">
                  <div className="resource-toolbar-buttons">
                    <div id={portals.refreshTimeSelectorPortal} />
                    <div id={portals.assortedFilterOpenBtn} />
                  </div>
                  <div id={portals.assortedFilterCloseBtns} />
                </div>
              </div>
            </React.Fragment>
          )}
          <div className="resourceDiagramControlsContainer">
            <div className="diagram-title">{diagramTitle}</div>
            {topologyLoadError && (
              <InlineNotification
                kind={'error'}
                title={msgs.get('error.load.resource', this.context.locale)}
                iconDescription=""
                subtitle={msgs.get('error.load.topology', this.context.locale)}
                onCloseButtonClick={this.handleTopologyErrorClosed}
              />
            )}
            {showExpandedTopology ? (
              <React.Fragment>
                <div className="diagram-controls-container">
                  <div
                    className="diagram-type-filter-bar"
                    id="type-filter-bar-portal-id"
                  />
                </div>
                <div className="topology-container">{renderTopology()}</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {renderTopology()}
                <div className="diagram-controls-container">
                  <div
                    className="diagram-type-filter-bar"
                    id="type-filter-bar-portal-id"
                  />
                  <div
                    className="diagram-expand-button"
                    tabIndex="0"
                    role={'button'}
                    title={viewFullMsg}
                    aria-label={viewFullMsg}
                    onClick={this.handleToggleSize}
                    onKeyPress={this.handleToggleSize}
                  >
                    <svg className="icon">
                      <use href={'#diagramIcons_launch'} />
                    </svg>
                    {viewFullMsg}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      )
    }

    const renderTextView = () => {
      return (
        <div className="resourceEditorContainer">
          <div
            className="resource-editor-toolbar"
            role="region"
            aria-label={typeFilterTitle}
            id={typeFilterTitle}
          >
            <EditorBar
              hasUndo={hasUndo}
              hasRedo={hasRedo}
              exceptions={exceptions}
              gotoEditorLine={this.gotoEditorLine}
              handleEditorCommand={this.handleEditorCommand}
              handleSearchChange={this.handleSearchChange}
            />
          </div>
          {updateMessage && (
            <InlineNotification
              kind={updateMsgKind}
              title={
                updateMsgKind === 'error'
                  ? msgs.get('error.updating.resource', this.context.locale)
                  : msgs.get('success.update.resource', this.context.locale)
              }
              iconDescription=""
              subtitle={updateMessage}
              onCloseButtonClick={this.handleUpdateMessageClosed}
            />
          )}
          <YamlEditor
            width={'100%'}
            height={'100%'}
            getViewer={this.getViewer}
            setContainerEditor={this.setContainerEditor}
            setEditor={this.setEditor}
            wrapEnabled={true}
            readOnly={true}
            theme={'vibrant_ink'}
            onYamlChange={this.handleEditorChange}
            yaml={currentYaml}
          />
          <div
            className="diagram-collapse-button"
            tabIndex="0"
            role={'button'}
            title={viewFullMsg}
            aria-label={viewFullMsg}
            onClick={this.handleToggleSize}
            onKeyPress={this.closeTextView}
          >
            {viewFullMsg}
            <svg className="icon">
              <use href={'#diagramIcons_launch'} />
            </svg>
          </div>
        </div>
      )
    }

    return (
      <div className={diagramClasses} ref={this.setContainerRef}>
        {showExpandedTopology ? (
          <SplitPane
            split="vertical"
            minSize={50}
            ref={this.setSplitPaneRef}
            defaultSize={this.handleSplitterDefault()}
            onChange={this.handleSplitterChange}
          >
            {renderDiagramView()}
            {renderTextView()}
          </SplitPane>
        ) : (
          renderDiagramView()
        )}
      </div>
    )
  }

  changeTheChannel(fetchChannel) {
    this.setState({ changingChannel: true, activeChannel: fetchChannel })
    this.props.fetchAppTopology(fetchChannel)
  }

  handleToggleSize() {
    const { actions, showExpandedTopology } = this.props
    actions.setShowExpandedTopology({
      showExpandedTopology: !showExpandedTopology,
      selectedNodeId: undefined
    })
  }

  // user clicked a node in diagram
  showNodeYAML(yamlNode) {
    const { actions, showExpandedTopology } = this.props
    if (!showExpandedTopology) {
      this.selectedNode = yamlNode
      actions.setShowExpandedTopology({
        showExpandedTopology: true,
        selectedNodeId: yamlNode.id
      })
    } else {
      this.setState(() => {
        this.selectTextLine(yamlNode)
        return {
          selectedNode: yamlNode
        }
      })
    }
    return true
  }

  processActionLink = resource => {
    if (_.get(resource, 'specs.isDesign')) {
      //show node yaml
      this.showNodeYAML(resource)
    } else if (R.pathOr('', ['action'])(resource) === 'show_pod_log') {
      //show pod logs
      const { name, namespace, cluster } = resource
      const targetLink = `/multicloud/details/${cluster}/api/v1/namespaces/${namespace}/pods/${name}/logs`
      window.open(targetLink, '_blank')
    } else {
      //object search
      const { name, namespace, kind } = resource
      const targetLink = `/multicloud/search?filters={"textsearch":"kind:${kind} name:${name} namespace:${namespace}"}`
      window.open(targetLink, '_blank')
    }
  };

  closeTextView = () => {
    delete this.editor
    const { actions } = this.props
    actions.setShowExpandedTopology({
      showExpandedTopology: false,
      selectedNodeId: undefined
    })
  };

  // select text editor line associated with selected node/link
  selectTextLine(textNode) {
    if (this.editor) {
      this.editor.clearSelection()
      textNode = textNode || this.selectedNode
      if (textNode) {
        const row = _.get(textNode, 'specs.row', 0)
        this.gotoEditorLine(row)
      } else if (this.selectAfterRender) {
        this.editor.scrollToLine(0)
        this.editor.selection.moveCursorToPosition({ row: 0, column: 0 })
      }
      if (this.selectAfterRender) {
        this.editor.renderer.off('afterRender', this.selectTextLine)
        delete this.selectAfterRender
      }
      delete this.selectedNode
    } else {
      this.selectedNode = textNode
    }
  }

  gotoEditorLine(line) {
    this.editor.renderer.STEPS = 25
    this.editor.setAnimatedScroll(true)
    this.editor.scrollToLine(line, true)
    this.editor.selection.moveCursorToPosition({ row: line, column: 0 })
    this.editor.selection.selectLineEnd()
  }

  // text editor commands
  handleEditorCommand(command) {
    switch (command) {
    case 'next':
    case 'previous':
      if (this.selectionIndex !== -1 && this.selectionRanges.length > 1) {
        if (command === 'next') {
          this.selectionIndex++
          if (this.selectionIndex >= this.selectionRanges.length) {
            this.selectionIndex = 0
          }
        } else if (command === 'previous') {
          this.selectionIndex--
          if (this.selectionIndex < 0) {
            this.selectionIndex = this.selectionRanges.length - 1
          }
        }
        const range = this.selectionRanges[this.selectionIndex]
        this.editor.selection.setRange(range, true)
        this.editor.scrollToLine(range.start.row, true)
      }
      break
    case 'undo':
      this.editor.undo()
      break
    case 'redo':
      this.editor.redo()
      break
    case 'restore':
      this.resetEditor()
      break
    case 'update':
      this.updateResources()
      break
    }
  }

  handleSearchChange(searchName) {
    if (searchName.length > 1 || this.nameSearchMode) {
      this.editor.exitMultiSelectMode()
      if (searchName) {
        const found = this.editor.findAll(searchName)
        if (found > 0) {
          const { start: { row } } = this.editor.getSelectionRange()
          this.editor.setAnimatedScroll(true)
          this.editor.scrollToLine(row, true)
          this.selectionRanges = this.editor.selection.getAllRanges()
          this.selectionIndex = 0
        }
      } else {
        this.selectionIndex = -1
      }
      this.nameSearch = searchName
      this.nameSearchMode = searchName.length > 0
    }
  }

  handleEditorChange = currentYaml => {
    this.setState({
      currentYaml,
      /* eslint-disable-next-line react/no-unused-state */
      userChanges: true
    })
    delete this.resetUndoManager
    this.parseDebounced()
  };

  handleParse = () => {
    const { currentYaml } = this.state
    const { parsed: currentParsed, exceptions } = parse(
      currentYaml,
      validator,
      this.context.locale
    )

    // update editor annotations
    this.editor.session.setAnnotations(exceptions)

    // update editor toolbar
    this.setState({ currentParsed, exceptions })
  };

  resetEditor(yml) {
    const { yaml } = this.props
    this.setState({
      currentYaml: yml || yaml,
      exceptions: [],
      hasUndo: false,
      hasRedo: false,
      userChanges: false /* eslint-disable-line react/no-unused-state */
    })
    if (this.editor) {
      this.editor.scrollToLine(0, true)
    }
    this.resetUndoManager = true
  }

  updateResources() {
    const { yaml, originalMap } = this.props
    const { parsed } = parse(yaml)
    const { currentParsed } = this.state
    const { updates } = getUpdates(parsed, currentParsed, originalMap)
    if (updates.length > 0) {
      let error = false
      updates.some(({ resourceType, namespace, name, resource, selfLink }) => {
        try {
          this.props.putResource(
            resourceType,
            namespace,
            name,
            resource,
            selfLink
          )
        } catch (e) {
          this.setState({
            updateMsgKind: 'error',
            updateMessage: msgs.get(
              'error.updating.resource',
              [e.message],
              this.context.locale
            )
          })
          error = true
        }
        return error
      })
      if (!error) {
        this.setState({
          updateMsgKind: 'success',
          updateMessage: msgs.get(
            'success.update.resource.check',
            this.context.locale
          )
        })
      }
    } else {
      this.setState({
        updateMsgKind: 'error',
        updateMessage: msgs.get(
          'error.update.only.placement',
          this.context.locale
        )
      })
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps
  const { HCMApplicationList } = state
  const name = decodeURIComponent(params.name)
  const namespace = decodeURIComponent(params.namespace)
  const { topology } = state
  const {
    activeFilters,
    fetchFilters,
    fetchError,
    diagramFilters = []
  } = topology
  let localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${namespace}\\${name}`
  const fetchApplication = _.get(topology, 'fetchFilters.application')
  if (fetchApplication) {
    localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${fetchApplication.namespace}\\${
      fetchApplication.name
    }`
  }
  const diagramElements = getDiagramElements(
    topology,
    localStoreKey,
    name,
    namespace,
    HCMApplicationList
  )
  return {
    ...diagramElements,
    activeFilters,
    fetchFilters,
    fetchError,
    diagramFilters,
    HCMApplicationList
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { namespace, name } } = ownProps
  return {
    resetFilters: () => {
      dispatch({
        type: TOPOLOGY_SET_ACTIVE_FILTERS,
        activeFilters: {}
      })
    },
    fetchHCMApplicationResource: () => {
      dispatch(fetchResource(RESOURCE_TYPES.HCM_APPLICATIONS, namespace, name))
    },
    fetchAppTopology: (fetchChannel, reloading) => {
      const fetchFilters = {
        application: { name, namespace, channel: fetchChannel }
      }
      dispatch(
        fetchTopology({ filter: { ...fetchFilters } }, fetchFilters, reloading)
      )
    },
    putResource: (resourceType, ns, resName, data, selfLink) => {
      dispatch(editResource(resourceType, ns, resName, data, selfLink))
    },
    restoreSavedDiagramFilters: () => {
      dispatch({
        type: DIAGRAM_RESTORE_FILTERS,
        namespace,
        name,
        initialDiagramFilters: []
      })
    },
    onDiagramFilterChange: (filterType, diagramFilters) => {
      dispatch({
        type: DIAGRAM_SAVE_FILTERS,
        namespace,
        name,
        diagramFilters
      })
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withLocale(ApplicationTopologyModule)
  )
)

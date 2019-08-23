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
import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import hcmappdiagram from './definitions/hcm-application-diagram'
import hcmtopology from './definitions/hcm-topology'
import { editResource } from '../../actions/common'
import { fetchTopology } from '../../actions/topology'
import { parse } from '../../../lib/client/design-helper'
import {
  DIAGRAM_REFRESH_INTERVAL_COOKIE,
  MCM_DESIGN_SPLITTER_SIZE_COOKIE,
  DIAGRAM_QUERY_COOKIE
} from '../../../lib/shared/constants'
import { InlineNotification } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import * as Actions from '../../actions'
import apolloClient from '../../../lib/client/apollo-client'
import resources from '../../../lib/shared/resources'
import DiagramViewer from './visualizers/DiagramViewer'
import { getPollInterval } from './components/RefreshSelect'
import EditorBar from './components/EditorBar'
import FilterBar from './components/FilterBar'
import YamlEditor from '../common/YamlEditor'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('./style.scss')
})

class ApplicationTopologyModule extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    activeChannel: PropTypes.string,
    channels: PropTypes.array,
    clusters: PropTypes.array,
    diagramFilters: PropTypes.array,
    fetchTopology: PropTypes.func,
    getUpdates: PropTypes.func,
    links: PropTypes.array,
    nodes: PropTypes.array,
    onDiagramFilterChange: PropTypes.func,
    parsed: PropTypes.object,
    putResource: PropTypes.func,
    resetFilters: PropTypes.func,
    restoreSavedDiagramFilters: PropTypes.func,
    showExpandedTopology: PropTypes.bool,
    staticResourceData: PropTypes.object,
    statusesLoaded: PropTypes.bool,
    topologyLoadError: PropTypes.bool,
    topologyLoaded: PropTypes.bool,
    topologyReloading: PropTypes.bool,
    validator: PropTypes.func,
    yaml: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {
      links: [],
      nodes: [],
      activeChannel: props.activeChannel,
      currentYaml: props.yaml || '',
      exceptions: [],
      updateMessage: '',
      topologyLoaded: false,
      statusesLoaded: false,
      selectedNode: undefined,
      firstLoad: false,
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
    this.handeNodeSelected = this.handleNodeSelected.bind(this)
    this.handleEditorCommand = this.handleEditorCommand.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleToggleSize = this.handleToggleSize.bind(this)
    this.gotoEditorLine = this.gotoEditorLine.bind(this)
    this.fetchLogs = this.fetchLogs.bind(this)
  }

  componentWillMount() {
    this.props.restoreSavedDiagramFilters()
    this.props.resetFilters()
    this.props.fetchTopology(this.props.activeChannel)
    this.startPolling()
  }

  componentWillUnmount() {
    if (this.state) {
      this.stopPolling()
    }
  }

  startPolling(newInterval) {
    this.stopPolling()
    let intervalId = undefined
    const interval =
      newInterval || getPollInterval(DIAGRAM_REFRESH_INTERVAL_COOKIE)
    if (interval) {
      intervalId = setInterval(this.refetch, Math.max(interval, 5 * 1000))
    }
    this.setState({ intervalId })
  }

  stopPolling() {
    const { intervalId } = this.state
    if (intervalId) clearInterval(intervalId)
    this.setState({ intervalId: undefined })
  }

  refetch() {
    this.props.fetchTopology(this.props.activeChannel)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      const links = _.cloneDeep(nextProps.links || [])
      const nodes = _.cloneDeep(nextProps.nodes || [])
      const clusters = _.cloneDeep(nextProps.clusters || [])
      const diagramFilters = _.cloneDeep(nextProps.diagramFilters || [])

      // update loading spinner
      const firstLoad = prevState.firstLoad || nextProps.topologyLoaded
      const { topologyReloading } = nextProps
      if (this.updateDiagramRefreshTime) {
        this.updateDiagramRefreshTime(topologyReloading)
      }

      // update current yaml
      const currentYaml = prevState.currentYaml || nextProps.yaml

      return {
        clusters,
        links,
        nodes,
        currentYaml,
        diagramFilters,
        firstLoad,
        topologyReloading,
        isMulticluster: clusters.length > 1,
        topologyLoaded: nextProps.topologyLoaded,
        topologyLoadError: nextProps.topologyLoadError,
        statusesLoaded: nextProps.statusesLoaded
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(
        this.state.nodes.map(n => n.uid),
        nextState.nodes.map(n => n.uid)
      ) ||
      !_.isEqual(
        this.state.links.map(n => n.uid),
        nextState.links.map(n => n.uid)
      ) ||
      !_.isEqual(this.state.diagramFilters, nextState.diagramFilters) ||
      !_.isEqual(this.state.exceptions, nextState.exceptions) ||
      this.state.activeChannel !== nextState.activeChannel ||
      !_.isEqual(this.props.channels, nextProps.channels) ||
      this.state.updateMessage !== nextState.updateMessage ||
      this.props.showExpandedTopology !== nextProps.showExpandedTopology ||
      this.props.topologyLoaded !== nextProps.topologyLoaded ||
      this.props.statusesLoaded !== nextProps.statusesLoaded ||
      this.props.yaml.localeCompare(nextProps.yaml) !== 0 ||
      this.state.currentYaml.localeCompare(nextState.currentYaml) !== 0 ||
      this.state.hasUndo !== nextState.hasUndo ||
      this.state.hasRedo !== nextState.hasRedo
    )
  }

  handleSplitterDefault = () => {
    const cookie = localStorage.getItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`)
    let size = 1000
    if (cookie) {
      size = parseInt(cookie)
    } else {
      const page = document.getElementById('page')
      if (page) {
        size = page.getBoundingClientRect().width * 2 / 3
        localStorage.setItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`, size)
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
      const fontSize = editorSize <= 250 ? 6 : editorSize <= 400 ? 10 : 12
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
  setUpdateDiagramRefreshTimeFunc = func => {
    this.updateDiagramRefreshTime = func
  };
  handleTopologyErrorClosed = () => this.setState({ topologyLoadError: false });
  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' });

  render() {
    const {
      staticResourceData,
      onDiagramFilterChange,
      showExpandedTopology
    } = this.props
    const { designTypes, topologyTypes, typeToShapeMap } = staticResourceData
    const {
      nodes,
      links,
      diagramFilters,
      selectedNode,
      isMulticluster,
      topologyLoadError
    } = this.state
    const {
      firstLoad,
      topologyLoaded,
      topologyReloading,
      statusesLoaded
    } = this.state
    const {
      currentYaml,
      hasUndo,
      hasRedo,
      exceptions,
      updateMessage,
      updateMsgKind
    } = this.state
    const { locale } = this.context

    // set up type filter bar
    const availableFilters = [...designTypes, ...topologyTypes].map(label => {
      return { label }
    })

    const typeFilterTitle = msgs.get('type', locale)
    const diagramTitle = msgs.get('application.diagram', locale)
    const viewFullMsg = showExpandedTopology
      ? msgs.get('application.diagram.view.collapsed', locale)
      : msgs.get('application.diagram.view.full', locale)

    const handleNodeSelected = node => {
      this.handleNodeSelected(node)
    }

    const diagramClasses = classNames({
      resourceDiagramSourceContainer: true,
      showExpandedTopology,
      split: showExpandedTopology
    })

    const renderDiagramView = () => {
      return (
        <div className="resourceDiagramControlsContainer">
          <div className="diagram-title">{diagramTitle}</div>
          {topologyLoadError && (
            <InlineNotification
              kind={'error'}
              title={msgs.get('error.update.resource', this.context.locale)}
              iconDescription=""
              subtitle={msgs.get('error.load.topology', this.context.locale)}
              onCloseButtonClick={this.handleTopologyErrorClosed}
            />
          )}
          <div className="channel-diagram-container">
            {this.renderChannelControls()}
            <DiagramViewer
              id={'application'}
              nodes={nodes}
              links={links}
              isMulticluster={isMulticluster}
              context={this.context}
              showExpandedTopology={showExpandedTopology}
              handleNodeSelected={handleNodeSelected}
              selectedNode={selectedNode}
              setViewer={this.setViewer}
              secondaryLoad={!topologyLoaded && !firstLoad}
              statusesLoaded={statusesLoaded}
              reloading={topologyReloading}
              staticResourceData={staticResourceData}
              setUpdateDiagramRefreshTimeFunc={
                this.setUpdateDiagramRefreshTimeFunc
              }
              fetchLogs={this.fetchLogs}
              activeFilters={{ type: diagramFilters }}
            />
          </div>
          <div className="diagram-controls-container">
            <div
              className="diagram-type-filter-bar"
              role="region"
              aria-label={typeFilterTitle}
              id={typeFilterTitle}
            >
              <FilterBar
                availableFilters={availableFilters}
                activeFilters={diagramFilters}
                typeToShapeMap={typeToShapeMap}
                onChange={onDiagramFilterChange}
              />
            </div>
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
        </div>
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
                  ? msgs.get('error.update.resource', this.context.locale)
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

  renderChannelControls() {
    const { locale } = this.context
    const { channels } = this.props
    const { activeChannel } = this.state
    return (
      <div className="channel-controls-container">
        {channels.map(chn => {
          const classes = classNames({
            'channel-control': true,
            selected: chn === activeChannel
          })
          const handleClick = () => {
            this.changeTheChannel(chn)
          }
          const handleKeyPress = e => {
            if (e.key === 'Enter') {
              this.changeTheChannel(chn)
            }
          }
          const tooltip = msgs.get(
            'application.diagram.channel.tooltip',
            [chn],
            locale
          )
          return (
            <div
              className={classes}
              key={chn}
              tabIndex="0"
              role={'button'}
              aria-label={tooltip}
              title={tooltip}
              onClick={handleClick}
              onKeyPress={handleKeyPress}
            >
              {chn
                .split('/')
                .slice(-1)
                .pop()}
            </div>
          )
        })}
      </div>
    )
  }

  changeTheChannel(fetchChannel) {
    this.setState({ activeChannel: fetchChannel })
    this.props.fetchTopology(fetchChannel)
  }

  handleToggleSize() {
    const { actions, showExpandedTopology } = this.props
    actions.setShowExpandedTopology(!showExpandedTopology)
  }

  // user clicked a node in diagram
  handleNodeSelected(node) {
    this.setState(() => {
      this.selectTextLine(node)
      return {
        selectedNode: node
      }
    })
  }

  closeTextView = () => {
    delete this.editor
    const { actions } = this.props
    actions.setShowExpandedTopology(false)
  };

  // select text editor line associated with selected node/link
  selectTextLine(node) {
    if (this.editor) {
      node = node || this.selectedNode
      if (node) {
        const row = _.get(node, 'specs.row', 0)
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
      this.selectedNode = node
    }
  }

  gotoEditorLine(line) {
    this.editor.renderer.STEPS = 25
    this.editor.setAnimatedScroll(true)
    this.editor.scrollToLine(line, true)
    this.editor.selection.moveCursorToPosition({ row: line, column: 0 })
    this.editor.selection.selectLine()
  }

  // text editor commands
  handleEditorCommand(command) {
    switch (command) {
    case 'next':
    case 'previous':
      if (this.selectionIndex !== -1) {
        if (this.selectionRanges.length > 1) {
          switch (command) {
          case 'next':
            this.selectionIndex++
            if (this.selectionIndex >= this.selectionRanges.length) {
              this.selectionIndex = 0
            }
            break
          case 'previous':
            this.selectionIndex--
            if (this.selectionIndex < 0) {
              this.selectionIndex = this.selectionRanges.length - 1
            }
            break
          }
          const range = this.selectionRanges[this.selectionIndex]
          this.editor.selection.setRange(range, true)
          this.editor.scrollToLine(range.start.row, true)
        }
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
    this.setState({ currentYaml })
    delete this.resetUndoManager
    this.parseDebounced()
  };

  handleParse = () => {
    const { validator } = this.props
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

  resetEditor() {
    const { yaml } = this.props
    this.setState({
      currentYaml: yaml,
      exceptions: [],
      hasUndo: false,
      hasRedo: false
    })
    this.resetUndoManager = true
  }

  updateResources() {
    const { getUpdates, parsed } = this.props
    const { currentParsed } = this.state
    const { updates } = getUpdates(parsed, currentParsed)
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

  fetchLogs(resourceType, { name, namespace, clusterName }) {
    const client = apolloClient.getClient()
    client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: true,
        type: 'table.actions.pod.logs',
        resourceType: {
          __typename: 'resourceType',
          name: resourceType.name,
          list: resourceType.list
        },
        data: {
          __typename: 'ModalData',
          name,
          namespace,
          clusterName,
          kind: ''
        }
      }
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps
  const name = decodeURIComponent(params.name)
  const namespace = decodeURIComponent(params.namespace)
  const staticResourceData = hcmappdiagram.mergeDefinitions(hcmtopology)
  const { HCMApplicationList } = state
  const item = HCMApplicationList.items[0]
  const localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${namespace}\\${name}`
  const { topology } = state
  const { activeFilters = {}, diagramFilters = [] } = topology
  const { application = {} } = activeFilters
  topology.loaded =
    application.name === name && application.namespace === namespace
  const diagramElements = staticResourceData.getDiagramElements(
    item,
    topology,
    diagramFilters,
    localStoreKey
  )
  return {
    ...diagramElements,
    staticResourceData,
    validator: staticResourceData.validator,
    getUpdates: staticResourceData.getUpdates,
    diagramFilters
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { namespace, name } } = ownProps
  const staticResourceData = hcmappdiagram.mergeDefinitions(hcmtopology)
  const { designTypes, topologyTypes } = staticResourceData
  return {
    resetFilters: () => {
      dispatch({
        type: Actions.TOPOLOGY_SET_ACTIVE_FILTERS,
        activeFilters: {}
      })
    },
    fetchTopology: (fetchChannel, reloading) => {
      const fetchFilters = {
        application: { name, namespace, channel: fetchChannel }
      }
      dispatch(
        fetchTopology({ filter: { ...fetchFilters } }, fetchFilters, reloading)
      )
    },
    putResource: (resourceType, namespace, name, data, selfLink) => {
      dispatch(editResource(resourceType, namespace, name, data, selfLink))
    },
    restoreSavedDiagramFilters: () => {
      // initial filter is everything
      const initialDiagramFilters = [...designTypes, ...topologyTypes].map(
        label => {
          return { label }
        }
      )
      dispatch({
        type: Actions.DIAGRAM_RESTORE_FILTERS,
        namespace,
        name,
        initialDiagramFilters
      })
    },
    onDiagramFilterChange: (filterType, diagramFilters) => {
      dispatch({
        type: Actions.DIAGRAM_SAVE_FILTERS,
        namespace,
        name,
        diagramFilters
      })
    }
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ApplicationTopologyModule)
)

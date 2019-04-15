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
import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchResource, fetchResources, editResource } from '../../actions/common'
import { fetchTopology } from '../../actions/topology'
import { parse } from '../../../lib/client/design-helper'
import { MCM_OPEN_DIAGRAM_TAB_COOKIE, DIAGRAM_REFRESH_INTERVAL_COOKIE,
  DIAGRAM_QUERY_COOKIE, MCM_DESIGN_SPLITTER_OPEN_COOKIE,
  MCM_DESIGN_SPLITTER_SIZE_COOKIE, REFRESH_TIMES, RESOURCE_TYPES } from '../../../lib/shared/constants'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import { Loading, Icon, InlineNotification  } from 'carbon-components-react'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import msgs from '../../../nls/platform.properties'
import * as Actions from '../../actions'
import apolloClient from '../../../lib/client/apollo-client'
import resources from '../../../lib/shared/resources'
import DiagramViewer from '../diagrams/DiagramViewer'
import AutoRefreshSelect, {getPollInterval} from './AutoRefreshSelect'
import EditorBar from './EditorBar'
import FilterBar from './FilterBar'
import YamlEditor from '../common/YamlEditor'
import _ from 'lodash'

resources(() => {
  require('../../../scss/resource-diagram.scss')
  require('../../../scss/topology-details.scss')
  require('../../../scss/topology-diagram.scss')
})

class ResourceDiagram extends React.Component {
    static propTypes = {
      clusters: PropTypes.array,
      designLoaded: PropTypes.bool,
      diagramFilters: PropTypes.array,
      fetchDesign: PropTypes.func,
      fetchPods: PropTypes.func,
      fetchTopology: PropTypes.func,
      getUpdates: PropTypes.func,
      links: PropTypes.array,
      nodes: PropTypes.array,
      onDiagramFilterChange: PropTypes.func,
      parsed: PropTypes.object,
      putResource: PropTypes.func,
      requiredFilters: PropTypes.object,
      restoreSavedDiagramFilters: PropTypes.func,
      staticResourceData: PropTypes.object,
      statusesLoaded: PropTypes.bool,
      topologyError: PropTypes.bool,
      topologyLoaded: PropTypes.bool,
      topologyReloading: PropTypes.bool,
      validator: PropTypes.func,
      yaml: PropTypes.string,
    }

    constructor (props) {
      super(props)
      this.state = {
        links: [],
        nodes: [],
        currentYaml: props.yaml || '',
        exceptions: [],
        updateMessage: '',
        designLoaded:false,
        topologyLoaded:false,
        statusesLoaded:false,
        showTextView: !!localStorage.getItem(`${MCM_DESIGN_SPLITTER_OPEN_COOKIE}`),
        selectedNode: undefined,
        firstLoad:false,
        hasUndo: false,
        hasRedo: false,
      }
      this.layoutEditorsDebounced = _.debounce(()=>{
        this.layoutEditors()
      }, 150)
      this.parseDebounced = _.debounce(()=>{
        this.handleParse()
      }, 500)
      this.startPolling = this.startPolling.bind(this)
      this.stopPolling = this.stopPolling.bind(this)
      this.refetch = this.refetch.bind(this)
      this.handeNodeSelected = this.handleNodeSelected.bind(this)
      this.handleEditorCommand = this.handleEditorCommand.bind(this)
      this.handleSearchChange = this.handleSearchChange.bind(this)
      this.gotoEditorLine = this.gotoEditorLine.bind(this)
      this.fetchLogs = this.fetchLogs.bind(this)
      localStorage.setItem(MCM_OPEN_DIAGRAM_TAB_COOKIE, 'true')
    }

    componentWillMount() {
      // when mounting, load design
      // that will figure out what topology labels we need
      // when topologyLabels changes we fetch the topology
      this.props.restoreSavedDiagramFilters()
      this.props.fetchDesign()
      this.startPolling()
    }

    componentDidMount() {
      if (this.state.showTextView) {
        this.layoutEditors()
      }
    }

    componentWillUnmount() {
      if (this.state) {
        this.stopPolling()
      }
    }

    startPolling(newInterval) {
      this.stopPolling()
      let intervalId = undefined
      const interval = newInterval || getPollInterval(DIAGRAM_REFRESH_INTERVAL_COOKIE)
      if (interval) {
        intervalId = setInterval(this.refetch, Math.max(interval, 5*1000))
      }
      this.setState({ intervalId })
    }

    stopPolling() {
      const {intervalId} = this.state
      if (intervalId)
        clearInterval(intervalId)
      this.setState({ intervalId: undefined })
    }

    refetch() {
      this.props.fetchTopology(this.props.requiredFilters, true)
      this.props.fetchPods()
    }

    componentWillReceiveProps(nextProps) {
      this.setState((prevState) => {
        const links = _.cloneDeep(nextProps.links||[])
        const nodes = _.cloneDeep(nextProps.nodes||[])
        const clusters = _.cloneDeep(nextProps.clusters||[])
        const diagramFilters = _.cloneDeep(nextProps.diagramFilters||[])

        // when the labels required by the design have been loaded, load the topology
        if (!prevState.designLoaded && nextProps.designLoaded ||
        !_.isEqual(this.props.requiredFilters, nextProps.requiredFilters)) {
          this.props.fetchTopology(nextProps.requiredFilters)
        }

        // after design and topology loaded, fetch pods
        if (!prevState.topologyLoaded && nextProps.topologyLoaded) {
          this.props.fetchPods()
        }

        // update loading spinner
        const firstLoad = prevState.firstLoad || nextProps.topologyLoaded || nextProps.topologyError
        const {topologyReloading} = nextProps
        if (this.updateDiagramRefreshTime) {
          this.updateDiagramRefreshTime(topologyReloading)
        }

        // update current yaml
        const currentYaml = prevState.currentYaml || nextProps.yaml

        return { clusters, links, nodes, currentYaml,
          diagramFilters, firstLoad, topologyReloading,
          isMulticluster: clusters.length>1,
          designLoaded: nextProps.designLoaded,
          topologyLoaded: nextProps.topologyLoaded,
          statusesLoaded:  nextProps.statusesLoaded,}
      })
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (!_.isEqual(this.state.nodes.map(n => n.uid), nextState.nodes.map(n => n.uid)) ||
        !_.isEqual(this.state.links.map(n => n.uid), nextState.links.map(n => n.uid)) ||
        !_.isEqual(this.state.diagramFilters, nextState.diagramFilters) ||
        !_.isEqual(this.state.exceptions, nextState.exceptions) ||
        this.state.updateMessage !== nextState.updateMessage ||
        this.state.showTextView !== nextState.showTextView ||
        this.props.topologyError !== nextProps.topologyError ||
        this.props.topologyLoaded !== nextProps.topologyLoaded ||
        this.props.statusesLoaded !== nextProps.statusesLoaded ||
        this.props.yaml.localeCompare(nextProps.yaml) !==  0 ||
        this.state.currentYaml.localeCompare(nextState.currentYaml) !==  0 ||
        this.state.hasUndo!==nextState.hasUndo ||
        this.state.hasRedo!==nextState.hasRedo)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.showTextView && !prevState.showTextView) {
        localStorage.setItem(`${MCM_DESIGN_SPLITTER_OPEN_COOKIE}`, true)
      }
    }

    handleSplitterDefault = () => {
      const cookie = localStorage.getItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`)
      let size = 1000
      if (cookie) {
        size = parseInt(cookie)
      } else {
        const page = document.getElementById('page')
        if (page) {
          size = page.getBoundingClientRect().width*2/3
          localStorage.setItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`, size)
        }
      }
      return size
    }

    handleSplitterChange = (size) => {
      localStorage.setItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`, size)
      this.layoutEditorsDebounced()
    }

    setContainerRef = (container) => {
      this.containerRef = container
      this.layoutEditors()
    }

    setEditor = (editor) => {
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
        this.setState({hasUndo, hasRedo})
      })
    }

    setViewer = (viewer) => {
      this.viewer = viewer
      this.layoutEditors()
    }

    layoutEditors() {
      if (this.containerRef && this.viewer && this.editor) {
        const diagramSize = localStorage.getItem(`${MCM_DESIGN_SPLITTER_SIZE_COOKIE}`)
        const editorSize = this.containerRef.getBoundingClientRect().width - diagramSize
        // change editor font size based on how much horiozontal space it has
        const fontSize = editorSize<=250 ? 6 : (editorSize<=400 ? 10 : 12)
        this.viewer.resize()
        this.editor.setFontSize(fontSize)
        this.editor.renderer.setShowGutter(editorSize>250)
        this.editor.resize()
        this.editor.setAnimatedScroll(false)
        const cursor = this.editor.selection.getCursor()
        this.editor.scrollToLine(cursor.row, true)
      }
    }

    setContainerEditor = (container) => this.containerEditor = container
    setSplitPaneRef = (splitPane) => this.splitPane = splitPane
    getViewer = () => this.viewer
    getEditor = () => this.editor
    setCopyAreaRef = (ref) =>  this.copyArea = ref
    setUpdateDiagramRefreshTimeFunc = func => {this.updateDiagramRefreshTime = func}
    handleUpdateMessageClosed = () => this.setState({ updateMessage: '' })

    render() {
      if (!this.state.designLoaded)
        return <Loading withOverlay={false} className='content-spinner' />

      const { staticResourceData, onDiagramFilterChange, topologyError } = this.props
      const { designTypes, topologyTypes, typeToShapeMap } = staticResourceData
      const { links,  diagramFilters, selectedNode, showTextView, isMulticluster } = this.state
      const { firstLoad, topologyLoaded, topologyReloading, statusesLoaded } = this.state
      const { currentYaml, hasUndo, hasRedo, exceptions, updateMessage, updateMsgKind } = this.state
      const { nodes } = this.state

      // set up type filter bar
      const availableFilters = [...designTypes, ...topologyTypes].map(label=>{
        return {label}
      })

      const typeFilterTitle = msgs.get('type', this.context.locale)

      const handleNodeSelected = (node) => {
        this.handleNodeSelected(node)
      }

      const renderDiagramView = () =>{
        return (
          <div className="resourceDiagramContainer" >
            <div className='diagram-type-filter-bar' role='region' aria-label={typeFilterTitle} id={typeFilterTitle}>
              <FilterBar
                availableFilters={availableFilters}
                activeFilters={diagramFilters}
                typeToShapeMap={typeToShapeMap}
                onChange={onDiagramFilterChange}
              />
            </div>
            <DiagramViewer
              id={'application'}
              nodes={nodes}
              links={links}
              isMulticluster={isMulticluster}
              context={this.context}
              handleNodeSelected={handleNodeSelected}
              selectedNode={selectedNode}
              setViewer={this.setViewer}
              secondaryError={topologyError}
              secondaryLoad={!topologyLoaded && !firstLoad}
              statusesLoaded={statusesLoaded}
              reloading={topologyReloading}
              staticResourceData={staticResourceData}
              setUpdateDiagramRefreshTimeFunc={this.setUpdateDiagramRefreshTimeFunc}
              fetchLogs={this.fetchLogs}
              activeFilters={{type:diagramFilters}}
            />
            <div className='resource-diagram-toolbar' >
              <AutoRefreshSelect
                startPolling={this.startPolling}
                stopPolling={this.stopPolling}
                pollInterval={getPollInterval(DIAGRAM_REFRESH_INTERVAL_COOKIE)}
                refetch={this.refetch}
                refreshValues = {REFRESH_TIMES}
                refreshCookie={DIAGRAM_REFRESH_INTERVAL_COOKIE}
              />
            </div>
          </div>
        )
      }

      const renderTextView = () =>{
        return (
          <div className="resourceEditorContainer" >
            <div className='resource-editor-toolbar' role='region' aria-label={typeFilterTitle} id={typeFilterTitle}>
              <EditorBar
                hasUndo={hasUndo}
                hasRedo={hasRedo}
                exceptions={exceptions}
                gotoEditorLine={this.gotoEditorLine}
                handleEditorCommand={this.handleEditorCommand}
                handleSearchChange={this.handleSearchChange}
              />
            </div>
            {updateMessage &&
            <InlineNotification
              kind={updateMsgKind}
              title={updateMsgKind==='error' ?
                msgs.get('error.update.resource', this.context.locale) :
                msgs.get('success.update.resource', this.context.locale) }
              iconDescription=''
              subtitle={updateMessage}
              onCloseButtonClick={this.handleUpdateMessageClosed}
            />
            }
            <YamlEditor
              width={'100%'}
              height={'100%'}
              getViewer={this.getViewer}
              setContainerEditor={this.setContainerEditor}
              setEditor={this.setEditor}
              wrapEnabled={true}
              onYamlChange={this.handleEditorChange}
              yaml={currentYaml} />
            <Icon
              className='closeIcon'
              description={msgs.get('topology.details.close', this.context.locale)}
              name="icon--close"
              onClick={this.closeTextView}
            />
          </div>
        )
      }

      const classes = classNames({
        'resourceDiagramSourceContainer': true,
        split: showTextView
      })

      return (
        <div className={classes} ref={this.setContainerRef} >
          {showTextView ?
            <SplitPane
              split='vertical'
              minSize={50}
              ref={this.setSplitPaneRef}
              defaultSize={this.handleSplitterDefault()}
              onChange={this.handleSplitterChange}>
              {renderDiagramView()}
              {renderTextView()}
            </SplitPane> :
            renderDiagramView()}
        </div>
      )
    }


    // user clicked a node in diagram
    handleNodeSelected(node) {
      this.setState((prevState) => {
        this.selectTextLine(node)
        return {
          selectedNode: node,
          showTextView: !!node || prevState.showTextView
        }
      })
    }

    closeTextView = () => {
      localStorage.removeItem(`${MCM_DESIGN_SPLITTER_OPEN_COOKIE}`)
      delete this.editor
      this.setState(() => {
        return {
          selectedNode: undefined,
          showTextView: false
        }
      })
    }

    // select text editor line associated with selected node/link
    selectTextLine(node) {
      if (this.editor) {
        node = node || this.selectedNode
        if (node) {
          this.gotoEditorLine(node.$r||0)
        } else if (this.selectAfterRender) {
          this.editor.scrollToLine(0)
          this.editor.selection.moveCursorToPosition({row: 0, column: 0})
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
      this.editor.selection.moveCursorToPosition({row: line, column: 0})
      this.editor.selection.selectLine()
    }

    // text editor commands
    handleEditorCommand(command) {
      switch (command) {
      case 'next':
      case 'previous':
        if (this.selectionIndex!==-1) {
          if (this.selectionRanges.length>1) {
            switch (command) {
            case 'next':
              this.selectionIndex++
              if (this.selectionIndex>=this.selectionRanges.length) {
                this.selectionIndex = 0
              }
              break
            case 'previous':
              this.selectionIndex--
              if (this.selectionIndex<0) {
                this.selectionIndex = this.selectionRanges.length-1
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
      if (searchName.length>1 || this.nameSearchMode) {
        this.editor.exitMultiSelectMode()
        if (searchName) {
          const found = this.editor.findAll(searchName)
          if (found>0) {
            const {start: {row}} = this.editor.getSelectionRange()
            this.editor.setAnimatedScroll(true)
            this.editor.scrollToLine(row, true)
            this.selectionRanges = this.editor.selection.getAllRanges()
            this.selectionIndex = 0
          }
        } else {
          this.selectionIndex = -1
        }
        this.nameSearch = searchName
        this.nameSearchMode = searchName.length>0
      }
    }

    handleEditorChange = (currentYaml) => {
      this.setState({currentYaml})
      delete this.resetUndoManager
      this.parseDebounced()
    }

    handleParse = () => {
      const { validator } = this.props
      const { currentYaml } = this.state
      const { parsed: currentParsed, exceptions} = parse(currentYaml, validator, this.context.locale)

      // update editor annotations
      this.editor.session.setAnnotations(exceptions)

      // update editor toolbar
      this.setState({currentParsed, exceptions})
    }

    resetEditor() {
      const {yaml} = this.props
      this.setState({ currentYaml:yaml, exceptions:[], hasUndo: false, hasRedo: false})
      this.resetUndoManager = true
    }

    updateResources() {
      const {getUpdates, parsed} = this.props
      const {currentParsed} = this.state
      const {updates} = getUpdates(parsed, currentParsed)
      if (updates.length>0) {
        let error = false
        updates.some(({resourceType, namespace, name, resource, selfLink})=>{
          try {
            this.props.putResource(resourceType, namespace, name, resource, selfLink)
          } catch (e) {
            this.setState({updateMsgKind: 'error', updateMessage: msgs.get('error.updating.resource', [e.message], this.context.locale)})
            error = true
          }
          return error
        })
        if (!error) {
          this.setState({updateMsgKind: 'success', updateMessage: msgs.get('success.update.resource.check', this.context.locale)})
        }
      } else {
        this.setState({updateMsgKind: 'error', updateMessage: msgs.get('error.update.only.placement', this.context.locale)})
      }
    }

    fetchLogs(resourceType,{name,namespace,clusterName}) {
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
            __typename:'ModalData',
            name,
            namespace,
            clusterName,
          }
        }
      })
    }
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, staticResourceData, params } = ownProps
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
  const localStoreKey = `${DIAGRAM_QUERY_COOKIE}\\${resourceType.name}\\${params.namespace}\\${name}`
  const {topology, HCMPodList} = state
  const {diagramFilters=[]} = topology
  const diagramElements = staticResourceData.getDiagramElements(item, topology, diagramFilters, HCMPodList, localStoreKey)
  return {
    ...diagramElements,
    validator: staticResourceData.validator,
    getUpdates: staticResourceData.getUpdates,
    diagramFilters,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, params: {namespace, name}, staticResourceData } = ownProps
  const {designTypes, topologyTypes} = staticResourceData
  return {
    fetchDesign: () => {
      // in topology page, the filter dropdowns would be setting activeFilters
      // but here we need to set the activeFilters based on the design
      // and design hasn't loaded yet, so no active topology filters yet
      dispatch({type: Actions.TOPOLOGY_SET_ACTIVE_FILTERS, activeFilters: {}})

      dispatch(fetchResource(resourceType, namespace, name))
    },
    fetchTopology: (requiredFilters, reloading) => {
      const f = _.cloneDeep(requiredFilters)
      f.label = f.label ? f.label.map(l => ({ name: l.name, value: l.value })) : []

      // in topology page, the filter dropdowns would be setting the active topology filters
      // but here we need to set the activeFilters based on the design
      dispatch({type: Actions.TOPOLOGY_SET_ACTIVE_FILTERS, activeFilters: requiredFilters, reloading})

      // fetch topology with these types and labels
      dispatch(fetchTopology({ filter: {...f}}, requiredFilters))
    },
    fetchPods: () => {
      dispatch(fetchResources(RESOURCE_TYPES.HCM_PODS))
    },
    putResource: (resourceType, namespace, name, data, selfLink) => {
      dispatch(editResource(resourceType, namespace, name, data, selfLink))
    },
    restoreSavedDiagramFilters: () => {
      // initial filter is everything
      const initialDiagramFilters = [...designTypes, ...topologyTypes].map(label=>{
        return {label}
      })
      dispatch({type: Actions.DIAGRAM_RESTORE_FILTERS, namespace, name, initialDiagramFilters})
    },
    onDiagramFilterChange: (filterType, diagramFilters) => {
      dispatch({type: Actions.DIAGRAM_SAVE_FILTERS, namespace, name, diagramFilters})
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceDiagram))

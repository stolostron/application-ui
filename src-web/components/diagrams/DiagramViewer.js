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
import * as d3 from 'd3'
import resources from '../../../lib/shared/resources'
import config from '../../../lib/shared/config'
import DetailsView from './DetailsView'
import LayoutHelper from './layoutHelper'
import TitleHelper, {interruptTitles, counterZoomTitles} from './titleHelper'
import LinkHelper, {appendLinkDefs, interruptLinks, counterZoomLinks} from './linkHelper'
import NodeHelper, {interruptNodes, counterZoomLabels, setSelections} from './nodeHelper'
import * as c from './constants.js'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'


resources(() => {
  require('../../../scss/topology-link.scss')
  require('../../../scss/topology-node.scss')
  require('../../../scss/topology-icons.scss')
})

var currentZoom = {x:0, y:0, k:1}

class DiagramViewer extends React.Component {

  static propTypes = {
    activeFilters: PropTypes.object,
    context: PropTypes.object,
    getEditor: PropTypes.func,
    isMulticluster: PropTypes.bool,
    links: PropTypes.array,
    nodes: PropTypes.array,
    searchName: PropTypes.string,
    setViewer: PropTypes.func,
    staticResourceData: PropTypes.object,
    title: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      links: _.uniqBy(props.links, 'uid'),
      nodes: _.uniqBy(props.nodes, 'uid'),
      hiddenLinks: new Set(),
      selectedNodeId: ''
    }
    if (props.setViewer) {
      props.setViewer(this)
    }
    this.resize = _.debounce(()=>{
      if (this.isAutoZoomToFit) {
        this.zoomFit(true)
      }
    }, 150)
    const { locale } = this.props.context
    this.titles=[]
    this.layoutHelper = new LayoutHelper(this.props.staticResourceData, this.titles, locale)
    this.diagramOptions = this.props.staticResourceData.diagramOptions||{}
    this.getLayoutNodes = this.getLayoutNodes.bind(this)
    this.lastLayoutBBox=undefined
    this.isDragging = false
    this.isAutoZoomToFit = true
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    this.generateDiagram()
  }

  componentDidUpdate(){
    this.generateDiagram()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    this.destroyDiagram()
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.selectedNodeId !== nextState.selectedNodeId
    || !_.isEqual(this.state.requiredFilters, nextState.requiredFilters)
    || !_.isEqual(this.state.nodes.map(n => n.id), nextState.nodes.map(n => n.id))
    || !_.isEqual(this.state.links.map(l => l.uid), nextState.links.map(l => l.uid))
    || !_.isEqual(this.state.hiddenLinks, nextState.hiddenLinks)
    || this.props.activeFilters !== nextProps.activeFilters
    || this.props.searchName !== nextProps.searchName
  }

  // weave scans can:
  //  1) include multiple copies of the same node
  //  2) can miss some nodes between scans
  componentWillReceiveProps(){
    this.setState((prevState, props) => {

      // keyBy makes sure nodes are unique
      // also -- if they disappear in one scan, see if they reappear in the next 2 scan
      // until topology filter is changed
      const propNodeMap = _.keyBy(props.nodes, 'uid')
      const prevStateNodeMap = _.keyBy(prevState.nodes, 'uid')
      for (var uid in prevStateNodeMap) {
        const prevNode = prevStateNodeMap[uid]
        if (!propNodeMap[uid]) {
          // if node is missing in this scan, see if it reappears in the next 3 scans
          if (prevNode.latency===undefined) {
            prevNode.latency = 3
          }
          prevNode.latency -= 1
          // give it 3 scans where an object is missing before we rewmove it
          if (prevNode.latency>=0) {
            propNodeMap[uid] = prevNode
          }
        } else {
          // if it's back, forget it was ever gone
          delete prevNode.latency
        }
      }
      let nodes = Object.values(propNodeMap)


      // reuse existing states for the same node
      nodes = nodes.map(node => {
        return prevStateNodeMap[node.uid] || Object.assign(node, {layout: {newComer: {}}})
      })
      // if lots of new nodes, don't bother with remembering them
      const newComers = nodes.filter(({layout})=>{
        return layout && layout.newComer
      })
      if (newComers.length>10) {
        newComers.forEach(({layout})=>{
          delete layout.newComer
        })
      }

      // if the source/target are still there but link is gone, remember it as a hidden link
      // however if source or target are gone, don't remember it at all
      const nodeMap = _.keyBy(nodes, 'uid')
      const hiddenLinks = new Set()
      const currentLinks = _.uniqBy(props.links, 'uid').filter((link)=>{
        const {source, target} = link
        if (!nodeMap[source] || !nodeMap[target]) {
          return false
        }
        return true
      })
      const currentLinkMap = _.keyBy(currentLinks, 'uid')
      const previousLinks = prevState.links.filter((link)=>{
        const {source, target} = link
        if (!nodeMap[source] || !nodeMap[target]) {
          return false
        } else if (!currentLinkMap[link.uid]) {
          hiddenLinks.add(link.uid)
        }
        return true
      })

      // combine current and remaining previous links
      const compare = (a,b) => {
        return a.uid===b.uid
      }
      const links = _.unionWith(previousLinks, currentLinks, compare)

      // switching between search and not
      const {searchName=''} = props
      const searchChanged = searchName.localeCompare((prevState.searchName||''))!==0
      return {links, nodes, hiddenLinks, searchName, searchChanged}
    })

  }

  setViewerContainerContainerRef = ref => {this.viewerContainerContainerRef = ref}
  setViewerContainerRef = ref => {this.viewerContainerRef = ref}
  setZoomInRef = ref => {this.zoomInRef = ref}

  render() {
    const { title, context, staticResourceData, getEditor } = this.props
    const { selectedNodeId } = this.state
    const { locale } = context
    const svgId = this.getSvgId()
    return (
      <div className="diagramViewerDiagram" ref={this.setContainerRef} >
        {title && <div className='diagramViewerTitle'>
          {msgs.get('cluster.names', [title], locale)}
        </div>}
        <div className='diagramViewerContainerContainer' ref={this.setViewerContainerContainerRef}>
          <div className='diagramViewerContainer' ref={this.setViewerContainerRef}
            style={{height:'100%', width:'100%'}}  role='region' aria-label='zoom'>
            <svg id={svgId} className="topologyDiagram" />
          </div>
        </div>
        <input type='image' alt='zoom-in' className='zoom-in' ref={this.setZoomInRef}
          onClick={this.handleZoomIn} src={`${config.contextPath}/graphics/zoom-in.svg`} />
        <input type='image' alt='zoom-out' className='zoom-out'
          onClick={this.handleZoomOut} src={`${config.contextPath}/graphics/zoom-out.svg`} />
        <input type='image' alt='zoom-target' className='zoom-target'
          onClick={this.handleTarget} src={`${config.contextPath}/graphics/zoom-center.svg`} />
        { this.state.selectedNodeId && !getEditor &&
          <DetailsView
            context={this.context}
            onClose={this.handleDetailsClose}
            staticResourceData={staticResourceData}
            getLayoutNodes={this.getLayoutNodes}
            selectedNodeId={selectedNodeId}
          /> }
      </div>
    )
  }

  handleNodeClick = (node) => {
    d3.event.stopPropagation()

    // clear any currently selected nodes
    const svg = d3.select('#'+this.getSvgId())
    if (svg) {
      setSelections(svg, node)
    }

    // if there's a companion yaml editor, scroll to line
    const { getEditor } = this.props
    const editor = getEditor && getEditor()
    if (editor && node) {
      const line = node.$r||0
      editor.renderer.STEPS = 25
      editor.setAnimatedScroll(true)
      editor.scrollToLine(line, true, true, ()=>{})
      editor.selection.moveCursorToPosition({row: line, column: 0})
      editor.selection.selectLine()
    }
    this.setState({
      selectedNodeId: node?node.uid:undefined
    })
  }

  handleNodeDrag = (isDragging) => {
    this.isDragging = isDragging
  }

  getLayoutNodes = () => {
    return this.laidoutNodes
  }

  handleDetailsClose = () => {
    this.setState({
      selectedNodeId: ''
    })
  }

  destroyDiagram = () => {
    this.titles=[]
    this.layoutHelper.destroy()
    const svg = d3.select('#'+this.getSvgId())
    if (svg) {
      svg.select('g.nodes').selectAll('*').remove()
      svg.select('g.links').selectAll('*').remove()
      svg.select('g.titles').selectAll('*').remove()
    }
  }

  generateDiagram() {
    // if dragging or searching don't refresh diagram
    if (this.isDragging) {
      return
    }

    if (!this.svg) {
      this.svg = d3.select('#'+this.getSvgId())
      this.svg.append('g').attr('class', 'titles')
      this.svg.append('g').attr('class', 'links')  // Links must be added before nodes, so nodes are painted on top.
      this.svg.append('g').attr('class', 'nodes')
      this.svg.on('click', this.handleNodeClick)
      this.svg.call(this.canvasZoom())
      appendLinkDefs(this.svg)
    }

    // consolidate nodes/filter links/add layout data to each element
    const {nodes=[], links=[], hiddenLinks= new Set(), searchChanged} = this.state
    const {isMulticluster, searchName} = this.props
    const clientWidth = this.viewerContainerContainerRef ?
      this.viewerContainerContainerRef.getBoundingClientRect().width : 2200
    const options = {
      firstLayout: this.lastLayoutBBox===undefined,
      clientWidth,
      isMulticluster,
      searchName
    }
    this.layoutHelper.layout(nodes, links, hiddenLinks, options, (layoutResults)=>{

      const {laidoutNodes, titles, selfLinks, layoutMap, layoutBBox} = layoutResults
      this.layoutBBox = layoutBBox
      this.titles = titles
      const {firstLayout} = options

      // stop any current transitions
      this.interruptElements(this.svg)

      // zoom to fit all nodes
      if (this.isAutoZoomToFit || firstLayout || searchChanged) {
        this.zoomFit(false, searchChanged, true)
      }

      // Create or refresh the links in the diagram.
      const transition = d3.transition()
        .duration(firstLayout?400:800)
        .ease(d3.easeCircleOut)
      const {typeToShapeMap} = this.props.staticResourceData
      const linkHelper = new LinkHelper(this.svg, links, selfLinks, laidoutNodes, typeToShapeMap, this.diagramOptions)
      linkHelper.removeOldLinksFromDiagram()
      linkHelper.addLinksToDiagram(currentZoom)
      linkHelper.moveLinks(transition, currentZoom, searchChanged)

      // Create or refresh the nodes in the diagram.
      const nodeHelper = new NodeHelper(this.svg, laidoutNodes, typeToShapeMap, layoutMap)
      nodeHelper.removeOldNodesFromDiagram()
      nodeHelper.addNodesToDiagram(currentZoom, this.handleNodeClick, this.handleNodeDrag)
      nodeHelper.moveNodes(transition, currentZoom, searchChanged)

      // Create or refresh the titles in the diagram.
      if (titles.length) {
        const titleHelper = new TitleHelper(this.svg, titles)
        titleHelper.removeOldTitlesFromDiagram()
        titleHelper.addTitlesToDiagram(currentZoom)
        titleHelper.moveTitles(transition, currentZoom, searchChanged)
      }

      this.laidoutNodes = laidoutNodes
      this.lastLayoutBBox = laidoutNodes.length ? this.layoutBBox : undefined
      this.counterZoomElements(this.svg, currentZoom)
    })
  }

  handleZoomIn = () => {
    this.buttonZoom().scaleBy(this.svg, 1.3)
  }

  handleZoomOut = () => {
    this.buttonZoom().scaleBy(this.svg, 1 / 1.3)
  }

  handleTarget = () => {
    this.viewerContainerContainerRef.scrollTo(0, 0)
    this.zoomFit(true)
  }

  zoomFit = (zoomElements, resetScrollbar) => {
    const {y1, width, height} = this.layoutBBox
    if (width && height) {
      const svg = d3.select('#'+this.getSvgId())
      if (svg) {
        if (this.viewerContainerContainerRef) {
          const {width: availableWidth, height: availableHeight} = this.viewerContainerContainerRef.getBoundingClientRect()
          let scale = Math.min( 1, .95 / Math.max(width / availableWidth, height / availableHeight))

          // don't allow scale to drop too far for accessability reasons
          // below threshHold, show scrollbar instead
          if (scale<c.MINIMUM_ZOOM_FIT) {
            scale = c.MINIMUM_ZOOM_FIT//Math.min(c.MINIMUM_ZOOM_FIT, .8/(width / availableWidth)) // even below threshhold keep entire row visible
            this.viewerContainerContainerRef.classList.add('scrolled')
            this.viewerContainerRef.setAttribute('style', `height: ${height*scale+c.TOPOLOGY_PADDING}px;`)
          } else {
            this.viewerContainerContainerRef.classList.remove('scrolled')
            this.viewerContainerRef.setAttribute('style', 'height: 100%;')
          }
          d3.zoom().scaleTo(svg, scale)
          if (resetScrollbar) {
            this.viewerContainerContainerRef.scrollTo(0, 0)
          }
          this.isAutoZoomToFit = true

          // center diagram horizontally
          const cx = width/2
          // put c.TOPOLOGY_PADDING from top
          const viewerHeight = this.viewerContainerRef.getBoundingClientRect().height
          const dy = (viewerHeight/2 - c.TOPOLOGY_PADDING) * 1/scale
          const cy =  y1 + dy
          d3.zoom().on('zoom', () => {
            currentZoom = d3.event.transform
            if (zoomElements) {
              this.zoomElements(200)
            }
          }).translateTo(svg, cx, cy)
        }
      }
    }
  }

  canvasZoom(){
    return this.manualZoom(0)
  }

  buttonZoom(){
    return this.manualZoom(200)
  }

  manualZoom(duration){
    return d3.zoom()
      .scaleExtent([ 0.1, 1 ]) // can manually scale from 0.1 up to 1
      .on('zoom', () => {
        currentZoom = d3.event.transform
        this.isAutoZoomToFit = false
        this.zoomElements(duration)

        // disable zoom-in button at 1
        this.zoomInRef.disabled = currentZoom.k>=1
      })
  }

  zoomElements(duration) {
    const svg = d3.select('#'+this.getSvgId())
    if (svg) {
      this.interruptElements(svg)
      const transition = d3.transition()
        .duration(duration)
        .ease(d3.easeSinOut)
      svg.select('g.nodes').selectAll('g.node')
        .transition(transition)
        .attr('transform', currentZoom)
      svg.select('g.links').selectAll('g.link')
        .transition(transition)
        .attr('transform', currentZoom)
      svg.select('g.links').selectAll('g.label')
        .transition(transition)
        .attr('transform', currentZoom)
      svg.select('g.titles').selectAll('g.title')
        .transition(transition)
        .attr('transform', currentZoom)
      this.counterZoomElements(svg, currentZoom)
    }
  }

  counterZoomElements(svg, currentZoom) {
    counterZoomLabels(svg, currentZoom)
    counterZoomTitles(svg, currentZoom)
    counterZoomLinks(svg, currentZoom)
  }

  interruptElements(svg) {
    // stop any transitions and make sure
    // elements have their final value
    interruptNodes(svg)
    interruptLinks(svg)
    interruptTitles(svg)
  }

  getSvgId() {
    return 'svgId'
  }
}

export default DiagramViewer

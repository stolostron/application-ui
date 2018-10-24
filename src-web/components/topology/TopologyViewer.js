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
import TitleHelper, {counterZoomTitles} from './titleHelper'
import LinkHelper, {appendLinkDefs, counterZoomLinks} from './linkHelper'
import NodeHelper, {counterZoomLabels} from './nodeHelper'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'


resources(() => {
  require('../../../scss/topology-link.scss')
  require('../../../scss/topology-node.scss')
})

var currentZoom = {x:0, y:0, k:1}

class TopologyViewer extends React.Component {

  static propTypes = {
    activeFilters: PropTypes.object,
    context: PropTypes.object,
    getEditor: PropTypes.func,
    isMulticluster: PropTypes.bool,
    links: PropTypes.array,
    nodes: PropTypes.array,
    setViewer: PropTypes.func,
    staticResourceData: PropTypes.object,
    title: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      activeFilters: props.activeFilters,
      links: _.uniqBy(props.links, 'uid'),
      nodes: _.uniqBy(props.nodes, 'uid'),
      hiddenLinks: new Set(),
      selectedNodeId: ''
    }
    if (props.setViewer) {
      props.setViewer(this)
    }
    this.resize = _.debounce(()=>{
      this.zoomFit()
    }, 150)
    const { locale } = this.props.context
    this.titles=[]
    this.layoutHelper = new LayoutHelper(this.props.staticResourceData, this.titles, locale)
    this.topologyOptions = this.props.staticResourceData.topologyOptions||{}
    this.getLayoutNodes = this.getLayoutNodes.bind(this)
    this.lastLayoutBBox=undefined
    this.isDragging = false
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
    || !_.isEqual(this.state.activeFilters, nextState.activeFilters)
    || !_.isEqual(this.state.requiredFilters, nextState.requiredFilters)
    || !_.isEqual(this.state.nodes.map(n => n.id), nextState.nodes.map(n => n.id))
    || !_.isEqual(this.state.links.map(l => l.uid), nextState.links.map(l => l.uid))
    || !_.isEqual(this.state.hiddenLinks, nextState.hiddenLinks)
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
      return {links, nodes, hiddenLinks, activeFilters: props.activeFilters}
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
      <div className="topologyViewerDiagram" ref={this.setContainerRef} >
        {title && <div className='topologyViewerTitle'>
          {msgs.get('cluster.names', [title], locale)}
        </div>}
        <div className='topologyViewerContainerContainer' ref={this.setViewerContainerContainerRef}>
          <div className='topologyViewerContainer'  ref={this.setViewerContainerRef} role='region' aria-label='zoom'>
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

  handleNodeClick = (node, selected) => {
    d3.event.stopPropagation()

    // mark as selected
    if (this.lastSelected) {
      this.lastSelected.classed('selected', false)
      delete this.lastSelected
    }
    if (selected) {
      selected.classed('selected', true)
      this.lastSelected = selected
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
      this.svg.call(this.getSvgSpace())
      appendLinkDefs(this.svg)
    }

    // consolidate nodes/filter links/add layout data to each element
    const {nodes=[], links=[], hiddenLinks= new Set()} = this.state
    const {isMulticluster} = this.props
    const options = {
      firstLayout: this.lastLayoutBBox===undefined,
      breakWidth: 3000, //this.viewerContainerContainerRef.getBoundingClientRect().width + 1000
      isMulticluster
    }
    this.layoutHelper.layout(nodes, links, hiddenLinks, options, (layoutResults)=>{

      const {laidoutNodes, titles, selfLinks, layoutMap, layoutBBox} = layoutResults
      this.layoutBBox = layoutBBox
      this.titles = titles
      const {firstLayout} = options

      // resize diagram to fit all the nodes
      if (firstLayout) {
        this.zoomFit()
      }

      // Create or refresh the nodes in the diagram.
      const transformation = d3.transition()
        .duration(firstLayout?400:800)
        .ease(d3.easeSinOut)
      this.svg.interrupt().selectAll('*').interrupt()

      // Create or refresh the links in the diagram.
      const {topologyShapes} = this.props.staticResourceData
      const linkHelper = new LinkHelper(this.svg, links, selfLinks, laidoutNodes, topologyShapes, this.topologyOptions)
      linkHelper.removeOldLinksFromDiagram()
      linkHelper.addLinksToDiagram(currentZoom)
      linkHelper.moveLinks(transformation)

      // Create or refresh the nodes in the diagram.
      const nodeHelper = new NodeHelper(this.svg, laidoutNodes, topologyShapes, layoutMap)
      nodeHelper.removeOldNodesFromDiagram()
      nodeHelper.addNodesToDiagram(currentZoom, this.handleNodeClick, this.handleNodeDrag)
      nodeHelper.moveNodes(transformation)

      // Create or refresh the titles in the diagram.
      if (this.topologyOptions.showSectionTitles) {
        const titleHelper = new TitleHelper(this.svg, titles)
        titleHelper.removeOldTitlesFromDiagram()
        titleHelper.addTitlesToDiagram(currentZoom)
        titleHelper.moveTitles(transformation)
      }

      this.laidoutNodes = laidoutNodes
      this.lastLayoutBBox = laidoutNodes.length ? this.layoutBBox : undefined
      counterZoomLabels(this.svg, currentZoom)
      counterZoomTitles(this.svg, currentZoom)
      counterZoomLinks(this.svg, currentZoom)
    })
  }

  getSvgSpace(duration=0){
    const svgSpace = d3.zoom()
      .scaleExtent([ 0.1, 1 ]) // scale from 0.1 up to 1
      .on('zoom', () => {
        currentZoom = d3.event.transform
        const svg = d3.select('#'+this.getSvgId())
        if (svg) {

          // zoom shapes and links
          const transition = d3.transition()
            .duration(duration)
            .ease(d3.easeSinOut)
          svg.select('g.nodes').selectAll('g.node')
            .transition(transition)
            .attr('transform', d3.event.transform)
          svg.select('g.links').selectAll('g.link')
            .transition(transition)
            .attr('transform', d3.event.transform)
          svg.select('g.links').selectAll('g.label')
            .transition(transition)
            .attr('transform', d3.event.transform)
          svg.select('g.titles').selectAll('g.title')
            .transition(transition)
            .attr('transform', d3.event.transform)

          // counter-zoom text
          counterZoomLabels(svg, currentZoom)
          counterZoomTitles(svg, currentZoom)
          counterZoomLinks(svg, currentZoom)
        }
        // disable zoom in at 1
        this.zoomInRef.disabled = currentZoom.k===1
      })
    return svgSpace
  }

  handleZoomIn = () => {
    this.getSvgSpace(200).scaleBy(this.svg, 1.3)
  }

  handleZoomOut = () => {
    this.getSvgSpace(200).scaleBy(this.svg, 1 / 1.3)
  }

  handleTarget = () => {
    this.zoomFit()
  }

  zoomFit = () => {
    const {y1, width, height} = this.layoutBBox
    if (width && height) {
      const svg = d3.select('#'+this.getSvgId())
      if (svg) {
        if (this.viewerContainerContainerRef) {
          const {width: availableWidth, height: availableHeight} = this.viewerContainerContainerRef.getBoundingClientRect()
          let scale = Math.min( 1, .92 / Math.max(width / availableWidth, height / availableHeight))

          // don't allow scale to drop too far for accessability reasons
          // below threshHold, show scrollbar instead
          let dy
          const topMargin = 30
          const threshHold = 0.3
          if (scale<threshHold) {
            scale = threshHold
            this.viewerContainerContainerRef.classList.add('scrolled')
            this.viewerContainerRef.setAttribute('style', `height: ${height*scale+topMargin}px;`)
            const viewerHeight = this.viewerContainerRef.getBoundingClientRect().height
            dy = (viewerHeight/2 - topMargin) * 1/scale
          } else {
            this.viewerContainerContainerRef.classList.remove('scrolled')
            this.viewerContainerRef.setAttribute('style', 'height: 100%;')
            dy = height/2
          }
          this.viewerContainerContainerRef.scrollTo(0, 0)
          this.getSvgSpace(200).translateTo(svg, width/2, y1 + dy)
          this.getSvgSpace(200).scaleTo(svg, scale)
        }
      }
    }
    return 1
  }

  getSvgId() {
    return 'svgId'
  }
}

export default TopologyViewer

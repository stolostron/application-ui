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
import { Loading, InlineNotification  } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import '../../../graphics/diagramIcons.svg'
import DesignView from './DesignView'
import DetailsView from './DetailsView'
import DiagramControls from './DiagramControls'
import LayoutHelper from './layoutHelper'
import ZoomHelper from './zoomHelper'
import TitleHelper from './titleHelper'
import LinkHelper, {defineLinkMarkers } from './linkHelper'
import NodeHelper, {showMatches, setSelections} from './nodeHelper'
import * as c from './constants.js'
import moment from 'moment'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'


resources(() => {
  require('../../../scss/topology-link.scss')
  require('../../../scss/topology-node.scss')
  require('../../../scss/topology-icons.scss')
})

class DiagramViewer extends React.Component {

  static propTypes = {
    activeFilters: PropTypes.object,
    context: PropTypes.object,
    isMulticluster: PropTypes.bool,
    links: PropTypes.array,
    nodes: PropTypes.array,
    searchName: PropTypes.string,
    secondaryError: PropTypes.bool,
    secondaryLoad: PropTypes.bool,
    setUpdateDiagramRefreshTimeFunc: PropTypes.func,
    setViewer: PropTypes.func,
    staticResourceData: PropTypes.object,
    title: PropTypes.string,
    yaml: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      links: _.uniqBy(props.links, 'uid'),
      nodes: _.uniqBy(props.nodes, 'uid'),
      hiddenLinks: new Set(),
      selectedNodeId: '',
      selectedDesignNode: null,
    }
    if (props.setViewer) {
      props.setViewer(this)
    }
    if (this.props.setUpdateDiagramRefreshTimeFunc) {
      this.props.setUpdateDiagramRefreshTimeFunc(this.updateDiagramRefreshTime)
    }
    const { locale } = this.props.context
    this.titles=[]
    this.layoutHelper = new LayoutHelper(this.props.staticResourceData, this.titles, locale)
    this.diagramOptions = this.props.staticResourceData.diagramOptions||{}
    this.zoomHelper = new ZoomHelper(this, this.diagramOptions)
    this.getLayoutNodes = this.getLayoutNodes.bind(this)
    this.getZoomHelper = this.getZoomHelper.bind(this)
    this.getViewContainer = this.getViewContainer.bind(this)
    this.showsShapeTitles = typeof this.props.staticResourceData.getNodeTitle === 'function'
    this.lastLayoutBBox=undefined
    this.isDragging = false
    this.lastRefreshing = true
  }

  componentDidMount() {
    this.zoomHelper.mountViewer()
    this.generateDiagram()
  }

  componentDidUpdate(){
    this.generateDiagram()
  }

  componentWillUnmount() {
    this.zoomHelper.dismountViewer()
    this.destroyDiagram()
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.selectedNodeId !== nextState.selectedNodeId
    || !_.isEqual(this.state.nodes.map(n => n.id), nextState.nodes.map(n => n.id))
    || !_.isEqual(this.state.links.map(l => l.uid), nextState.links.map(l => l.uid))
    || !_.isEqual(this.state.hiddenLinks, nextState.hiddenLinks)
    || !_.isEqual(this.props.activeFilters, nextProps.activeFilters)
    || this.props.searchName !== nextProps.searchName
    || this.props.secondaryLoad !== nextProps.secondaryLoad
    || this.state.secondaryError !== nextState.secondaryError
  }

  // weave scans can:
  //  1) include multiple copies of the same node
  //  2) can miss some nodes between scans
  componentWillReceiveProps(){
    this.setState((prevState, props) => {

      // secondary load--when a design diagram loads the topology second
      // if there was an error loading topology, set secondaryError state till topology loads succesfully
      const secondaryError = props.secondaryError || (prevState.secondaryError && !props.secondaryLoad)

      // keyBy makes sure nodes are unique
      // also -- if they disappear in one scan, see if they reappear in the next 2 scan
      // until topology filter is changed
      const propNodeMap = _.keyBy(props.nodes, 'uid')
      const prevStateNodeMap = _.keyBy(prevState.nodes, 'uid')
      for (var uid in prevStateNodeMap) {
        const prevNode = prevStateNodeMap[uid]
        if (!propNodeMap[uid] && !prevNode.loading) {
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
      // remember new nodes---unless there's more then 10
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
      return {links, nodes, hiddenLinks, searchName, searchChanged, secondaryError}
    })

  }

  setViewerContainerContainerRef = ref => {this.viewerContainerContainerRef = ref}
  setViewerContainerRef = ref => {this.viewerContainerRef = ref}
  setDiagramRefreshContainerRef = ref => {this.diagramRefreshContainerRef = ref}
  setDiagramRefreshTimeRef = ref => {this.diagramRefreshTimeRef = ref}
  getZoomHelper = () => {return this.zoomHelper}
  getViewContainer = () => {return this.viewerContainerContainerRef}

  updateDiagramRefreshTime = (refreshing) => {
    if (this.diagramRefreshContainerRef) {
      this.diagramRefreshContainerRef.classList.toggle('refreshing', refreshing)
    }
    if (this.diagramRefreshTimeRef && this.lastRefreshing && !refreshing) {
      this.diagramRefreshTimeRef.textContent = moment().format('h:mm:ss A')
    }
    this.lastRefreshing = refreshing
  }

  render() {
    const { title, yaml, staticResourceData, secondaryLoad } = this.props
    const { selectedNodeId, selectedDesignNode, secondaryError } = this.state
    // don't screw up the jest test by having the current time in the snapshot
    const time = this.props.setUpdateDiagramRefreshTimeFunc ? moment().format('h:mm:ss A') : ''
    return (
      <div className="diagramViewerDiagram" ref={this.setContainerRef} >
        <div className='diagramViewerTitle'>
          {title}
        </div>
        <div className='diagramViewerContainerContainer' ref={this.setViewerContainerContainerRef}>
          <div className='diagramViewerContainer' ref={this.setViewerContainerRef}
            style={{height:'100%', width:'100%'}}  role='region' aria-label='zoom'>
            <svg id={c.DIAGRAM_SVG_ID} className="topologyDiagram" />
          </div>
          {secondaryLoad && !secondaryError && <div className='secondaryLoad' >
            <Loading withOverlay={false} />
          </div>}
          {secondaryError &&
            <InlineNotification
              kind='error'
              title={msgs.get('error.load.topology', this.context.locale)}
              iconDescription=''
              subtitle={''}
              onCloseButtonClick={()=>{}}
            />
          }
        </div>
        <div className='diagramRefreshContainer' ref={this.setDiagramRefreshContainerRef}>
          <Loading withOverlay={false} small />
          <div ref={this.setDiagramRefreshTimeRef}>{time}</div>
        </div>
        <DesignView
          context={this.context}
          open={!!(selectedNodeId && selectedDesignNode)}
          yaml={yaml}
          getLayoutNodes={this.getLayoutNodes}
          selectedDesignNode={selectedDesignNode}
          onClose={this.handleDesignClose}
        />
        <DiagramControls
          getZoomHelper={this.getZoomHelper}
          getViewContainer={this.getViewContainer}
        />
        { selectedNodeId && !selectedDesignNode &&
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
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    if (svg) {
      setSelections(svg, node)
    }
    this.setState({
      selectedNodeId: node ? node.uid : '',
      selectedDesignNode: node && node.isDesign ? node: null,
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
      selectedNodeId: '',
    })
  }

  handleDesignClose = () => {
    this.setState({
      selectedNodeId: '',
      selectedDesignNode: null,
    })
  }

  generateDiagram() {
    // if dragging or searching don't refresh diagram
    if (this.isDragging) {
      return
    }

    if (!this.svg) {
      this.svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
      this.svg.append('g').attr('class', 'titles')
      this.svg.append('g').attr('class', 'links')  // Links must be added before nodes, so nodes are painted on top.
      this.svg.append('g').attr('class', 'nodes')
      this.svg.on('click', this.handleNodeClick)
      this.svg.call(this.zoomHelper.canvasZoom())
      defineLinkMarkers(this.svg)
    }

    // consolidate nodes/filter links/add layout data to each element
    const {nodes=[], links=[], hiddenLinks= new Set(), searchChanged} = this.state
    const {activeFilters, isMulticluster, searchName} = this.props
    const options = {
      firstLayout: this.lastLayoutBBox===undefined,
      clientRect: this.clientRect,
      isMulticluster,
      searchName,
      activeFilters
    }
    if (this.viewerContainerRef)
      this.viewerContainerRef.classList.toggle('search-mode', !!searchName)
    this.layoutHelper.layout(nodes, links, hiddenLinks, options, (layoutResults)=>{

      const {laidoutNodes, titles, searchNames, selfLinks, layoutBBox} = layoutResults
      this.layoutBBox = layoutBBox
      this.titles = titles
      const {firstLayout} = options

      // stop any current transitions
      this.zoomHelper.interruptElements()

      // zoom to fit all nodes
      if (this.zoomHelper.isAutoZoomToFit() || firstLayout || searchChanged) {
        this.zoomHelper.zoomFit(false, searchChanged)
      }

      // Create or refresh the links in the diagram.
      const currentZoom = this.zoomHelper.getCurrentZoom()
      const transition = d3.transition()
        .duration(firstLayout?400:800)
        .ease(d3.easeCircleOut)
      const {typeToShapeMap} = this.props.staticResourceData
      const linkHelper = new LinkHelper(this.svg, links, selfLinks, laidoutNodes, typeToShapeMap, this.diagramOptions)
      linkHelper.updateDiagramLinks(currentZoom)
      linkHelper.moveLinks(transition, currentZoom, searchChanged)

      // Create or refresh the nodes in the diagram.
      const nodeHelper = new NodeHelper(this.svg, laidoutNodes,
        typeToShapeMap, this.showsShapeTitles, ()=>{return this.clientRect})
      nodeHelper.updateDiagramNodes(currentZoom, this.handleNodeClick, this.handleNodeDrag)
      nodeHelper.moveNodes(transition, currentZoom, searchChanged)

      // Create or refresh the titles in the diagram.
      if (this.diagramOptions.showSectionTitles!==false && (titles.length || searchChanged ||
          (this.lastTitlesLength && titles.length!=this.lastTitlesLength))) {
        const titleHelper = new TitleHelper(this.svg, titles)
        titleHelper.updateDiagramTitles(currentZoom)
        titleHelper.moveTitles(transition, currentZoom, searchChanged)
        this.lastTitlesLength = titles.length
      }

      // show label matches in boldface
      if (searchChanged || (firstLayout && searchNames.length>0)) {
        showMatches(this.svg, searchNames)
      }
      // counter zoom labels
      this.zoomHelper.counterZoomElements(this.svg)

      this.laidoutNodes = laidoutNodes
      this.lastLayoutBBox = laidoutNodes.length ? this.layoutBBox : undefined
    })
  }

  destroyDiagram = () => {
    this.titles=[]
    this.layoutHelper.destroy()
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    if (svg) {
      svg.select('g.nodes').selectAll('*').remove()
      svg.select('g.links').selectAll('*').remove()
      svg.select('g.titles').selectAll('*').remove()
    }
  }
}

export default DiagramViewer

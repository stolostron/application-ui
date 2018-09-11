/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import dagre from 'cytoscape-dagre'
import _ from 'lodash'
cytoscape.use( cycola )
cytoscape.use( dagre )

import { NODE_SIZE } from './constants.js'

export default class LayoutHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   */

  constructor ({topologyOrder, topologyCloneTypes=[], topologyNodeLayout}, locale) {
    this.nodeClones = {}
    this.topologyOrder = topologyOrder
    this.topologyCloneTypes = topologyCloneTypes
    this.topologyNodeLayout = topologyNodeLayout
    this.locale = locale
    this.destroyed = false
    this.cachedLayouts = {}
  }

  destroy = () => {
    this.destroyed = true
  }

  layout = (nodes, links, hiddenLinks, firstLayout, cb) => {
    this.firstLayout = firstLayout

    // sort out nodes that can appear everywhere
    this.nodesToBeCloned = {}
    this.clonedIdSet = new Set()
    nodes = nodes.filter(n=>{
      if (this.topologyCloneTypes.indexOf(n.type) !== -1) {
        this.nodesToBeCloned[n.uid] = n
        this.clonedIdSet.add(n.uid)
        return false
      }
      return true
    })


    // for each cluster, group into collections by type
    const groups = this.getNodeGroups(nodes)

    // group by connections which may pull nodes into other groups
    this.groupNodesByConnections(groups, links)

    // re-add cloned nodes
    this.cloneNodes(groups, nodes)

    //identify hubs
    this.markHubs(groups)

    // assign info to each node
    if (this.topologyNodeLayout) {
      nodes.forEach(node=>{
        this.topologyNodeLayout(node, this.locale)
      })
    }

    // create cytoscape element collections
    let collections = this.createCollections(groups)

    // assign cytoscape layout options for each collection (ex: dagre, grid)
    this.setLayoutOptions(collections)

    // run the cytoscape layouts
    collections = collections.connected.concat(collections.unconnected)
    this.runCollectionLayouts(collections, () => {

      // after all layouts run, use Masonry to fit the collections neatly in the diagram
      const layoutInfo = this.layoutCollections(collections, hiddenLinks)


      // return to TopologyView to create/position the d3 svg shapes
      if (!this.destroyed) {
        cb({layoutNodes: nodes, ...layoutInfo})
      }
    })
  }

  getNodeGroups = (nodes) => {
    // separate into types
    const groupMap = {}
    const allNodeMap = {}
    const controllerMap = {}
    const controllerSet = new Set(['deployment', 'daemonset', 'statefulset', 'cronjob'])
    nodes.forEach(node=>{
      allNodeMap[node.uid] = node
      let type = controllerSet.has(node.type) ? 'controller' : node.type
      if (this.topologyOrder.indexOf(type)===-1) {
        if (this.topologyOrder.indexOf('unknown')===-1) {
          this.topologyOrder.push('unknown')
        }
        type = 'unknown'
      }
      let group = groupMap[type]
      if (!group) {
        group = groupMap[type] = {nodes:[]}
      }
      node.layout = Object.assign(node.layout || {}, {
        uid: node.uid,
        type: node.type,
        label: this.layoutLabel(node.name)
      }
      )
      delete node.layout.source
      delete node.layout.target

      switch (type) {
      case 'controller':
        Object.assign(node.layout, {
          qname: node.namespace+'/'+node.name,
          hasService: false,
          hasPods: false,
          hasContent: false,
          pods: [],
          services: []
        })
        controllerMap[node.layout.qname] = node
        break
      case 'pod':
        node.layout.qname = node.namespace+'/'+node.name.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '')
        break
      case 'service':
        node.layout.qname = node.namespace+'/'+node.name.replace(/-service$/, '')
        break
      }
      group.nodes.push(node)
    })

    // combine pods into their controllers
    const controllerAsService = []
    if (groupMap['controller']) {
      if (groupMap['pod']) {
        let i=groupMap['pod'].nodes.length
        while(--i>=0) {
          const node = groupMap['pod'].nodes[i]
          if (node.layout) {
            const controller = controllerMap[node.layout.qname]
            if (controller) {
              controller.layout.pods.push(node)
              controller.layout.hasPods = controller.layout.hasContent = true
              groupMap['pod'].nodes.splice(i,1)
              delete allNodeMap[node.uid]
              delete node.layout
            }
          }
        }
      }

      if (groupMap['service']) {
        let i=groupMap['service'].nodes.length
        while(--i>=0) {
          const node = groupMap['service'].nodes[i]
          if (!node.layout) {
            const controller = controllerMap[node.layout.qname]
            if (controller) {
              controller.layout.services.push(node)
              groupMap['service'].nodes.splice(i,1)
              controllerAsService.push(node.layout.qname)
              delete allNodeMap[node.uid]
              delete node.layout
            }
          }
        }
      }
    }

    // show controllers as services
    controllerAsService.forEach(qname=>{
      var inx = groupMap['controller'].nodes.findIndex(({layout})=>{
        return layout.qname === qname
      })
      if (inx!==-1) {
        const controller = groupMap['controller'].nodes.splice(inx,1)[0]
        controller.layout.type = 'service'
        controller.layout.hasService = controller.layout.hasContent = true
        groupMap['service'].nodes.push(controller)
      }
    })
    return {nodeGroups: groupMap, allNodeMap}
  }

  groupNodesByConnections = (groups, links) => {
    const {nodeGroups, allNodeMap} = groups
    const sourceMap = {}
    const targetMap = {}
    const anyConnectedSet = new Set()
    links
      .filter(link=>{
        return (link.source && link.target &&
            (allNodeMap[link.source] || this.nodesToBeCloned[link.source]) &&
            (allNodeMap[link.target] || this.nodesToBeCloned[link.target] ))
      })
      .forEach(link=>{
        // all sources of this target
        let sources = sourceMap[link.target]
        if (!sources) {
          sources = sourceMap[link.target] = []
        }
        sources.push({source:link.source, link})

        // all targets of this source
        let targets = targetMap[link.source]
        if (!targets) {
          targets = targetMap[link.source] = []
        }
        targets.push({target:link.target, link})

        // anything that's connected
        anyConnectedSet.add(link.source)
        anyConnectedSet.add(link.target)
      })
    const connectedSet = new Set()
    const directions = [
      {map:sourceMap, next:'source', other:'target'},
      {map:targetMap, next:'target', other:'source'}]
    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type]) {
        const group = nodeGroups[type]
        // sort nodes/links into collections
        const connected = nodeGroups[type].connected = []
        const unconnected = nodeGroups[type].unconnected = []

        // find the connected nodes
        group.nodes.forEach(node => {
          const {uid} = node
          // if this node is connected to anything start a new group
          if (!connectedSet.has(uid) && anyConnectedSet.has(uid)) {
            const grp = {
              nodeMap: {},
              edges: []
            }
            connected.push(grp)

            // then add everything connected to this node to this group
            this.gatherNodesByConnections(uid, grp, directions, connectedSet, allNodeMap)

          } else if (!anyConnectedSet.has(uid)) {

            // the rest are unconnected
            unconnected.push(node)
          }
        })
      }
    })

    // remove any groups that are now empty
    Object.keys(nodeGroups).forEach(key=>{
      const {connected, unconnected} = nodeGroups[key]
      if (connected.length===0 && unconnected.length===0) {
        delete nodeGroups[key]
      }
    })

  }

  gatherNodesByConnections = (uid, grp, directions, connectedSet, allNodeMap) => {
    // already connected to another group??
    if (!connectedSet.has(uid)) {
      connectedSet.add(uid)

      // add this node to this group
      grp.nodeMap[uid] = allNodeMap[uid]

      // recurse up and down to get everything
      directions.forEach(({map, next, other})=>{
        if (map[uid]) {
          map[uid].forEach(entry => {
            const {link} = entry
            const end = entry[next]
            if (!connectedSet.has(end)) {
              // add link
              link.layout = {}
              link.layout[next] = this.nodesToBeCloned[link[next]] || allNodeMap[link[next]].layout
              link.layout[other] = this.nodesToBeCloned[link[other]] || allNodeMap[link[other]].layout
              grp.edges.push(link)

              // reiterate until nothing else connected
              if (!this.nodesToBeCloned[end]) {
                this.gatherNodesByConnections(link[next], grp, directions, connectedSet, allNodeMap)
              }
            }
          })
        }
      })
    }
  }

  markHubs = ({nodeGroups}) => {
    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type]) {
        const {connected} = nodeGroups[type]
        connected.forEach(c=>{
          c.hubs = this.markHubsHelper(c)
        })
      }
    })
  }

  markHubsHelper = ({nodeMap, edges}) => {
    // build list of all the next nodes
    let hubs = 0
    const targets = {}
    const sources = {}
    Object.keys(nodeMap).forEach(id => {
      targets[id] = []
      sources[id] = []
    })
    edges.forEach(({source, target}) =>{
      if (targets[source]) targets[source].push(target)
      if (sources[target]) sources[target].push(source)
    })

    // see if there are any cycles
    let hasCycle = false
    const visited = {}
    const recursion = {}
    const nodes = Object.keys(targets)
    for (let i=0; i<nodes.length && !hasCycle; i++) {

      const id = nodes[i]
      if (sources[id].length+targets[id].length >= 4) {
        nodeMap[id].layout.isHub = true
        hubs++
      }

      hasCycle = this.hasCycle(id, targets, visited, recursion)
    }
    if (hasCycle) return hubs

    // see if there are any leaves with more then 1 inbound connection
    const leaves = []
    nodes.forEach(id=>{
      if (targets[id].length===0) {
        leaves.push(id)
      }
    })
    if (leaves.length<=1) return hubs


    // if more then one, do any have more then one inbound??
    leaves.forEach(id=>{
      if (sources[id].length>1) {
        nodeMap[id].layout.isHub = true
        hubs++
      }
    })
    return hubs
  }


  cloneNodes = (groups, nodes) => {
    const {nodeGroups} = groups

    // consolidate single nodes that just connect to a single clone
    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type] && nodeGroups[type].connected) {
        const inConsolidatedConnected = {edges:[], nodeMap:{}}
        const outConsolidatedConnected = {edges:[], nodeMap:{}}
        nodeGroups[type].connected = nodeGroups[type].connected.filter(({edges, nodeMap})=>{
          // if just one edge to clone
          if (edges.length===1) {
            if (this.nodesToBeCloned[edges[0].source]) {
              inConsolidatedConnected.edges.push(edges[0])
              inConsolidatedConnected.nodeMap = Object.assign(inConsolidatedConnected.nodeMap, nodeMap)
              inConsolidatedConnected.uid = inConsolidatedConnected.uid || edges[0].target
              return false
            }
            if (this.nodesToBeCloned[edges[0].target]) {
              outConsolidatedConnected.edges.push(edges[0])
              outConsolidatedConnected.nodeMap = Object.assign(outConsolidatedConnected.nodeMap, nodeMap)
              outConsolidatedConnected.uid = outConsolidatedConnected.uid || edges[0].source
              return false
            }
          }
          return true
        })
        if (inConsolidatedConnected.edges.length) {
          nodeGroups[type].connected.unshift(inConsolidatedConnected)
        }
        if (outConsolidatedConnected.edges.length) {
          nodeGroups[type].connected.unshift(outConsolidatedConnected)
        }
      }
    })

    // clone objects for each section that has a link to that clone
    if (Object.keys(this.nodesToBeCloned).length) {
      const directions = ['source', 'target']
      this.topologyOrder.forEach(type=>{
        if (nodeGroups[type] && nodeGroups[type].connected) {
          nodeGroups[type].connected.forEach(({nodeMap, edges})=>{
            const hashCode = this.hashCode(Object.keys(nodeMap).sort().join())
            edges.forEach(edge=>{
              directions.forEach(direction=>{
                const next = edge[direction]
                if (this.nodesToBeCloned[next]) {
                  const cuid = next+'_'+type+'_'+hashCode
                  if (!nodeMap[cuid]) {
                    let clone = this.nodeClones[cuid]
                    if (!clone) {
                      clone = this.nodeClones[cuid] = _.cloneDeep(this.nodesToBeCloned[next])
                      clone.layout = {
                        uid: cuid,
                        type: clone.type,
                        label: this.layoutLabel(clone.name),
                        cloned: true
                      }
                    }
                    nodeMap[cuid] = clone
                    nodes.push(nodeMap[cuid])
                  }
                  edge.layout[direction] = nodeMap[cuid].layout
                }
              })
            })
          })
        }
      })

    }
  }

  createCollections = (groups) => {
    const {nodeGroups} = groups
    const collections = {connected:[], unconnected:[]}
    const cy = cytoscape({ headless: true }) // start headless cytoscape

    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type]) {
        const {connected} = nodeGroups[type]
        let {unconnected} = nodeGroups[type]
        connected.forEach(({nodeMap, edges, hubs})=>{
          const uidArr = []
          const elements = {nodes:[], edges:[]}
          _.forOwn(nodeMap, (node) => {
            const n = {
              data: {
                id: node.layout.uid,
                node
              }
            }
            elements.nodes.push(n)
            uidArr.push(node.layout.uid)
          })
          edges.forEach(edge=>{
            const {layout} = edge
            elements.edges.push({
              data: {
                source: layout.source.uid,
                target: layout.target.uid,
                edge
              }
            })
          })
          collections.connected.push({
            hubs,
            type,
            title: type,
            elements: cy.add(elements),
            hashCode: this.hashCode(uidArr.sort().join())
          })
        })

        // break large unconnected groups into smaller groups
        unconnected = unconnected.filter(u=>u.layout!==undefined)
        let unconnectArr = [unconnected]
        if (unconnected.length>48) {
          unconnected.sort(({layout: {label: a='', uid:au, newComer: an}}, {layout:{label:b='', uid:bu, newComer: bn}})=>{
            if (!an && bn) {
              return -1
            } else if (an && !bn) {
              return 1
            }
            const r = a.localeCompare(b)
            if (r!==0) {
              return r
            } else {
              return au.localeCompare(bu)
            }
          })
          unconnectArr = _.chunk(unconnected, 32)
        }
        unconnectArr.forEach(arr=>{
          const uidArr = []
          const elements = {nodes:[]}
          arr.forEach(node=>{
            if (node.layout.newComer) {
              node.layout.newComer.grid = true
            }
            elements.nodes.push({
              data: {
                id: node.uid,
                node
              }
            })
            uidArr.push(node.uid)
          })
          if (elements.nodes.length>0) {
            collections.unconnected.push({
              hubs: 0,
              type,
              title: type,
              elements: cy.add(elements),
              hashCode: this.hashCode(uidArr.sort().join())
            })
          }
        })
      }
    })
    return collections
  }

  setLayoutOptions = ({connected, unconnected}) => {
    const numOfSections = connected.length + unconnected.length
    this.setConnectedLayoutOptions(connected, numOfSections)
    this.setUnconnectedLayoutOptions(unconnected)
  }

  setConnectedLayoutOptions = (connected, numOfSections) => {
    connected.forEach(collection => {
      collection.options = this.getConnectedLayoutOptions(collection, numOfSections)
    })
  }

  getConnectedLayoutOptions = ({elements}, numOfSections) => {
    const isDAG = elements.nodes().length===2
    if (isDAG) {
      return this.getDagreLayoutOptions(elements, numOfSections)
    } else {
      return this.getColaLayoutOptions(elements)
    }
  }

  getColaLayoutOptions = (elements) => {
    // stabilize diagram
    elements.nodes().forEach(ele=>{
      const {node: {layout}} = ele.data()
      const {x=0, y=0} = layout || {x:1000, y:1000}
      ele.position({x, y})
    })

    return {
      name: 'cola',
      animate: false,
      boundingBox: {
        x1: 0,
        y1: 0,
        w: 1000,
        h: 1000
      },
      flow: { axis: 'y', minSeparation: 30 },
      nodeSpacing: (node)=>{
        const {node:{layout:{scale=1}}} = node.data()
        return (NODE_SIZE*scale) + 10  // running in headless mode, we need to provide node size here
      },
      unconstrIter: 10, // works on positioning nodes to making edge lengths ideal
      userConstIter: 20, // works on flow constraints (lr(x axis)or tb(y axis)) 20
      allConstIter: 20, //works overlap 20
    }
  }

  getDagreLayoutOptions = (elements) => {
    const nodes = elements.nodes()
    // max degree returns the maximum number of edges to any node in the collection
    // if lots for one node, make the collecion wider (top to bottom)
    const ttb = nodes.length < 9 || nodes.maxDegree() > 4
    return {
      name: 'dagre',
      rankDir: ttb ? 'TB' : 'LR',
      rankSep: NODE_SIZE*3, // running in headless mode, we need to provide node size here
      nodeSep: NODE_SIZE*2, // running in headless mode, we need to provide node size here
    }
  }

  setUnconnectedLayoutOptions = (unconnected) => {
    // get rough idea how many to allocate for each collection based on # of nodes
    const columns = unconnected.map(collection => {
      const count = collection.elements.nodes().length
      return count<=3 ? 1 : (count<=9 ? 3 : (count<=12 ? 4 : (count<=18? 6:8)))
    })
    unconnected.forEach((collection, index)=>{
      const count = collection.elements.length
      const cols = Math.min(count, columns[index])
      const h = Math.ceil(count/columns[index])*NODE_SIZE*2
      const w = cols*NODE_SIZE*3
      collection.options = {
        name: 'grid',
        avoidOverlap: false, // prevents node overlap, may overflow boundingBox if not enough space
        boundingBox: {
          x1: 0,
          y1: 0,
          w,
          h
        },
        sort: (a,b) => {
          const {node: {layout: la}} = a.data()
          const {node: {layout: lb}} = b.data()
          if (!la.newComer && lb.newComer) {
            return -1
          } else if (la.newComer && !lb.newComer) {
            return 1
          } else if (la.newComer && lb.newComer) {
            if (la.newComer.displayed && !lb.newComer.displayed) {
              return -1
            } else if (!la.newComer.displayed && lb.newComer.displayed) {
              return 1
            }
            return 0
          } else if (la.hasContent && !lb.hasContent) {
            return -1
          } else if (!la.hasContent && lb.hasContent) {
            return 1
          }
          const r = la.type.localeCompare(lb.type)
          if (r!==0) {
            return r
          }
          return la.label.localeCompare(lb.label)
        },
        cols
      }
    })
  }

  runCollectionLayouts = (collections, cb) => {
    // layout each collections
    const set = {}
    const newLayouts = collections.filter(({hashCode})=>{
      set[hashCode] = true
      return !this.cachedLayouts[hashCode]
    })
    for (const hashCode in this.cachedLayouts) {
      if (!set[hashCode]) {
        delete this.cachedLayouts[hashCode]
      }
    }

    let totalLayouts = newLayouts.length
    if (totalLayouts) {
      collections.forEach((collection)=>{
        const {elements, options} = collection
        const layout = collection.layout = elements.layout(options)
        layout.pon('layoutstop').then(()=>{
          totalLayouts--
          if (totalLayouts<=0) {
            cb()
          }
        })
        layout.run()
      })
    } else {
      cb()
    }
  }

  layoutCollections = (collections, hiddenLinks) => {
    //const hiliteSelections = collections.length>3

    // get row dimensions
    let cells=0
    let maxWidth = 0
    let maxHeight = 0
    let totalMaxWidth = 0
    let totalHeight = 0
    const xMargin = NODE_SIZE*3
    const yMargin = NODE_SIZE
    const xSpacer = NODE_SIZE*3
    const ySpacer = NODE_SIZE*2
    const breakWidth = 3000
    let currentX = xMargin
    let currentY = yMargin
    const rowDims = []
    const bboxArr = []

    // cache layouts
    const clayouts = []
    collections.forEach(({elements, hashCode, type, hubs, options:{name} })=>{
      let clayout = this.cachedLayouts[hashCode]
      if (!clayout) {
        this.cachedLayouts[hashCode] = clayout = {
          bbox: elements.boundingBox(),
          nodes: [],
          hashCode,
          type,
          hubs,
          name
        }
        elements.forEach(element=>{
          const data = element.data()
          if (element.isNode()) {
            const {node: {layout}, id} = data
            clayout.nodes.push({
              layout,
              id,
              position: element.position()
            })
          }
        })
      }
      clayout.edges = []
      elements.forEach(element=>{
        const data = element.data()
        if (!element.isNode()) {
          const {edge: {layout, uid}} = data
          layout.isLoop = element.isLoop()
          clayout.edges.push({
            layout,
            uid
          })
        }
      })
      clayouts.push(this.cachedLayouts[hashCode])
    })


    // sort layouts so they appear at the same spots in diagram
    clayouts.sort(({nodes:ae, hashCode:ac, type:at, name:an, hubs:ah},
      {nodes:be, hashCode:bc, type:bt, name:bn, hubs:bh}) => {
      // grids at end
      if (an!=='grid' && bn==='grid') {
        return -1
      } else if (an==='grid' && bn!=='grid') {
        return 1
      } else {
        // types together
        const ax = this.topologyOrder.indexOf(at)
        const bx = this.topologyOrder.indexOf(bt)
        if (ax-bx !==0) {
          return ax-bx
        }

        // hubs ascending
        if (ah-bh!==0) {
          return ah-bh
        }

        // size ascending
        const az = ae.length
        const bz = be.length
        if (az-bz !==0 ) {
          return az-bz
        }
      }
      // all else fails use hash code
      return ac-bc
    })

    // determine rows
    clayouts.forEach(({bbox}, idx, array)=>{
      const {w, h} = bbox
      bboxArr.push(bbox)
      cells++

      // keep track of the dimensions
      maxWidth = Math.max(currentX+w, maxWidth)
      totalMaxWidth = Math.max(maxWidth, totalMaxWidth)
      currentX += w + xMargin
      maxHeight = Math.max(h, maxHeight)
      if (currentX>breakWidth || idx === array.length - 1) {
        rowDims.push({rowWidth: maxWidth, rowHeight: maxHeight, cells})
        totalHeight+=maxHeight
        maxHeight=maxWidth=cells=0
        currentX = xMargin
      }
    })

    // layout cells aka the collections
    let row = 0
    let cell = 1
    currentX = xMargin
    currentY = yMargin
    const layoutMap = {}
    let xSpcr = xSpacer
    clayouts.forEach(({nodes, edges, name}, idx)=>{
      //const {elements, options:{name}, layout:{adaptor}} = collection
      const {x1, y1, w, h} = bboxArr[idx]
      const {rowWidth, rowHeight, cells} = rowDims[row]

      // center cells in their rows and evenly space
      let dxCell = 0
      let spacer = totalMaxWidth-rowWidth
      if (spacer) {
        switch (cells) {
        case 1:
          spacer/=2
          dxCell = spacer
          break
        case 2:
          xSpcr=xSpacer*3
          spacer = (totalMaxWidth-rowWidth-xSpcr)/2
          dxCell = spacer
          break
        default:
          spacer/=cells
          dxCell = spacer*cell - spacer
          break
        }
      }
      const dyCell = name==='grid'?0:(rowHeight-h)/2

      // set all node positions
      const center = {x:currentX+dxCell+(w/2), y:currentY+dyCell+(h/2)}
      nodes.forEach(node=>{
        const {layout, position: {x,y}} = node
        layout.x = x - x1 + currentX + dxCell
        layout.y = y - y1 + currentY + dyCell

        layout.center = center

        // restore position of any node dragged by user
        if (layout.dragged) {
          layout.undragged = {
            x: layout.x,
            y: layout.y
          }
          layout.x = layout.dragged.x
          layout.y = layout.dragged.y
        }
      })
      edges.forEach(edge=>{
        const {layout, uid} = edge
        layout.center = center
        layout.hidden = hiddenLinks.has(uid)
      })

      currentX += w + xSpcr
      cell++
      if (currentX>breakWidth) {
        currentY += rowHeight + ySpacer
        currentX = xMargin
        cell = 1
        row++
      }
    })
    const width = totalMaxWidth + xMargin*2
    const height = totalHeight + yMargin*4
    return {layoutMap, layoutBBox: { x:0, y:0, width, height}}
  }

  hasCycle = (node, neighbors, visited, recursion) => {
    // nodes that are cloned are never in a cycle because any group that wants one gets one
    if (!this.clonedIdSet.has(node)) {
      if (!visited[node]) {
        visited[node] = true
        recursion[node] = true
        const related = neighbors[node]
        for (let i=0; i<related.length; i++) {
          const n = related[i]
          if (!visited[n] && this.hasCycle(n, neighbors, visited, recursion)) {
            return true
          } else if (recursion[n]) {
            return true
          }
        }
      }
      recursion[node] = false
    }
    return false
  }

  layoutLabel = (name) => {
    // replace any guid with {uid}
    let label = name.replace(/[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '{uid}')

    // if too long, add elipse
    if (label.length>40) {
      label = label.substr(0, 15)+'...'+label.substr(-25)
    }

    // wrap the rest
    return this.wrapLabel(label)
  }

  wrapLabel = (label, width=18) => {
    if ((label.length - width) > 3) {
      let i=width
      while (i>0 && /[a-zA-Z\d]/.test(label[i])) {
        i--
      }
      if (i>0) {
        const left = label.substring(0, i)
        const right = label.substring(i+1)
        return left + label[i] +'\n' + this.wrapLabel(right, width)
      }
    }
    return label
  }

  hashCode = (str) => {
    let hash = 0, i, chr
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i)
      hash  = ((hash << 5) - hash) + chr
      hash |= 0
    }
    return hash
  }

}

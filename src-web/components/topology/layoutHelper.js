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

  constructor ({topologyOrder, topologyNodeDescription}, locale) {
    this.internetClones = {}
    this.topologyOrder = topologyOrder
    this.topologyNodeDescription = topologyNodeDescription
    this.locale = locale
  }

  layout = (nodes, links, hiddenLinks, cb) => {

    // sort out internet nodes--they can appear everywhere
    const internetNodes = {}
    nodes = nodes.filter(n=>{
      if (n.type==='internet') {
        internetNodes[n.uid] = n
        return false
      }
      return true
    })

    // for each cluster, group into collections by type
    const groups = this.getNodeGroups(nodes)

    // group by connections which may pull nodes into other groups
    this.groupNodesByConnections(groups, internetNodes, links)

    // re-add internet nodes but as clones,
    // otherwise everything will coalesce around two internet nodes (in & out)
    this.cloneInternetNodes(groups, internetNodes, nodes)

    // assign info to each node
    if (this.topologyNodeDescription) {
      nodes.forEach(node=>{
        this.topologyNodeDescription(node, this.locale)
      })
    }

    // create cytoscape element collections
    const cy = cytoscape({ headless: true }) // start headless cytoscape
    let collections = this.createCollections(cy, groups)

    // assign cytoscape layout options for each collection (ex: dagre, grid)
    this.setLayoutOptions(collections)

    // run the cytoscape layouts
    collections = collections.connected.concat(collections.unconnected)
    this.runCollectionLayouts(collections, () => {

      // after all layouts run, use Masonry to fit the collections neatly in the diagram
      const layoutInfo = this.layoutCollections(collections, hiddenLinks)


      // return to TopologyView to create/position the d3 svg shapes
      cb({layoutNodes: nodes, ...layoutInfo})
    })
  }

  layoutCollections = (collections, hiddenLinks) => {
    const hiliteSelections = collections.length>3

    // get row dimensions
    let bbox
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
    collections.forEach(({elements}, idx, array)=>{
      const {w, h} = bbox = elements.boundingBox()
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
    collections.forEach(({elements, options:{name}}, idx)=>{
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
      elements.forEach(element=>{
        const data = element.data()
        if (element.isNode()) {
          const {node: {layout}, id} = data
          const {x, y} = element.position()
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

          // remember for nodehelper selections
          layoutMap[id] = {elements, element, highlight:(hiliteSelections && elements.length>10)}
        } else {
          const {edge: {layout, uid}} = data
          layout.isLoop = element.isLoop()
          layout.center = center
          layout.hidden = hiddenLinks.has(uid)
        }
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

      if (groupMap['service']) {
        let i=groupMap['service'].nodes.length
        while(--i>=0) {
          const node = groupMap['service'].nodes[i]
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

  groupNodesByConnections = (groups, internetNodes, links) => {
    const {nodeGroups, allNodeMap} = groups
    const sourceMap = {}
    const targetMap = {}
    const anyConnectedSet = new Set()
    links
      .filter(link=>{
        return (link.source && link.target &&
            (allNodeMap[link.source] || internetNodes[link.source]) &&
            (allNodeMap[link.target] || internetNodes[link.target] ))
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
            this.gatherNodesByConnections(uid, grp, internetNodes, directions, connectedSet, allNodeMap)

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

  gatherNodesByConnections = (uid, grp, internetNodes, directions, connectedSet, allNodeMap) => {
    // already connected to another group??
    if (!connectedSet.has(uid)) {
      connectedSet.add(uid)

      // add this node to this group
      const node = grp.nodeMap[uid] = allNodeMap[uid]

      // recurse up and down to get everything
      directions.forEach(({map, next, other})=>{
        if (map[uid]) {
          map[uid].forEach(entry => {
            const {link} = entry
            const end = entry[next]
            if (!connectedSet.has(end)) {
              // add link
              link.layout = {}
              link.layout[next] = internetNodes[link[next]] || allNodeMap[link[next]].layout
              link.layout[other] = internetNodes[link[other]] || allNodeMap[link[other]].layout
              grp.edges.push(link)

              // add link to node as 'source' or 'target'
              let nexts = node.layout[next]
              if (!nexts) {
                nexts = node.layout[next] = []
              }
              nexts.push(allNodeMap[link[next]])

              // reiterate until nothing else connected
              if (!internetNodes[end]) {
                this.gatherNodesByConnections(link[next], grp, internetNodes, directions, connectedSet, allNodeMap)
              }
            }
          })
        }
      })
    }
  }

  cloneInternetNodes = (groups, internetNodes, nodes) => {
    const {nodeGroups} = groups

    // consolidate single nodes that just connect to internet
    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type] && nodeGroups[type].connected) {
        const inConsolidatedConnected = {edges:[], nodeMap:{}}
        const outConsolidatedConnected = {edges:[], nodeMap:{}}
        nodeGroups[type].connected = nodeGroups[type].connected.filter(({edges, nodeMap})=>{
          // if just one edge to internet
          if (edges.length===1) {
            if (internetNodes[edges[0].source]) {
              inConsolidatedConnected.edges.push(edges[0])
              inConsolidatedConnected.nodeMap = Object.assign(inConsolidatedConnected.nodeMap, nodeMap)
              return false
            }
            if (internetNodes[edges[0].target]) {
              outConsolidatedConnected.edges.push(edges[0])
              outConsolidatedConnected.nodeMap = Object.assign(outConsolidatedConnected.nodeMap, nodeMap)
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

    // clone the internet objects for each section that has a link to internet
    if (Object.keys(internetNodes).length) {
      const directions = ['source', 'target']
      this.topologyOrder.forEach(type=>{
        if (nodeGroups[type] && nodeGroups[type].connected) {
          nodeGroups[type].connected.forEach(({nodeMap, edges}, index)=>{
            edges.forEach(edge=>{
              directions.forEach(direction=>{
                const next = edge[direction]
                if (internetNodes[next]) {
                  const iuid = next+'_'+type+'_'+index
                  if (!nodeMap[iuid]) {
                    let clone = this.internetClones[iuid]
                    if (!clone) {
                      clone = this.internetClones[iuid] = _.cloneDeep(internetNodes[next])
                      clone.layout = {
                        uid: iuid,
                        type: clone.type,
                        label: this.layoutLabel(clone.name),
                        cloned: true
                      }
                    }
                    nodeMap[iuid] = clone
                    nodes.push(nodeMap[iuid])
                  }
                  edge.layout[direction] = nodeMap[iuid].layout
                }
              })
            })
          })
        }
      })

    }
  }

  createCollections = (cy, groups) => {
    const {nodeGroups} = groups
    const collections = {connected:[], unconnected:[]}
    const chunks = (arr, len) => {
      let i = 0
      const chunks = []
      while (i < arr.length) {
        chunks.push(arr.slice(i, i += len))
      }
      return chunks
    }
    this.topologyOrder.forEach(type=>{
      if (nodeGroups[type]) {
        const {connected, unconnected} = nodeGroups[type]
        connected.forEach(({nodeMap, edges})=>{
          const elements = {nodes:[], edges:[]}
          _.forOwn(nodeMap, (node) => {
            const n = {
              data: {
                id: node.layout.uid,
                node
              }
            }
            elements.nodes.push(n)
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
          collections.connected.push({elements: cy.add(elements)})
        })

        // break large unconnected groups into smaller groups
        let unconnectArr = [unconnected]
        if (unconnected.length>48) {
          unconnected.sort(({layout: {label: a='', newComer: an}}, {layout:{label:b='', newComer: bn}})=>{
            if (!an && bn) {
              return -1
            } else if (an && !bn) {
              return 1
            }
            return a.localeCompare(b)
          })
          unconnectArr = chunks(unconnected, 32)
        }
        unconnectArr.forEach(arr=>{
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
          })
          if (elements.nodes.length>0) {
            collections.unconnected.push({elements: cy.add(elements)})
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
      collection.options = this.getConnectedLayoutOptions(collection.elements, numOfSections)
    })
  }

  getConnectedLayoutOptions = (elements, numOfSections) => {
    const nodes = elements.nodes().length
    const leaves = elements.leaves().length
    const roots = elements.roots().length

    // use dagre if the # of roots or leaves is one and the collection is small
    let dagre = nodes===2
    if ((leaves===1&&roots>1) || (leaves>1&&roots==1)) {
      dagre = nodes<10 && roots<3 && (leaves+roots) !== nodes
    }
    if (dagre || (leaves<6 && numOfSections===1)) {
      return this.getDagreLayoutOptions(elements, numOfSections)
    } else if (nodes<16) {
      // cola gets out of hand above a certain amount
      return this.getColaLayoutOptions(elements)
    } else {
      return this.getCoseLayoutOptions(elements)
    }
  }

  getCoseLayoutOptions = (elements) => {
    // get rough idea how many to allocate for each collection based on # of nodes
    let count = elements.nodes().length
    count = count<=3 ? 1 : (count<=6 ? 2 : (count<=12 ? 3 : (count<=24? 4:5)))
    const {w, h} = {w: count*NODE_SIZE*5, h: count*NODE_SIZE*2}

    // to stabilize cose layout, need to set initial poisitons
    let xx = 0
    elements.nodes().forEach(ele=>{
      ele.position('x', xx)
      xx+=100
    })
    return {
      name: 'cose',
      animate: false,
      padding: 10,
      nodeSpacing: 15,
      boundingBox: {
        x1: 0,
        y1: 0,
        w,
        h
      }
    }
  }

  getColaLayoutOptions = (elements) => {
    // get rough idea how many to allocate for each collection based on # of nodes
    let count = elements.nodes().length
    count = count<=3 ? 1 : (count<=6 ? 2 : (count<=12 ? 3 : (count<=24? 4:5)))
    const {w, h} = {w: count*NODE_SIZE*5, h: count*NODE_SIZE*2}
    return {
      name: 'cola',
      animate: false,
      fit: true,
      boundingBox: {
        x1: 0,
        y1: 0,
        w,
        h
      }
    }
  }

  getDagreLayoutOptions = (elements, numOfSections) => {
    // get rough idea how many to allocate for each collection based on # of nodes
    const count = elements.nodes().length
    const thresh = count<=4 ? 1 : (count<=6 ? 1.5 : (count<=12 ? 3 : (count<=24? 4:5)))
    const {w, h} = ltr ?
      {w: thresh*NODE_SIZE*3, h: thresh*NODE_SIZE*2} :
      {h: thresh*NODE_SIZE*3, w: thresh*NODE_SIZE*4}

    // do left to right if a small collection in a small diagram
    const ltr = numOfSections<=6 && count<=3
    return {
      name: 'dagre',
      boundingBox: {
        x1: 0,
        y1: 0,
        w,
        h
      },
      fit: true,
      padding: 30, // fit padding
      rankDir: ltr ? 'LR' : 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
    }
  }

  setUnconnectedLayoutOptions = (unconnected) => {
    // get rough idea how many to allocate for each collection based on # of nodes
    const columns = unconnected.map(collection => {
      const count = collection.elements.nodes().length
      return count<=9 ? 3 : (count<=12 ? 4 : (count<=18? 6:8))
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
    let totalLayouts = collections.length
    collections.forEach(({elements, options})=>{
      const layout = elements.layout(options)
      layout.pon('layoutstop').then(()=>{
        totalLayouts--
        if (totalLayouts<=0) {
          cb()
        }
      })
      layout.run()
    })
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

}

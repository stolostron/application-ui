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

const SECTION_ORDER = ['host', 'service', 'controller', 'pod', 'container', 'unmanaged']

export default class LayoutHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to manage sections.
   */

  constructor () {
    this.internetClones = {}
  }

  layout = (nodes, links, hiddenNodes, hiddenLinks, cb) => {

    // sort out internet nodes--they can appear everywhere
    const internetNodes = {}
    nodes = nodes.filter(n=>{
      if (n.type==='internet') {
        internetNodes[n.uid] = n
        return false
      }
      return true
    })

    // for each cluster, group into sections
    // group by type
    const groups = this.getNodeGroups(nodes)

    // group by connections
    this.groupNodesByConnections(groups, internetNodes, links)

    // need to clone internet, otherwise everything coalesce around two internet nodes (in & out)
    this.cloneInternetNodes(groups, internetNodes, nodes)

    // create sections
    const cy = cytoscape({ headless: true }) // start headless cytoscape
    var sections = this.createSections(cy, groups)

    // layout sections
    const layoutBBox = this.setSectionLayouts(sections, hiddenNodes, hiddenLinks)

    // then layout all sections
    this.runSectionLayouts(sections, nodes, cb)
    return layoutBBox
  }

  getNodeGroups = (nodes) => {
    // separate into types
    const groupMap = {}
    const allNodeMap = {}
    const controllerMap = {}
    const controllerSet = new Set(['deployment', 'daemonset', 'statefulset'])
    nodes.forEach(node=>{
      allNodeMap[node.uid] = node
      const type = controllerSet.has(node.type) ? 'controller' : node.type
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

      groupMap['controller'].nodes.forEach(controller=>{
        const {type, layout} = controller
        if (layout.pods.length) {
          layout.info = `${type} of ${layout.pods.length} pods`
        }
      })
    }

    // show controllers as services
    controllerAsService.forEach(qname=>{
      var inx = groupMap['controller'].nodes.findIndex(({layout})=>{
        return layout.qname === qname
      })
      if (inx!==-1) {
        const controller = groupMap['controller'].nodes.splice(inx,1)[0]
        controller.layout.type = 'service'
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
    SECTION_ORDER.forEach(type=>{
      if (nodeGroups[type]) {
        const group = nodeGroups[type]
        // sort nodes/links into sections
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
    if (Object.keys(internetNodes).length) {
      const directions = ['source', 'target']
      SECTION_ORDER.forEach(type=>{
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

  createSections = (cy, groups) => {
    const {nodeGroups} = groups
    const sections = {connected:[], unconnected:[]}
    SECTION_ORDER.forEach(type=>{
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
          sections.connected.push({elements: cy.add(elements)})
        })

        const elements = {nodes:[]}
        unconnected.forEach(node=>{
          elements.nodes.push({
            data: {
              id: node.uid,
              node
            }
          })
        })
        sections.unconnected.push({elements: cy.add(elements)})
      }
    })
    return sections
  }

  setSectionLayouts = (sections, hiddenNodes, hiddenLinks) => {
    const {connected, unconnected} = sections
    const numOfSections = connected.length + unconnected.length
    const connectedDim = this.setConnectedLayoutOptions(connected, numOfSections)
    const unconnectedDim = this.setUnconnectedLayoutOptions(unconnected)

    // move unconnected below connected
    unconnected.forEach(({options})=>{
      options.boundingBox.y1 += connectedDim.height
      options.center.y += connectedDim.height
    })

    // center top over bottom
    if (connectedDim.width>unconnectedDim.width) {
      const dx = (connectedDim.width-unconnectedDim.width)/2
      unconnected.forEach(({options})=>{
        options.boundingBox.x1 += dx
        options.center.x += dx
      })
    } else {
      const dx = (unconnectedDim.width-connectedDim.width)/2
      connected.forEach(({options})=>{
        options.boundingBox.x1 += dx
        options.center.x += dx
      })
    }

    // center nodes and links in their bbox
    const both = [connected, unconnected]
    both.forEach(d=>{
      d.forEach(({elements, options})=>{
        const nodes = elements.nodes()
        const edges = elements.edges()
        const {center} = options
        nodes.forEach(ele=>{
          const {node: {layout}} = ele.data()
          layout.center = center
          layout.hidden = hiddenNodes.has(layout.uid)
        })
        if (edges) {
          edges.forEach(ele=>{
            const {edge} = ele.data()
            const {layout} = edge
            layout.center = center
            layout.hidden = hiddenLinks.has(edge.uid)
          })
        }
      })
    })

    return {x:0, y:0,
      width:Math.max(connectedDim.width, unconnectedDim.width)+NODE_SIZE*2,
      height:connectedDim.height+unconnectedDim.height
    }
  }

  setConnectedLayoutOptions = (connected, numOfSections) => {
    let x = 0
    let height = 0
    connected.forEach(section => {
      section.options = this.getConnectedLayoutOptions(x, section.elements, numOfSections)
      const {boundingBox: {w, h}} = section.options
      height = Math.max(h, height)
      x+=w+NODE_SIZE*2
    })
    return {width:x, height}
  }

  getConnectedLayoutOptions = (x, elements, numOfSections) => {
    const nodes = elements.nodes().length
    const leaves = elements.leaves().length
    const roots = elements.roots().length

    // use dagre if the # of roots or leaves is one and the section is small
    let dagre = nodes===2
    if ((leaves===1&&roots>1) || (leaves>1&&roots==1)) {
      dagre = nodes<10
    }
    if (dagre) {
      return this.getDagreLayoutOptions(x, elements, numOfSections)
    } else {
      return this.getColaLayoutOptions(x, elements)
    }
  }

  getColaLayoutOptions = (x, elements) => {
    // get rough idea how many to allocate for each section based on # of nodes
    let count = elements.nodes().length
    count = count<=3 ? 1 : (count<=6 ? 2 : (count<=12 ? 3 : (count<=24? 4:5)))
    const {w, h} = {w: count*NODE_SIZE*5, h: count*NODE_SIZE*2}
    return {
      name: 'cola',
      animate: false,
      fit: true,
      boundingBox: {
        x1: x,
        y1: 0,
        w,
        h
      },
      center: {
        x: x + w/2,
        y: h/2
      }
    }
  }

  getDagreLayoutOptions = (x, elements, numOfSections) => {
    // get rough idea how many to allocate for each section based on # of nodes
    const count = elements.nodes().length
    const thresh = count<=3 ? 1 : (count<=6 ? 2 : (count<=12 ? 3 : (count<=24? 4:5)))
    const {w, h} = ltr ?
      {w: thresh*NODE_SIZE*3, h: thresh*NODE_SIZE*2} :
      {h: thresh*NODE_SIZE*3, w: thresh*NODE_SIZE*2}

    // do left to right if a small section in a small diagram
    const ltr = numOfSections<=6 && count<=3
    return {
      name: 'dagre',
      boundingBox: {
        x1: x,
        y1: 0,
        w,
        h
      },
      center: {
        x: x + w/2,
        y: h/2
      },
      fit: true,
      padding: 30, // fit padding
      rankDir: ltr ? 'LR' : 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
    }
  }

  setUnconnectedLayoutOptions = (unconnected) => {
    let x = 0
    let height = 0
    // get rough idea how many to allocate for each section based on # of nodes
    const columns = unconnected.map(section => {
      const count = section.elements.nodes().length
      return count<=9 ? 3 : (count<=12 ? 4 : (count<=18? 5:(count<=24? 6:(count<=30? 7:8))))
    })
    unconnected.forEach((section, index)=>{
      const count = section.elements.length
      const cols = Math.min(count, columns[index])
      const h = Math.ceil(count/columns[index])*NODE_SIZE*2
      const w = cols*NODE_SIZE*2
      section.options = {
        name: 'grid',
        avoidOverlap: false, // prevents node overlap, may overflow boundingBox if not enough space
        boundingBox: {
          x1: x,
          y1: 0,
          w,
          h
        },
        sort: (a,b) => {
          const {node: nodea} = a.data()
          const {node: nodeb} = b.data()
          return nodea.layout.type.localeCompare(nodeb.layout.type)
        },
        center: {
          x: x + w/2,
          y: h/2
        },
        cols
      }
      height = Math.max(h, height)
      x+=w+NODE_SIZE
    })
    return {width:x, height}
  }

  runSectionLayouts = (sections, nodes, cb) => {
    // layout each sections
    const cyMap = {}
    const allSections = sections.connected.concat(sections.unconnected)
    let totalLayouts = allSections.length
    allSections.forEach(({elements, options})=>{
      const layout = elements.layout(options)
      layout.pon('layoutstop').then(({layout: {options: {eles}}})=>{
        const elements = _.cloneDeep(eles)
        eles.forEach(ele=>{
          const data = ele.data()
          if (ele.isNode()) {
            Object.assign(data.node.layout, ele.position())
            cyMap[data.id] = {elements, ele}
          } else {
            data.edge.layout.isLoop = ele.isLoop()
          }
        })

        // after all sections laid out, move nodes/links
        totalLayouts--
        if (totalLayouts<=0) {
          nodes.forEach((n)=>{
            if (n.layout && n.layout.dragged) {
              const {layout} = n
              layout.undragged = {
                x: layout.x,
                y: layout.y
              }
              layout.x = layout.dragged.x
              layout.y = layout.dragged.y
            }
          })
          cb(nodes, cyMap)
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

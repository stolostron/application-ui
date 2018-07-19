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


export default class LayoutHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to manage sections.
   */
  getClusterBounds = (height, width) => {
    return {
      x: 0,
      y: 0,
      width,
      height,
      center: {
        x: width/2,
        y: height/2
      }
    }
  }

  layout = (bounds, nodes, links, cb) => {

    // for each cluster, group into sections
    // group by type
    let nodeGroups = this.getNodeGroups(nodes)

    // group by connections
    this.groupNodesByConnections(nodeGroups, links)

    // create sections
    var sections = this.createSections(bounds.center, nodeGroups)

    // layout sections
    this.setSectionLayouts(sections, bounds)

    // then layout all sections
    this.runSectionLayouts(sections, nodes, cb)
  }

  getNodeGroups = (nodes) => {
    // separate into types
    const groupMap = {}
    const controllerMap = {}
    const controllerSet = new Set(['deployment', 'daemonset', 'statefulset'])
    nodes.forEach(node=>{
      const type = controllerSet.has(node.type) ? 'controller' : node.type
      let group = groupMap[type]
      if (!group) {
        group = groupMap[type] = {nodes:[]}
      }
      node.layout = Object.assign(node.layout || {}, {
        type: node.type,
        label: this.layoutLabel(node.name)
      }
      )
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
    let controllerAsService = []
    if (groupMap['controller']) {
      if (groupMap['pod']) {
        let i=groupMap['pod'].nodes.length
        while(--i>=0) {
          let node = groupMap['pod'].nodes[i]
          let controller = controllerMap[node.layout.qname]
          if (controller) {
            controller.layout.pods.push(node)
            groupMap['pod'].nodes.splice(i,1)
            delete node.layout
          }
        }
      }

      if (groupMap['service']) {
        let i=groupMap['service'].nodes.length
        while(--i>=0) {
          let node = groupMap['service'].nodes[i]
          let controller = controllerMap[node.layout.qname]
          if (controller) {
            controller.layout.services.push(node)
            groupMap['service'].nodes.splice(i,1)
            controllerAsService.push(node.layout.qname)
            delete node.layout
          }
        }
      }

      groupMap['controller'].nodes.forEach(controller=>{
        let {type, layout} = controller
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
        let controller = groupMap['controller'].nodes.splice(inx,1)[0]
        controller.layout.type = 'service'
        groupMap['service'].nodes.push(controller)
      }
    })

    return groupMap
  }

  groupNodesByConnections = (nodeGroups, links) => {
    _.forOwn(nodeGroups, (group, type) => {
      // sort nodes/links into sections
      let connected = nodeGroups[type].connected = []
      let unconnected = nodeGroups[type].unconnected = []
      let nodeMap = _.keyBy(group.nodes, 'uid')
      let unconnectedSet = new Set(Object.keys(nodeMap))
      let i=links.length
      while(--i>=0) {
        let link = links[i]
        if (link.source && link.target && nodeMap[link.source] && nodeMap[link.target]) {
          let inx = connected.findIndex((s=>{
            return s.nodeMap[link.source] || s.nodeMap[link.target]
          }))
          // if section doesn't exist, add it
          let grp
          if (inx===-1) {
            grp = {
              nodeMap: {},
              edges: []
            }
            connected.push(grp)
          } else {
            grp = connected[inx]
          }

          // add edge to grp
          link.layout = link.layout || {}
          link.layout.source = nodeMap[link.source].layout
          link.layout.target = nodeMap[link.target].layout
          grp.edges.push(link)

          // update nodes/ keep track of how many links to this node for layout options
          let keys = ['source', 'target']
          keys.forEach(key => {
            let value = link[key]
            let node = grp.nodeMap[value]
            if (!node) {
              node = grp.nodeMap[value] = nodeMap[value]
              node.layout.source = 0
              node.layout.target = 0
            }
            node.layout[key]++
            unconnectedSet.delete(value)
          })
        }
      }
      unconnectedSet.forEach(key=>{
        unconnected.push(nodeMap[key])
      })
    })
  }

  createSections = (center, nodeGroups) => {
    let sections = []
    let sectionKeys = ['internet', 'host', 'service', 'controller', 'pod', 'container', 'unmanaged']
    sectionKeys.forEach(key=>{
      if (nodeGroups[key]) {
        const {connected, unconnected} = nodeGroups[key]
        connected.forEach(({nodeMap, edges})=>{
          let section = {elements: {nodes:[], edges:[]} }
          _.forOwn(nodeMap, (node, uid) => {
            node.layout.center = center
            section.elements.nodes.push({
              data: {
                id: uid,
                node
              }
            })
          })
          // sort different controller types together
          if (key==='controller') {
            section.elements.nodes.sort((a, b)=>{
              return a.data.node.type.localeCompare(b.data.node.type)
            })
          }
          edges.forEach(edge=>{
            edge.layout.center = center
            section.elements.edges.push({
              data: edge
            })
          })
          sections.push(section)
        })

        let section = {elements: {nodes:[]} }
        unconnected.forEach(node=>{
          node.layout.center =center
          section.elements.nodes.push({
            data: {
              id: node.uid,
              node
            }
          })
        })
        sections.push(section)
      }
    })
    return sections
  }


  setSectionLayouts = (sections, bounds) => {
    const NODE_SIZE = 60
    let {x, y, width, height} = bounds
    // get rough idea how many to allocate for each section based on # of nodes
    const columns = sections.map(section => {
      let count = section.elements.nodes.length
      return count<=3 ? 1 : (count<=6 ? 2 : (count<=12 ? 3 : (count<=24? 4:5)))
    })
    const totalColumns = columns.reduce((acc, cur) => acc + cur)
    width -= NODE_SIZE*2
    height -= NODE_SIZE
    const widths = columns.map(count => {
      return Math.min(width*(count/totalColumns), count*NODE_SIZE*2)
    })
    const totalWidth = widths.reduce((acc, cur) => acc + cur)
    x+= (Math.max(width-totalWidth, NODE_SIZE) / 2) + 10
    sections.forEach((section, index)=>{
      const w = widths[index]
      let {elements} = section
      if (elements.edges) {
        section.options = {
          name: 'dagre', //cola
          boundingBox: {
            x1: x+NODE_SIZE, //dagre starts right on edge
            y1: y,
            w: w,
            h: height
          },
          padding: 0,
          spacingFactor: .4,
        }
      } else {
        section.options = {
          name: 'grid',
          avoidOverlap: false, // prevents node overlap, may overflow boundingBox if not enough space
          boundingBox: {
            x1: x,
            y1: y,
            w: w,
            h: height
          },
          padding: 0,
          cols: columns[index]
        }
      }
      x+=w
    })
  }

  runSectionLayouts = (allSections, nodes, cb) => {
    // start headless cytoscape
    const cy = cytoscape({
      headless: true
    })

    // layout each sections
    let totalLayouts = allSections.length
    allSections.forEach(({elements, options})=>{
      let section = cy.add(elements)
      let layout = section.layout(options)
      layout.pon('layoutstop').then(()=>{
        section.forEach(ele=>{
          let data = ele.data()
          if (ele.isNode()) {
            Object.assign(data.node.layout, ele.position())
          } else {
            Object.assign(data.layout, {
              isLoop: ele.isLoop()
            })
          }
        })

        // after all sections laid out, move nodes/links
        totalLayouts--
        if (totalLayouts<=0) {
          nodes.forEach((n)=>{
            if (n.layout && n.layout.dragged) {
              const {layout} = n
              layout.x = layout.dragged.x
              layout.y = layout.dragged.y
            }
          })
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
        let left = label.substring(0, i)
        let right = label.substring(i+1)
        return left + label[i] +'\n' + this.wrapLabel(right, width)
      }
    }
    return label
  }

}

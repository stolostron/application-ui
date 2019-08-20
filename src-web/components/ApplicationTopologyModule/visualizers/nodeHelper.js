/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import * as d3 from 'd3'
import 'd3-selection-multi'
import SVG from 'svg.js'
import { dragLinks } from './linkHelper'
import { counterZoom, getTooltip } from '../utils.js'
import '../../../../graphics/diagramShapes.svg'
import '../../../../graphics/diagramIcons.svg'

import {
  FilterResults,
  RELATED_OPACITY,
  NODE_RADIUS,
  NODE_SIZE
} from './constants.js'

const TITLE_RADIUS = NODE_RADIUS + 28

export const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .styles(() => {
    return {
      display: 'none',
      opacity: 0
    }
  })

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, typeToShapeMap, showsShapeTitles, getClientRef) {
    this.svg = svg
    this.nodes = nodes
    this.typeToShapeMap = typeToShapeMap
    this.getClientRef = getClientRef
    this.showsShapeTitles = showsShapeTitles
  }

  // add or remove nodes based on data in this.nodes
  updateDiagramNodes = (currentZoom, nodeClickHandler, nodeDragHandler) => {
    const draw =
      typeof SVG === 'function'
        ? SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        : undefined
    const filteredNodes = this.nodes.filter(node => !!node.layout)

    // join data to svg groups
    // creates enter and exit arrays
    // if already exists, updates its __data__ with data
    // based on creating a map '$n.layout.uid'
    const nodes = this.svg
      .select('g.nodes')
      .selectAll('g.node')
      .data(filteredNodes, n => {
        return n.layout ? n.layout.uid : ''
      })

    // remove node groups that no longer have data (in exit array)
    // or any nodes with a duplicate key ($n.layout.uid)
    nodes.exit().remove()

    // add node groups for new data (in enter array)
    const newNodes = nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', currentZoom)
      .attr('type', d => {
        return d.name
      })
      .style('opacity', 0.0)
      .on('click', d => {
        tooltip.style('display', 'none')
        nodeClickHandler(d)
      })
      // accessability--user presses enter key when node has focus
      .on('keypress', d => {
        if (d3.event.keyCode === 32 || d3.event.keyCode === 13) {
          tooltip.style('display', 'none')
          nodeClickHandler(d)
        }
      })
      // tooltip
      .on('mouseover', ({ layout }, i, ns) => {
        const bb = ns[i].getBoundingClientRect()
        tooltip.style('display', undefined)
        tooltip
          .interrupt()
          .transition()
          .delay(200)
          .duration(100)
          .style('opacity', 1)
        tooltip
          .html(() => {
            return getTooltip(layout.tooltips)
          })
          .styles((d, j, ts) => {
            const { width, height } = ts[j].getBoundingClientRect()
            return {
              top: bb.top - height + window.scrollY - 6 + 'px',
              left: bb.left + bb.width / 2 - width / 2 + 'px'
            }
          })
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .delay(1000)
          .duration(100)
          .style('opacity', 0)
          .on('end', () => {
            tooltip.style('display', 'none')
          })
      })

    // node hover/select shape
    this.createNodeHilites(newNodes)

    // node shape
    this.createNodeShapes(newNodes, nodeDragHandler)

    // node labels
    if (draw) {
      if (this.showsShapeTitles) {
        this.createTitles(draw, newNodes)
      }
      this.createLabels(draw, newNodes)
    }

    // update node icons
    this.updateNodeIcons()
  };

  createNodeHilites = nodes => {
    nodes.append('use').attrs(() => {
      return {
        'xlink:href': '#diagramShapes_circle',
        width: NODE_SIZE,
        height: NODE_SIZE,
        tabindex: -1,
        class: 'shadow'
      }
    })
  };

  createNodeShapes = (nodes, nodeDragHandler) => {
    nodes
      .append('use')
      .attrs(d => {
        const { layout } = d
        const { type } = layout
        const shape = this.typeToShapeMap[type]
          ? this.typeToShapeMap[type].shape
          : 'circle'
        const classType = this.typeToShapeMap[type]
          ? this.typeToShapeMap[type].className
          : 'default'
        //layout.newComer) {
        return {
          'xlink:href': `#diagramShapes_${shape}`,
          width: NODE_SIZE,
          height: NODE_SIZE,
          tabindex: 1,
          class: `shape ${classType}`
        }
      })
      .call(
        d3
          .drag()
          .on('drag', this.dragNode)
          .on('start', () => {
            if (nodeDragHandler) nodeDragHandler(true)
          })
          .on('end', () => {
            if (nodeDragHandler) nodeDragHandler(false)
          })
      )
  };

  createTitles = (draw, nodes) => {
    // create label
    nodes
      .filter(({ layout: { title } }) => {
        return !!title
      })
      .append('g')
      .attr('class', 'nodeTitle')
      .html(({ layout }) => {
        const nodeTitleGroup = draw.group()

        // title
        nodeTitleGroup.text(add => {
          add
            .tspan(layout.title)
            .addClass('counter-zoom title beg')
            .newLine()
        })

        return nodeTitleGroup.svg()
      })
      .call(d3.drag().on('drag', this.dragNode))
  };

  createLabels = (draw, nodes) => {
    // create label
    nodes
      .append('g')
      .attr('class', 'nodeLabel')
      .html(({ layout }) => {
        const nodeLabelGroup = draw.group()

        // white background
        nodeLabelGroup.rect()

        // normal label
        nodeLabelGroup
          .text(add => {
            layout.label.split('\n').forEach(line => {
              if (line) {
                add
                  .tspan(line)
                  .addClass('counter-zoom beg')
                  .newLine()
              }
            })
            if (layout.description) {
              add
                .tspan(layout.description)
                .fill('gray')
                .font({ size: 9 })
                .addClass('description beg')
                .newLine()
            }
          })
          .addClass('regularLabel')
          .leading(1)

        // compact label
        nodeLabelGroup
          .text(add => {
            layout.compactLabel.split('\n').forEach(line => {
              if (line) {
                add
                  .tspan(line)
                  .addClass('counter-zoom beg')
                  .newLine()
              }
            })
          })
          .addClass('compactLabel')

        return nodeLabelGroup.svg()
      })
      .call(d3.drag().on('drag', this.dragNode))

      // determine sizes of white opaque background
      .call(this.layoutBackgroundRect)
  };

  layoutBackgroundRect = selection => {
    selection.each(({ layout }, i, ns) => {
      layout.textBBox = ns[i].getBBox()
      d3
        .select(ns[i])
        .select('rect')
        .attrs(({ layout: { textBBox } }) => {
          return {
            x: textBBox.x,
            y: textBBox.y,
            width: textBBox.width,
            height: textBBox.height,
            tabindex: -1
          }
        })
    })
  };

  // update node icons
  updateNodeIcons = () => {
    const icons = this.svg
      .select('g.nodes')
      .selectAll('g.node')
      .selectAll('use.nodeIcon')
      .data(({ layout: { nodeIcons } }) => {
        return nodeIcons ? Object.values(nodeIcons) : []
      })

    // remove icons if nodeIcons is gone
    icons.exit().remove()

    // add icons
    icons
      .enter()
      .append('use')
      .attrs(({ icon, classType, width, height }) => {
        return {
          'xlink:href': `#diagramIcons_${icon}`,
          width: width + 'px',
          height: height + 'px',
          'pointer-events': 'none',
          tabindex: -1,
          class: `nodeIcon ${classType}`
        }
      })
  };

  moveNodes = (transition, currentZoom, searchChanged) => {
    const nodeLayer = this.svg.select('g.nodes')

    // move node shapes
    const nodes = nodeLayer
      .selectAll('g.node')
      .styles(({ layout }) => {
        // set opacity to 0 if search changed or node moved
        // we will transition it back when in new position
        let opacity = 1.0
        const { x, y, lastPosition, search = FilterResults.nosearch } = layout
        if (
          !lastPosition ||
          (lastPosition &&
            (Math.abs(lastPosition.x - x) > 10 ||
              Math.abs(lastPosition.y - y) > 10))
        ) {
          opacity = 0.1
        }
        layout.lastPosition = { x, y }

        return {
          visibility: search === FilterResults.hidden ? 'hidden' : 'visible',
          opacity: searchChanged
            ? 0.0
            : search === FilterResults.related ? RELATED_OPACITY : opacity
        }
      })
      .attr('transform', currentZoom)

    nodes
      .transition(transition)
      .styles(({ layout: { search = FilterResults.nosearch } }) => {
        return {
          opacity: search === FilterResults.related ? RELATED_OPACITY : 1.0
        }
      })

    // clean up any selections if search changed
    if (searchChanged) {
      nodes.classed('selected', ({ layout }) => {
        layout.selected = false
        return false
      })
    }

    // if name search only position visible nodes
    const visible = nodes
      .filter(({ layout: { search = FilterResults.nosearch } }) => {
        return search !== FilterResults.hidden
      })
      .classed('selected', ({ layout }) => {
        const { search = FilterResults.nosearch, selected } = layout
        if (search === FilterResults.matched || selected) {
          return true
        }
        return false
      })

    visible.selectAll('use.shape').attrs(({ layout }) => {
      const { x, y, scale = 1 } = layout
      const sz = NODE_SIZE * scale
      return {
        width: sz,
        height: sz,
        transform: `translate(${x - sz / 2}, ${y - sz / 2})`
      }
    })

    // move highlight/select shape
    visible.selectAll('use.shadow').attrs(({ layout }) => {
      const { x, y, scale = 1 } = layout
      const sz = NODE_SIZE * scale + 18
      return {
        width: sz,
        height: sz,
        transform: `translate(${x - sz / 2}, ${y - sz / 2})`
      }
    })

    // move icons
    nodeLayer
      .selectAll('use.nodeIcon')
      .attrs(({ dx, dy, width, height }, i, ns) => {
        const { layout: { x, y } } = d3.select(ns[i].parentNode).datum()
        return {
          transform: `translate(${x + dx - width / 2}, ${y + dy - height / 2})`
        }
      })

    if (this.showsShapeTitles) {
      moveTitles(this.svg)
    }
    // move labels
    moveLabels(this.svg)
  };

  dragNode = (d, i, ns) => {
    const { layout } = d
    const node = d3.select(ns[i].parentNode)
    tooltip.style('display', 'none')

    // don't consider it dragged until more then 5 pixels away from original
    if (!layout.undragged) {
      layout.undragged = {
        x: layout.x,
        y: layout.y
      }
    }
    layout.x += d3.event.dx
    layout.y += d3.event.dy
    if (
      Math.hypot(layout.x - layout.undragged.x, layout.y - layout.undragged.y) >
      5
    ) {
      // keep dragged distance relative to it section in case the whole section moves
      layout.dragged = {
        x: layout.x - layout.section.x,
        y: layout.y - layout.section.y
      }

      // drag shape
      node.selectAll('use.shape').attr('transform', () => {
        const { x, y, scale = 1 } = layout
        const sz = NODE_SIZE * scale
        return `translate(${x - sz / 2}, ${y - sz / 2})`
      })

      // drag hilights
      node.selectAll('use.shadow').attr('transform', () => {
        const { x, y, scale = 1 } = layout
        const sz = NODE_SIZE * scale + 20
        return `translate(${x - sz / 2}, ${y - sz / 2})`
      })

      // drag icons
      node
        .selectAll('use.nodeIcon')
        .attrs(({ dx, dy, width, height }, i, ns) => {
          const { layout: { x, y } } = d3.select(ns[i].parentNode).datum()
          return {
            transform: `translate(${x + dx - width / 2}, ${y +
              dy -
              height / 2})`
          }
        })

      if (this.showsShapeTitles) {
        // drag node title if any
        const nodeLabels = node.selectAll('g.nodeTitle')
        nodeLabels.each((d, i, ns) => {
          d3
            .select(ns[i])
            .selectAll('text')
            .attr('x', () => {
              return layout.x
            })
            .attr('y', () => {
              return layout.y - TITLE_RADIUS
            })
          d3
            .select(ns[i])
            .selectAll('tspan')
            .attr('x', () => {
              return layout.x
            })
        })
      }

      // drag node label
      const nodeLabels = node.selectAll('g.nodeLabel')
      nodeLabels.each((d, i, ns) => {
        d3
          .select(ns[i])
          .selectAll('text')
          .attr('x', () => {
            return layout.x
          })
          .attr('y', () => {
            return layout.y + NODE_RADIUS * (layout.scale || 1)
          })
        d3
          .select(ns[i])
          .selectAll('rect')
          .attr('x', () => {
            return layout.x - layout.textBBox.width / 2
          })
          .attr('y', () => {
            return layout.y + NODE_RADIUS * (layout.scale || 1) + 2
          })
        d3
          .select(ns[i])
          .selectAll('tspan')
          .attr('x', () => {
            return layout.x
          })
      })

      // drag any connecting links
      dragLinks(this.svg, d, this.typeToShapeMap)
    }
  };
}

export const setSelections = (svg, selected) => {
  svg
    .select('g.nodes')
    .selectAll('g.node')
    .classed('selected', ({ layout }) => {
      layout.search = FilterResults.nosearch
      layout.selected = selected && selected.uid === layout.uid
      return layout.selected
    })
}

// interrupt any transition and make sure it has its final value
export const interruptNodes = svg => {
  svg
    .select('g.nodes')
    .selectAll('g.node')
    .interrupt()
    .call(selection => {
      selection.each(({ layout }, i, ns) => {
        if (layout) {
          const { search = FilterResults.nosearch } = layout
          d3
            .select(ns[i])
            .style(
              'opacity',
              search === FilterResults.related ? RELATED_OPACITY : 1.0
            )
        }
      })
    })
}

// counter zoom labels-- if smaller, show an abreviated smaller label
export const counterZoomLabels = (svg, currentZoom) => {
  if (svg) {
    const s = currentZoom.k
    const fontSize = counterZoom(s, 0.35, 0.85, 12, 22)

    // set title visibility based on search or zoom
    svg
      .select('g.nodes')
      .selectAll('g.nodeTitle')
      .each(({ layout: { search = FilterResults.nosearch } }, i, ns) => {
        const nodeTitle = d3.select(ns[i])
        nodeTitle.style('visibility', () => {
          return search === FilterResults.hidden ? 'hidden' : 'visible'
        })

        // apply counter zoom font
        nodeTitle
          .selectAll('tspan.counter-zoom')
          .style('font-size', fontSize + 4 + 'px')
      })

    // show regular labels
    let showClass, hideClass
    if (s > 0.6) {
      showClass = 'regularLabel'
      hideClass = 'compactLabel'
    } else {
      showClass = 'compactLabel'
      hideClass = 'regularLabel'
    }

    // set label visibility based on search or zoom
    svg
      .select('g.nodes')
      .selectAll('g.nodeLabel')
      .each(({ layout }, i, ns) => {
        const { search = FilterResults.nosearch } = layout
        const nodeLabel = d3.select(ns[i])

        // not in search mode, selectively show labels based on zoom
        let shownLabel
        let hideDescription = false
        if (search === FilterResults.nosearch) {
          shownLabel = nodeLabel.selectAll(`text.${showClass}`)
          shownLabel.style('visibility', 'visible')
          // hide description at a certain point
          hideDescription = s <= 0.7
          shownLabel
            .selectAll('tspan.description')
            .style('visibility', hideDescription ? 'hidden' : 'visible')

          // hide compact label if regular should show and vice versa
          nodeLabel
            .selectAll(`text.${hideClass}`)
            .style('visibility', 'hidden')
        } else {
          // show labels only if matched or related
          // if match, always show regular label and hide compact
          shownLabel = nodeLabel
            .selectAll('text.regularLabel')
            .style('visibility', () => {
              return search === FilterResults.hidden ? 'hidden' : 'visible'
            })
          // always show description if a match
          hideDescription = search === FilterResults.hidden
          nodeLabel.selectAll('tspan.description').style('visibility', () => {
            return hideDescription ? 'hidden' : 'visible'
          })

          nodeLabel
            .selectAll('text.compactLabel')
            .style('visibility', 'hidden')
        }

        // counter zoom whatever is still visible
        // apply counter zoom font
        shownLabel
          .selectAll('tspan.counter-zoom')
          .style('font-size', fontSize + 'px')

        // if hub, make font even bigger
        shownLabel
          .selectAll('tspan.hub-label')
          .style('font-size', fontSize + 4 + 'px')

        // if description make smaller
        shownLabel
          .selectAll('tspan.description')
          .style('font-size', hideDescription ? 0 : fontSize - 2 + 'px')

        // fix leading between lines
        let height
        shownLabel.selectAll('tspan.beg').each((d, j, ts) => {
          ts[j].setAttribute('dy', fontSize)
          height = ts.length * fontSize
        })
        layout.textBBox.height = height

        // fix opaque background behind label
        nodeLabel.selectAll('rect').each((d, k, rc) => {
          d3.select(rc[k]).attrs(() => {
            return { height }
          })
        })
      })

    // set shape icon visibility based on search
    svg
      .select('g.nodes')
      .selectAll('use.nodeIcon')
      .style('visibility', (d, i, ns) => {
        const { layout: { search = FilterResults.nosearch } } = d3
          .select(ns[i].parentNode)
          .datum()
        return search === FilterResults.hidden ? 'hidden' : 'visible'
      })
  }
}

// during search mode, show match in label in boldface
export const showMatches = (svg, searchNames) => {
  if (svg) {
    searchNames = searchNames.filter(s => !!s)
    const draw =
      typeof SVG === 'function'
        ? SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        : undefined
    svg
      .select('g.nodes')
      .selectAll('g.nodeLabel')
      .each((d, i, ns) => {
        const { name, layout } = d
        const { x, y, scale = 1, search = FilterResults.nosearch } = layout
        if (search !== FilterResults.hidden && x && y) {
          const label = layout.label.toLowerCase()
          const regex = new RegExp(`(${searchNames.join('|')})`, 'g')
          const acrossLines =
            search === FilterResults.match && label.split(regex).length <= 1
          d3
            .select(ns[i])
            .selectAll('text.regularLabel')
            .each((d, j, ln) => {
              ln[j].outerHTML = draw
                .text(add => {
                  const lines = label.split('\n').map((line, idx) => {
                    if (search === FilterResults.match) {
                      // if match falls across label lines, put result in middle line
                      if (acrossLines) {
                        if (idx === 1) {
                          return name
                            .split(regex)
                            .filter(str => searchNames.indexOf(str) !== -1)
                            .concat(line.substr(searchNames[0].length))
                        } else {
                          return [line]
                        }
                      } else {
                        return line.split(regex).filter(s => !!s)
                      }
                    } else {
                      return [line]
                    }
                  })
                  lines.forEach(strs => {
                    strs.forEach((str, idx) => {
                      const tspan = add.tspan(str)
                      if (searchNames.indexOf(str) !== -1) {
                        tspan.addClass('matched')
                      }
                      tspan.addClass('counter-zoom')
                      if (scale > 1) {
                        tspan.addClass('hub-label')
                      }
                      if (idx === 0) {
                        tspan.addClass('beg').newLine()
                      }
                    })
                  })
                })
                .addClass('regularLabel')
                .svg()
            })
        }
      })
    moveTitles(svg)
    moveLabels(svg)
  }
}

export const moveLabels = svg => {
  svg
    .select('g.nodes')
    .selectAll('g.nodeLabel')
    .filter(({ layout: { x, y } }) => {
      return x !== undefined && y !== undefined
    })
    .each(({ layout }, i, ns) => {
      const { x, y, textBBox, scale = 1 } = layout
      const dy = NODE_RADIUS * (scale === 1 ? 1 : scale + 0.3)
      const nodeLabel = d3.select(ns[i])
      nodeLabel.selectAll('tspan').classed('hub-label', scale > 1)

      nodeLabel.selectAll('text').attrs(() => {
        return {
          x: x,
          y: y + dy
        }
      })
      nodeLabel.selectAll('rect').attrs(() => {
        return {
          x: x - textBBox.width / 2,
          y: y + dy + 4
        }
      })
      nodeLabel.selectAll('tspan.beg').attr('x', () => {
        return x
      })
    })
}

// shape titles are over the shape
// diagram titles are supported by titleHelper
export const moveTitles = svg => {
  svg
    .select('g.nodes')
    .selectAll('g.nodeTitle')
    .filter(({ layout: { x, y } }) => {
      return x !== undefined && y !== undefined
    })
    .each(({ layout }, i, ns) => {
      const { x, y } = layout
      const nodeTitle = d3.select(ns[i])

      nodeTitle.selectAll('text').attrs(() => {
        return {
          x: x,
          y: y - TITLE_RADIUS
        }
      })
      nodeTitle.selectAll('tspan.beg').attr('x', () => {
        return x
      })
    })
}

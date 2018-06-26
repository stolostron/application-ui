/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import * as d3 from 'd3'
import { NODE_RADIUS, NODE_SEPARATION } from './constants'

export default class SimulationHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to manage the D3 force simulations to position nodes.
   */

  createSimulation = (height, width, clusters, nodes, links, onTicked) => {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.uid).strength(.1).distance(NODE_SEPARATION))
      .force('collide', d3.forceCollide().strength(.5).radius(NODE_RADIUS * 2)) // Prevents nodes from overlapping
      .on('tick', onTicked)

    this.simulation
      .nodes(nodes)

    this.simulation.force('link')
      .links(links)

    this.clusterSimulations = clusters.map(({id, index}) => {
      const centerX = width * (index * 2 + 1) / (clusters.length * 2)
      const clusterSimulation = d3.forceSimulation()
        .force('center', d3.forceCenter(centerX, height / 2))
        .force('forceX', d3.forceX(centerX).strength(.01))
      clusterSimulation.nodes(nodes.filter(n => n.cluster === id))

      return clusterSimulation
    })
  }

  getSimulation = () =>{
    return this.simulation
  }

  stopSimulations = () => {
    if (this.simulation) {
      this.simulation.stop()
    }
    if (this.clusterSimulations) {
      this.clusterSimulations.forEach(sim => sim.stop())
    }
  }

}

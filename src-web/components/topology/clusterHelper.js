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
import { CLUSTER_MARGIN, CLUSTER_MARGIN_TOP } from './constants'


export default class ClusterHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw a cluster in the diagram.
   */
  constructor(height, width, clusters){
    this.clusters = clusters
    this.height = height
    this.width = width
    this.svg = d3.select('svg.topologyDiagram')
  }

  removeOldClustersFromDiagram = () => {
    // TODO: We could preserve the existing clusters using
    //      `data(this.clusters, (n) => n.id).exit()`
    //      But we have to resize the remaining clusters. A
    //      simpler approach is to remove all clusters and redraw.
    this.svg.select('g.clusters')
      .selectAll('g.cluster')
      .remove()
  }

  addClustersToDiagram = () => {
    const clusterQuantity = this.clusters ? this.clusters.length : 0

    const clusters = this.svg.select('g.clusters')
      .selectAll('g.cluster')
      .data(this.clusters, (n) => n.id)
      .enter().append('g')
      .attr('id', (n) => `cluster-${n.name}`)
      .attr('class', 'cluster')

    clusters.append('rect')
      .attr('class', 'clusterArea')
      .attr('x', CLUSTER_MARGIN).attr('y', CLUSTER_MARGIN_TOP)
      .attr('height', this.height - CLUSTER_MARGIN_TOP * 2)
      .attr('width', `${this.width / clusterQuantity - CLUSTER_MARGIN * 2}`)
      .attr('transform', (n) => `translate(${this.width * n.index / clusterQuantity}, 0)`)
    clusters.append('text').attr('class','clusterTitle').text((n) =>`Cluster: ${n.name}`)
      .attr('transform', (n) => `translate(${this.width * n.index / clusterQuantity + CLUSTER_MARGIN}, 45)`)

  }
}

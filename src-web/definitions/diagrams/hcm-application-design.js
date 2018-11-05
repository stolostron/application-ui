/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import {dumpAndParse} from '../../../lib/client/design-helper'
import { NODE_SIZE } from '../../components/diagrams/constants.js'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

export default {
  //general order in which to organize diagram with 'application' at upper left
  shapeTypeOrder: ['application', 'deployer', 'policy', 'dependency'],

  typeToShapeMap: {
    'application': {
      shape: 'roundedSq',
      className: 'container',
      nodeRadius: 30
    },
    'deployer': {
      shape: 'circle',
      className: 'service'
    },
    'policy': {
      shape: 'roundedRect',
      className: 'service'
    },
    'dependency': {
      shape: 'hexagon',
      className: 'internet'
    }
  },

  diagramOptions: {
    showLineLabels: true, // show labels on lines
  },

  // nodes, links and yaml
  getDesignElements,

  // get description for under node
  getNodeDescription,

  // cytoscape layout options
  getConnectedLayoutOptions,
}

export function getDesignElements(item) {
  const links=[]
  const nodes=[]
  let yaml = ''
  if (item) {
    const dnp = dumpAndParse(item, ['applicationRelationships', 'deployables', 'placementPolicies'])
    const {parsed} = dnp
    yaml = dnp.yaml

    // create application node
    const name = _.get(parsed, 'metadata.$v.name.$v')
    const appId = `application--${name}`
    nodes.push({
      name,
      namespace: _.get(parsed, 'metadata.$v.namespace.$v'),
      application: item,
      type: 'application',
      uid: appId,
      $r: 0
    })

    // create deployment and policy nodes and links back to application
    const deployablesMap = {}
    const keys = ['deployables', 'placementPolicies']
    keys.forEach(key=>{
      const arr = parsed[key]
      if (Array.isArray(arr)) {
        arr.forEach((member, idx)=>{
          const name = _.get(member, 'metadata.$v.name', member)
          const memberId = `member--${key}--${name.$v}--${idx}`
          nodes.push({
            name: name.$v,
            member,
            type: key === 'deployables' ? 'deployer' : 'policy',
            uid: memberId,
            $r: name.$r
          })
          links.push({
            source: appId,
            target: memberId,
            label: 'uses',
            uid: appId+memberId
          })
          if (key==='deployables') {
            deployablesMap[name.$v] = memberId
          }
        })
      }
    })

    // create application relationship links between deployments
    const arr = parsed['applicationRelationships']
    if (Array.isArray(arr)) {
      arr.forEach((member)=>{
        var srcId = deployablesMap[_.get(member, 'spec.$v.source.$v.name.$v')]
        var tgtId = deployablesMap[_.get(member, 'spec.$v.destination.$v.name.$v')]
        if (srcId && tgtId) {
          links.push({
            source: srcId,
            target: tgtId,
            label: _.get(member, 'spec.$v.type.$v') || 'usesCreated',
            uid: srcId+tgtId
          })
        }
      })
    }
  }

  return {
    links,
    nodes,
    yaml
  }
}

export function getNodeDescription(node, locale) {
  let description = ''
  switch (node.type) {
  case 'application':
    description = node.namespace
    break
  case 'deployer':
    description = _.get(node, 'deployer.chartName.$v')
    break
  case 'dependency':
    description = _.get(node, 'dependency.kind.$v')
    break
  case 'policy':
    description = msgs.get('application.policy', locale)
    break
  }
  return description
}

export function getConnectedLayoutOptions() {
  return {
    name: 'dagre',
    rankDir: 'LR',
    rankSep: NODE_SIZE*3, // running in headless mode, we need to provide node size here
    nodeSep: NODE_SIZE*2, // running in headless mode, we need to provide node size here
  }
}

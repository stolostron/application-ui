/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import R from 'ramda'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import _ from 'lodash'

/*
* UI helpers to help with data transformations
* */

export const getWrappedNodeLabel = (label, width, rows = 3) => {
  // if too long, add elipse and split the rest
  const ip = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(label)
  if (ip) {
    label = label.substr(0, ip.index) + '\n' + ip[0]
  } else {
    if (label.length > width * rows) {
      if (rows === 2) {
        label = label.substr(0, width) + '..\n' + label.substr(-width)
      } else {
        label =
          splitLabel(label.substr(0, width * 2), width, rows - 1) +
          '..\n' +
          label.substr(-width)
      }
    } else {
      label = splitLabel(label, width, rows)
    }
  }
  return label
}

const splitLabel = (label, width, rows) => {
  let line = ''
  const lines = []
  const parts = label.split(/([^A-Za-z0-9])+/)
  let remaining = label.length
  do {
    // add label part
    line += parts.shift()

    // add splitter
    if (parts.length) {
      line += parts.shift()
    }

    // if next label part puts it over width split it
    if (parts.length) {
      if (line.length + parts[0].length > width) {
        remaining -= line.length
        if (remaining > width) {
          if (rows === 2) {
            // if pentulitmate row do a hard break
            const split = parts[0]
            const idx = width - line.length
            line += split.substr(0, idx)
            parts[0] = split.substr(idx)
          }
        }
        lines.push(line)
        line = ''
        rows -= 1
      }
    } else {
      // nothing left, push last line
      lines.push(line)
    }
  } while (parts.length)

  // pull last line in if too short
  if (lines.length > 1) {
    let lastLine = lines.pop()
    if (lastLine.length <= 2) {
      lastLine = lines.pop() + lastLine
    }
    lines.push(lastLine)
  }
  return lines.join('\n')
}

//as scale decreases from max to min, return a counter zoomed value from min to max
export const counterZoom = (scale, scaleMin, scaleMax, valueMin, valueMax) => {
  if (scale >= scaleMax) {
    return valueMin
  } else if (scale <= scaleMin) {
    return valueMax
  }
  return (
    valueMin +
    (1 - (scale - scaleMin) / (scaleMax - scaleMin)) * (valueMax - valueMin)
  )
}

export const getTooltip = tooltips => {
  return ReactDOMServer.renderToStaticMarkup(
    <React.Fragment>
      {tooltips.map(
        ({
          name,
          value,
          href,
          target = '_blank',
          rel = 'noopener noreferrer'
        }) => {
          return (
            <div key={Math.random()}>
              <span className="label">{name}: </span>
              {href ? (
                <a className="link" href={href} target={target} rel={rel}>
                  {value}
                </a>
              ) : (
                <span className="value">{value}</span>
              )}
            </div>
          )
        }
      )}
    </React.Fragment>
  )
}

export const getHashCode = str => {
  let hash = 0,
      i,
      chr
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

export const getNodePropery = (node, propPath, key, defaultValue) => {
  let data = R.pathOr(undefined, propPath)(node)
  if (data) {
    data = R.replace(/:/g, '=', R.toString(data))
    data = R.replace(/{/g, '', data)
    data = R.replace(/}/g, '', data)
    data = R.replace(/"/g, '', data)
    data = R.replace(/ /g, '', data)
  } else {
    if (defaultValue) {
      data = defaultValue
    }
  }

  if (data) {
    return {
      labelKey: key,
      value: data
    }
  }

  return undefined
}

export const addPropertyToList = (list, data) => {
  if (list && data) {
    list.push(data)
  }

  return list
}

export const nodeMustHavePods = node => {
  //returns true if the node should deploy pods
  let mustHavePods = false
  if (
    node &&
    R.length(
      R.pathOr([], ['specs', 'raw', 'spec', 'template', 'spec', 'containers'])(
        node
      )
    ) > 0
  ) {
    mustHavePods = true
  }

  return mustHavePods
}

export const createDeployableYamlLink = (node, details) => {
  //returns yaml for the deployable
  if (details && node) {
    const row = R.pathOr(undefined, ['specs', 'row'])(node)
    if (row) {
      details.push({
        type: 'link',
        value: {
          label: 'View Deployable YAML',
          id: node.id,
          data: {
            specs: {
              row: row,
              isDesign: true
            }
          },
          indent: true
        }
      })
    }
  }

  return details
}

export const createResourceSearchLink = (node, details) => {
  //returns search link for resource
  if (details && node) {
    details.push({
      type: 'link',
      value: {
        label: 'Show resource in Search View',
        id: node.id,
        data: {
          action: 'show_search',
          name: node.name,
          namespace: node.namespace,
          kind: node.type
        },
        indent: true
      }
    })
  }

  return details
}

//creates a map with all related kinds for this app, not only pod types
export const setupResourceModel = (list, resourceMap, isClusterGrouped) => {
  if (list && resourceMap) {
    list.forEach(kindArray => {
      const relatedKindList = R.pathOr([], ['items'])(kindArray)

      relatedKindList.forEach(relatedKind => {
        let name = relatedKind.name
        const kind = relatedKind.kind
        let podHash = undefined
        let deployableName = undefined

        //look for pod template hash and remove it from the name if there
        const labels = relatedKind.label ? R.split(';')(relatedKind.label) : []
        if (labels.length > 0) {
          labels.forEach(label => {
            const values = R.split('=')(label)
            if (values.length === 2) {
              const label = values[0].trim()
              if (label === 'pod-template-hash') {
                podHash = values[1].trim()
              } else if (
                label === 'openshift.io/deployment-config.name' ||
                R.contains('deploymentconfig')(label)
              ) {
                deployableName = values[1].trim()
              }
            }
          })
        }
        if (deployableName) {
          name = deployableName
        }
        if (podHash) {
          name = R.replace(`-${podHash}`, '')(name)
        }

        //look for deployment config info in the label; the name of the resource could be different than the one defined by the deployable
        //openshift.io/deployment-config.name
        if (relatedKind.kind === 'pod' && !deployableName) {
          const pname = name
          // get pod name w/o uid suffix
          name = pname.replace(/-[0-9a-fA-F]{8,10}-[0-9a-zA-Z]{4,5}$/, '')
          if (name === pname) {
            const idx = name.lastIndexOf('-')
            if (idx !== -1) {
              name = name.substr(0, idx)
            }
          }
        }

        if (relatedKind.kind !== 'subscription') {
          //expect for subscriptions, use cluster name to group resources
          name = isClusterGrouped.value
            ? name
            : `${name}-${relatedKind.cluster}`
        }
        if (!resourceMap[name]) {
          resourceMap[name] = {}
        }
        if (resourceMap[name]) {
          const kindModel = _.get(resourceMap[name], `specs.${kind}Model`, {})
          kindModel[`${relatedKind.name}-${relatedKind.cluster}`] = relatedKind
          _.set(resourceMap[name], `specs.${kind}Model`, kindModel)
        }
      })
    })
  }

  return resourceMap
}

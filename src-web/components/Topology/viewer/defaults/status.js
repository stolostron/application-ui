/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { StatusIcon } from '../constants.js'
import msgs from '../../../../../nls/platform.properties'
import _ from 'lodash'
import { nodeMustHavePods } from '../../utils/diagram-helpers'

const HOURS = 1000 * 60 * 60

const updateClusterNodeStatus = (node, locale, sizes, startedAts, now) => {
  // collect data that will determine size of cluster
  const { specs = {} } = node
  const { cluster, violations = [] } = specs || {}
  if (cluster) {
    const { metadata = {}, usage, status } = cluster
    const { creationTimestamp } = metadata

    // determine status
    const clusterStatus = {
      isOffline: false,
      hasViolations: false,
      hasFailure: false,
      isRecent: false,
      isDisabled: false
    }

    if (status !== 'offline') {
      if (status.toLowerCase() === 'pending') {
        clusterStatus.hasPending = true
      } else if (violations.length > 0) {
        clusterStatus.hasFailure = true
        clusterStatus.status = [`${violations.length}`, 'violations']
        clusterStatus.hasViolations = true
      }
    } else if (
      !creationTimestamp ||
      now - new Date(creationTimestamp).getTime() > HOURS * 4
    ) {
      clusterStatus.hasFailure = true
      clusterStatus.isDisabled = true
      clusterStatus.isOffline = true
      clusterStatus.status = msgs.get('cluster.status.offline', locale)
    }
    _.set(node, 'specs.clusterStatus', clusterStatus)

    // collect data to show how big cluster is
    if (usage) {
      const { pods = 0 } = usage
      sizes.push({ pods: parseInt(pods, 10), node })
    }

    // collect data to detemine if cluster started recently
    if (creationTimestamp) {
      startedAts.push({
        started: now - new Date(creationTimestamp).getTime(),
        node
      })
    }
  }
}

const updateNodeWithPodsStatus = (node, startedAts, now) => {
  let podModel = _.get(node, 'specs.podModel')
  let pulse = 'red'

  if (podModel) {
    const podStatus = {
      hasPending: false,
      hasFailure: false,
      hasRestarts: false,
      hostIPs: new Set()
    }

    if (podModel.name) {
      podModel = {}
      podModel[podModel.name] = podModel
    }
    Object.values(podModel).forEach(pod => {
      const { restarts, status, hostIP, startedAt } = pod
      if (status) {
        if (status === 'Pending') {
          podStatus.hasPending = true
          pulse = 'yellow'
        } else if (status !== 'Running' && status !== 'Succeeded') {
          podStatus.hasFailure = true
          pulse = 'red'
        }
      }
      podStatus.hasRestarts = podStatus.hasRestarts || restarts > 5
      if (startedAt) {
        startedAts.push({
          started: now - new Date(startedAt).getTime(),
          node
        })
      }
      podStatus.hostIPs.add(hostIP || '<none>')
    })
    _.set(node, 'specs.podStatus', podStatus)
  }
  _.set(node, 'specs.pulse', pulse)
}

export const updateNodeStatus = (nodes, locale) => {
  // collect statistics
  const sizes = []
  const startedAts = []
  const now = new Date().getTime()
  nodes.forEach(node => {
    const { type } = node

    if (type === 'cluster') {
      updateClusterNodeStatus(node, locale, sizes, startedAts, now)
    }

    if (nodeMustHavePods(node)) {
      updateNodeWithPodsStatus(node, startedAts, now)
    }
  })

  // update node size based on some metric
  updateNodeSize(sizes)

  // show green pulse for recently started node
  updateGreenPulse(startedAts)
}

const updateNodeSize = sizes => {
  if (sizes.length > 0) {
    // determine if a cluster is bigger then standard
    const { avg, std } = getStd(
      sizes.map(({ pods }) => {
        return pods
      })
    )
    sizes.forEach(({ pods, node }) => {
      let scale = 1
      if (pods > avg + std * 2) {
        scale = 1.8
      } else if (pods > avg + std) {
        scale = 1.4
      } else if (pods < avg - std) {
        scale = 0.8
      }
      _.set(node, 'specs.scale', scale)
    })
  }
}

const updateGreenPulse = startedAts => {
  if (startedAts.length > 0) {
    // calculate recent
    const { avg: a, std: s } = getStd(
      startedAts.map(({ started }) => {
        return started
      })
    )
    const threshold = Math.min(Math.max(a - s, HOURS * 4), HOURS * 8) // at least 6 but not more then 24 hours ago
    startedAts
      .sort(({ started: s1 }, { started: s2 }) => {
        return s1 - s2
      })
      .some(({ node, started }) => {
        if (started < threshold) {
          const podStatus = _.get(node, 'specs.podStatus', {}) // for filtering
          podStatus.isRecent = true
          if (!node.specs.pulse) {
            node.specs.pulse = 'green'
          }
          return false
        }
        return true
      })
  }
}

//a standard deviation function
const getStd = array => {
  const avg = _.sum(array) / array.length
  const std = Math.max(
    avg * 0.05,
    Math.sqrt(_.sum(_.map(array, i => Math.pow(i - avg, 2))) / array.length)
  )
  return { avg, std }
}

export const updateNodeIcons = nodes => {
  nodes.forEach(node => {
    const nodeIcons = {}
    const { type, layout = {} } = node

    // status icon
    let nodeStatus = ''
    let disabled = false

    // show error icon on application node if app is not subscribed to any channel
    if (type === 'application') {
      const { specs = {} } = node
      if (
        specs &&
        (!specs.channels || (specs.channels && specs.channels.length === 0))
      ) {
        nodeIcons['status'] = Object.assign({}, StatusIcon.error)
      }
    }

    if (type === 'cluster') {
      // determine icon
      const { specs = {} } = node
      if (specs.clusterStatus) {
        const {
          hasWarning,
          hasFailure,
          status,
          isDisabled
        } = specs.clusterStatus
        let statusIcon = StatusIcon.success
        if (hasFailure) {
          statusIcon = StatusIcon.error
        } else if (hasWarning) {
          statusIcon = StatusIcon.pending
        }
        nodeIcons['status'] = Object.assign({}, statusIcon)
        nodeStatus = status
        disabled = isDisabled
      } else if (specs.cluster) {
        const compliant = node.specs.compliance.compliant
        const noncompliant =
          !compliant || compliant.toLowerCase() === 'noncompliant'
        let statusIcon = StatusIcon.success
        if (noncompliant) {
          statusIcon = StatusIcon.error
        }
        nodeIcons['status'] = Object.assign({}, statusIcon)
      }
    }

    if (nodeMustHavePods(node)) {
      updatePodIcon(node, nodeIcons)
    }

    // get deplyable status
    if (!nodeIcons['status']) {
      const deployStatuses = _.get(node, 'specs.deployStatuses')
      if (deployStatuses && deployStatuses.length > 0) {
        let statusIcon = StatusIcon.success
        if (deployStatuses.some(({ phase }) => phase === 'Failed')) {
          statusIcon = StatusIcon.error
        }
        nodeIcons['status'] = Object.assign({}, statusIcon)
      }
    }

    layout.nodeIcons = Object.assign(layout.nodeIcons || {}, nodeIcons)
    layout.nodeStatus = nodeStatus // description under label
    layout.isDisabled = disabled // show node grayed out
  })
}

const updatePodIcon = (node, nodeIcons) => {
  let pulse
  let statusIcon
  let anySuccess = false
  let anyPending = false
  let anyFailure = false
  let anyRecent = false
  const podStatus = _.get(node, 'specs.podStatus')
  if (podStatus) {
    const { hasPending, hasFailure, isRecent } = podStatus
    anyFailure = anyFailure || hasFailure
    anyPending = anyPending || hasPending
    anyRecent = anyRecent || isRecent
    anySuccess = true
  } else {
    pulse = 'red'
    statusIcon = StatusIcon.error
  }

  if (anyFailure) {
    statusIcon = StatusIcon.error
    pulse = 'red'
  } else if (anyPending) {
    statusIcon = StatusIcon.pending
    pulse = 'yellow'
  } else if (anySuccess) {
    statusIcon = StatusIcon.success
    if (anyRecent) {
      pulse = 'green'
    }
  }
  if (statusIcon) {
    nodeIcons['status'] = Object.assign({}, statusIcon)
  }
  if (pulse) {
    _.set(node, 'specs.pulse', pulse)
  }
}

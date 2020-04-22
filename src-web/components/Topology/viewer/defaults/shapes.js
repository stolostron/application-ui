/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export const defaultShapes = Object.freeze({
  application: {
    shape: 'application',
    className: 'design',
    nodeRadius: 30
  },
  deployable: {
    shape: 'deployable',
    className: 'design'
  },
  subscription: {
    shape: 'subscription',
    className: 'design'
  },
  rules: {
    shape: 'rules',
    className: 'design'
  },
  clusters: {
    shape: 'cluster',
    className: 'container'
  },
  helmrelease: {
    shape: 'chart',
    className: 'container'
  },
  package: {
    shape: 'chart',
    className: 'container'
  },
  internet: {
    shape: 'cloud',
    className: 'internet'
  },
  host: {
    shape: 'host',
    className: 'host'
  },
  policy: {
    shape: 'roundedSq',
    className: 'design',
    nodeRadius: 30
  },
  placement: {
    shape: 'placement',
    className: 'design'
  },
  cluster: {
    shape: 'cluster',
    className: 'container'
  },
  service: {
    shape: 'service',
    className: 'service'
  },
  deployment: {
    shape: 'deployment',
    className: 'deployment'
  },
  daemonset: {
    shape: 'daemonset',
    className: 'daemonset'
  },
  statefulset: {
    shape: 'circle',
    className: 'default'
  },
  pod: {
    shape: 'pod',
    className: 'pod'
  },
  container: {
    shape: 'irregularHexagon',
    className: 'container'
  },
  cronjob: {
    shape: 'clock',
    className: 'default'
  },
  spare1: {
    shape: 'star4',
    className: 'daemonset'
  },
  spare2: {
    shape: 'roundedSq',
    className: 'daemonset'
  },
  spare3: {
    shape: 'hexagon',
    className: 'daemonset'
  },
  spare4: {
    shape: 'irregularHexagon',
    className: 'daemonset'
  },
  spare5: {
    shape: 'roundedRect',
    className: 'daemonset'
  }
})

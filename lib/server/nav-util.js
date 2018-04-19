/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var config = require('../shared/config'),
    msgs = require('../../nls/header.properties'),
    lodash = require('lodash')

const getBaseUrl = (req, appServiceId, dev, routeServiceId) => {
  return JSON.parse(dev) === true && appServiceId !== routeServiceId ? config.cfcRouterUrl : ''
}

exports.getLeftNavConfig = (req, appServiceId, dev, userRole) => {
  let routes = getRoutes(req, userRole)
  const getUrl = getBaseUrl.bind(this, req, appServiceId, dev)
  routes.forEach(route => {
    if(route.url) {
      route.external = route.serviceId !== 'platform-ui' || appServiceId !== 'platform-ui'
      route.url = `${getUrl(route.serviceId)}${route.url}`
    } else {
      route.subItems.forEach(route => {
        route.external = route.serviceId !== 'platform-ui' || appServiceId !== 'platform-ui'
        route.url = `${getUrl(route.serviceId)}${route.url}`
      })
    }
  })
  return routes
}

exports.updateLeftNavConfig = (routes, namespaces, navItem, currentRole) => {
  let index
  let route = routes && routes.find(item => item.id === navItem.route)

  if (!route)
    return routes

  const allowedRoles = navItem.roles && navItem.roles.split(',')
  index = lodash.findIndex(route.subItems, item => item.id === navItem.id)
  navItem.enabled ?
    index === -1 && route.subItems.push({
      id: navItem.id,
      label: navItem.displayName,
      url: navItem.url,
      serviceId: navItem.chart,
      external: true,
      disabled: !(allowedRoles && allowedRoles.find(role => role.toLowerCase() === (currentRole && currentRole.toLowerCase())) && namespaces && namespaces.find(namespace => namespace.Name === navItem.namespace))
    }) : index > -1 && route.subItems.splice(index, 1)
  return routes.map(item => {
    if (item.id === navItem.id)
      item = route
    return item
  })
}

const getRoutes = (req) => [
  {
    id: 'clusters',
    label: msgs.get('routes.clusters', req),
    disabled: config['featureFlags:multicluster'] !== true,
    subItems: [
      {
        id: 'clusters-overview',
        label: msgs.get('routes.clusters', req),
        url: `${config.contextPath}/clusters/overview`,
        serviceId: 'platform-ui',
      },
      {
        id: 'clusters-pods',
        label: msgs.get('routes.clusters.pods', req),
        url: `${config.contextPath}/clusters/pods`,
        serviceId: 'platform-ui',
      },
      {
        id: 'clusters-nodes',
        label: msgs.get('routes.clusters.nodes', req),
        url: `${config.contextPath}/clusters/nodes`,
        serviceId: 'platform-ui',
      },
      {
        id: 'clusters-pvs',
        label: msgs.get('routes.clusters.pvs', req),
        url: `${config.contextPath}/clusters/pvs`,
        serviceId: 'platform-ui',
      }
    ]
  }
]

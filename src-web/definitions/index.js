/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import lodash from 'lodash'

import { RESOURCE_TYPES } from '../../lib/shared/constants'

import hcmpods from './hcm-pods'
import hcmnodes from './hcm-nodes'
import hcmpvs from './hcm-pvs'

const resourceData = {
  [RESOURCE_TYPES.HCM_PODS.name]: hcmpods,
  [RESOURCE_TYPES.HCM_NODES.name]: hcmnodes,
  [RESOURCE_TYPES.HCM_PVS.name]: hcmpvs
}

function getResourceData(resourceType) {
  var def = resourceData[resourceType.name]
  if (!def)
    //eslint-disable-next-line no-console
    console.error(`No resource data found for '${resourceType}'`)
  return def
}

export default getResourceData

export function getPrimaryKey(resourceType) {
  let def = getResourceData(resourceType)
  let pk = def.primaryKey

  if (!pk)
    pk = 'metadata.uid'

  return pk
}

export function getURIKey(resourceType) {
  let def = getResourceData(resourceType)
  let uriKey = def.uriKey

  if (!uriKey)
    uriKey = 'metadata.name'

  return uriKey
}

export function getDefaultSearchField(resourceType) {
  var def = getResourceData(resourceType)
  let sf = def && def.defaultSearchField
  if (!def || !def.tableKeys || (def && def.tableKeys.length < 1))
    //eslint-disable-next-line no-console
    console.error(`No table keys found in ${resourceType} resource definition`)
  if (!sf)
    sf = def && def.tableKeys && def.tableKeys[0] && def.tableKeys[0].resourceKey
  return sf
}

export function getDefaultSortField(resourceType) {
  var def = getResourceData(resourceType)
  let sf = def && def.defaultSortField
  if (!def || !def.tableKeys || (def && def.tableKeys.length < 1))
    //eslint-disable-next-line no-console
    console.error(`No table keys found in ${resourceType} resource definition`)
  if (!sf) {
    sf = def && def.tableKeys && def.tableKeys[0] && def.tableKeys[0].resourceKey
  }
  if (!sf)
    //eslint-disable-next-line no-console
    console.error(`No sortable fields defined for '${resourceType}' resource definition`)
  return sf
}

export function getLink(link, resource) {
  if(typeof(link) === 'boolean') {
    return `/${resource.metadata.namespace}/${resource.metadata.name}`
  } else if (typeof(link) === 'function') {
    return link(resource)
  } else {
    const parts = link.split('/')
    let path = ''
    parts.forEach(part => {
      const value = lodash.get(resource, part)
      path += `/${encodeURIComponent(value)}`
    })
    return path
  }
}

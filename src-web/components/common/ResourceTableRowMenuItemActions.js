/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { updateModal } from '../../actions/common'
import config from '../../../lib/shared/config'

export const resourceActions = (action, dispatch, resourceType, data, hasService, history) => {
  switch (action) {
  case 'table.actions.edit': {
    return dispatch(updateModal(
      { open: true, type: 'resource-edit', action: 'put', resourceType, editorMode: 'json',
        label: { primaryBtn: 'modal.button.submit', label: `modal.edit-${resourceType.name.toLowerCase()}.label`, heading: `modal.edit-${resourceType.name.toLowerCase()}.heading` },
        data: { kind: resourceType.name, ...data }}))
  }
  case 'table.actions.applications.remove':
  case 'table.actions.compliance.remove':
  case 'table.actions.policy.remove':
  case 'table.actions.remove': {
    return dispatch(updateModal(
      { open: true, type: 'resource-remove', resourceType,
        label: { primaryBtn: `modal.remove-${resourceType.name.toLowerCase()}.heading`, label: `modal.remove-${resourceType.name.toLowerCase()}.label`, heading: `modal.remove-${resourceType.name.toLowerCase()}.heading` },
        data: { apiVersion: resourceType.api_version, kind: resourceType.name, ...data }}))
  }
  case 'table.actions.cluster.view.nodes':{
    history.push(`${config.contextPath}/nodes?filters={"cluster":["${data.metadata.name}"]}`)
    return
  }
  case 'table.actions.cluster.view.pods': {
    history.push(`${config.contextPath}/pods?filters={"cluster":["${data.metadata.name}"]}`)
    return
  }
  case 'table.actions.cluster.edit.labels': {
    const _data = { ...data }
    return dispatch(updateModal(
      { open: true, type: 'label-editing', action: 'put', resourceType,
        label: { primaryBtn: 'modal.button.submit', label: `modal.edit-${resourceType.name.toLowerCase()}.label`, heading: `modal.edit-${resourceType.name.toLowerCase()}.heading` },
        data: { apiVersion: resourceType.api_version, resourceType: resourceType.name, ..._data }}))
  }
  case 'table.actions.pod.logs': {
    return dispatch(updateModal({ open: true, type: 'view-logs', resourceType, data }))
  }
  default:

  }
}

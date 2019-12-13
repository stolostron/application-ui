/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { updateModal } from '../../actions/common'

export const resourceActions = (
  action,
  dispatch,
  resourceType,
  data
) => {
  switch (action) {
  case 'table.actions.application.edit':
  case 'table.actions.edit': {
    return dispatch(
      updateModal({
        open: true,
        type: 'resource-edit',
        action: 'put',
        resourceType,
        editorMode: 'json',
        label: {
          primaryBtn: 'modal.button.submit',
          label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
          heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
        },
        data: { kind: resourceType.name, ...data }
      })
    )
  }
  case 'table.actions.applications.remove':
  case 'table.actions.remove': {
    return dispatch(
      updateModal({
        open: true,
        type: 'resource-remove',
        resourceType,
        label: {
          primaryBtn: `modal.remove-${resourceType.name.toLowerCase()}.heading`,
          label: `modal.remove-${resourceType.name.toLowerCase()}.label`,
          heading: `modal.remove-${resourceType.name.toLowerCase()}.heading`
        },
        data: {
          apiVersion: resourceType.api_version,
          kind: resourceType.name,
          ...data
        }
      })
    )
  }
  case 'table.actions.cluster.edit.labels': {
    const _data = { ...data }
    return dispatch(
      updateModal({
        open: true,
        type: 'label-editing',
        action: 'put',
        resourceType,
        label: {
          primaryBtn: 'modal.button.submit',
          label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
          heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
        },
        data: {
          apiVersion: resourceType.api_version,
          resourceType: resourceType.name,
          ..._data
        }
      })
    )
  }
  case 'table.actions.pod.logs': {
    return dispatch(
      updateModal({ open: true, type: 'view-logs', resourceType, data })
    )
  }

  default:
  }
}

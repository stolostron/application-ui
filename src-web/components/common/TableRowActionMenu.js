// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withLocale } from '../../providers/LocaleProvider'
import _ from 'lodash'
import { AcmDropdown } from '@open-cluster-management/ui-components'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'

export function handleActionClick(action, resourceType, item, history) {
  const client = apolloClient.getClient()
  const name = _.get(item, 'name', '')
  const namespace = _.get(item, 'namespace', '')
  if (action.link) {
    const url = action.link.url(item)
    if (url && !url.startsWith(config.contextPath)) {
      // external to this SPA
      window.location = url
    } else {
      history.push(url, action.link.state)
    }
  } else if (action.modal) {
    client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: true,
        type: action.key,
        resourceType: {
          __typename: 'resourceType',
          name: resourceType.name,
          list: resourceType.list
        },
        data: {
          __typename: 'ModalData',
          name,
          namespace,
          clusterName: _.get(item, 'cluster', ''),
          selfLink: _.get(item, 'selfLink', ''),
          _uid: _.get(item, '_uid', ''),
          kind: _.get(resourceType, 'kind', ''),
          apiVersion:
            _.get(item, 'apiVersion') || _.get(resourceType, 'apiVersion', '')
        }
      }
    })
  }
}

const TableRowActionMenu = ({
  actions,
  item,
  history,
  resourceType,
  locale
}) => {
  const onSelect = id => {
    const selected = actions.find(action => action.key === id)
    if (selected) {
      handleActionClick(selected, resourceType, item, history)
    }
  }
  const actionButtons = actions.map(action => {
    return {
      id: action.key,
      text: msgs.get(action.key, locale),
      component: 'button'
    }
  })
  return (
    <AcmDropdown
      isKebab={true}
      isPlain={true}
      onSelect={onSelect}
      dropdownItems={actionButtons}
    />
  )
}

TableRowActionMenu.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object,
  item: PropTypes.object,
  locale: PropTypes.string,
  resourceType: PropTypes.object
}

export default withLocale(withRouter(TableRowActionMenu))

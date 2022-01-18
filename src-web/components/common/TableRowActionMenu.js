// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withLocale } from '../../providers/LocaleProvider'
import _ from 'lodash'
import { AcmDropdown } from '@stolostron/ui-components'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'

export function handleActionClick(
  action,
  resourceType,
  item,
  history,
  itemGroup = []
) {
  const client = apolloClient.getClient()
  const thisItem = item ? item : itemGroup[0]
  const name = item
    ? _.get(item, 'name', '')
    : _.get(thisItem, 'applicationSet', '')
  const namespace = _.get(thisItem, 'namespace', '')
  if (action.link) {
    const url = action.link.url(thisItem)
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
          clusterName: _.get(thisItem, 'cluster', ''),
          selfLink: _.get(thisItem, 'selfLink', ''),
          _uid: _.get(thisItem, '_uid', ''),
          kind: _.get(resourceType, 'kind', ''),
          apiVersion:
            _.get(thisItem, 'apiVersion') ||
            _.get(resourceType, 'apiVersion', ''),
          itemGroup: itemGroup
        }
      }
    })
  }
}

const TableRowActionMenu = ({
  actions,
  item,
  itemGroup,
  history,
  resourceType,
  locale
}) => {
  const onSelect = id => {
    const selected = actions.find(action => action.key === id)
    if (selected) {
      handleActionClick(selected, resourceType, item, history, itemGroup)
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
  itemGroup: PropTypes.array,
  locale: PropTypes.string,
  resourceType: PropTypes.object
}

export default withLocale(withRouter(TableRowActionMenu))

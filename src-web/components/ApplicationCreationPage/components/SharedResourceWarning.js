// Copyright (c) 2020 Red Hat, Inc. All Rights Reserved.
'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ExclamationTriangleIcon } from '@patternfly/react-icons'
import _ from 'lodash'
import apolloClient from '../../../../lib/client/apollo-client'
import { SEARCH_QUERY_RELATED } from '../../../apollo-client/queries/SearchQueries'
import { RESOURCE_TYPES } from '../../../../lib/shared/constants'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import { withLocale } from '../../../providers/LocaleProvider'

resources(() => {
  require('./style.scss')
})

const getSelfLinks = control => {
  const channel = _.get(control, 'groupControlData', []).find(
    d => d.id === 'channel'
  )
  const selfLinks = _.get(channel, 'content', []).find(
    c => c.id === 'selfLinks'
  )
  return _.get(selfLinks, 'active', {})
}

const getResourceKind = resourceType => {
  let kind
  switch (resourceType.name) {
  case 'HCMSubscription':
    kind = 'Subscription'
    break
  case 'HCMPlacementRule':
    kind = 'PlacementRule'
    break
  }
  return kind
}

const getResourceNameAndNamespace = (resourceType, selfLinks) => {
  let selfLinksKey, selfLinkPlural
  switch (resourceType.name) {
  case 'HCMSubscription':
    selfLinksKey = 'Subscription'
    selfLinkPlural = 'subscriptions'
    break
  case 'HCMApplication':
    selfLinksKey = 'Application'
    selfLinkPlural = 'applications'
    break
  case 'HCMPlacementRule':
    selfLinksKey = 'PlacementRule'
    selfLinkPlural = 'placementrules'
    break
  }
  const selfLink = _.get(selfLinks, selfLinksKey, '')
  const selfLinkExp = new RegExp(
    `namespaces/([^/]*)/${selfLinkPlural}/([^/]*)`
  )
  const matches = selfLink.match(selfLinkExp)
  return matches ? matches.slice(1, 3) : [null, null]
}

const getQuery = (resourceType, name, namespace) => {
  const kind = getResourceKind(resourceType).toLowerCase()
  return {
    filters: [
      { property: 'kind', values: [kind] },
      { property: 'name', values: [name] },
      { property: 'namespace', values: [namespace] }
    ],
    relatedKinds: ['application']
  }
}

const SharedResourceWarning = ({ resourceType, control, locale }) => {
  const [relatedApplications, setRelatedApplications] = useState([])
  const selfLinks = getSelfLinks(control)
  const [applicationNamespace, applicationName] = getResourceNameAndNamespace(
    RESOURCE_TYPES.HCM_APPLICATIONS,
    selfLinks
  )
  const [resourceNamespace, resourceName] = getResourceNameAndNamespace(
    resourceType,
    selfLinks
  )

  useEffect(
    () => {
      if (control.editMode && resourceName && resourceNamespace) {
        const query = getQuery(resourceType, resourceName, resourceNamespace)
        apolloClient
          .search(SEARCH_QUERY_RELATED, {
            input: [query]
          })
          .then(response => {
            const relatedItems =
              _.get(response, 'data.searchResult[0].related') || []
            const relatedApps = _.get(
              relatedItems.find(r => r.kind === 'application'),
              'items',
              []
            )
            if (relatedApps) {
              setRelatedApplications(
                relatedApps
                  .filter(
                    r =>
                      r.name !== applicationName ||
                      r.namespace !== applicationNamespace
                  )
                  .map(r => r.name)
                  .sort()
              )
            }
          })
      }
    },
    [
      control.editMode,
      resourceNamespace,
      resourceName,
      applicationName,
      applicationNamespace
    ]
  )

  return relatedApplications.length ? (
    <div className="shared-resource-warning">
      <div>
        <ExclamationTriangleIcon />
      </div>
      <div>
        <p>
          {msgs.get(
            'editing.app.sharedResourceWarning',
            [getResourceKind(resourceType)],
            locale
          )}
        </p>
        <p>{relatedApplications.join(', ')}</p>
      </div>
    </div>
  ) : null
}

SharedResourceWarning.propTypes = {
  control: PropTypes.object,
  locale: PropTypes.string,
  resourceType: PropTypes.object
}

export default withLocale(SharedResourceWarning)

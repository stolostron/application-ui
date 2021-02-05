/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import _ from 'lodash'

// @flow
export const mapSingleApplication = application => {
  console.log('mapSingleApplication ', application)
  const items = _.get(application, 'items', [])

  const result =
    items.length > 0
      ? items[0]
      : {
        name: '',
        namespace: '',
        dashboard: '',
        selfLink: '',
        _uid: '',
        created: '',
        apigroup: '',
        cluster: '',
        kind: '',
        label: '',
        _hubClusterResource: '',
        _rbac: '',
        related: []
      }

  result.related = application.related || []
  items.forEach(item => {
    //if this is an argo app, the related kinds query should be built from the items section
    //for argo we ask for namespace:targetNamespace label:appLabel kind:<comma separated string of resource kind>
    //this code moves all these items under the related section
    const kind = _.get(item, 'kind')

    if (kind === 'application' || kind === 'subscription') {
      //this is a legit app object , just leave it
      return
    }

    const relatedList = _.get(result, 'related', [])
    const queryKind = _.filter(
      relatedList,
      filtertype => _.get(filtertype, 'kind', '') === kind
    )
    if (!result.related) {
      result.related = relatedList
    }
    const kindSection =
      !queryKind || queryKind.length > 0 ? queryKind : { kind, items: [item] }
    if (!queryKind || queryKind.length == 0) {
      //link it to the app
      result.related.push(kindSection)
    } else {
      kindSection.items.push(item)
    }
  })
  console.log('RESULT IS ', result)
  return [result]
}

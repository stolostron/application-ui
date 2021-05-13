/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import _ from 'lodash'

// @flow
export const mapSingleApplication = application => {
  const items = application ? _.get(application, 'items', []) : []

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

  result.related = application ? application.related || [] : []

  items.forEach(item => {
    //if this is an argo app, the related kinds query should be built from the items section
    //for argo we ask for namespace:targetNamespace label:appLabel kind:<comma separated string of resource kind>
    //this code moves all these items under the related section
    const kind = _.get(item, 'kind')
    const cluster = _.get(item, 'cluster')

    if (kind === 'application') {
      //this is a legit app object , just leave it
      return
    }

    if (kind === 'subscription' && cluster !== 'local-cluster') {
      // this is a legit subscription object that needs no alternation
      return
    }

    //find under the related array an object matching this kind
    const queryKind = _.filter(
      result.related,
      filtertype => _.get(filtertype, 'kind', '') === kind
    )
    //if that kind section was found add this object to it, otherwise create a new kind object for it
    const kindSection =
      queryKind && queryKind.length > 0 ? queryKind : { kind, items: [item] }
    if (!queryKind || queryKind.length === 0) {
      //link this kind section directly to the results array
      result.related.push(kindSection)
    } else {
      kindSection[0].items.push(item)
    }
  })
  return [result]
}

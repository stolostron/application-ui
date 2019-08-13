/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const getRelatedItems = (related, kind) => {
  let result = []
  let filtered = []
  if (related instanceof Array && related.length > 0) {
    if (kind === 'deployment') {
      filtered = related.filter(
        elem =>
          ![
            'deployable',
            'channel',
            'cluster',
            'subscription',
            'placementbinding',
            'placementrule',
            'placementpolicy',
            'applicationrelationship'
          ].includes(elem.kind)
      )
    } else {
      filtered = related.filter(elem => elem.kind === kind)
    }
    filtered.map(elem => {
      if (elem.items instanceof Array) {
        result = result.concat(elem.items)
      }
    })
  }
  return result
}

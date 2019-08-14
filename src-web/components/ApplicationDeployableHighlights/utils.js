/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// return the summary for the deployable
export const getDeployableSummary = item => {
  if (item && item.related) {
    var completed = 0
    var failed = 0
    var progress = 0
    var pending = 0

    for (var i = 0; i < item.related.length; i++) {
      const kind = item.related[i].kind
      const correctKindAndItems =
        (kind === 'release' ||
          kind === 'deployment' ||
          kind === 'pod' ||
          kind === 'service' ||
          kind === 'replicaset') &&
        item.related[i].items

      if (kind && correctKindAndItems) {
        for (var j = 0; j < item.related[i].items.length; j++) {
          if (item.related[i].items[j].status) {
            var status = item.related[i].items[j].status
            if (status === 'FAILED' || status.includes('Error')) {
              failed = failed + 1
            } else if (status === 'DEPLOYED' || status === 'Running') {
              completed = completed + 1
            } else if (status === 'PROGRESS') {
              progress = progress + 1
            } else if (status.toUpperCase().includes('PENDING')) {
              pending = pending + 1
            } else {
              //anything else is in progress
              progress = progress + 1
            }
          } else {
            completed = completed + 1
          }
        }
      }
    }
    const countsCardDataGeneralInfo = [
      {
        msgKey: 'dashboard.card.deployable.versions',
        count: 1
      },
      {
        msgKey: 'dashboard.card.deployable.completed',
        count: completed
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        count: failed,
        alert: true
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: progress
      },
      {
        msgKey: 'dashboard.card.deployable.pending',
        count: pending
      }
    ]
    return countsCardDataGeneralInfo
  }
  return [
    {
      msgKey: 'dashboard.card.deployable.versions',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.completed',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.failed',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.inProgress',
      count: '-'
    },
    {
      msgKey: 'dashboard.card.deployable.pending',
      count: '-'
    }
  ]
}

// return the incidents for the deployable
export const getDeployableIncidents = item => {
  const countsCardDataIncidents = [
    {
      msgKey: 'dashboard.card.deployable.incidents',
      count: 0,
      alert: true
    }
  ]
  if (item) return countsCardDataIncidents

  return countsCardDataIncidents
}
